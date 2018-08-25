class Command {
    constructor(client, {
        name = null,
        category = null,
        description = null,
        usage = null,
        parameters = null,
        extended = false,
        extended_help = null,
        permissions = {
            user: null,
            bot: null
        },
        aliases = []
    }) {
        this.client = client;
        this.help = { name, category, description, usage, parameters, extended, extended_help };
        this.conf = { permissions, aliases };
    };
};

module.exports = Command;