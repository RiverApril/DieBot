#!/usr/bin/env node

var Discord = require("discord.io");
var logger = require("winston");
var auth = require("./auth.json");
var dice = require("./dice")

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = "debug";



// Discord

var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on("ready", function(evt){
    logger.info("Connected");
    logger.info("Logged in as: ");
    logger.info(bot.username + " - (" + bot.id + ")");
});

bot.on("message", function(user, userID, channelID, message, evt) {
    if(message.substr(0, 1) == "!"){
        var args = message.substr(1).split(" ");
        var cmd = args[0].toLowerCase();

        let setting = 0;

        args = args.slice(1);
        if(args.length > 0){
            switch(cmd){
                case "roll": {
                    let result = dice.rollDiceExp(args);
                    bot.sendMessage({
                        to: channelID,
                        message: "<@" + userID + "> " + result
                    });
                    break;
                }
                case "rollavg": {
                    let result = dice.rollDiceExp(args, "mean");
                    bot.sendMessage({
                        to: channelID,
                        message: "<@" + userID + "> " + result
                    });
                    break;
                }
                case "rollmin": {
                    let result = dice.rollDiceExp(args, "min");
                    bot.sendMessage({
                        to: channelID,
                        message: "<@" + userID + "> " + result
                    });
                    break;
                }
                case "rollmax": {
                    let result = dice.rollDiceExp(args, "max");
                    bot.sendMessage({
                        to: channelID,
                        message: "<@" + userID + "> " + result
                    });
                    break;
                }
            }
        }else{
            switch(cmd){
                case "roll": {
                    let result = dice.rollD20("normal");
                    bot.sendMessage({
                        to: channelID,
                        message: "<@" + userID + "> " + result
                    });
                    break;
                }
                case "rolladv": {
                    let result = dice.rollD20("advantage");
                    bot.sendMessage({
                        to: channelID,
                        message: "<@" + userID + "> " + result
                    });
                    break;
                }
                case "rolldis": {
                    let result = dice.rollD20("disadvantage");
                    bot.sendMessage({
                        to: channelID,
                        message: "<@" + userID + "> " + result
                    });
                    break;
                }
            }
        }
    }
});
