const { SlashCommandBuilder } = require('discord.js');
const dice = require("../dice.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rolld20')
		.setDescription('Rolls D20')
		.addStringOption(option =>
			option
				.setName("style")
				.setChoices(
					[
						{name: "single", value: "normal"},
						{name: "advantage", value: "advantage"},
						{name: "disadvantage", value: "disadvantage"}
					]
				)
				.setDescription('Roll with advantage or disadvantage'),
		),
	async execute(interaction) {
		const style = interaction.options.getString('style') ?? "normal";
		let styleText = style;
		if (style == "normal") {
			styleText = "";
		}
		let result = ""
		try {
			result = "/rolld20 " + styleText + "\n" + dice.rollD20(style)
		} catch (err) {
			console.log(err)
			result = "There was an error.";
		}
		await interaction.reply(result); 
	},
};