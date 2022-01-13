import { updateCall } from "typescript";
import { User } from "./user";

export class RegistrationManager {
    //public path: String;
    
    public static testPasswordSecurity (password: string) : boolean{
        //Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
        return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) != null;

    }

    public register(username: String, password: String): User {
        //will accept any password between 4 and 8 signs consisting of numbers or letters, must contain numbers. 

        return new User(true, 'abc');
    }
    public login(username: String, password: String): User {
        return new User(true, 'abc');
    }
    public registerAnonymousUser(): User {
        return new User(true, 'abc');
    }
    private checkUsername(username: String): boolean {
        //will accept alphanumeric usernames between 5 and 20 characters, no special characters.  
        return username.match(/^(?=.{5,20}$)[a-zA-Z0-9._]+(?<![_.])$/) != null;

    }
}