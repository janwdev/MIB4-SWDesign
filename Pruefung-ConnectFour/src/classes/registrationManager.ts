// Data Access Object Pattern

import { User } from "./user";

export interface RegistrationManager {
    register(): Promise<User | null>;
    login(): Promise<User | null>;
    registerAnonymousUser(): User;
    registerComputerUser(): User;
}