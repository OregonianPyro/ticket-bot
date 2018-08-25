class GuildCreate {
    constructor(client) {
        this.client = client;
    };

    async run(guild) {
        this.client.settings.set(guild.id, this.client.default_settings);
        this.client.guild_tickets.set(guild.id, []);
        guild.members.forEach(m => {
            this.client.user_tickets.set(m.user.id, []);
        });
    };
};

module.exports = GuildCreate;