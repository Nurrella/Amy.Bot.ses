require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.once("ready", () => {
  console.log(`Giriş yapıldı: ${client.user.tag}`);

  const channel = client.channels.cache.get(CHANNEL_ID);

  if (!channel) {
    console.log("Ses kanalı bulunamadı!");
    return;
  }

  joinVoiceChannel({
    channelId: CHANNEL_ID,
    guildId: GUILD_ID,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfMute: true,   // mikrofon kapalı
    selfDeaf: false,  // sesi açık (istersen true yaparız)
  });

  console.log("Ses kanalına bağlandı!");
});

client.login(TOKEN);