import { User } from "./user";

export class RegistrationManager {
    public path: String;

    public register(username: String, password: String): User {
        password.match(/^(?=.*\d).{4,8}$/);
    }
    public login(username: String, password: String): User {
    }
    private checkUsername(username: String): boolean {
    }
    public registerAnonymousUser(): User {
    }
}