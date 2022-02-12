import { User } from "./user";
import { database } from "./control";
import prompts from "prompts";
import { RegistrationManager } from "./registrationManager";

/**
 * Implemention of Registration Manager
 */
export class RegistrationManagerImp implements RegistrationManager {

    /**
     * Register an anonymous user
     * @returns the anonymous user
     */
    public registerAnonymousUser(): User {
        let user: User = new User(false, "Anon");
        return user;
    }

    /**
     * Register a Computer as user
     * @returns the computer user
     */
    public registerComputerUser(): User {
        let user: User = new User(false, "Computer");
        return user;
    }

    /**
     * Register a new User
     * @returns the user if successfull, else null
     */
    public async register(): Promise<User | null> {
        // gets username and password
        let userName: string | null = await this.getUserName();
        let password: string | null = null;
        if (userName)
            password = await this.getPassword();
        // if username and password were provided successfull
        if (userName && password) {
            if (password.trim().length <= 1 || userName.trim().length <= 1) {
                // if password and username where empty
                console.log("Please provide non-empty input");
                // recall register
                return this.register();
            }
            // register user in db and return new user
            let userOld: User = new User(true, userName, password);
            let user: User | null = await database.register(userOld);
            if (user) {
                return user;
            } else {
                console.log("Registration went wrong, please try again!");
                return null;
            }
        } else {
            // if username and password werent provided successfully recall register
            return this.register();
        }
    }

    /**
     * Login a user
     * @returns the user if successfull, else null
     */
    public async login(): Promise<User | null> {
        // ask for username and password
        let userName: string | null = await this.getUserName();
        let password: string | null = null;
        if (userName)
            password = await this.getPassword();
        if (userName && password) {
            // if username and password were provided successfull
            if (password.trim().length < 1 || userName.trim().length < 1) {
                // if password and username were empty
                console.log("Please provide non-empty input");
                // recall login
                return this.login();
            }
            // login user
            let userDB: User | null = await database.login(userName, password);
            if (userDB) {
                // if login successfull, init user and return user
                let user: User = new User(true, userName);
                user.setValuesFromUser(userDB);
                return user;
            } else {
                // error and return null
                console.log("Login went wrong, please try again!");
                return null;
            }
        } else {
            // recall login if username and password weren't provided successfully
            return this.login();
        }
    }

    /**
     * Checks Password security
     * @param password Password which is checked
     * @returns true if password is secure enough
     */
    public testPasswordSecurity(password: string): boolean {
        if (password)
            //Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
            return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) != null;
        return false;
    }

    /**
     * Checks if username matches pattern
     * @param username username to check
     * @returns true if username match pattern
     */
    private checkUsername(username: String): boolean {
        if (username)
            //will accept alphanumeric usernames between 5 and 20 characters, no special characters.  
            return username.match(/^(?=.{5,20}$)[a-zA-Z0-9._]+(?<![_.])$/) != null;
        return false;
    }

    /**
     * Get the username
     * @returns username or null if input wasnt correct
     */
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

    /**
     * Asks for password
     * @returns password or null if input wasnt correct
     */
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