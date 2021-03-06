import { Question } from "./question";

export class UniqueNumber extends Question {
    public correctNumber: number;
    constructor(question: String, correctNumber: number) {
        super(question, Question.uniqueNumberType);
        this.correctNumber = correctNumber;
    }
}

