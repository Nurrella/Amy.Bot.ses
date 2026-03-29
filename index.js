require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const GUILD_ID = "1483958419101843488";
const VOICE_CHANNEL_ID = "1483963397086380152";

client.once("ready", async () => {
  console.log(`${client.user.tag} aktif oldu!`);

  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const channel = await guild.channels.fetch(VOICE_CHANNEL_ID);

    if (!channel) {
      console.log("Ses kanalı bulunamadı.");
      return;
    }

    if (channel.type !== 2) {
      console.log("Bu kanal ses kanalı değil.");
      return;
    }

    joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfMute: true,
      selfDeaf: false,
    });

    console.log(`${channel.name} kanalına giriş yapıldı.`);
  } catch (error) {
    console.error("Ses kanalına girerken hata oluştu:", error);
  }
});

client.login(process.env.TOKEN);