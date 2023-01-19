import {
	Client, codeBlock, EmbedBuilder, Events,
	GatewayIntentBits
} from 'discord.js'
import {format} from 'date-fns'
import {getMongooseConnection} from "./db";

// General channel and data mapping

const EMOJI = {
	Pepitas: '1065120900506210464',
	IsForLove: '942091047146774548'
}

const Channels = {
	Introductions: '1065466035555274792',
}

enum Commands {
	Pepitas = 'pepitas',
	Translate = 'translate',
	Help = 'help'
}

const LanguageMap = {
	ja: "Japanese",
	en: "English",
	es: "Spanish",
	fr: "French",
	de: "German",
	pt: "Portuguese",
	ko: "Korean",
}


const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]})

// Ready event
client.on(Events.ClientReady, () => {
	console.log('DUCK BOT IS ALIVE!')
	console.log(`Logged in as ${client.user?.tag}`)
	client.user?.setActivity("/help | citypop.in")
})

// Handle slash command interactions
client.on(Events.InteractionCreate, async function (interaction) {
	if (interaction.isCommand()) {
		await interaction.channel?.sendTyping()

		console.log(interaction.commandName)

		switch (interaction.commandName) {
			case Commands.Pepitas: {
				await interaction.reply({
					embeds: [
						EmbedBuilder.from({
							title: `${interaction.guild?.emojis.cache.get(EMOJI.Pepitas)} Pepitas Summary`,
							description: format(new Date(), 'hh:mm E dd MMM yyyy')
						})
					]
				})
				break
			}
			case Commands.Translate: {
				const [text, language] = interaction.options.data.map((opt) => opt.value)

				await interaction.reply({
					ephemeral: true,
					content: "Translation created!",
					embeds: [
						EmbedBuilder.from({
							title: `${interaction.guild?.emojis.cache.get(EMOJI.IsForLove)} Translation created!`,
							description: "How did I do?",
							fields: [
								{
									name: "Original Text",
									value: codeBlock(String(text))
								},
								{
									name: "Translated Text",
									value: codeBlock(LanguageMap[language as keyof typeof LanguageMap])
								}
							],
						})
					]
				})
				break
			}
			case Commands.Help: {
				await interaction.reply({
					embeds: [
						EmbedBuilder.from({
							title: `${interaction.guild?.emojis.cache.get(EMOJI.IsForLove)} Duck Bot Help`,
							description: format(new Date(), 'hh:mm E dd MMM yyyy')

						})
					]
				})
				break
			}
		}
	}
})

// React to various messages, NOT commands
client.on(Events.MessageCreate, async (msg) => {
	if (msg.content.toLowerCase().includes('pepitas')) {
		console.log("DETECTED PEPITAS MESSAGE!")
		await msg.react(msg.guild?.emojis.cache.get(EMOJI.Pepitas)!)
	}

	if (msg.channelId === Channels.Introductions) {
		const content = msg.content
		if (msg.content.length < 100) {
			await msg.delete()
			await msg.author.createDM().then(async (dm) => {
				await dm.send(`Hey ${msg.author.username}, I'm Duck Bot - welcome to SeasideFM! I'm writing to let you know your introduction is a little too short. Can you please write a little more about yourself? We'd love to get to know you!`)
				await dm.send({
					content: `Here's what you wrote: \`\`\`${content}\`\`\``,
				})
			})
		} else {
			await msg.react(msg.guild?.emojis.cache.get(EMOJI.IsForLove)!)
		}
	}
})

// client.login is blocking, so we set up the database connection BEFORE the bot starts
async function startup() {
	await getMongooseConnection()
	await client.login(process.env.BOT_TOKEN)
}

startup().catch(e => console.error(e))
