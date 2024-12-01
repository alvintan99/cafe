import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import path from 'path';
import { Cafe } from '../entities/Cafe';
import { Employee } from '../entities/Employee';

config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'cafe_db',
    synchronize: false,
    logging: ["error", "warn"],
    entities: [Cafe, Employee],
    migrations: [path.join(__dirname, '..', 'migrations', '*.{ts,js}')],
    subscribers: [],
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });