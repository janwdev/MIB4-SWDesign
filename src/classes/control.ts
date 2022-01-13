import { Database } from "./database";
import { Quiz } from "./quiz";
import { User } from "./user";
const prompts = require("prompts");

export let database: Database = new Database();


export class Control {

    public static user: User;

    public async main(): Promise<void> {
        console.log("I'm running!");
        await database.connectRegistered();
        Control.user = new User(true, "user1", "1234");
        await database.register(Control.user);
        let userDB: User | null = await database.login(Control.user.username, Control.user.password ?? '');
        if (userDB) {
            Control.user.setValuesFromUser(userDB);
            console.log(Control.user._id?.toString());
            console.log(Control.user.statistics);
        } else {
            console.log("Error, login went wrong");
        }

        while (true) {

            const response = await prompts({
                type: "select",
                name: "answer",
                message: "Was willst du machen",
                choices: [
                    { title: "Quiz spielen", value: 0 },
                    { title: "Quiz erstellen", value: 1 },
                    { title: "Statistik ansehen", value: 2 },
                    { title: "Quiz App beenden", value: 3 }
                ],
            });

            if (response.answer == 0) {
                const prompt = [
                    {
                        type: "text",
                        name: "answer",
                        message: "Wähle ein Quiz aus"
                    }
                ];
                let all: Quiz[] | null = await database.getAllQuiz();
                if (all) {
                    for (let index: number = 0; index < all.length; index++) {
                        const quiz: Quiz = all[index];
                        console.log((index + 1) + ") " + quiz.quizTitle);
                    }
                    const response2 = await prompts(prompt);

                    const quizSelector: QuizSelector = await QuizSelectorFactory.checkQuiz(response2.answer);
                    
                    if(!quizSelector.isNil()) {
                        let selectedQuiz: Quiz | null = await quizSelector.getQuiz()
                        if (selectedQuiz) {
                            let quizClass: Quiz = new Quiz();
                            await quizClass.playQuiz(selectedQuiz);
                        }
                    } else console.log("This quiz does not exist")
                }

            }
            else if (response.answer == 1) {
                let quiz: Quiz = new Quiz();
                await quiz.createQuiz();
            }
            else if (response.answer == 2) {
                console.log(Control.user.showStatistic());
            } 
            else if (response.answer == 3) {
                console.log("Quiz wird beendet")
                break;
            } 
            else {
                break;
            }
        }
        console.log("Abort");
        await database.disconnect();
    }
}


abstract class QuizSelector {
    protected quizNumber:string;
    constructor() { this.quizNumber = "" }
    public abstract isNil():boolean;
    public abstract getQuiz(): Promise<Quiz>;
}

class RealQuiz extends QuizSelector {
    constructor() {
        super()
        this.quizNumber = "-1"
    }
    setName(quizNumber:string) {
       this.quizNumber = quizNumber;
    }
    public isNil():boolean {
       return false;
    }
    public async getQuiz(): Promise<Quiz> {
       let all: Quiz[] | null = await database.getAllQuiz();
       return all!= null ? all[parseInt(this.quizNumber)-1] : new Quiz();
    }
 }

class NullQuiz extends QuizSelector {
    constructor() {
        super()
        this.quizNumber = "-1"
    }
    public isNil():boolean {
        return true;
    }
    public async getQuiz(): Promise<Quiz> {
        return new Quiz();
    }
}


class QuizSelectorFactory {
    public static async checkQuiz(quizNumber:string): Promise<QuizSelector>{
        let all: Quiz[] | null = await database.getAllQuiz();
        if(all != null && parseInt(quizNumber) < all.length && parseInt(quizNumber) >= 0) {
            let success:RealQuiz = new RealQuiz();
            success.setName(quizNumber)
            return success
        }
        return new NullQuiz()
    }
 }
