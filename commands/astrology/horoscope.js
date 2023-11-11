const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

const base_url = 'https://horoscope-ro-api.onrender.com/api/v1';

horoscope_translate = {
    'berbec': 'aries',
    'taur': 'taurus',
    'gemeni': 'gemini',
    'rac': 'cancer',
    'leu': 'leo',
    'fecioara': 'virgo',
    'balanta': 'libra',
    'scorpion': 'scorpio',
    'sagetator': 'sagittarius',
    'capricorn': 'capricorn',
    'varsator': 'aquarius',
    'pesti': 'pisces',
};

function writeHearts(number) {
    heartRating = '';
    nr = parseInt(number);
    if (nr !== NaN) {
        for (i = 0; i < 5; i++) {
            if (i < number) {
                heartRating += ' :heart: ';
            }
            else {
                heartRating += ' :white_heart: ';
            }
        }
    }
    return heartRating;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('horoscop')
        .setDescription('Iti da horoscopul pentru o zodie pentru azi, ieri sau maine')
        .addStringOption(option =>
            option.setName('zodie')
                .setDescription('Ce zodie cauti')
                .setRequired(true)
                .addChoices(
                    { name: 'Berbec', value: 'leu' },
                    { name: 'Taur', value: 'taur' },
                    { name: 'Gemeni', value: 'gemeni' },
                    { name: 'Rac', value: 'rac' },
                    { name: 'Leu', value: 'leu' },
                    { name: 'Fecioara', value: 'fecioara' },
                    { name: 'Balanta', value: 'balanta' },
                    { name: 'Scorpion', value: 'scorpion' },
                    { name: 'Sagetator', value: 'sagetator' },
                    { name: 'Capricorn', value: 'capricorn' },
                    { name: 'Varsator', value: 'varsator' },
                    { name: 'Pesti', value: 'pesti' },
                ))
        .addStringOption(option =>
            option.setName('zi')
                .setDescription('Pentru ce zi')
                .setRequired(true)
                .addChoices(
                    { name: 'Azi', value: 'TODAY' },
                    { name: 'Ieri', value: 'YESTERDAY' },
                    { name: 'Maine', value: 'TOMORROW' },
                )),
    async execute(interaction) {
        // get data from horoscope API
        const zodie = interaction.options.getString('zodie');
        const zi = interaction.options.getString('zi');
        response = await fetch(`${base_url}/get-horoscope/daily?sign=${zodie}&day=${zi}`);
        json = await response.json();

        // create embed response
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${zodie.toUpperCase()}`)
            .setURL('https://www.horoscop.ro/')
            .setThumbnail(`https://www.horoscope.com/images-US/signs/profile-${horoscope_translate[zodie]}.jpg`)
            .addFields(
                { name: `Horoscopul tau pentru ${zi === 'TODAY' ? 'azi' : (zi === 'YESTERDAY' ? 'ieri' : 'maine')}`, value: json.data }
            )
            .setTimestamp()
            .setFooter({ text: 'Bot horoscop romana', iconURL: `https://www.horoscope.com/images-US/signs/profile-${horoscope_translate[zodie]}.jpg` });
        for (rating in json.ratings) {
            embed.addFields({ name: rating, value: writeHearts(json.ratings[rating]), inline: true })
        }

        // send embeds
        await interaction.reply({ embeds: [embed] });
    },
};