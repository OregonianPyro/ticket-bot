class Ready { 
    constructor(client) {
        this.client = client;
    };

    async run() {
        console.log(`${this.client.user.tag} is online!\nUsers: ${this.client.users.size} | Guilds: ${this.client.guilds.size}`);
    };
};

module.exports = Ready;