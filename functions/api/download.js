// Cloudflare Pages Function script to act as an API for downloading a specific file from a remote URL
// Place this file at: functions/api/download.js in your Pages project
// Usage: GET /api/download
// This will proxy the fetch and force a download of the hardcoded file.

const REMOTE_URL = 'https://software.download.prss.microsoft.com/dbazure/Win11_24H2_EnglishInternational_x64.iso?t=142129a8-8a38-4538-a815-a134eea74418&P1=1758977279&P2=601&P3=2&P4=TceGK2xAZjXhPB4NXXQ6KeZv4vC2agVJcQD4od7sQDofy0zR%2fp95KBs4pa18PvNwwe6Ag8RRimPrhNnnfj28cf6vQBEaH6OIhnai5quIYL18MNZtTaxOml1sP9FMnuOEEtoyhAFaCAmhgoIMGb3lfG%2b773QJ1O8ZFRObMz6T3l4dU8Edf1NqkxmZ98L4wpGj2c4mo39240N0wpPyf48TjogSGeSiEWva2RtizME3B7kN4XHKdpCcdTanZGJJgouO%2fN%2fGjU%2buCJLIBKYwtIwvQ2nvFJ01Wdf610qfjRuZ0dMaAeAIjUmteaVBP9H3CIwrywXN%2f%2f97ho2wEuAIwTMjrg%3d%3d';

export default {
  async fetch(request, env, ctx) {
    const remoteUrl = REMOTE_URL;

    // Optional: Validate URL (basic check)
    try {
      new URL(remoteUrl);
    } catch {
      return new Response('Invalid hardcoded URL', { status: 500 });
    }

    try {
      const response = await fetch(remoteUrl, {
        // Pass through method, headers, etc., if needed for more advanced proxying
        method: request.method,
        headers: request.headers,
      });

      if (!response.ok) {
        return new Response(`Remote server error: ${response.status}`, { status: response.status });
      }

      // Clone the response to add headers without mutating
      const modifiedResponse = new Response(response.body, response);

      // Force download (customize filename if needed)
      const filename = 'Win11_24H2_EnglishInternational_x64.iso';
      modifiedResponse.headers.set('Content-Disposition', `attachment; filename="${filename}"`);

      // Preserve other important headers
      modifiedResponse.headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
      modifiedResponse.headers.set('Cache-Control', response.headers.get('Cache-Control') || 'no-cache');

      return modifiedResponse;
    } catch (error) {
      console.error('Fetch error:', error);
      return new Response('Error fetching remote file', { status: 500 });
    }
  },
};
