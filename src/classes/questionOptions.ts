import { Question } from "./question";

export class QuestionOptions extends Question {
    public options: String[];
    public correctAnswer: number;
    public type: number;
    constructor(question: String, correctAnswer: number, options: String[]) {
        super(question);
        this.correctAnswer = correctAnswer;
        this.options = options;
        this.type = 1;
    }
}