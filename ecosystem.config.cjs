module.exports = {
  apps: [{
    name: 'comic-strip-maker',
    script: 'src/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      PUPPETEER_EXECUTABLE_PATH: '/usr/bin/chromium'
    }
  }]
};
