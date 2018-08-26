const BaseCommand = require('../base/BaseCommand');
const Specs = require('./index');

class SpecRemove extends BaseCommand {
    static validationRules() {
        return { id: 'required' };
    }

    async execute(params) {
        const { id } = params;
        const wasRemoved = await Specs.removeSpec(id);
        return wasRemoved;
    }
}

module.exports = SpecRemove;
