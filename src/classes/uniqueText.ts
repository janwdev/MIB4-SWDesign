import { Question } from "./question";

export class UniqueText extends Question {
    public rightAnswer: String;
    constructor(question: String, correctAnswer: String) {
        super(question, Question.UniqueTextType);
        this.rightAnswer = correctAnswer;
    }
}