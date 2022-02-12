import { User } from "./user";

/**
 * Data Access Object for Registration Manager
 */
export interface RegistrationManager {
    register(): Promise<User | null>;
    login(): Promise<User | null>;
    registerAnonymousUser(): User;
    registerComputerUser(): User;
}