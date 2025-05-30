const { SlashCommandBuilder } = require('discord.js');
const dice = require("../dice.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rollodds')
		.setDescription('Shows how the roll may go.')
		.addStringOption(option =>
			option
				.setName('dice')
				.setDescription('The dice to roll.'),
		),
	async execute(interaction) {
		const inputDice = interaction.options.getString('dice') ?? "";
		let result = ""
		try {
			result = [
				"/rollodds " + inputDice,
				dice.rollDiceExp(inputDice, "mean"),
				dice.rollDiceExp(inputDice, "min"),
				dice.rollDiceExp(inputDice, "max")
			].join("\n")
		} catch (err) {
			console.log(err)
			result = "There was an error.";
		}
		await interaction.reply(result); 
	},
};