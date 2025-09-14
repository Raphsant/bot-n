const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('healthcheck')
    .setDescription('Replies with a healthcheck!'),
  async execute(interaction) {
    await interaction.reply('Healthy!');
  },
};
