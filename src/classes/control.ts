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
        let userDB: User | null = await database.login(Control.user.username, Control.user.password);
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
                    { title: "Statistik ansehen", value: 2 }
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
                    if (response2.answer == undefined) {

                        break;
                    }
                    let quiz: Quiz = all[response2.answer - 1];
                    let selectedQuiz: Quiz | null = await database.getQuiz(quiz._id);
                    if (selectedQuiz) {
                        let quizClass: Quiz = new Quiz();
                        await quizClass.playQuiz(selectedQuiz);
                    }
                }

            }
            else if (response.answer == 1) {
                let quiz: Quiz = new Quiz();
                await quiz.createQuiz();
            }
            else if (response.answer == 2) {
                console.log(Control.user.showStatistic());
            }
        }
        console.log("Abort");
        await database.disconnect();
    }
}