const Command = require('../../base/command.js');
const { RichEmbed } = require('discord.js');

class Eval extends Command {
    constructor(client) {
        super(client, {
            name: 'eval',
            category: 'developer',
            description: 'Evaluates JavaScript code.',
            usage: '{prefix}eval <code>',
            parameters: '*code',
            extended: false,
            enabled: true,
            reason: null,
            guildOnly: true,
            permissions: {
                user: 'SEND_MESSAGES',
                bot: 'SEND_MESSAGES'
            },
            aliases: ['e']
        });
    };

    async run(message, args) {
        const content = message.content.split(' ').slice(1).join(' ');
        const result = new Promise((resolve, reject) => resolve(eval(content)));

        return result.then(output => {
            if (typeof output !== 'string') output = require('util').inspect(output, {
                depth: 0
            });
            if (output.includes(process.env.token)) output = output.replace(process.env.token, '[INSERT TOKEN HERE]');
            var toolong = new RichEmbed()
                .setColor("e7ea3c")
                .setTitle("Eval Success")
                .setDescription(`:warning: **Length too long, check console.**`)
            if (output.length > 1000) return console.log(output), message.channel.send(toolong);
            return message.channel.send(output, { code: 'js' });
        }).catch(err => {
            console.error(err);
            err = err.toString();

            if (err.includes(process.env.token)) err = err.replace(process.env.token, 'Not for your eyes');
            // //whopps
            // const eror = (err, {code: 'js'})
            // var oops = new Discod.RichEmbed()
            //   .setColor("ff0000")
            //   .setTitle("Eval Fail")
            //   .setDescription(`\`\`\`\n${eror}\n\`\`\``)
            return message.channel.send(err, { code: 'js' });
        });
    };
};

module.exports = Eval;