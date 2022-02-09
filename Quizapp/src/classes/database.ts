import * as Mongo from "mongodb";
import * as bcrypt from "bcrypt";
import { dbRegisteredUserName, dbRegisteredUserPW, dbUnregisteredUserName, dbUnregisteredUserPW } from "../secrets";
import { Question } from "./question";
import { Quiz } from "./quiz";
import { User } from "./user";

export class Database {
    private readonly dbName: string = "TodoApp";
    private mongoClient!: Mongo.MongoClient;
    private dbUsers!: Mongo.Collection;
    private dbQuiz!: Mongo.Collection;
    private dbQuestions!: Mongo.Collection;


    private readonly dbUsersCollectionName: string = "Users";
    private readonly dbQuizCollectionName: string = "Quiz";
    private readonly dbQuestionsCollectionName: string = "Questions";

    public async connectUnregistered(): Promise<boolean> {
        let success: boolean = await this.connect(dbUnregisteredUserName, dbUnregisteredUserPW);
        return success;
    }
    public async connectRegistered(): Promise<boolean> {
        let success: boolean = await this.connect(dbRegisteredUserName, dbRegisteredUserPW);
        return success;
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
            let user: User = new User(userOld.registered, userOld.username, hashedPassword, userOld._id, userOld.playableQuizIds, userOld.statistics, userOld.playableQuiz);
            await this.addUserToDB(user);
            dbUser = await this.findUserByUsername(user.username);
            if (!dbUser) {
                return dbUser;
            } else {
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
        await this.dbUsers.updateOne({ _id: user._id }, updateDoc );
    }

    public async addQuestionToDB(question: Question): Promise<void> {
        if (this.dbQuestions != undefined) {
            let result: Mongo.InsertOneResult<Mongo.Document> = await this.dbQuestions.insertOne(question);
            let _id: string = result.insertedId.toString();
            question.setId(_id);
        } else {
            console.log("DBConnection not successfull");
        }
    }

    public async addQuizToDB(quiz: Quiz): Promise<void> {
        if (this.dbQuiz != undefined) {
            await this.dbQuiz.insertOne(quiz);
        } else {
            console.log("DBConnection not successfull");
        }
    }

    public async getQuiz(id: Mongo.ObjectId): Promise<Quiz | null> {
        let quiz: Quiz = <Quiz><unknown>await this.dbQuiz.findOne({ _id: id });
        if (quiz) {
            return quiz;
        } else {
            console.log("Cant find quiz with id: " + id);
            return null;
        }
    }

    public async getAllQuiz(): Promise<Quiz[] | null> {
        let allQuiz: Quiz[] = <Quiz[]><unknown>await this.dbQuiz.find().toArray();
        if (allQuiz)
            return allQuiz;
        else
            return null;
    }

    public async getQuestion(id: Mongo.ObjectId): Promise<Question | null> {
        let question: Question = <Question>await this.dbQuestions.findOne({ _id: id });
        if (question) {
            return question;
        } else {
            console.log("Cant find question with id: " + typeof (id) + id);
            return null;
        }
    }

    public async getQuestions(ids: Mongo.ObjectId[]): Promise<Question[] | null> {
        let questions: Question[] = [];
        for (let index: number = 0; index < ids.length; index++) {
            let question: Question = <Question>await this.dbQuestions.findOne({ _id: ids[index] });
            questions.push(question);
        }
        if (questions.length > 0) {
            return questions;
        } else {
            console.log("Cant find questions");
            return null;
        }
    }

    private async findUserByUsername(username: String): Promise<User | null> {
        let user: User = <User>await this.dbUsers.findOne({ username: username });
        if (user) {
            return user;
        } else
            return null;
    }

    private async connect(user: string, pw: string): Promise<boolean> {
        const uri: string = "mongodb+srv://" + user + ":" + pw + "@swdesign.gu1ll.mongodb.net/" + this.dbName + "?retryWrites=true&w=majority";
        this.mongoClient = new Mongo.MongoClient(uri, { });
        await this.mongoClient.connect();
        this.dbUsers = this.mongoClient.db(this.dbName).collection(this.dbUsersCollectionName);
        this.dbQuiz = this.mongoClient.db(this.dbName).collection(this.dbQuizCollectionName);
        this.dbQuestions = this.mongoClient.db(this.dbName).collection(this.dbQuestionsCollectionName);
        console.log("Database connection", this.dbUsers != undefined);
        return this.dbUsers != undefined;
    }
}