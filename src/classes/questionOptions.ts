import { Question } from "./question";

export class QuestionOptions extends Question {
    public options: String[];
    public correctAnswer: String;
    constructor(question: String, correctAnswer: String, options: String[]) {
        super(question);
        this.correctAnswer = correctAnswer;
        this.options = options;
    }
}