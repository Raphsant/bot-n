const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../utils/config');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    console.log(`${member.user.tag} joined the server!`);

    // Get the specific channel from config
    const channel = member.guild.channels.cache.get(config.getWelcomeChannelId());
    if (!channel) {
      console.log('Welcome channel not found');
      return;
    }

    // Create embed
    const embed = new EmbedBuilder()
      .setTitle('🎉 New Member Joined!')
      .setDescription(`Welcome ${member.user.tag} to the server!`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setColor(0x00AE86)
      .setTimestamp();

    // Create button
    const button = new ButtonBuilder()
      .setCustomId(`assign_role_${member.id}`)
      .setLabel('Give Role')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('✅');

    const row = new ActionRowBuilder()
      .addComponents(button);

    // Send message with embed and button
    await channel.send({
      embeds: [embed],
      components: [row]
    });
  }
}
