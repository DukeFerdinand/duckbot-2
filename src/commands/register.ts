import {REST, Routes, SlashCommandBuilder} from 'discord.js'

const commands = [
	// Pepitas
	new SlashCommandBuilder()
		.setName('pepitas')
		.setDescription('Gets the total number of "pepitas" dropped in the server')
		.setDMPermission(false)
		.toJSON(),
	// Help
	new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get help with the Duck Bot commands')
		.setDMPermission(false)
		.toJSON(),
	// Translate
	new SlashCommandBuilder()
		.setName("translate")
		.setDescription("Get a translation for your word or phrase in a supported language (default is English)")
		.setDMPermission(false)
		.addStringOption((opt) =>
			opt.setName("text").setDescription("The text you want translated").setRequired(true)
		)
		.addStringOption((opt) =>
			opt.setName("language")
				.setDescription("Translate to this language").addChoices(
				{
					name: 'Japanese',
					value: 'ja',
				},
				{
					name: 'English',
					value: 'en'
				}
			)
		).toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: commands });

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();