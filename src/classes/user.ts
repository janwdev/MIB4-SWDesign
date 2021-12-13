import { Quiz } from "./quiz";
import { Statistics } from "./statistics";
import { ObjectId } from "mongodb";

export class User {
    public _id?: ObjectId;
    public registered: Boolean;
    public username: String;
    public statistics: Statistics = new Statistics();
    public password?: String;
    public playableQuizIds?: String[];
    public playableQuiz?: Quiz[];

    constructor(registered: Boolean, username: String, password?: String, _id?: ObjectId, playableQuizIds?: String[], statistics?: Statistics, playableQuiz?: Quiz[]) {
        if (_id)
            this._id = _id;
        this.registered = registered;
        this.username = username;
        if (password)
            this.password = password;
        if (playableQuizIds)
            this.playableQuizIds = playableQuizIds;
        if (statistics)
            this.statistics.initSetValues(statistics.numOfQuizes, statistics.answersGiven, statistics.correctAnswers);
        if (playableQuiz)
            this.playableQuiz = playableQuiz;
    }

    public setValuesFromUser(userDB: User): void {
        if (userDB._id)
            this._id = userDB._id;
        if (userDB.registered)
            this.registered = userDB.registered;
        if (userDB.username)
            this.username = userDB.username;
        if (userDB.statistics)
            this.statistics.initSetValues(userDB.statistics.numOfQuizes, userDB.statistics.answersGiven, userDB.statistics.correctAnswers);
        if (userDB.password)
            this.password = userDB.password;
        if (userDB.playableQuizIds)
            this.playableQuizIds = userDB.playableQuizIds;
        // TODO load playable Quiz Array
    }

    public showStatistic(): string {
        let percent: number = Math.round(this.statistics.correctAnswers / this.statistics.answersGiven * 100);
        if (Number.isNaN(percent) || percent == undefined)
            percent = 0;
        return "You played " + this.statistics.numOfQuizes + " Quiz with " + this.statistics.answersGiven + " answered Questions and " + this.statistics.correctAnswers + " correct answers." +
            " This means you answered " + percent + "% right";
    }
}