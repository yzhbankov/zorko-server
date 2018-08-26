const logger = require('../logger');

const makeRouterHandler = (Command, mapToParams) => async (req, res) => {
    try {
        const { session: { context } } = req;
        const command = new Command({ context });
        const result = await command.run(mapToParams(req));
        if (result) {
            res.json(result);
        } else {
            result.status(404).json({ code: 'NOT_FOUND' });
        }
    } catch (err) {
        if (err.code === 'FORMAT_ERROR') {
            const data = err.toHash();
            logger.log('error', ` code: ${data.code}\\n fields: ${data.fields}`);
            res.status(400).json(data);
        } else {
            logger.log('error', ` message: ${err.message} stack: ${err.stack}`);
            res.status(500).json({
                message: err.message,
            });
        }
    }
};

module.exports = makeRouterHandler;
