"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const url_1 = require("url");
const next_1 = __importDefault(require("next"));
const path = __importStar(require("path"));
// Define environment variables
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const ALLOWED_HOSTS = [
    "http://localhost:9000", "https://api.karnalwebtech.com"
];
// Initialize Next.js
const app = (0, next_1.default)({
    dev,
    hostname,
    port,
    dir: path.join(__dirname, '..'), // Assuming server.ts is in the dist folder
    conf: {
        distDir: '.next' // Explicitly set the build directory
    }
});
const handle = app.getRequestHandler();
// Function to apply security headers
function applySecurityHeaders(res) {
    // Content Security Policy
    const cspDirectives = [
        "default-src 'self' " + ALLOWED_HOSTS.join(' '),
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' " + ALLOWED_HOSTS.join(' ') + " https://apis.google.com",
        "style-src 'self' 'unsafe-inline' " + ALLOWED_HOSTS.join(' ') + " https://fonts.googleapis.com",
        "img-src 'self' data: blob:",
        "connect-src 'self' " + ALLOWED_HOSTS.join(' '),
        "font-src 'self' " + ALLOWED_HOSTS.join(' '),
        "object-src 'none'",
        "media-src 'self' " + ALLOWED_HOSTS.join(' '),
        "frame-src 'self' " + ALLOWED_HOSTS.join(' ')
    ].join('; ');
    // Set security headers
    res.setHeader('Content-Security-Policy', cspDirectives);
    res.removeHeader('Server');
    res.setHeader('Server', '');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}
// Prepare the Next.js app
app.prepare().then(() => {
    // Create HTTP server
    const server = http.createServer((req, res) => {
        // Parse URL
        const parsedUrl = (0, url_1.parse)(req.url || '', true);
        const { pathname } = parsedUrl;
        // Log requests in development
        if (dev) {
            console.log(`${req.method} ${pathname}`);
        }
        // Apply security headers in production
        if (!dev) {
            applySecurityHeaders(res);
        }
        // Let Next.js handle the request
        handle(req, res, parsedUrl);
    });
    // Start the server
    server.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port} - env ${process.env.NODE_ENV}`);
        console.log(`> Serving admin.karnalwebtech.com`);
    });
}).catch((err) => {
    console.error('Error occurred starting server:', err);
    process.exit(1);
});
// import * as http from 'http';
// import { parse } from 'url';
// import next from 'next';
// import * as path from 'path';
// import cluster from 'cluster';
// import * as os from 'os';
// import helmet from 'helmet';
// // Get the number of available CPU cores
// const numCPUs = os.cpus().length;
// // Define environment variables
// const port = parseInt(process.env.PORT || '3000', 10);
// const dev = process.env.NODE_ENV !== 'production';
// const hostname = 'localhost';
// const ALLOWED_HOSTS = [
//   "http://localhost:9000", "https://api.karnalwebtech.com"
// ]
// // Implement clustering with proper TypeScript handling
// if (cluster.isPrimary || cluster.isMaster) {
//   console.log(`Primary ${process.pid} is running`);
//   // Fork workers for each CPU core
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
//     console.log('Starting a new worker');
//     cluster.fork();
//   });
//   // Handle graceful shutdown
//   process.on('SIGINT', () => {
//     console.log('Received SIGINT. Stopping all workers...');
//     for (const id in cluster.workers) {
//       cluster.workers[id]?.process.kill();
//     }
//     process.exit(0);
//   });
//   process.on('SIGTERM', () => {
//     console.log('Received SIGTERM. Stopping all workers...');
//     for (const id in cluster.workers) {
//       cluster.workers[id]?.process.kill();
//     }
//     process.exit(0);
//   });
// } else {
//   // Initialize Next.js
//   const app = next({
//     dev,
//     hostname,
//     port,
//     dir: path.join(__dirname, '..'), // Assuming server.ts is in the dist folder
//     conf: {
//       distDir: '.next' // Explicitly set the build directory
//     }
//   });
//   const handle = app.getRequestHandler();
//   // Prepare the Next.js app
//   app.prepare().then(() => {
//     // Create HTTP server
//     const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
//       // Apply security headers with helmet middleware
// if (!dev) {
//   // Apply Helmet security headers
//   const helmetMiddleware = helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'",...ALLOWED_HOSTS],
//         scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'",...ALLOWED_HOSTS, "https://apis.google.com"],
//         styleSrc: ["'self'", "'unsafe-inline'",...ALLOWED_HOSTS,"https://fonts.googleapis.com"],
//         imgSrc: ["'self'", "data:", "blob:"],
//         connectSrc: ["'self'", ...ALLOWED_HOSTS],
//         fontSrc: ["'self'",...ALLOWED_HOSTS],
//         objectSrc: ["'none'"],
//         mediaSrc: ["'self'",...ALLOWED_HOSTS],
//         frameSrc: ["'self'",...ALLOWED_HOSTS],
//       },
//     },
//     xssFilter: true,
//     noSniff: true,
//     hsts: {
//       maxAge: 31536000,
//       includeSubDomains: true,
//       preload: true,
//     },
//     frameguard: {
//       action: 'deny',
//     },
//   });
//   // Apply helmet middleware manually
//   helmetMiddleware(req, res, () => { });
// }
//       // Parse URL
//       const parsedUrl = parse(req.url || '', true);
//       const { pathname } = parsedUrl;
//       // Log requests in development
//       if (dev) {
//         console.log(`Worker ${process.pid}: ${req.method} ${pathname}`);
//       }
//       // Let Next.js handle the request
//       handle(req, res, parsedUrl);
//     });
//     // Start the server
//     server.listen(port, () => {
//       console.log(`> Worker ${process.pid} ready on http://${hostname}:${port} - env ${process.env.NODE_ENV}`);
//       console.log(`> Serving admin.karnalwebtech.com`);
//     });
//   }).catch((err: Error) => {
//     console.error('Error occurred starting server:', err);
//     process.exit(1);
//   });
// }
