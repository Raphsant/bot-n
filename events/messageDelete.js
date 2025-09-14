const {Events, MessageFlags, EmbedBuilder} = require('discord.js')
const config = require('../utils/config')

module.exports = {
  name: Events.MessageDelete,
  async execute(message) {
    console.log(`Message deleted in ${message.channel.name}`);

    try{
      const user = await message.client.users.fetch(config.getSunnyUserId())

      // Create the embed
      const deleteEmbed = new EmbedBuilder()
        .setTitle('Message Deleted')
        .setColor(0xFF0000) // Red color
        .addFields(
          { name: 'Channel', value: message.channel.name, inline: true },
          { name: 'Author', value: message.author?.tag || 'Unknown', inline: true },
          { name: 'Author ID', value: message.author?.id || 'Unknown', inline: true },
          { name: 'Content', value: message.content || '*No content available*' },
          { name: 'Message ID', value: message.id, inline: true },
          { name: 'Deleted At', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: `Server: ${message.guild?.name || 'Unknown'}` });

      // Add author's avatar if available
      if (message.author?.avatarURL()) {
        deleteEmbed.setThumbnail(message.author.avatarURL({ dynamic: true }));
      }

      await user.send({ embeds: [deleteEmbed] })
    }catch(error){
      console.error('Could not send DM:', error);
    }

  }
}
