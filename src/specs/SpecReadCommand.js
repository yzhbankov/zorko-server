const BaseCommand = require('../base/BaseCommand');
const Specs = require('./index');

class SpecReadCommand extends BaseCommand {
    static validationRules() {
        return { id: ['required'] };
    }

    async execute(params) {
        const { id } = params;
        const spec = await Specs.getSpecs(id, {});
        // TODO: return not direct object
        return spec.spec;
    }
}

module.exports = SpecReadCommand;
