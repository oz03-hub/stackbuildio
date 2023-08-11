import { MongoClient, ServerApiVersion } from "mongodb";
import Logger from "js-logger";

Logger.useDefaults();

export class StacksDatabase {
    constructor(dburl) {
        this.dburl = dburl;
    }

    async connect() {
        this.client = await MongoClient.connect(this.dburl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: ServerApiVersion.v1
        });
        Logger.info("Connected to client");

        this.db = this.client.db('stacks');
        Logger.info("Connected to db stacks");

        await this.init();
    }

    async init() {
        this.collection = this.db.collection('stacks');
    }

    async close() {
        Logger.info("Closing db client connection");
        await this.client.close();
    }

    async readApp(id) {
        const res = await this.collection.findOne({_id: id});
        Logger.info(`Read app ${id}: ${JSON.stringify(res)}`);
        return res;
    }

    async insertApp(appData) {
        const res = await this.collection.insertOne(appData);
        Logger.info(`Insert new app ${JSON.stringify(res)}`);
        return res;
    }

    async deleteApp(id) {
        const res = await this.collection.deleteOne({_id: id});
        Logger.info(`Deleted app ${JSON.stringify(res)}`);
        return res;
    }

    async readAllApps() {
        const res = await this.collection.find({}).toArray();
        Logger.info(`Read apps, ${res.length} read`);
        return res;
    }
}
