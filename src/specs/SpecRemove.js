const BaseCommand = require('../base/BaseCommand');
const Specs = require('./index');

class SpecRemove extends BaseCommand {
    static validationRules() {
        return { id: 'required' };
    }

    async execute(params) {
        const { id } = params;
        const result = await Specs.removeSpec(id);
        // TODO: clean up user
        return result;
    }
}

module.exports = SpecRemove;
