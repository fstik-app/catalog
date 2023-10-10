module.exports = {
  apps: [{
    name: 'fstik-api',
    script: './index.js',
    max_memory_restart: '1000M',
    instances: 4,
    exec_mode: 'cluster',
    watch: true,
    ignore_watch: ['node_modules'],
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],
}
