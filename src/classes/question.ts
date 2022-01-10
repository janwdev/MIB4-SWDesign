import { ObjectId } from "mongodb";
export class Question {
    public static readonly uniqueNumberType: number = 0;
    public static readonly questionOptionsType: number = 1;
    public static readonly uniqueTextType: number = 2;
    
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