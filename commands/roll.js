const { SlashCommandBuilder } = require('discord.js');
const dice = require("../dice.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls Dice')
		.addStringOption(option =>
			option
				.setName('dice')
				.setDescription('The dice to roll, default is d20.'),
		),
	async execute(interaction) {
		const inputDice = interaction.options.getString('dice') ?? "d20";
		// const setting = interaction.options.getString('setting');
		let result = ""
		try {
			result = "/roll " + inputDice + "\n" + dice.rollDiceExp(inputDice, null)
		} catch (err) {
			console.log(err)
			result = "There was an error.";
		}
		await interaction.reply(result); 
	},
};