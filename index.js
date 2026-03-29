require("dotenv").config();

const { Client, GatewayIntentBits, ChannelType } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.once("ready", async () => {
  console.log(`Giriş yapıldı: ${client.user.tag}`);
  console.log("GUILD_ID:", GUILD_ID);
  console.log("CHANNEL_ID:", CHANNEL_ID);

  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    console.log("Sunucu bulundu:", guild.name);

    const channel = await guild.channels.fetch(CHANNEL_ID);
    if (!channel) {
      console.log("Kanal bulunamadı.");
      return;
    }

    console.log("Kanal bulundu:", channel.name);
    console.log("Kanal tipi:", channel.type);

    if (
      channel.type !== ChannelType.GuildVoice &&
      channel.type !== ChannelType.GuildStageVoice
    ) {
      console.log("Bu kanal ses kanalı değil.");
      return;
    }

    joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfMute: true,
      selfDeaf: true,
    });

    console.log(`${channel.name} kanalına bağlanıldı.`);
  } catch (error) {
    console.error("Ses kanalına bağlanırken hata:", error);
  }
});

client.login(TOKEN);