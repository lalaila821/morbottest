const botconfig = require("./botconfig.json");
const tokenfile = require("./token.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
//let coins = require("./coins.json");
let xp = require("./xp.json");
let purple = botconfig.purple;
let cooldown = new Set();
let cdseconds = 5;

fs.readdir("./commands/", (err, files) => {

  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", async () => {
  //online message for terminal
  console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
  bot.user.setActivity("Flitzbane", {
    type: "WATCHING"
  });

});


bot.on("message", async message => {
  //ignores bots
  if (message.author.bot) return;
  //ignores dm
  if (message.channel.type === "dm") return;
  //set server specific prefixes
  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if (!prefixes[message.guild.id]) {
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }

  // if(!coins[message.author.id]){
  //   coins[message.author.id] = {
  //     coins: 0
  //   };
  // }

  // let coinAmt = Math.floor(Math.random() * 15) + 1;
  // let baseAmt = Math.floor(Math.random() * 15) + 1;
  // console.log(`${coinAmt} ; ${baseAmt}`);

  // if(coinAmt === baseAmt){
  //   coins[message.author.id] = {
  //     coins: coins[message.author.id].coins + coinAmt
  //   };
  // fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
  //   if (err) console.log(err)
  // });
  // let coinEmbed = new Discord.RichEmbed()
  // .setAuthor(message.author.username)
  // .setColor("#0000FF")
  // .addField("💸", `${coinAmt} coins added!`);

  // message.author.send(coinEmbed).then(msg => {msg.delete(5000)});
  // }

  //levels & XP
  let xpAdd = Math.floor(Math.random() * 7) + 8;
  console.log(xpAdd);

  if (!xp[message.author.id]) {
    xp[message.author.id] = {
      xp: 0,
      level: 1
    };
  }

  let curxp = xp[message.author.id].xp;
  let curlvl = xp[message.author.id].level;
  let nxtLvl = xp[message.author.id].level * 300;
  xp[message.author.id].xp = curxp + xpAdd;
  //messages member when hits new level
  if (nxtLvl <= xp[message.author.id].xp) {
    xp[message.author.id].level = curlvl + 1;
    let lvlup = new Discord.RichEmbed()
      .setTitle("You have leveled up!")
      .setColor(purple)
      .setThumbnail("https://media.tenor.com/images/861f82d2fc2283ebe9c3c2e8a059c0dd/tenor.gif")
      .addField("Good Job!", curlvl + 1);

    message.author.send(lvlup);
  }

  //END LEVELS

  fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
    if (err) console.log(err)
  });
  let prefix = prefixes[message.guild.id].prefixes;
  if (!message.content.startsWith(prefix)) return;
  if (cooldown.has(message.author.id)) {
    message.delete();
    return message.reply("You have to wait 5 seconds between commands.")
  }
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    cooldown.add(message.author.id);
  }


  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if (commandfile) commandfile.run(bot, message, args);

  setTimeout(() => {
    cooldown.delete(message.author.id)
  }, cdseconds * 1000)

});

bot.login(process.env.BOT_TOKEN);
