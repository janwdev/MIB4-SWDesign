import { Question } from "./question";
import { QuestionOptions } from "./questionOptions";
import { UniqueNumber } from "./uniqueNumber";
import { UniqueText } from "./uniqueText";

export class Quiz {
    public static readonly UniqueNumberType: number = 0;
    public static readonly QuestionOptionsType: number = 1;
    public static readonly UniqueTextType: number = 2;

    public questionsArray: Question[];
    public author: String;
    public publicQuiz: Boolean;
    public quizTitle: String;

    public createQuiz(questionsArray: Question[]): boolean {
        this.questionsArray = questionsArray;
        // return ret;
    }

    createQuestion(questionType: number, questionString: String, correctNumber: String, options?: String[]): Question {
        let question: Question;
        if (questionType == Quiz.UniqueNumberType) {
            question = new UniqueNumber(questionString, correctNumber);
        } else if (questionType == Quiz.QuestionOptionsType) {
            question = new QuestionOptions(questionString, correctNumber, options);
        } else if (questionType == Quiz.UniqueTextType) {
            question = new UniqueText(questionString, correctNumber);
        }
        return question;
    }
}