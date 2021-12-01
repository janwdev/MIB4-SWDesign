import { Question } from "./question";

export class UniqueText extends Question {
    public rightAnswer: String;
    public type: number;
    constructor(question: String, correctAnswer: String) {
        super(question);
        this.rightAnswer = correctAnswer;
        this.type = 2;
    }
}