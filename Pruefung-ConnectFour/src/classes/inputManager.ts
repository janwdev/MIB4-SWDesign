import prompts from "prompts";
import { control } from "../index";
import { database } from "./control";
import { User } from "./user";

export class InputManager {

    public async getGameMode(): Promise<void> {
        let proceed: boolean = false;
        while (!proceed) {
            let response: prompts.Answers<string> = await prompts.prompt({
                type: "select",
                name: "answer",
                message: "Choose Game-Mode:",
                choices: [
                    { title: "TicTacToe", value: control.GAMEMODETICTACTOE },
                    { title: "ConnectFour", value: control.GAMEMODECONNECTFOUR },
                    { title: "Quit program", value: 2 }
                ]
            });
            switch (response.answer) {
                case control.GAMEMODETICTACTOE:
                    control.gameMode = control.GAMEMODETICTACTOE;
                    proceed = true;
                    break;
                case control.GAMEMODECONNECTFOUR:
                    control.gameMode = control.GAMEMODECONNECTFOUR;
                    proceed = true;
                    break;
                case 2:
                    proceed = true;
                    control.exitProgram();
                    break;
                default:
                    console.log("Wrong Type, try again");
                    break;
            }
        }
    }

    public async playAgainstWho(): Promise<void> {
        let proceed: boolean = false;
        while (!proceed) {
            let response: prompts.Answers<string> = await prompts.prompt({
                type: "select",
                name: "answer",
                message: "How do you want to play?",
                choices: [
                    { title: "With the Computer", value: 0 },
                    { title: "Against another human", value: 1 },
                    { title: "Quit Program", value: 2 }
                ]
            });
            switch (response.answer) {
                case 0:
                    control.playAgainstComputer = true;
                    proceed = true;
                    break;
                case 1:
                    control.playAgainstComputer = false;
                    proceed = true;
                    break;
                case 2:
                    proceed = true;
                    control.exitProgram();
                    break;
                default:
                    console.log("Wrong Type, try again");
                    break;
            }
        }
    }

    public async howToPlay(message: string): Promise<User | undefined> {
        let proceed: boolean = false;
        while (!proceed) {
            let response: prompts.Answers<string> = await prompts.prompt({
                type: "select",
                name: "answer",
                message: message,
                choices: [
                    { title: "Login", value: 0 },
                    { title: "Play anonymous", value: 1 },
                    { title: "Register", value: 2 },
                    { title: "Quit Program", value: 3 }
                ]
            });
            switch (response.answer) {
                case 0:
                    //Login
                    if (await database.connect()) {
                        let user: User | null = await control.regManager.login();
                        if (user) {
                            proceed = true;
                            console.log("Login successfull: ", proceed);
                            return user;
                        }
                    } else {
                        console.log("No connection to DB");
                        control.exitProgram();
                    }
                    break;
                case 1:
                    //play anonymous
                    let user: User = control.regManager.registerAnonymousUser();
                    proceed = true;
                    return user;
                case 2:
                    //register
                    if (await database.connect()) {
                        let user: User | null = await control.regManager.register();
                        if (user) {
                            proceed = true;
                            console.log("Registration successfull: ", proceed);
                            return user;
                        }
                    } else {
                        console.log("No connection to DB");
                        control.exitProgram();
                    }
                    break;
                case 3:
                    proceed = true;
                    control.exitProgram();
                    break;
                default:
                    console.log("Wrong Type, try again");
                    break;
            }
        }
    }

