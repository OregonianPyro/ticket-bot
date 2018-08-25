class GuildDelete {
    constructor(client) {
        this.client = client;
    };

    async run(guild) {
        this.client.settings.delete(guild.id);
        this.client.guild_tickets.delete(guild.id);
    };
};

module.exports = GuildDelete