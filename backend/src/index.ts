import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { AppDataSource } from './config/database';
import cafeRoutes from './routes/cafe.routes';
import employeeRoutes from './routes/employee.routes';
import { errorHandler } from './middlewares/error.handler';
import path from 'path';

config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/cafes', cafeRoutes);
app.use('/api/employees', employeeRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Database connection and server startup
AppDataSource.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to database:', error);
        process.exit(1);
    });
