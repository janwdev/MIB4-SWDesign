import { Database } from "./database";
import { Quiz } from "./quiz";
import { User } from "./user";

export let database: Database = new Database();
export let user: User;

export class Control {

    public async main(): Promise<void> {
        console.log("I'm running!");
        await database.connectRegistered();
        let user: User | null = new User(true, "user1", "1234");
        await database.register(user);
        user = await database.login(user.username, user.password);
        if (user)
            console.log(user._id?.toString());
        
        let quiz: Quiz = new Quiz();
        await quiz.createQuiz();
        await database.disconnect();
    }
    public selectQuiz(name: String): Quiz {
        let quiz: QuizSelector = QuizSelectorFactory.getQuiz(name);
        return quiz;
    }
}