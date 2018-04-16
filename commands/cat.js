const Discord = require("discord.js");
const superagent = require("superagent");

module.exports.run = async (bot, message, args) => {

    let {body} = await superagent
    .get(`https://aws.random.cat//meow`);

    /*cat embed*/
    let catembed = new Discord.RichEmbed()
    .setColor("#15f153")
    .setTitle("Cat")
    .setImage(body.url);

    message.channel.send(catembed);
}

module.exports.help = {
    name: "cat"
}