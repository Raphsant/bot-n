class Config {
  getBotToken() {
    return process.env.token;
  }

  getClientId() {
    return process.env.clientId;
  }

  getGuildId() {
    return process.env.guildId;
  }

  getWelcomeChannelId() {
    return process.env.welcomeChannelId;
  }

  getWelcomeRoleId() {
    return process.env.roleId;
  }

  getSunnyUserId() {
    return process.env.sunny;
  }
}

module.exports = new Config();