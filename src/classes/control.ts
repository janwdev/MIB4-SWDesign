import { Quiz } from "./quiz";
import { User } from "./user";

export class Control {
    public pathToQuizFile: String;
    public user: User;

    public async main(): Promise<void> {
        console.log("I'm running!");
    }
    public selectQuiz(name: String): Quiz {
        let quiz: QuizSelector = QuizSelectorFactory.getQuiz(name);
        return quiz;
    }
    public readQuizFromFile(): Quiz[] {
    }
    private saveQuiz(quiz: Quiz): boolean {
    }
}