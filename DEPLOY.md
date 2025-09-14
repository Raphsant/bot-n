# FreeNAS Deployment Guide

## Setup Steps

### 1. Push to Container Registry

**Option A: GitHub Container Registry (Recommended)**
1. Push your code to GitHub
2. GitHub Actions will automatically build and push to `ghcr.io/your-username/discord:latest`
3. Update `docker-compose.prod.yml` with your actual GitHub username

**Option B: Docker Hub**
1. Build and push manually:
   ```bash
   docker build -t your-dockerhub-username/discord-bot:latest .
   docker push your-dockerhub-username/discord-bot:latest
   ```
2. Update `docker-compose.prod.yml` image line accordingly

### 2. FreeNAS Setup

1. **Enable Docker/Kubernetes in TrueNAS Scale** or **install Docker plugin in FreeNAS Core**

2. **Create directories on your pool:**
   ```bash
   mkdir -p /mnt/your-pool/docker/discord-bot
   ```

3. **Copy config.yml to FreeNAS:**
   ```bash
   scp config.yml root@your-freenas-ip:/mnt/your-pool/docker/discord-bot/
   ```

4. **Update docker-compose.prod.yml with your bot credentials:**
   ```yaml
   environment:
     - BOT_TOKEN=your_actual_bot_token
     - CLIENT_ID=your_actual_client_id
   ```

### 3. Deploy

1. **Copy docker-compose.prod.yml to FreeNAS:**
   ```bash
   scp docker-compose.prod.yml root@your-freenas-ip:/mnt/your-pool/docker/discord-bot/
   ```

2. **SSH into FreeNAS and run:**
   ```bash
   cd /mnt/your-pool/docker/discord-bot
   docker-compose -f docker-compose.prod.yml up -d
   ```

### 4. Management Commands

```bash
# View logs
docker logs discord-music-bot -f

# Update to latest image
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Stop the bot
docker-compose -f docker-compose.prod.yml down

# Restart
docker-compose -f docker-compose.prod.yml restart
```

### 5. Auto-Updates (Optional)

Install Watchtower to automatically update when new images are pushed:
```bash
docker run -d \
  --name watchtower \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --interval 3600 \
  discord-music-bot
```

## File Structure on FreeNAS
```
/mnt/your-pool/docker/discord-bot/
├── config.yml
├── docker-compose.prod.yml
└── logs/ (auto-created)
```

## Registry URLs

- **GitHub Container Registry:** `ghcr.io/your-username/discord:latest`
- **Docker Hub:** `your-username/discord-bot:latest`