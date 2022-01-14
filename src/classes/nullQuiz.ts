import { Quiz } from "./quiz";
import { QuizSelector } from "./quizSelector";


export class NullQuiz extends QuizSelector {
    constructor() {
        super();
        this.quizNumber = "-1";
    }
    public isNil(): boolean {
        return true;
    }
    public async getQuiz(): Promise<Quiz> {
        return new Quiz();
    }
}