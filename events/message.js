class Message {
    constructor(client) {
        this.client = client;
    };

    async run(message) {
        if (message.author.bot) return;
        if (message.channel.type !== 'text') return;
        message.settings = this.client.settings.get(message.guild.id);
        if (message.content.indexOf(message.settings.prefix) !== 0) return;
        const args = message.content.split(' ').slice(1);
        let command = message.content.split(' ')[0];
        command = command.slice(message.settings.prefix.length).toLowerCase();
        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
        if (!cmd) return;
        if (!message.member.permissions.has(cmd.conf.permissions.user)) {
            return message.channel.send(`:warning: | You must have the permission \`${cmd.conf.permissions.user}\` to use this command.`);
        };
        if (!message.guild.me.permissions.has(cmd.conf.permissions.bot)) {
            return message.channel.send(`:warning: | The bot requires the permission \`${cmd.conf.permissions.bot}\` to execute this command.`);
        };
        try {
            await cmd.run(message, args);
        } catch (e) {
            message.channel.send(`:x: | \`ERROR:\` ${e.message}`);
            return console.error(e.stack);
        };
    };
};

module.exports = Message;