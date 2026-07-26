const sanitizeValue = (val) => {
    if (typeof val === 'string') {
        // Strip out HTML tag patterns
        return val.replace(/<[^>]*>/g, '');
    }
    if (typeof val === 'object' && val !== null) {
        for (const key in val) {
            val[key] = sanitizeValue(val[key]);
        }
    }
    return val;
};

const xssSanitizer = (req, res, next) => {
    if (req.body) req.body = sanitizeValue(req.body);
    if (req.query) req.query = sanitizeValue(req.query);
    if (req.params) req.params = sanitizeValue(req.params);
    next();
};

module.exports = xssSanitizer;
