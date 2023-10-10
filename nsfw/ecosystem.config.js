module.exports = {
  apps: [{
    name: 'fstik-nsfw',
    script: './index.js',
    max_memory_restart: '2000M',
    watch: true,
    ignore_watch: ['node_modules'],
    cron_restart: '*/20 * * * *',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}
