require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  entersState,
  VoiceConnectionStatus,
  getVoiceConnection,
} = require("@discordjs/voice");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const GUILD_ID = "1483958419101843488";
const VOICE_CHANNEL_ID = "1483961789090627728";

async function connectToVoice() {
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

    const existingConnection = getVoiceConnection(guild.id);
    if (existingConnection) {
      try {
        existingConnection.destroy();
      } catch (err) {}
    }

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfMute: true,
      selfDeaf: true,
    });

    connection.on("stateChange", async (_, newState) => {
      console.log("Ses durumu:", newState.status);

      if (newState.status === VoiceConnectionStatus.Disconnected) {
        console.log("Ses bağlantısı koptu, 5 saniye sonra tekrar denenecek...");

        setTimeout(async () => {
          await connectToVoice();
        }, 5000);
      }
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 30000);
    console.log(`${channel.name} kanalına giriş yapıldı.`);
  } catch (error) {
    console.error("Ses kanalına girerken hata oluştu:", error);

    setTimeout(async () => {
      await connectToVoice();
    }, 5000);
  }
}

client.once("ready", async () => {
  console.log(`${client.user.tag} aktif oldu!`);
  await connectToVoice();
});

setInterval(async () => {
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const me = await guild.members.fetchMe();

    if (!me.voice.channelId || me.voice.channelId !== VOICE_CHANNEL_ID) {
      console.log("Bot ses kanalında değil, tekrar bağlanılıyor...");
      await connectToVoice();
    }
  } catch (error) {
    console.error("Ses kontrol hatası:", error);
  }
}, 20000);

client.login(process.env.TOKEN);