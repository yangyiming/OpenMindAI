module.exports = {
  apps : [{
    name: 'health-sniffing-api', // 应用名称
    script: './dist/index.js', // 应用启动脚本
    watch: true, // 是否监控文件变化并自动重启
    env_test: {
      NODE_ENV: 'test' // 环境变量
    },
    env_production: {
      NODE_ENV: 'production' // 生产环境变量
    }
  }]
};