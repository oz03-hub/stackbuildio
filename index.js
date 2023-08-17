import express from 'express';
import logger from 'morgan';
import Logger from 'js-logger';
import { StacksDatabase } from './mongo-module.js';
import dotenv from 'dotenv'
import * as ai from './ai-module.js';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

class StackBuilderServer {
    constructor(dburl) {
        this.dburl = dburl;
        this.app = express();
    }

    async initDB() {
        this.db = new StacksDatabase(this.dburl);
        Logger.info("Connecting to DB...");
        await this.db.connect();
    }

    async start() {
        this.app.use(logger('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use('/', express.static('client'));
        this.app.use(cookieParser());
        this.app.use((req, res, next) => {
            if (!req.cookies.uniqueid) {
                const uniqueid = uuidv4();
                res.cookie('uniqueid', uniqueid, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            }
            next();
        });
        const port = 3000;
        this.app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
            console.log(`Client on http://localhost:${port}/client/`);
        });
        try {
            Logger.info("Server start-up");
            await this.initDB();
            await this.initRoutes();
        } catch (error) {
            console.log('An error occurred on server start up');
            console.log(error);
        }
    }

    async initRoutes() {
        const self = this;

        this.app.get('/uniqueid', (req, res) => {
            res.send(`All cookies: ${JSON.stringify(req.cookies)}\nYour unique ID: ${req.cookies.uniqueid}`);
        });
        
        this.app.get('/build/:appName/:description', async (req, res) => {
            Logger.info("Request to stack advice");
            res.send(await ai.stackAdvice(req.params.appName, req.params.description));
        });
        
        this.app.post('/create', async (req, res) => {
            const data = req.body;
            data["ownerId"] = req.cookies.uniqueid;
            Logger.info(`Creating app: ${JSON.stringify(data)}`);
            const result = await self.db.insertApp(data);
            res.json({ message: `Created: ${data["appName"]}`});
        });

        this.app.get('/read/all', async (req, res) => {
            Logger.info("Reading all DB");
            const result = await self.db.readAllApps();
            res.json(result.map(e => {
                e["owner"] = e["ownerId"] === req.cookies.uniqueid;
                return e;
            }));
        });

        this.app.get('/read/:id', async (req, res) => {
            const id = req.params.id;
            Logger.info(`Reading app with id: ${id}`);
            const result = await self.db.readApp(id);
            res.json(result);
        });

        this.app.put('/update', async (req, res) => {
            const data = req.body;
            data["ownerId"] = req.cookies.uniqueid;
            Logger.info(`Updating app: ${JSON.stringify(data)}`);
            const result = await self.db.updateApp(data);
            res.json({message: `Updated: ${data["appName"]}`});
        });

        this.app.delete('/delete/:id', async (req, res) => {
            Logger.info(`Deleting ${req.params.id}`);
            const result = await self.db.deleteApp(req.params.id);
            res.json(result);
        });

        this.app.get('*', (req, res) => {
            res.status(404).json({ request: req.path, message: 'Unknown request'});
        });    
    }
}

Logger.info(process.env.DB_URL);
const server = new StackBuilderServer(process.env.DB_URL);
server.start().catch(e => {
    console.log('Server will not start.');
    console.log(e);
});
