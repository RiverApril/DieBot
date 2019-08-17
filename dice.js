

// dice.js

function rollDie(sides, setting){
    if(setting == "mean"){
        return sides/2 + 0.5;
    }else if(setting == "min"){
        return 1;
    }else if(setting == "max"){
        return sides;
    }else{
        return 1 + Math.floor(Math.random() * sides);
    }
}

module.exports = {

    rollD20: function(style){
        if(style == "normal"){
            return "rolled **" + rollDie(20) + "**.";
        }else{
            let a = rollDie(20);
            let b = rollDie(20);
            if(style == "advantage"){
                val = Math.max(a, b);
            } else if(style == "disadvantage"){
                val = Math.min(a, b);
            }else{
                return "Invalid D20 style."
            }
            return "rolled **" + val + "**. (" + a + ", " + b + ")";
        }
    },

    rollDiceExp: function(args, setting){
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
        if(setting == "mean"){
            action = "average is";
        }else if(setting == "min"){
            action = "minimum is";
        }else if(setting == "max"){
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
}