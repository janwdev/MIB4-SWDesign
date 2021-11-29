import { Quiz } from "./quiz";
import { Statistics } from "./statistics";

export class User {
    public registered: Boolean;
    public username: String;
    public password: String;
    public statistics: Statistics;
    public playableQuiz: Quiz[];
}