module.exports = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  dbName: process.env.DB_NAME,
  type: 'postgresql',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  clientUrl: process.env.DB_URL,
  debug: true,
  migrations: {
    path: './migrations', // 迁移文件的路径
    pattern: /^[\w-]+\d+\.[tj]s$/, // 迁移文件的名字模式
    emit: 'ts', // 迁移文件的类型 ('js' 或 'ts')
    disableForeignKeys: false,
  },
};