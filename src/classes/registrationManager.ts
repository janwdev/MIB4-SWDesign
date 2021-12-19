import { User } from "./user";

export class RegistrationManager {
    public path: String;

    public register(username: String, password: String): User {
        //will accept any password between 4 and 8 signs consisting of numbers or letters, must contain numbers. 
        password.match(/^(?=.*\d).{4,8}$/);
    }
    public login(username: String, password: String): User {
    }
    private checkUsername(username: String): boolean {
        //will accept alphanumeric usernames between 5 and 20 characters, no special characters.  
        username.match(/^(?=.{5,20}$)[a-zA-Z0-9._]+(?<![_.])$/);
    }
    public registerAnonymousUser(): User {
    }
}