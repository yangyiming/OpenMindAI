const { DB_HOST,DB_PORT,DB_USERNAME,DB_PASSWORD,DB_DATABASE,NODE_ENV} = process.env;
module.exports =  {
  type: 'mongodb',
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  authSource: "admin", // 认证数据库（通常是 admin）
  synchronize: true,
  logging: true,
  entities: [`${NODE_ENV == 'dev' ? 'src' : 'dist'}/entity/**/*{.ts,.js}`]
}
