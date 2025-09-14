const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');

class MusicQueue {
  constructor(guildId) {
    this.guildId = guildId;
    this.songs = [];
    this.playing = false;
    this.player = null;
    this.connection = null;
  }

  addSong(song) {
    this.songs.push(song);
  }

  async playNext() {
    if (this.songs.length === 0) {
      this.playing = false;
      this.currentSong = null;
      if (this.connection) {
        this.connection.destroy();
      }
      return null;
    }

    const song = this.songs.shift();
    this.currentSong = song;
    this.playing = true;

    try {
      const stream = ytdl(song.url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25
      });

      const resource = createAudioResource(stream);

      if (!this.player) {
        this.player = createAudioPlayer();

        this.player.on(AudioPlayerStatus.Idle, () => {
          this.playNext();
        });

        this.player.on('error', error => {
          console.error('Player error:', error);
          this.playNext();
        });

        if (this.connection) {
          this.connection.subscribe(this.player);
        }
      }

      this.player.play(resource);
      return song;
    } catch (error) {
      console.error('Error playing song:', error);
      this.playNext();
      return null;
    }
  }

  getCurrentSong() {
    return this.currentSong;
  }

  getQueue() {
    return this.songs;
  }

  clear() {
    this.songs = [];
    if (this.player) {
      this.player.stop();
    }
    this.playing = false;
  }

  skip() {
    if (this.player) {
      this.player.stop();
    }
  }

  setConnection(connection) {
    this.connection = connection;
    if (this.player) {
      this.connection.subscribe(this.player);
    }
  }
}

// Global queues and players storage
if (!global.queues) {
  global.queues = new Map();
}

if (!global.players) {
  global.players = new Map();
}

function getQueue(guildId) {
  if (!global.queues.has(guildId)) {
    global.queues.set(guildId, new MusicQueue(guildId));
  }
  return global.queues.get(guildId);
}

module.exports = {
  MusicQueue,
  getQueue
};