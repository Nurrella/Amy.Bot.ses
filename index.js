require("dotenv").config();

const { Client, GatewayIntentBits, ChannelType } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

const GUILD_ID = process.env.GUILD_ID;

const bots = [
  { token: process.env.TOKEN_1, channelId: process.env.CHANNEL_ID_1 },
  { token: process.env.TOKEN_2, channelId: process.env.CHANNEL_ID_2 },
];

bots.forEach((bot, index) => {
  if (!bot.token || !bot.channelId) {
    console.log(`Bot ${index + 1} eksik ayar.`);
    return;
  }

  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  client.once("clientReady", async () => {
    console.log(`Bot ${index + 1} giriş yaptı: ${client.user.tag}`);

    try {
      const guild = await client.guilds.fetch(GUILD_ID);
      const channel = await guild.channels.fetch(bot.channelId);

      if (!channel) {
        console.log(`Bot ${index + 1}: kanal bulunamadı.`);
        return;
      }

      if (
        channel.type !== ChannelType.GuildVoice &&
        channel.type !== ChannelType.GuildStageVoice
      ) {
        console.log(`Bot ${index + 1}: bu kanal ses kanalı değil.`);
        return;
      }

      joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: true,
        selfMute: true,
      });

      console.log(`Bot ${index + 1}: ${channel.name} kanalına girdi.`);
    } catch (err) {
      console.log(`Bot ${index + 1} hata:`, err);
    }
  });

  client.login(bot.token);
});

setInterval(() => {
  console.log("Botlar aktif...");
}, 30000);