import { Quiz } from "./quiz";
import { QuizSelector } from "./quizSelector";
import { database } from "./control";


export class RealQuiz extends QuizSelector {
    constructor() {
        super();
        this.quizNumber = "-1";
    }
    setName(quizNumber: string): void {
       this.quizNumber = quizNumber;
    }
    public isNil(): boolean {
       return false;
    }
    public async getQuiz(): Promise<Quiz> {
       let all: Quiz[] | null = await database.getAllQuiz();
       return all != null ? all[parseInt(this.quizNumber) - 1 ] : new Quiz();
    }
 }