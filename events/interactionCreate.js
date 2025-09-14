const { Events, MessageFlags } = require('discord.js');
const config = require('../utils/config');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        } else {
          await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
        }
      }
    }

    // Handle button interactions
    else if (interaction.isButton()) {
      // Check if it's the role assignment button
      if (interaction.customId.startsWith('assign_role_')) {
        const memberId = interaction.customId.replace('assign_role_', '');

        try {
          // Get the member to assign the role to
          const targetMember = await interaction.guild.members.fetch(memberId);

          // Get the role to assign from config
          const role = interaction.guild.roles.cache.get(config.getWelcomeRoleId());

          if (!role) {
            return interaction.reply({ content: 'Role not found!', flags: MessageFlags.Ephemeral });
          }

          if (!targetMember) {
            return interaction.reply({ content: 'Member not found!', flags: MessageFlags.Ephemeral });
          }

          // Check if member already has the role
          if (targetMember.roles.cache.has(role.id)) {
            return interaction.reply({ content: `${targetMember.user.tag} already has the role!`, flags: MessageFlags.Ephemeral });
          }

          // Assign the role
          await targetMember.roles.add(role);

          await interaction.reply({
            content: `✅ Successfully gave the role to ${targetMember.user.tag}!`,
            flags: MessageFlags.Ephemeral
          });

        } catch (error) {
          console.error('Error assigning role:', error);
          await interaction.reply({
            content: 'There was an error assigning the role!',
            flags: MessageFlags.Ephemeral
          });
        }
      }
    }
  },
};
