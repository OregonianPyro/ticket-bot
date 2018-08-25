/**
 * Changes the settings for the bot. The first command they / you should run when adding the bot. If you don't, then none
 * of the ticket commands will work.
 */
const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');
/**
 * 'Prefix' changes the prefix for the bot in that server.
 * 'Logs' sets the logs channel (for tickets) in that server, or disables them.
 * 'Category' is the category for which you want the tickets to be made in.
 * 'Tag_Staff' tells the bot to tag staff in the created ticket channel or not.
 * 'Cooldown' sets the amount of time a user has to wait to submit another ticket. (time is in minutes)
 */
class Settings extends Command {
    constructor(client) {
        super(client, {
            name: 'settings',
            category: 'admin',
            description: 'View or edit the settings for your server.',
            usage: '{prefix}settings <view|edit> <key <value>',
            parameters: 'stringFlag, stringKey, *Value',
            extended: true,
            extended_help: 'Available Keys: `prefix`, `logs`, `category`, `tag_staff`, `cooldown`',
            permissions: {
                user: 'ADMINISTRATOR',
                bot: 'SEND_MESSAGES'
            },
            aliases: ['set', 'conf']
        });
    };

    async run(message, args) {
        if (!args[0]) return message.channel.send(`\`|❌|\` ${message.member.toString()} | You must provide a flag.`);
        if (args[0].toLowerCase() === 'view') {
            const embed = new RichEmbed()
                .setColor(this.client.color)
                .setAuthor(message.guild.name, message.guild.iconURL)
                .setTitle(`Displaying the Current Settings for: ${message.guild.name}`)
                .setDescription(`\`\`\`${JSON.stringify(message.settings, null, 2)}\`\`\``);
            return message.channel.send(embed);
        } else if (args[0].toLowerCase() === 'edit') {
            if (!args[1] || !args[2]) if (!args[0]) return message.channel.send(`\`|❌|\` ${message.member.toString()} | You must provide a key and/or value.`);
            let key = args[1].toLowerCase();
            if (key === 'prefix') {
                let val = args[2];
                if (val.length >= 10) return this.client.error(message, 'Please provide a shorter prefix.');
                message.settings.prefix = val;
                this.client.settings.set(message.guild.id, message.settings);
                return this.client.success(message, `Successfully set your prefix to \`${val}\``);
            } else if (key === 'logs') {
                if (args[2].toLowerCase() === 'off' || args[2].toLowerCase() === 'false') {
                    message.settings.log_channel.enabled= false;
                    this.client.settings.set(message.guild.id, message.settings);
                    return this.client.success(message, 'Successfully turned off your logging.');
                };
                if (args[2].toLowerCase() === 'on' || args[2].toLowerCase() === 'true') {
                    message.settings.log_channel.enabled = true;
                    this.client.settings.set(message.guild.id, message.settings);
                    return this.client.success(message, 'Successfully turned on your logging.')
                };
                const new_log = message.mentions.channels.first() || message.guild.channels.find(c => c.name.toLowerCase().includes(args[2].toLowerCase())) || message.guild.channels.get(args[2]);
                if (!new_log) return this.client.error(message, 'Invalid channel - Channel does not exist.');
                message.settings.log_channel.channel = new_log.id;
                message.settings.log_channel.enabled= true;
                this.client.settings.set(message.guild.id, message.settings);
                return this.client.success(message, `Successfully set your log channel to \`#${new_log.name}\``);
            } else if (key === 'staff' || key === 'tag_staff' || key === 'tag-staff') {
                let val = args[2];
                if (val !== 'true' && val !== 'false') return this.client.error(message, 'Expected value can only be true or false.');
                message.settings.tag_staff = val;
                this.client.settings.set(message.guild.id, message.settings);
                return this.client.success(message, `Successfully updated your setting to ${val}`);
            } else if (key === 'cooldown') {
                const ms = require('ms');
                if (isNaN(parseInt(args[2]))) return this.client.error(message, 'Time can only be a number.');
                if (ms('1 week') >= ms(args[2])) return this.client.error(message, 'Time must be shorter than one week.');
                message.settings.cooldown = ms(args[2]);
                this.client.settings.set(message.guild.id, message.settings);
                return this.client.success(message, `Successfully set your cooldown to \`${ms(ms(args[2]), { long: true })}\``);
            };
        };
    };
};

module.exports = Settings;