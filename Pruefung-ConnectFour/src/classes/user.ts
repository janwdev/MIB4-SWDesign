import { Statistics } from "./statistics";
import { ObjectId } from "mongodb";

export class User {
    public _id?: ObjectId;
    public registered: Boolean;
    public username: String;
    public statistics: Statistics = new Statistics();
    public password?: String | undefined;

    /**
     * Create new User
     * @param registered true if this user is registered
     * @param username Name of the user
     * @param password password of the user, optional
     * @param statistics statistics of this user, optional
     * @param _id DatabaseId of this user, optional
     */
    constructor(registered: Boolean, username: String, password?: String, statistics?: Statistics, _id?: ObjectId) {
        if (_id)
            this._id = _id;
        this.registered = registered;
        this.username = username;
        if (password)
            this.password = password;
        if (statistics)
            this.statistics.initSetValues(statistics.gamesPlayed, statistics.gamesWon, statistics.gamesLost);
    }

    /**
     * Sets values for this user from other user
     * @param userDB user to get the values from
     */
    public setValuesFromUser(userDB: User): void {
        if (userDB._id)
            this._id = userDB._id;
        if (userDB.registered)
            this.registered = userDB.registered;
        if (userDB.username)
            this.username = userDB.username;
        if (userDB.statistics)
            this.statistics.initSetValues(userDB.statistics.gamesPlayed, userDB.statistics.gamesWon, userDB.statistics.gamesLost);
        this.password = undefined;
    }

    /**
     * Returns Statistic from User as string
     * @returns Statistic as String
     */
    public returnStatistic(): string {
        // Calculate percentages
        let percentWon: number = Math.round(this.statistics.gamesWon / this.statistics.gamesPlayed * 100);
        if (Number.isNaN(percentWon) || percentWon == undefined)
            percentWon = 0;
        let percentDrawn: number = Math.round((this.statistics.gamesPlayed - this.statistics.gamesWon - this.statistics.gamesLost) / this.statistics.gamesPlayed * 100);
        if (Number.isNaN(percentDrawn) || percentDrawn == undefined)
            percentDrawn = 0;
        let percentLost: number = Math.round(this.statistics.gamesLost / this.statistics.gamesPlayed * 100);
        if (Number.isNaN(percentLost) || percentLost == undefined)
            percentLost = 0;
        // Return statistic as string
        return "You played " + this.statistics.gamesPlayed + " games with " + this.statistics.gamesWon + " games won (" + percentWon + "%) and " +
            (this.statistics.gamesPlayed - this.statistics.gamesWon - this.statistics.gamesLost) + " drawn games(" + percentDrawn + "%). " +
            "You lost " + this.statistics.gamesLost + " games(" + percentLost + "%).";
    }
}