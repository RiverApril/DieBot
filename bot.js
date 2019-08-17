#!/usr/bin/env node

var Discord = require("discord.io");
var logger = require("winston");
var auth = require("./auth.json");
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = "debug";



var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on("ready", function(evt){
    logger.info("Connected");
    logger.info("Logged in as: ");
    logger.info(bot.username + " - (" + bot.id + ")");
});

let SETTING_MEAN = 1;
let SETTING_MIN = 2;
let SETTING_MAX = 3;

function rollDie(sides, setting){
    if(setting == SETTING_MEAN){
        return sides/2 + 0.5;
    }else if(setting == SETTING_MIN){
        return 1;
    }else if(setting == SETTING_MAX){
        return sides;
    }else{
        return 1 + Math.floor(Math.random() * sides);
    }
}

function rollDiceExp(args, setting){
    let exp = args.join("").toLowerCase();
    var tokens = exp.match(/[0-9]+d[0-9]+|d[0-9]+|[0-9]+|[\+\-]/gi);
    let sum = 0;
    let equation = "";
    let expectNum = true;
    let nextNegative = false;
    let rollCount = 0;

    for(let i = 0; i < tokens.length; i++){
        let token = tokens[i];
        if(token == "+"){
            if(expectNum){
                return "Invalid Expression: Unexpected '" + token + "'";
            }else{
                equation += ", ";
                expectNum = true;
            }
        }else if(token == "-"){
            if(expectNum){
                return "Invalid Expression: Unexpected '" + token + "'";
            }else{
                equation += ", ";
                nextNegative = true;
                expectNum = true;
            }
        }else{
            if(expectNum){
                if(token.includes("d")){
                    let nums = token.split('d');
                    if(nums.length == 2){
                        if(nums[0] == ""){
                            nums[0] = "1";
                        }
                        if(nums[1] == ""){
                            return "Invalid Expression: " + num[0] + " d-What?";
                        }
                    }else if(nums.length != 1){
                        return "Invalid Expression: Too many d's.";
                    }

                    let qty = parseInt(nums[0]);
                    if(isNaN(qty)){
                        return "Invalid Expression: Not a Number '" + token + "'";
                    }
                    let die = parseInt(nums[1]);
                    if(isNaN(die)){
                        return "Invalid Expression: Not a Number '" + token + "'";
                    }

                    if(qty < 1){
                        return "Invalid Expression: Gotta at least have one die.";
                    }
                    if(die < 1){
                        return "Invalid Expression: A die has to have at least 1 side.";
                    }

                    if(qty > 100){
                        let tempSum = 0;
                        for(let i = 0; i < qty; i++){
                            let num = (nextNegative?-1:1) * rollDie(die, setting);
                            rollCount++;
                            tempSum += num;
                        }
                        sum += tempSum;
                    }else if(qty > 1){
                        let tempSum = 0;
                        for(let i = 0; i < qty; i++){
                            let num = (nextNegative?-1:1) * rollDie(die, setting);
                            rollCount++;
                            tempSum += num;
                            if(i == 0){
                                equation += num + " ";
                            }else{
                                equation += "+ " + num + " ";
                            }
                        }
                        equation += "= " + tempSum;
                        sum += tempSum;
                    }else{
                        let num = (nextNegative?-1:1) * rollDie(die, setting);
                        rollCount++;
                        sum += num;
                        equation += num;
                    }

                    if(nextNegative){
                        nextNegative = false;
                    }
                }else{
                    let num = (nextNegative?-1:1) * parseInt(token);
                    if(isNaN(num)){
                        return "Invalid Expression: Not a Number '" + token + "'";
                    }
                    sum += num;
                    equation += num;

                    if(nextNegative){
                        nextNegative = false;
                    }
                }
                expectNum = false;
            }else{
                return "Invalid Expression: Expected '+' or '-' not '" + token + "'";
            }
        }

    }
    if(expectNum){
        return "Invalid Expression: Trailing '" + tokens[tokens.length-1] + "'";
    }
    let action = "rolled";
    if(setting == SETTING_MEAN){
        action = "average is";
    }else if(setting == SETTING_MIN){
        action = "minimum is";
    }else if(setting == SETTING_MAX){
        action = "maximum is";
    }
    if(rollCount > 1 && rollCount <= 100){
        return action+" **" + sum + "**. " + "(" + equation + ")";
    }else if(rollCount == 0){
        return "that's just **" + sum + "**. ";
    }else{
        return action+" **" + sum + "**. ";
    }
}

bot.on("message", function(user, userID, channelID, message, evt) {
    if(message.substr(0, 1) == "!"){
        var args = message.substr(1).split(" ");
        var cmd = args[0].toLowerCase();

        let setting = 0;

        args = args.slice(1);
        switch(cmd){
            case "roll": {
                let result = rollDiceExp(args);
                bot.sendMessage({
                    to: channelID,
                    message: "<@" + userID + "> " + result
                });
                break;
            }
            case "rollavg": {
                let result = rollDiceExp(args, SETTING_MEAN);
                bot.sendMessage({
                    to: channelID,
                    message: "<@" + userID + "> " + result
                });
                break;
            }
            case "rollmin": {
                let result = rollDiceExp(args, SETTING_MIN);
                bot.sendMessage({
                    to: channelID,
                    message: "<@" + userID + "> " + result
                });
                break;
            }
            case "rollmax": {
                let result = rollDiceExp(args, SETTING_MAX);
                bot.sendMessage({
                    to: channelID,
                    message: "<@" + userID + "> " + result
                });
                break;
            }
        }
    }
});
