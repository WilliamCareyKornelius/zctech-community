module.exports = {
  apps: [{
    name: 'zctech-community',
    script: '/usr/local/bin/bun',
    args: 'run start',
    exec_mode: 'fork',
    cwd: '/root/zctech-community',
    env: {
      PORT: 3001,
      NODE_ENV: 'production'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    error_file: '/root/zctech-community/logs/err.log',
    out_file: '/root/zctech-community/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
