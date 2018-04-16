const Discord = require("discord.js");
const superagent = require("superagent");

module.exports.run = async (bot, message, args) => {

    let {body} = await superagent
    .get(`https://random.dog/woof.json`);

    /*dog embed*/
    let dogembed = new Discord.RichEmbed()
    .setColor("#15f153")
    .setTitle("Dog")
    .setImage(body.url);

    message.channel.send(dogembed);
}

module.exports.help = {
    name: "dog"
}