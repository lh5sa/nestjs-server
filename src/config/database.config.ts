import { registerAs } from "@nestjs/config";
import { SequelizeModuleOptions } from "@nestjs/sequelize";

export default registerAs("database", (): SequelizeModuleOptions => {
  const { DB_TYPE, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env;
  return {
    dialect: DB_TYPE as "mysql",
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    autoLoadModels: true,
    synchronize: false,
  };
});
