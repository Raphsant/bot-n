const { SlashCommandBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause or resume the current song'),

  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply('You need to be in a voice channel!');
    }

    // Check if there's an active player for this guild
    if (!global.players || !global.players.has(interaction.guild.id)) {
      return interaction.reply('Nothing is currently playing!');
    }

    const player = global.players.get(interaction.guild.id);

    if (player.state.status === AudioPlayerStatus.Playing) {
      player.pause();
      await interaction.reply('⏸️ Music paused!');
    } else if (player.state.status === AudioPlayerStatus.Paused) {
      player.unpause();
      await interaction.reply('▶️ Music resumed!');
    } else {
      await interaction.reply('Nothing is currently playing!');
    }
  },
};