import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from "mongodb";

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

        this.db = this.client.db('stacks');

        await this.init();
    }

    async init() {
        this.collection = this.db.collection('stacks');
    }

    async close() {
        await this.client.close();
    }

    async readApp(id) {
        const res = await this.collection.findOne({_id: id});
        return res;
    }

    async insertApp(appData) {
        const data = {
            appName: appData["app"],
            appDesc: appData["desc"],
            appSummary: appData["summary"]
        };
        const res = await this.collection.insertOne(data);
    }

    async deleteApp(id) {
        const res = await this.collection.deleteOne({_id: id});
        return res;
    }

    async readAllApps() {
        const res = await this.collection.find({}).toArray();
        return res;
    }
}
