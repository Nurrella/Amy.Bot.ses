require("dotenv").config();

const { Client, GatewayIntentBits, ChannelType } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.once("clientReady", async () => {
  console.log(`Giriş yapıldı: ${client.user.tag}`);

  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const channel = await guild.channels.fetch(CHANNEL_ID);

    if (!channel) {
      console.log("Ses kanalı bulunamadı.");
      return;
    }

    if (
      channel.type !== ChannelType.GuildVoice &&
      channel.type !== ChannelType.GuildStageVoice
    ) {
      console.log("Bu kanal bir ses kanalı değil.");
      return;
    }

    joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: true,
      selfMute: true,
    });

    console.log("Ses kanalına bağlandı.");
  } catch (error) {
    console.error("Ses kanalına bağlanırken hata oluştu:", error);
  }
});

client.on("error", (error) => {
  console.error("Discord istemci hatası:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Beklenmeyen Promise hatası:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Yakalanmayan hata:", error);
});

client.login(TOKEN);