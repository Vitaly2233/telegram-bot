import { DataSource } from "typeorm";
import { config } from "../../config";

class Db {
  dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: "postgres",
      host: config.DB_HOST,
      port: 5432,
      username: config.DB_USER,
      password: config.DB_PASSWORD,
      database: config.DB_NAME,
      entities: [`${__dirname}/../../entity/*{.js,.ts}`],
      synchronize: true,
      ssl: true,
    });
    this.dataSource.initialize();
  }
}

export const db = new Db().dataSource;
