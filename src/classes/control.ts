import { Database } from "./database";
import { Quiz } from "./quiz";
import { User } from "./user";
import * as Mongo from "mongodb";
export let database: Database = new Database();
export let user: User;
const prompts = require("prompts");
export class Control {

    public async main(): Promise<void> {
        console.log("I'm running!");
        await database.connectRegistered();
        let user: User | null = new User(true, "user1", "1234");
        await database.register(user);
        user = await database.login(user.username, user.password);
        if (user)
            console.log(user._id?.toString());


        let prompt = [
            {
                type: "text",
                name: "answer",
                message: "Was willst du machen?\n1)Quiz spielen\n2)Quiz erstellen"
            }
        ];

        const response1 = await prompts(prompt);

        if (response1.answer == 1) {
            prompt = [
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
                let quiz: Quiz = all[response2.answer - 1];
                let selectedQuiz: Quiz | null = await database.getQuiz(quiz._id);
                if (selectedQuiz) {
                    let quizClass: Quiz = new Quiz();
                    await quizClass.playQuiz(selectedQuiz);
                }
            }

        }
        else {
            let quiz: Quiz = new Quiz();
            await quiz.createQuiz();
        }
        await database.disconnect();
    }
}