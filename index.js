require("dotenv").config();

const { Client, GatewayIntentBits, ChannelType } = require("discord.js");
const {
  joinVoiceChannel,
  entersState,
  VoiceConnectionStatus,
} = require("@discordjs/voice");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.once("clientReady", async () => {
  console.log(`Giriş yapıldı: ${client.user.tag}`);
  console.log(`GUILD_ID: ${GUILD_ID}`);
  console.log(`CHANNEL_ID: ${CHANNEL_ID}`);

  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    console.log(`Sunucu bulundu: ${guild.name}`);

    const channel = await guild.channels.fetch(CHANNEL_ID);

    if (!channel) {
      console.log("Ses kanalı bulunamadı.");
      return;
    }

    console.log(`Kanal bulundu: ${channel.name}`);
    console.log(`Kanal tipi: ${channel.type}`);

    if (
      channel.type !== ChannelType.GuildVoice &&
      channel.type !== ChannelType.GuildStageVoice
    ) {
      console.log("Bu kanal bir ses kanalı değil.");
      return;
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: true,
      selfMute: true,
    });

    connection.on("stateChange", (oldState, newState) => {
      console.log(`Bağlantı durumu: ${oldState.status} -> ${newState.status}`);
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 20_000);
    console.log("Ses kanalına başarıyla bağlandı.");
  } catch (error) {
    console.error("Ses kanalına bağlanırken hata oluştu:");
    console.error(error);
  }
});

client.on("error", console.error);
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

client.login(TOKEN);
client.login(TOKEN);

setInterval(() => {
  console.log("Bot aktif...");
}, 30000);