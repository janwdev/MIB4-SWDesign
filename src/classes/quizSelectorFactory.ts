import { Quiz } from "./quiz";
import { RealQuiz } from "./realQuiz";
import { NullQuiz } from "./nullQuiz";
import { QuizSelector } from "./quizSelector";
import { database } from "./control";

export class QuizSelectorFactory {
    public static async checkQuiz(quizNumber: string): Promise<QuizSelector> {
        let all: Quiz[] | null = await database.getAllQuiz();
        if (all != null && parseInt(quizNumber) < all.length && parseInt(quizNumber) >= 0) {
            let success: RealQuiz = new RealQuiz();
            success.setName(quizNumber);
            return success;
        }
        return new NullQuiz();
    }
 }