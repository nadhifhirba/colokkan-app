const { json } = require('./_lib/http');

exports.handler = async function handler() {
    return json(200, {
        googleMaps: {
            enabled: Boolean(process.env.GOOGLE_MAPS_BROWSER_KEY),
            browserKey: process.env.GOOGLE_MAPS_BROWSER_KEY || ''
        }
    });
};
