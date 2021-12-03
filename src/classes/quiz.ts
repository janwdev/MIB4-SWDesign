const prompts = require("prompts");

import { database } from "./control";
import { Question } from "./question";
import { QuestionOptions } from "./questionOptions";
import { UniqueNumber } from "./uniqueNumber";
import { UniqueText } from "./uniqueText";

export class Quiz {
    private questionsArray: string[];
    private author: string;
    private publicQuiz: Boolean;
    private quizTitle: string;

    constructor() {
        this.questionsArray = [];
        this.author = "Max"; //TODO change to username
        this.publicQuiz = false;
        this.quizTitle = "";
    }

    public async createQuiz(): Promise<void> {
        await this.getBasicInfo();
        if(this.quizTitle == undefined) {
            console.log("Stopped Quiz creation");
            return;
        }
        const quizSuccesful:boolean = await this.questionLoop();
        if(!quizSuccesful) {
            console.log("Stopped Quiz creation");
            return;
        }
        await database.addQuizToDB(this);
        console.log({
            "isPublic": this.publicQuiz,
            "author": this.author,
            "title": this.quizTitle,
            "questions": this.questionsArray
        });
    }

    private async getBasicInfo(): Promise<void> {
        const questions = [
            {
                type: "text",
                name: "title",
                message: "What is the title of your quiz?"
            },
            {
                type: "text",
                name: "makePublic",
                message: "Make the quiz public? (y/n)"
            }
        ];
        const response = await prompts(questions);
        this.quizTitle = response.title;
        if (response.makePublic == "y") {
            this.publicQuiz = true;
        }
    }

    private async questionLoop(): Promise<boolean> {
        let questionsCreated: number = 0;

        while (questionsCreated < 10) {
            if (questionsCreated > 2) {
                const repeatResult: boolean = await this.askUserToAddQuestion();
                if (!repeatResult) {
                    return true;
                }
            }
            const selectedType: number = await this.getQuestionType();
            if(selectedType == undefined) {
                return false
            }
            if (selectedType == 0){
                const uniqueNumberCorrect: boolean = await this.uniqueNumberQuestionPrequesites();
                if(!uniqueNumberCorrect) return false
            }
            else if (selectedType == 1){
                const optionsCorrect: boolean = await this.optionsQuestionPrequesites();
                if(!optionsCorrect) return false
            }
            else {
                const uniqueTextCorrect: boolean = await this.uniqueTextQuestionPrequesites();
                if(!uniqueTextCorrect) return false
            }
            ++questionsCreated;
        }
        console.log("Maximum of 10 questions reached");
        return true;
    }

    private async askUserToAddQuestion(): Promise<boolean> {
        const response = await prompts({
            type: "text",
            name: "repeatQuestion",
            message: "Do you want to add another question? (y/n)"
        });
        return response.repeatQuestion == "y" ? true : false;
    }

    private async getQuestionType(): Promise<number> {
        const response = await prompts({
            type: "select",
            name: "questionTypes",
            message: "Pick Question Type",
            choices: [
                { title: "Unique Number", value: 0 },
                { title: "Options", value: 1 },
                { title: "Unique Text", value: 2 }
            ],
        });
        return response.questionTypes;
    }

    private async uniqueNumberQuestionPrequesites(): Promise<boolean> {
        const questions = [
            {
                type: "text",
                name: "question",
                message: "What question do you want to ask?"
            },
            {
                type: "number",
                name: "correctNumber",
                message: "What is the correct answer?"
            }
        ];
        const response = await prompts(questions);
        if(Object.values(response).length == 2 && !Object.values(response).includes(undefined)) {
            await this.createQuestion(Question.UniqueNumberType, response.question, response.correctNumber, [], "");
            return true
        } else {
            return false
        }
    }

    private async optionsQuestionPrequesites(): Promise<boolean> {
        const questions = [
            {
                type: "text",
                name: "question",
                message: "What question do you want to ask?"
            },
            {
                type: "select",
                name: "amountOfOptions",
                message: "How many options should your question have?",
                choices: [
                    { title: "2", value: 2 },
                    { title: "3", value: 3 },
                    { title: "4", value: 4 }
                ],
            }
        ];
        const response = await prompts(questions);
        if(Object.values(response).length == 2 && !Object.values(response).includes(undefined)) {
            let result:string[] = await this.getOptionsAnswers(response.amountOfOptions)
            if(result.length == response.amountOfOptions+1 && !Object.values(response).includes(undefined)) {
                const optionsNumber = result.pop();
                const correctNumber = (typeof optionsNumber == "string") ? parseInt(optionsNumber) : 1;
                const options: string[] = result;
                await this.createQuestion(Question.QuestionOptionsType, response.question, correctNumber, options, "");
                return true;
            } else return false;
        } else return false;        
    }

    private async getOptionsAnswers(amount: Number): Promise<string[]> {
        let questions: Array<object> = [];
        let choices: Array<object> = [];
        for (let i: number = 0; i < amount; ++i) {
            questions.push({
                type: "text",
                name: i.toString(),
                message: "Please provide an option"
            });
            choices.push({
                title: (i + 1).toString(),
                value: i.toString()
            });
        }
        questions.push({
            type: "select",
            name: "correctAnswer",
            message: "Which option is correct?",
            choices
        });
        const response = await prompts(questions);

        return Object.values(response)
    }

    private async uniqueTextQuestionPrequesites(): Promise<boolean> {
        const questions = [
            {
                type: "text",
                name: "question",
                message: "What question do you want to ask?"
            },
            {
                type: "text",
                name: "correctAnswer",
                message: "What is the correct answer?"
            }
        ];
        const response = await prompts(questions);
        if(Object.values(response).length == 2 && !Object.values(response).includes(undefined)) {
            await this.createQuestion(Question.UniqueTextType, response.question, 0, [], response.correctAnswer);
            return true
        } else {
            return false
        }
    }


    private async createQuestion(questionType: number, questionString: string, correctNumber: number, options: string[], correctText: string): Promise<void> {
        let question!: Question;
        if (questionType == Question.UniqueNumberType) {
            question = new UniqueNumber(questionString, correctNumber);
        } else if (questionType == Question.QuestionOptionsType) {
            question = new QuestionOptions(questionString, correctNumber, options);
        } else if (questionType == Question.UniqueTextType) {
            question = new UniqueText(questionString, correctText);
        }
        await database.addQuestionToDB(question);
        this.questionsArray.push(question._id.toString());
    }
}