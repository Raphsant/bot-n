const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getQueue } = require('../../utils/queue');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current music queue'),

  async execute(interaction) {
    const queue = getQueue(interaction.guild.id);

    if (!queue.playing && queue.songs.length === 0) {
      return interaction.reply('The queue is empty!');
    }

    const embed = new EmbedBuilder()
      .setTitle('🎵 Music Queue')
      .setColor(0x00AE86);

    if (queue.playing) {
      embed.addFields({
        name: '🎶 Now Playing',
        value: `**${queue.currentSong ? queue.currentSong.title : 'Unknown'}**`,
        inline: false
      });
    }

    if (queue.songs.length > 0) {
      const queueList = queue.songs
        .slice(0, 10) // Show max 10 songs
        .map((song, index) => `${index + 1}. **${song.title}** - *${song.requester}*`)
        .join('\n');

      embed.addFields({
        name: `📝 Up Next (${queue.songs.length} songs)`,
        value: queueList,
        inline: false
      });

      if (queue.songs.length > 10) {
        embed.setFooter({ text: `And ${queue.songs.length - 10} more songs...` });
      }
    }

    await interaction.reply({ embeds: [embed] });
  },
};