const { SlashCommandBuilder } = require('discord.js');
const { getQueue } = require('../../utils/queue');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),

  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply('You need to be in a voice channel!');
    }

    const queue = getQueue(interaction.guild.id);

    if (!queue.playing) {
      return interaction.reply('Nothing is currently playing!');
    }

    queue.skip();
    await interaction.reply('⏭️ Song skipped!');
  },
};