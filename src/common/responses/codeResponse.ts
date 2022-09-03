export const Responses = {
    DefineResponse(statusCode = 502, data = {}) {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*',
            },
            statusCode,
            body: JSON.stringify(data),
        };
    },

    OK(data = {}) {
        return this.DefineResponse(200, data);
    },

    BadRequest(data = {}) {
        return this.DefineResponse(400, data);
    },
};