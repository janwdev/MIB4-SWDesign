import { ObjectId } from "mongodb";
export class Question {
    public static readonly UniqueNumberType: number = 0;
    public static readonly QuestionOptionsType: number = 1;
    public static readonly UniqueTextType: number = 2;

    public question: String;
    public type: number;
    public _id!: ObjectId;
    constructor(question: String, type: number) {
        this.question = question;
        this.type = type;
    }

    public setId(_id: string): void {
        this._id = new ObjectId(_id);
    }
}