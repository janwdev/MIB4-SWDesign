import { Question } from "./question";

export class QuestionOptions extends Question {
    public options: String[];
    public correctAnswer: number;
    constructor(question: String, correctAnswer: number, options: String[]) {
        super(question, Question.QuestionOptionsType);
        this.correctAnswer = correctAnswer;
        this.options = options;
    }
}