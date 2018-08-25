const { Client, RichEmbed } = require('discord.js');
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const { promisify } = require('util');
const readdir = promisify(require("fs").readdir);
const klaw = require('klaw');
const path = require('path');
require('dotenv').config();

class TicketBot extends Client {
    constructor(options) {
        super(options);
        this.moment = require('moment');
        this.default_settings = require('./default_settings.js');
        this.settings = new Enmap({ provider: new EnmapLevel({ name: 'settings'}) });
        this.guild_tickets = new Enmap({ provider: new EnmapLevel({ name: 'guild_tickets' }) });
        this.user_tickets = new Enmap({ provider: new EnmapLevel({ name: 'user_tickets'}) });
        this.commands = new Map();
        this.aliases = new Map();
        /**
         * @param {object} client The client object.
         * @param {object} message The message object.
         * @param {string} command The command to obtain information for.
         */
        this.color = '15eaa6';
        this.help = (message, command) => {
            let cmd = message.client.commands.get(command) || message.client.commands.get(message.client.aliases.get(command));
            if (!cmd) throw new Error(`Command '${cmd}' not found.`);
            const embed = new RichEmbed()
                .setColor(client.color)
                .setAuthor(`${message.client.user.username} | Command: ${cmd.help.name.split('')[0].toUpperCase()}${cmd.help.name.split('').slice(1).join('')}`, message.client.user.displayAvatarURL)
                .setDescription('`< >` denotes a __required__ parameter.\n`[ ]` denotes an optional parameter.')
                .addField('Description', cmd.help.description)
                .addField('Usage', cmd.help.usage.replace('{prefix}', message.settings.prefix))
                .addField('Parameters', `\`\`\`${cmd.help.parameters}\`\`\``)
                .addField('Aliases', `\`[${cmd.conf.aliases.join(', ')}]\``);
            if (!cmd.help.extended) return message.delete(), message.channel.send(embed);
            embed.addField('Extended Help', cmd.help.extended_help);
            return message.delete(), message.channel.send(embed);
        };
        this.error = (message, err) => {
            return message.channel.send(`\`|❌|\` ${message.member.toString()} | ${err}`);
        };
        this.success = (message, msg) => {
            return message.channel.send(`\`|✅|\` ${message.member.toString()} | ${msg}`);
        };
    };
    loadCommand(commandPath, commandName) {
        try {
            if (commandName === 'command.js') return;
            const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
            console.log(`Loaded Command: ${props.help.name} | Aliases: [${props.conf.aliases.join(', ')}]`);
            props.conf.location = commandPath;
            if (props.init) {
                props.init(this);
            }
            this.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                this.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            if (commandName === 'command.js') return;
            return (`Unable to load command ${commandName}: ${e.message}`);
        };
    };
    async unloadCommand(commandPath, commandName) {
        let command;
        if (this.commands.has(commandName)) {
            command = this.commands.get(commandName);
        } else if (this.aliases.has(commandName)) {
            command = this.commands.get(this.aliases.get(commandName));
        }
        if (!command) return `The command \`${commandName}\` is not recognized by the bot.`;

        if (command.shutdown) {
            await command.shutdown(this);
        }
        delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
        return false;
    };
};

const client = new TicketBot();
const init = async () => {
    klaw("./commands").on("data", (item) => {
        const cmdFile = path.parse(item.path);
        if (!cmdFile.ext || cmdFile.ext !== ".js") return;
        const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
        if (response) console.error(response);
    });
    const evtFiles = await readdir("./events/");
    console.log(`Loading a total of ${evtFiles.length} events`);
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        console.log(`Loaded the event ${eventName}`);
        const event = new (require(`./events/${file}`))(client);
        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
};

init();
client.login(process.env.TOKEN);

process.on('unhandledRejection', error => {
    console.error(`Uncaught Promise Error: \n${error.stack}`);
});