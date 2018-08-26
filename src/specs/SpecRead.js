const BaseCommand = require('../base/BaseCommand');
const Specs = require('./index');

class SpecRead extends BaseCommand {
    static validationRules() {
        return { id: ['required'] };
    }

    async execute(params) {
        const { id } = params;
        const spec = await Specs.getSpecs(id, {});
        return {
            id: spec.id,
            spec: spec.spec,
            title: spec.title,
            createdBy: spec.createdBy,
        };
    }
}

module.exports = SpecRead;
