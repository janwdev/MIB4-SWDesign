import { Question } from "./question";

export class UniqueNumber extends Question {
    public correctNumber: String;
    constructor(question: String, correctNumber: String) {
        super(question);
        this.correctNumber = correctNumber;
    }
}