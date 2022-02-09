import * as Mongo from "mongodb";
import * as bcrypt from "bcrypt";
import { User } from "./user";

export default class Database {
    private static database: Database = new Database();

    private readonly dbName: string = "ConnectFour";
    private mongoClient!: Mongo.MongoClient;
    private dbUsers!: Mongo.Collection;


    private readonly dbUsersCollectionName: string = "Users";

    constructor() {
        if (Database.database)
            throw new Error("Please use getInstance()");
        Database.database = this;
    }

    public static getInstance(): Database {
        return Database.database;
    }

    public async connect(): Promise<boolean> {
        if (this.dbUsers == undefined) {
            if (process.env.dbUserName && process.env.dbUserPW) {
                let dbUserName: string = process.env.dbUserName;
                let dbUserPW: string = process.env.dbUserPW;
                const uri: string = "mongodb+srv://" + dbUserName + ":" + dbUserPW + "@swdesign.gu1ll.mongodb.net/" + this.dbName + "?retryWrites=true&w=majority";
                this.mongoClient = new Mongo.MongoClient(uri, {});
                await this.mongoClient.connect();
                this.dbUsers = this.mongoClient.db(this.dbName).collection(this.dbUsersCollectionName);
                console.log("Database connection", this.dbUsers != undefined);
                return this.dbUsers != undefined;
            }
            return false;
        }
        return this.dbUsers != undefined;
    }

    public async disconnect(): Promise<void> {
        if (this.mongoClient) {
            await this.mongoClient.close();
            console.log("DBConnection disconnected successfull");
        }
    }

    public async addUserToDB(user: User): Promise<void> {
        await this.dbUsers.insertOne(user);
    }

    public async login(userName: String, password: String): Promise<User | null> {
        let dbUser: User | null = await this.findUserByUsername(userName);
        if (dbUser) {
            if (await bcrypt.compare(<string>password, <string>dbUser.password)) {
                return dbUser;
            } else {
                console.log("Wrong Password");
            }
        }
        return null;
    }

    public async register(userOld: User): Promise<User | null> {
        let dbUser: User | null = await this.findUserByUsername(userOld.username);
        if (!dbUser) {
            const saltRounds: number = 10;
            const hashedPassword: string = await bcrypt.hash(<string>userOld.password, saltRounds);
            let user: User = new User(userOld.registered, userOld.username, hashedPassword);
            await this.addUserToDB(user);
            dbUser = await this.findUserByUsername(user.username);
            if (dbUser) {
                let userNew: User = new User(true, dbUser.username, undefined, dbUser.statistics, dbUser._id);
                return userNew;
            } else {
                console.log("Something went wrong");
                return null;
            }
        } else {
            console.log("username already exist");
            return null;
        }
    }

    public async saveStatistic(user: User): Promise<void> {
        const updateDoc: Mongo.UpdateFilter<Mongo.Document> = {
            $set: {
                statistics: user.statistics
            }
        };
        await this.dbUsers.updateOne({ _id: user._id }, updateDoc);
    }

    private async findUserByUsername(username: String): Promise<User | null> {
        let user: User = <User>await this.dbUsers.findOne({ username: username });
        if (user) {
            return user;
        } else
            return null;
    }
}