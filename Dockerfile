# Use Node.js 20 LTS (has File API support)
FROM node:20-alpine

# Install ffmpeg and opus libraries for audio processing
RUN apk add --no-cache ffmpeg opus libopus-dev

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json ./

# Install dependencies using npm
RUN npm install --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S discordbot -u 1001

# Change ownership of the app directory
RUN chown -R discordbot:nodejs /usr/src/app
USER discordbot

# Expose port (if needed for health checks)
EXPOSE 3000

# Start the bot
CMD ["node", "index.js"]