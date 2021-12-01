import { Question } from "./question";

export class UniqueNumber extends Question {
    public correctNumber: number;
    public type: number;
    constructor(question: String, correctNumber: number) {
        super(question);
        this.correctNumber = correctNumber;
        this.type = 0
    }
}