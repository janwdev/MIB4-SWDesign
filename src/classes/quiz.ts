const prompts = require('prompts');

import { Question } from "./question";
import { QuestionOptions } from "./questionOptions";
import { UniqueNumber } from "./uniqueNumber";
import { UniqueText } from "./uniqueText";

export class Quiz {
    public static readonly UniqueNumberType: number = 0;
    public static readonly QuestionOptionsType: number = 1;
    public static readonly UniqueTextType: number = 2;

    private questionsArray: Question[];
    private author: String;
    private publicQuiz: Boolean;
    private quizTitle: String;

    constructor() {
        this.questionsArray = []
        this.author = "Max" //TODO change to username
        this.publicQuiz = false
        this.quizTitle = ""
    }    

    public async createQuiz(): Promise<void> {
        await this.getBasicInfo()
        await this.questionLoop()
        //TODO Daten aus console.log abspeichern
        console.log({
            "isPublic": this.publicQuiz,
            "author": this.author,
            "title": this.quizTitle,
            "questions": this.questionsArray
        })        
    }

    private async getBasicInfo(): Promise<void> {
        const questions = [
            {
              type: 'text',
              name: 'title',
              message: 'What is the title of your quiz?'
            },
            {
                type: 'text',
                name: 'makePublic',
              message: 'Make the quiz public? (y/n)'
            }
        ];
        const response = await prompts(questions);
        this.quizTitle = response.title
        if(response.makePublic == 'y') {
            this.publicQuiz = true
        }         
    }

    private async questionLoop(): Promise<void> {
        let questionsCreated: number = 0

        while(questionsCreated < 10) {
            if(questionsCreated > 2) {
                const repeatResult: boolean = await this.askUserToAddQuestion()
                if(!repeatResult) {
                    break
                }
            }
            const selectedType: number = await this.getQuestionType()            
            if(selectedType == 0) await this.uniqueNumberQuestionPrequesites()
            else if (selectedType == 1) await this.optionsQuestionPrequesites()            
            else await this.uniqueTextQuestionPrequesites()
            ++questionsCreated
        }
    }

    private async askUserToAddQuestion(): Promise<boolean> {
        const response = await prompts({
            type: 'text',
            name: 'repeatQuestion',
            message: 'Do you want to add another question? (y/n)'
        });        
        return response.repeatQuestion == 'y' ? true : false
    }

    private async getQuestionType(): Promise<number> {
        const response = await prompts({
            type: 'select',
            name: 'questionTypes',
            message: 'Pick Question Type',
            choices: [
                { title: 'Unique Number', value: 0 },
                { title: 'Options', value: 1 },
                { title: 'Unique Text', value: 2 }
            ],
        });
        return response.questionTypes
    }

    private async uniqueNumberQuestionPrequesites(): Promise<void> {
        const questions = [
            {
              type: 'text',
              name: 'question',
              message: 'What question do you want to ask?'
            },
            {
              type: 'number',
              name: 'correctNumber',
              message: 'What is the correct answer?'
            }
        ];
        const response = await prompts(questions);
        this.createQuestion(0, response.question, response.correctNumber, [], "")
    }

    private async optionsQuestionPrequesites(): Promise<void> {
        const questions = [
            {
                type: 'text',
                name: 'question',
                message: 'What question do you want to ask?'
            },
            {
                type: 'select',
                name: 'amountOfOptions',
                message: 'How many options should your question have?',    
                choices: [
                    { title: '2', value: 2 },
                    { title: '3', value: 3 },
                    { title: '4', value: 4 }
                ],
            }
        ];
        const response = await prompts(questions);
        let result:Array<any> = await this.getOptionsAnswers(response.amountOfOptions)
        const correctNumber = result.pop() 
        const options: Array<String> = result
        this.createQuestion(1, response.question, correctNumber, options, "")    
    }
    
    private async getOptionsAnswers(amount: Number): Promise<Array<any>> {
        let questions:Array<object> = []
        let choices:Array<object> = []
        for(let i = 0; i < amount; ++i) {
            questions.push({
                type: 'text',
                name: i.toString(),
                message: 'Please provide an option'
            })
            choices.push({
                title: (i+1).toString(),
                value: i
            })
        }
        questions.push({
            type: 'select',
            name: 'correctAnswer',
            message: 'Which option is correct?',
            choices
        })
        const response = await prompts(questions);
        
        let result:Array<any> = []
        for(let i = 0; i < amount; ++i) {
            result.push(response.i)            
        }
        result.push(response.correctAnswer)
        return result
    }

    private async uniqueTextQuestionPrequesites(): Promise<void> {
        const questions = [
            {
                type: 'text',
                name: 'question',
                message: 'What question do you want to ask?'
            },
            {
                type: 'text',
                name: 'correctAnswer',
                message: 'What is the correct answer?'
            }
        ];
        const response = await prompts(questions);
        this.createQuestion(2, response.question, 0, [], response.correctAnswer)
    }


    private createQuestion(questionType: number, questionString: String, correctNumber: number, options: String[], correctText: String): void {
        let question: Question = new Question(questionString);
        if (questionType == Quiz.UniqueNumberType) {
            question = new UniqueNumber(questionString, correctNumber);
        } else if (questionType == Quiz.QuestionOptionsType) {
            question = new QuestionOptions(questionString, correctNumber, options);
        } else if (questionType == Quiz.UniqueTextType) {
            question = new UniqueText(questionString, correctText);
        }
        this.questionsArray.push(question)
    }
}