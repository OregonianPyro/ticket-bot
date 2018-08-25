const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');

class Ticket extends Command {
    constructor(client) {
        super(client, {
            name: 'ticket',
            category: 'ticket system',
            description: 'Creates a new ticket.',
            usage: '{prefix}ticket <reason>',
            parameters: 'stringReason',
            extended: false,
            permissions: {
                user: 'SEND_MESSAGES',
                bot: 'ADMINISTRATOR'
            },
            aliases: ['createticket, newticket']
        });
    };

    async run(message, args) {
        if (!args[0]) return this.client.help(message, 'ticket');
        const str = args.slice(1).join(' ');
        if (str.length < 20) return this.client.error(message, 'Parameter [ REASON ] must exceed 20 characters.');
        message.delete();
        const msg = await message.channel.send('Validating information...');
        if (!message.settings.parent_id || !message.guild.channels.get(message.settings.parent_id)) {
            await msg.edit('No categoy set. Making category...');
            const cat = await message.guild.createChannel('tickets', 'category', [{
                id: message.guild.id,
                allowed: [],
                denied: ['SEND_MESSAGES', 'READ_MESSAGES']
            }]);
            message.settings.parent_id = cat.id;
            this.client.settings.set(message.guild.id, message.settings);
            await msg.edit('Categoy made. Making new role...');
            const size = this.client.guild_tickets.get(message.guild.id).length;
            const role = await message.guild.createRole({
                name: `ticket-${size}`,
                permissions: [],
                color: 'RANDOM'
            });
            await msg.edit('Role made. Making channel...');
            const channel = await message.guild.createChannel(`ticket-${size}`, 'text', [{
                id: message.guild.id,
                allowed: [],
                denied: ['SEND_MESSAGES', 'READ_MESSAGES']
            }, {
                id: role.id,
                allowed: ['SEND_MESSAGES', 'READ_MESSAGES'],
                denied: []
            }]);
            channel.setParent(message.guild.channels.get(message.settings.parent_id));
            await msg.edit('Role made. Channel set. Attempting to add role...');
            try {
                await message.member.addRole(role.id);
            } catch (e) {
                return msg.edit(`\`ERROR\`: ${e.message}`);
            };
            await msg.edit('Successfully made the category, channel, and role.');
            const time = this.client.moment().format('LLLL');
            const obj = {
                ticket_num: size,
                username: message.author.tag,
                user_id: message.author.id,
                reason: str,
                time: time
            };
            this.client.guild_tickets.get(message.guild.id).push(obj);
            this.client.guild_tickets.set(message.guild.id, this.client.guild_tickets.get(message.guild.id));
            this.client.user_tickets.get(message.author.id).push(obj);
            this.client.user_tickets.set(message.author.id, this.client.user_tickets.get(message.author.id));
            const { log_channel } = message.settings;
            if (!log_channel.enabled) return;
            const log = message.guild.channels.find(c => c.name === log_channel.channel) || message.guild.channels.get(log_channel.channel);
            if (!log) return;
            const embed = new RichEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL)
                .setTitle('New Ticket')
                .setDescription('**> Status: OPEN**')
                .addField('User', message.author.tag, true)
                .addField('User ID', message.author.id, true)
                .addField('Reason', `\`\`\`${str}\`\`\``, true)
                .setFooter(`Ticket #${size} | ${time}`)
                .setColor('GREEN');
            return log.send(embed);
        } else {
            //
            //
            await msg.edit('Making role...');
            const size = this.client.guild_tickets.get(message.guild.id).length;
            const role = await message.guild.createRole({
                name: `ticket-${size}`,
                permissions: [],
                color: 'RANDOM'
            });
            await msg.edit('Role made. Making channel...');
            const channel = await message.guild.createChannel(`ticket-${size}`, 'text', [{
                id: message.guild.id,
                allowed: [],
                denied: ['SEND_MESSAGES', 'READ_MESSAGES']
            }, {
                id: role.id,
                allowed: ['SEND_MESSAGES', 'READ_MESSAGES'],
                denied: []
            }]);
            channel.setParent(message.guild.channels.get(message.settings.parent_id));
            await msg.edit('Role made. Channel set. Attempting to add role...');
            try {
                await message.member.addRole(role.id);
            } catch (e) {
                return msg.edit(`\`ERROR\`: ${e.message}`);
            };
            await msg.edit('Successfully made the category, channel, and role.');
            const time = this.client.moment().format('LLLL');
            const obj = {
                ticket_num: size,
                username: message.author.tag,
                user_id: message.author.id,
                reason: str,
                time: time
            };
            this.client.guild_tickets.get(message.guild.id).push(obj);
            this.client.guild_tickets.set(message.guild.id, this.client.guild_tickets.get(message.guild.id));
            this.client.user_tickets.get(message.author.id).push(obj);
            this.client.user_tickets.set(message.author.id, this.client.user_tickets.get(message.author.id));
            const { log_channel } = message.settings;
            if (!log_channel.enabled) return;
            const log = message.guild.channels.find(c => c.name === log_channel.channel) || message.guild.channels.get(log_channel.channel);
            if (!log) return;
            const embed = new RichEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL)
                .setTitle('New Ticket')
                .setDescription('**> Status: OPEN**')
                .addField('User', message.author.tag, true)
                .addField('User ID', message.author.id, true)
                .addField('Reason', `\`\`\`${str}\`\`\``, true)
                .setFooter(`Ticket #${size} | ${time}`)
                .setColor('GREEN');
            return log.send(embed);
            //
            //
        };
    };
};

module.exports = Ticket;