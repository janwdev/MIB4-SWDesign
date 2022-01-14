import { Quiz } from "./quiz";

export abstract class QuizSelector {
    protected quizNumber: string;
    constructor() { this.quizNumber = ""; }
    public abstract isNil():boolean;
    public abstract getQuiz(): Promise<Quiz>;
}