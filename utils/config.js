const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

class Config {
  constructor() {
    this.config = null;
    this.loadConfig();
  }

  loadConfig() {
    try {
      const configPath = path.join(__dirname, '..', 'config.yml');
      const fileContents = fs.readFileSync(configPath, 'utf8');
      this.config = yaml.load(fileContents);
      console.log('Configuration loaded successfully');
    } catch (error) {
      console.error('Error loading config.yml:', error.message);
      process.exit(1);
    }
  }

  get(key) {
    const keys = key.split('.');
    let value = this.config;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }

    return value;
  }

  // Convenience methods for common config values
  getBotToken() {
    return process.env.BOT_TOKEN || this.get('bot.token');
  }

  getClientId() {
    return process.env.CLIENT_ID || this.get('bot.clientId');
  }

  getWelcomeChannelId() {
    return process.env.WELCOME_CHANNEL_ID || this.get('guild.welcomeChannelId');
  }

  getWelcomeRoleId() {
    return process.env.WELCOME_ROLE_ID || this.get('guild.welcomeRoleId');
  }

  getMusicConfig() {
    return this.get('music') || {};
  }

  getLoggingConfig() {
    return this.get('logging') || {};
  }

  getSunnyUserId() {
    return process.env.SUNNY_USER_ID || this.get('sunny');
  }
}

// Export singleton instance
module.exports = new Config();