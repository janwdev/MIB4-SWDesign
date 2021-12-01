import { Quiz } from "./quiz";
import { Statistics } from "./statistics";
import { ObjectId } from "mongodb";

export class User {
    public _id?: ObjectId;
    public registered: Boolean;
    public username: String;
    public password?: String;
    public statisticId?: String;
    public playableQuizIds?: String[];
    public playableQuizNames?: String[];
    public statistics?: Statistics;
    public playableQuiz?: Quiz[];

    constructor(registered: Boolean, username: String, password?: String, _id?: ObjectId, statisticId?: String, playableQuizIds?: String[], playableQuizNames?: String[], statistics?: Statistics, playableQuiz?: Quiz[]) {
        if (_id)
            this._id = _id;
        this.registered = registered;
        this.username = username;
        if (password)
            this.password = password;
        if (statisticId)
            this.statisticId = statisticId;
        if (playableQuizIds)
            this.playableQuizIds = playableQuizIds;
        if (playableQuizNames)
            this.playableQuizNames = playableQuizNames;
        if (statistics)
            this.statistics = statistics;
        if (playableQuiz)
            this.playableQuiz = playableQuiz;
    }
}