import express from "express";
import morgan from "morgan";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import connectToDatabase from "./config/mongodb.js";
import authRouter from "./routes/auth.route.js";

export default class Application {
    #app = express();
    #server = null;
    #PORT = Number(process.env.PORT) || 3000;

    constructor() {
        this.validateEnvironment();
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeHealthCheck();
        this.initializeErrorHandling();
    }

    validateEnvironment() {
        const requiredVars = ['SALT_SECRET', 'NODE_ENV'];
        const missingVars = requiredVars.filter(varName => !process.env[varName]);

        if (missingVars.length > 0) {
            throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
        }
    }

    async start() {
        try {
            const mongoUri = this.getMongoUri();
            await connectToDatabase(mongoUri);
            
            this.#server = http.createServer(this.#app);
            this.#server.listen(this.#PORT, () => {
                console.log(`[Server] Running in ${process.env.NODE_ENV} mode`);
                console.log(`[Server] Listening on port ${this.#PORT}`);
                console.log(`[Server] Health: http://localhost:${this.#PORT}/health`);
            });

            this.#server.on('error', (error) => {
                if (error.code === 'EADDRINUSE') {
                    console.error(`[Server] Port ${this.#PORT} already in use`);
                } else {
                    console.error(`[Server] Critical error: ${error.message}`);
                }
                process.exit(1);
            });
        } catch (error) {
            console.error('[Server] Fatal startup error:', error.message);
            process.exit(1);
        }
    }

    getMongoUri() {
        return process.env.NODE_ENV === 'production'
            ? process.env.MONGO_DB_PRODUCTION
            : process.env.MONGO_DB_DEVELOPMENT;
    }

    initializeMiddleware() {
        this.#app.use(cors({
            origin: process.env.FRONTEND || '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        }));
        
        this.#app.use(express.json());
        this.#app.use(express.urlencoded({ extended: true }));
        
        this.#app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
    }

    initializeRoutes() {
        this.#app.use('/api/auth', authRouter);
        
        this.#app.get('/api/status', (req, res) => {
            res.json({
                status: 'operational',
                environment: process.env.NODE_ENV
            });
        });
    }

    initializeHealthCheck() {
        this.#app.get('/health', (req, res) => {
            const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
            res.json({
                status: 'up',
                dbStatus,
                environment: process.env.NODE_ENV,
                timestamp: new Date().toISOString()
            });
        });
    }

    initializeErrorHandling() {
        this.#app.use((req, res) => {
            res.status(404).json({
                status: 'fail',
                message: `Route ${req.originalUrl} not found`
            });
        });

        this.#app.use((err, req, res, next) => {
            const statusCode = err.statusCode || 500;
            const message = statusCode >= 500 ? 'Internal server error' : err.message;
            
            if (statusCode >= 500) {
                console.error(`[ServerError] ${err.message}\n${err.stack}`);
            }

            res.status(statusCode).json({
                status: statusCode >= 500 ? 'error' : 'fail',
                message,
                ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
            });
        });
    }

    async shutdown() {
        if (this.#server) {
            await new Promise(resolve => this.#server.close(resolve));
            console.log('[Server] HTTP server closed');
        }
        await mongoose.disconnect();
        console.log('[Database] Connection closed');
    }
}