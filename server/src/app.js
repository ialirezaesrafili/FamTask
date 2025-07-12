import express from "express";
import morgan from "morgan";
import http from "http";
import cors from "cors";
import authRouter from "../src/routes/auth.route";
export class Application {
    /* --- PRIVATE VARIABLE */
    #app = express();
    #PORT = 3000;

    constructor(port) {
        this.#PORT = port;
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeHealthServer();
        this.initializeServer();
        this.initializeErrorHandling();
        this.initializeSwagger();
    }

    /**
     * Initializes the HTTP server and starts listening on the specified port.
     */
    initializeServer() {
        http.createServer(this.#app).listen(this.#PORT, () => {
            console.log(`[Server] Server listening on port ${this.#PORT}`);
            console.log(`[Server] Health check available at http://localhost:${this.#PORT}/`);
        });
    }

    /**
     * Sets up common Express middleware.
     */
    initializeMiddleware() {
        this.#app.use(express.json()); // Parses incoming requests with JSON payloads
        this.#app.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads
        this.#app.use(morgan('dev')); // Logs HTTP requests to the console in 'dev' format
    }

    initializeRoutes() {
        // Example route:
        this.#app.get('/api/greeting', (req, res) => {
            res.status(200).json({
                message: 'Hello from the API!',
                timestamp: new Date().toISOString()
            });
        });

        this.#app.use('/api/auth', authRouter)
    }

    /**
     * Initializes a basic health check endpoint for the server.
     */
    initializeHealthServer() {
        this.#app.get('/', (req, res) => { // Using GET for health checks is standard
            try {
                res.status(200).json({
                    status: 'success',
                    message: 'server is up and running!',
                    uptime: process.uptime(), // Server uptime in seconds
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
               
                console.error('Error in health check:', error);
                res.status(500).json({
                    status: 'error',
                    message: 'Health check failed unexpectedly',
                    error: error.message
                });
            }
        });
    }

    /**
     * Initializes a global error handling middleware.
     * This should be the last middleware added to the Express app.
     */
    initializeErrorHandling() {
        // Generic error handler
        this.#app.use((err, req, res, next) => {
            console.error('[Error] An unhandled error occurred:', err.stack); // Log the stack trace for debugging
            res.status(err.status || 500).json({
                status: 'error',
                message: err.message || 'An unknown error occurred!',
                ...(process.env.NODE_ENV === 'development' && { error: err.stack }) // Only send stack in dev mode
            });
        });

        // Handle 404 Not Found errors
        this.#app.use((req, res, next) => {
            res.status(404).json({
                status: 'fail',
                message: `Cannot find ${req.originalUrl} on this server!`
            });
        });
    }

    initializeSwagger() {
        console.log('Swagger config');
    }

    /**
     * Returns the Express application instance.
     * Useful for testing or further configuration outside the class.
     * @returns {express.Application} The Express application instance.
     */
    getApp() {
        return this.#app;
    }
}

