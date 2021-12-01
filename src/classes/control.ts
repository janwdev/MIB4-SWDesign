import { Database } from "./database";
import { Quiz } from "./quiz";
import { User } from "./user";

export class Control {
    public pathToQuizFile: String;
    public user: User;

    public async main(): Promise<void> {
        console.log("I'm running!");
        let database: Database = new Database();
        await database.connectRegistered();
        let user: User | null = new User(true, "user1", "1234");
        // await database.register(user);
        user = await database.login(user.username, user.password);
        if (user)
            console.log(user._id);
        await database.disconnect();
    }
    public selectQuiz(name: String): Quiz {
        let quiz: QuizSelector = QuizSelectorFactory.getQuiz(name);
        return quiz;
    }
    public readQuizFromFile(): Quiz[] {
    }
    private saveQuiz(quiz: Quiz): boolean {
    }
}