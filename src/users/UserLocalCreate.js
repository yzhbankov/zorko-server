const BaseCommand = require('../base/BaseCommand');
const toUserDto = require('./toUserDto');
const Users = require('./User');

class UserLocalCreate extends BaseCommand {
    static validationRules() {
        return {
            login: 'required',
            password: ['string', 'required'],
            email: ['email', 'required'],
        };
    }

    async execute(params) {
        const user = await Users.createUser(params);
        return toUserDto(user);
    }
}

module.exports = UserLocalCreate;
