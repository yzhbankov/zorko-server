const logger = require('../logger');

const makeRouterHandler = (Command, mapToParams, mapToRes) => async (req, res) => {
    try {
        const { session: { context } } = req;
        const command = new Command({ context });
        const result = await command.run(mapToParams(req));
        if (result) {
            if (!mapToRes) {
                res.json(result);
            } else {
                mapToRes(result, res);
            }
        } else {
            res.status(404)
                .json({ code: 'NOT_FOUND_ERROR' });
        }
    } catch (err) {
        if (err.code === 'NOT_FOUND_ERROR') {
            const data = err.toHash();
            logger.log('error', `code: ${data.code}\\n fields: ${data.fields}, message:${err.message}`);
            res.status(404)
                .json(data);
        } else if (err.code === 'FORMAT_ERROR') {
            const data = err.toHash();
            logger.log('error', ` code: ${data.code}\\n fields: ${data.fields}`);
            res.status(400)
                .json(data);
        } else {
            logger.log('error', ` message: ${err.message} stack: ${err.stack}`);
            res.status(500)
                .json({
                    message: err.message,
                });
        }
    }
};

module.exports = makeRouterHandler;
