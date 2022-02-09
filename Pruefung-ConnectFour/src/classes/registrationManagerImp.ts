import { User } from "./user";
import { database } from "./control";
import prompts from "prompts";
import { RegistrationManager } from "./registrationManager";

export class RegistrationManagerImp implements RegistrationManager {

    public registerAnonymousUser(): User {
        let user: User = new User(false, "Anon");
        return user;
    }
    public registerComputerUser(): User {
        let user: User = new User(false, "Computer");
        return user;
    }

    public async register(): Promise<User | null> {
        let userName: string | null = await this.getUserName();
        let password: string | null = null;
        if (userName)
            password = await this.getPassword();
        if (userName && password) {
            if (password.trim().length < 1 || userName.trim().length < 1) {
                console.log("Please provide non-empty input");
                return this.register();
            }
            let userOld: User = new User(true, userName, password);
            let user: User | null = await database.register(userOld);
            if (user) {
                return user;
            } else {
                console.log("Registration went wrong, please try again!");
                return null;
            }
        } else {
            return this.register();
        }
    }

    public async login(): Promise<User | null> {
        let userName: string | null = await this.getUserName();
        let password: string | null = null;
        if (userName)
            password = await this.getPassword();
        if (userName && password) {
            if (password.trim().length < 1 || userName.trim().length < 1) {
                console.log("Please provide non-empty input");
                return this.login();
            }
            let userDB: User | null = await database.login(userName, password);
            if (userDB) {
                let user: User = new User(true, userName);
                user.setValuesFromUser(userDB);
                return user;
            } else {
                console.log("Login went wrong, please try again!");
                return null;
            }
        } else {
            return this.login();
        }
    }

    public testPasswordSecurity(password: string): boolean {
        if (password)
            //Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
            return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) != null;
        return false;
    }
    private checkUsername(username: String): boolean {
        if (username)
            //will accept alphanumeric usernames between 5 and 20 characters, no special characters.  
            return username.match(/^(?=.{5,20}$)[a-zA-Z0-9._]+(?<![_.])$/) != null;
        return false;
    }

    private async getUserName(): Promise<string | null> {
        let userName: string | null = null;
        let response: prompts.Answers<string> = await prompts.prompt({
            type: "text",
            name: "answer",
            message: "Please enter your username:"
        });
        if (this.checkUsername(response.answer)) {
            userName = response.answer;
        } else {
            console.log("Username doesn't match pattern: \"alphanumeric usernames between 5 and 20 characters, no special characters\"");
        }
        return userName;
    }

    private async getPassword(): Promise<string | null> {
        let password: string | null = null;
        let response: prompts.Answers<string> = await prompts.prompt({
            type: "password",
            name: "answer",
            message: "Please enter your password:"
        });
        if (this.testPasswordSecurity(response.answer)) {
            password = response.answer;
        } else {
            console.log("Password doesn't match pattern: \"Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character\"");
        }
        return password;
    }
}