// Netlify deploys this server-side handler; it is also used by the local test server.
const { processEnquiry } = require('../../lib/enquiry.cjs');
exports.handler = async function (event) {
    const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff'
    };
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                ...headers,
                Allow: 'POST'
            },
            body: JSON.stringify({
                error: 'Use POST for this form.'
            })
        };
    }
    if (
        !String(event.headers?.['content-type'] || '')
            .toLowerCase()
            .startsWith('application/json')
    ) {
        return {
            statusCode: 415,
            headers,
            body: JSON.stringify({
                error: 'Submit JSON form data.'
            })
        };
    }
    if (Buffer.byteLength(event.body || '') > 8192) {
        return {
            statusCode: 413,
            headers,
            body: JSON.stringify({
                error: 'The message is too large.'
            })
        };
    }
    try {
        const result = processEnquiry(JSON.parse(event.body || '{}'));
        return {
            statusCode: result.status,
            headers,
            body: JSON.stringify(result.data)
        };
    } catch (error) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                error: 'The form data could not be read.'
            })
        };
    }
};
