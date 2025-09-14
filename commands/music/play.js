// commands/play.js
const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const { getQueue } = require('../../utils/queue');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from YouTube')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('The YouTube URL')
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.editReply('You need to be in a voice channel!');
    }

    const url = interaction.options.getString('url');

    try {
      // Validate URL
      if (!ytdl.validateURL(url)) {
        return interaction.editReply('❌ Please provide a valid YouTube URL!');
      }

      // Get video info
      const info = await ytdl.getInfo(url);
      const title = info.videoDetails.title;
      const duration = info.videoDetails.lengthSeconds;

      // Get or create queue for this guild
      const queue = getQueue(interaction.guild.id);

      // Create song object
      const song = {
        title,
        url,
        duration,
        requester: interaction.user.tag
      };

      // Add to queue
      queue.addSong(song);

      // If nothing is playing, join voice channel and start playing
      if (!queue.playing) {
        const connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: interaction.guild.id,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        queue.setConnection(connection);

        // Store the player globally for pause/resume functionality
        if (!global.players) {
          global.players = new Map();
        }
        global.players.set(interaction.guild.id, queue.player);

        const nowPlaying = await queue.playNext();
        if (nowPlaying) {
          await interaction.editReply(`🎵 Now playing: **${nowPlaying.title}**`);
        }
      } else {
        // Song added to queue
        await interaction.editReply(`➕ Added to queue: **${title}** (Position ${queue.songs.length})`);
      }

    } catch (error) {
      console.error(error);
      await interaction.editReply(`❌ Error: ${error.message}`);
    }
  },
};
