const Command = require('../../base/command.js');

class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            category: 'system',
            description: 'Checks the bot\'s ping.',
            usage: '{prefix}ping',
            parameters: 'None',
            extended: false,
            permissions: {
                user: 'SEND_MESSAGES',
                bot: 'SEND_MESSAGES'
            },
            aliases: ['p']
        });
    };

    async run(message, args) {
        const msg = await message.channel.send('Pinging..');
        return msg.edit(`Pong!\`\`\`Bot's Ping: ${this.client.ping.toFixed()}ms\nLatency: ${msg.createdTimestamp - message.createdTimestamp}ms\`\`\``);
    };
};

module.exports = Ping;