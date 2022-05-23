const url = require('url');
const apiPrefix = 'api/v1';

const generateNextUrl = (limit, offset, totalResults, requestQuery, baseUrl) => {
    if (offset + limit < totalResults) {
        const nextOffset = offset + limit;
        const query = Object.assign({}, requestQuery, { limit, offset: nextOffset });
        const queryStr = Object.keys(query)
            .map((key) => {
                if (['filter', 'sorter'].includes(key) && typeof query[key] === 'object') {
                    //need to parse query params object
                    const queryParam = query[key];
                    return Object.keys(queryParam)
                        .map((k) => `${key}[${k}]=${queryParam[k]}`)
                        .join('&');
                }
                return `${key}=${query[key]}`;
            })
            .join('&');
        return `${baseUrl}?${queryStr}`;
    }
    return '';
};

const genPagination = (req, limit, offset, totalResults) => {
    const path = `${apiPrefix}`;
    const baseUrl = url.parse(req.originalUrl, false).pathname.replace(/^\/api\/v1/, path);
    const next = generateNextUrl(limit, offset, totalResults, req.query, baseUrl);
    return {
        totalResults,
        offset,
        limit,
        next
    };
};

const paginateResult = (results, req, limit, offset, totalResults) => ({
    results,
    pagination: genPagination(req, limit, offset, totalResults)
});

module.exports = {
    paginateResult,
};

