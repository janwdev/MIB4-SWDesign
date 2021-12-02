const prompts = require("prompts");

import { database } from "./control";
import { Question } from "./question";
import { QuestionOptions } from "./questionOptions";
import { UniqueNumber } from "./uniqueNumber";
import { UniqueText } from "./uniqueText";

export class Quiz {
    private questionsArray: String[];
    private author: String;
    private publicQuiz: Boolean;
    private quizTitle: String;

    constructor() {
        this.questionsArray = [];
        this.author = "Max"; //TODO change to username
        this.publicQuiz = false;
        this.quizTitle = "";
    }

    public async createQuiz(): Promise<void> {
        await this.getBasicInfo();
        await this.questionLoop();
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

    private async questionLoop(): Promise<void> {
        let questionsCreated: number = 0;

        while (questionsCreated < 10) {
            if (questionsCreated > 2) {
                const repeatResult: boolean = await this.askUserToAddQuestion();
                if (!repeatResult) {
                    break;
                }
            }
            const selectedType: number = await this.getQuestionType();
            if (selectedType == 0) await this.uniqueNumberQuestionPrequesites();
            else if (selectedType == 1) await this.optionsQuestionPrequesites();
            else await this.uniqueTextQuestionPrequesites();
            ++questionsCreated;
        }
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

    private async uniqueNumberQuestionPrequesites(): Promise<void> {
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
        await this.createQuestion(Question.UniqueNumberType, response.question, response.correctNumber, [], "");
    }

    private async optionsQuestionPrequesites(): Promise<void> {
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
        let result: Array<any> = await this.getOptionsAnswers(response.amountOfOptions);
        const correctNumber = result.pop();
        const options: Array<String> = result;
        await this.createQuestion(Question.QuestionOptionsType, response.question, correctNumber, options, "");
    }

    private async getOptionsAnswers(amount: Number): Promise<Array<any>> {
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
                value: i
            });
        }
        questions.push({
            type: "select",
            name: "correctAnswer",
            message: "Which option is correct?",
            choices
        });
        const response = await prompts(questions);

        let result: Array<any> = [];
        for (let i = 0; i < amount; ++i) {
            result.push(response.i);
        }
        result.push(response.correctAnswer);
        return result;
    }

    private async uniqueTextQuestionPrequesites(): Promise<void> {
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
        await this.createQuestion(Question.UniqueTextType, response.question, 0, [], response.correctAnswer);
    }


    private async createQuestion(questionType: number, questionString: String, correctNumber: number, options: String[], correctText: String): Promise<void> {
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