    public async createPlayground(): Promise<void> {
        let proceed: boolean = false;

        while (!proceed) {
            let response: prompts.Answers<string> = await prompts.prompt({
                type: "number",
                name: "size",
                message: "Size of board in X-Direction:"
            });
            control.sizeX = response.size;
            if (control.sizeX == undefined) {
                console.log("SizeX: " + control.sizeX);
                await control.exitProgram();
            }
            response = await prompts.prompt({
                type: "number",
                name: "size",
                message: "Size of board in Y-Direction:"
            });
            control.sizeY = response.size;
            if (control.sizeY == undefined) {
                console.log("SizeY: " + control.sizeY);
                await control.exitProgram();
            }
            if (control.sizeX >= 3 && control.sizeY >= 3 && control.sizeX <= 15 && control.sizeY <= 15) {
                proceed = true;
            } else {
                console.log("Board have to has a minimum size of 3x3 and a maximum of 15x15!\nPlease try again");
            }
        }
        proceed = false;
        while (!proceed) {
            let response: prompts.Answers<string> = await prompts.prompt({
                type: "number",
                name: "winningPoints",
                message: "How many elements in row to win?"
            });
            control.winningPointsInRow = response.winningPoints;
            if (control.winningPointsInRow == undefined) {
                console.log("winningPointsInRow: " + control.winningPointsInRow);
                await control.exitProgram();
            }
            if (control.winningPointsInRow <= control.sizeX && control.winningPointsInRow <= control.sizeY && control.winningPointsInRow > 1) {
                proceed = true;
            } else {
                console.log("Winning points must be smaller than shortest side of board and minimum 2!\nPlease try again");
            }
        }
        for (let y: number = 0; y < control.sizeY; y++) {
            control.playArray[y] = [];
            for (let x: number = 0; x < control.sizeX; x++) {
                control.playArray[y][x] = control.FIELDEMPTY;
            }
        }
    }

    public async waitAndSetUserInputConnectFour(): Promise<void> {
        console.log("Possible from (X:1) (left) until (X:" + control.sizeX + " (right)");
        let proceed: boolean = false;
        let x: number;

        while (!proceed) {
            let response: prompts.Answers<string> = await prompts.prompt({
                type: "number",
                name: "positionX",
                message: "X:"
            });
            x = response.positionX;
            if (x == undefined) {
                console.log("X: " + x);
                await control.exitProgram();
            }
            if (x <= control.sizeX && x > 0) {
                x--;
                for (let y: number = control.sizeY - 1; y >= 0; y--) {
                    if (control.playArray[y][x] == control.FIELDEMPTY) {
                        control.lastFieldSetXY = [x, y];
                        if (control.isUser1Playing) {
                            control.playArray[y][x] = control.FIELDUSER1;
                            proceed = true;
                            break;
                        } else {
                            control.playArray[y][x] = control.FIELDUSER2;
                            proceed = true;
                            break;
                        }
                    }
                }
                if (!proceed) {
                    console.log("Column: " + (x + 1) + " is full, please try again");
                }
            } else {
                console.log("X:" + x + ", field is outside the board, please type in again");
            }
        }
    }

    public async waitAndSetUserInputTictactoe(): Promise<void> {
        console.log("Possible from(1,1) (top left) until (X:" + control.sizeX + ",Y:" + control.sizeY + ") (bottom right)");
        let proceed: boolean = false;
        let x: number;
        let y: number;

        while (!proceed) {
            let response: prompts.Answers<string> = await prompts.prompt({
                type: "number",
                name: "positionX",
                message: "X:"
            });
            x = response.positionX;
            response = await prompts.prompt({
                type: "number",
                name: "positionY",
                message: "Y:"
            });
            y = response.positionY;

            if (x == undefined || y == undefined) {
                console.log("X: " + x + ", Y: " + y);
                await control.exitProgram();
            }

            if (x <= control.sizeX && y <= control.sizeY && x > 0 && y > 0) {
                x--;
                y--;
                if (control.playArray[y][x] == control.FIELDEMPTY) {
                    control.lastFieldSetXY = [x, y];
                    if (control.isUser1Playing) {
                        control.playArray[y][x] = control.FIELDUSER1;
                        proceed = true;
                    } else {
                        control.playArray[y][x] = control.FIELDUSER2;
                        proceed = true;
                    }
                } else {
                    console.log("Field isn't empty, please try again");
                }
            } else {
                console.log("X:" + x + ", Y:" + y);
                console.log("Field is outside the board, please type in again");
            }
        }
    }
}