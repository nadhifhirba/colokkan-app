function json(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store'
        },
        body: JSON.stringify(body)
    };
}

function parseJsonBody(event) {
    if (!event.body) return {};
    try {
        return JSON.parse(event.body);
    } catch (error) {
        throw new Error('Invalid JSON payload');
    }
}

function getAdminToken(event) {
    const directHeader = event.headers['x-admin-token'] || event.headers['X-Admin-Token'];
    if (directHeader) return directHeader;
    const authHeader = event.headers.authorization || event.headers.Authorization || '';
    if (authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7);
    }
    return '';
}

module.exports = {
    json,
    parseJsonBody,
    getAdminToken
};
