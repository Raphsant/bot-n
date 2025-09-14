const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop the music and clear the queue'),

  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply('You need to be in a voice channel!');
    }

    const connection = getVoiceConnection(interaction.guild.id);
    if (!connection) {
      return interaction.reply('Nothing is currently playing!');
    }

    // Clear the queue if it exists
    if (global.queues && global.queues.has(interaction.guild.id)) {
      global.queues.delete(interaction.guild.id);
    }

    connection.destroy();
    await interaction.reply('⏹️ Music stopped and queue cleared!');
  },
};