import Database from "./database";
import { User } from "./user";
import { RegistrationManager } from "./registrationManager";
import { RegistrationManagerImp } from "./registrationManagerImp";
import { Computer } from "./computer";
import { InputManager } from "./inputManager";

export let database: Database = Database.getInstance(); // Singleton

export class Control {

    public static user: User;
    public static user2: User; // Wenn gegen Computer gespielt wird ist er immer user2
    public playAgainstComputer: boolean = true;

    public sizeX: number = 0;
    public sizeY: number = 0;
    public winningPointsInRow: number = 0;

    public playArray: number[][] = [];
    public readonly FIELDEMPTY: number = 0;
    public readonly FIELDUSER1: number = 1;
    public readonly FIELDUSER2: number = 2;

    public lastFieldSetXY: [number, number] = [-1, -1];

    public isUser1Playing: boolean = true;

    public gameMode?: number;
    public readonly GAMEMODETICTACTOE: number = 0;
    public readonly GAMEMODECONNECTFOUR: number = 1;

    public regManager: RegistrationManager = new RegistrationManagerImp();
    private computer: Computer = new Computer();
    private inputManager: InputManager = new InputManager();

    private readonly DRAWFIELDEMPTY: string = "-";
    private readonly DRAWFIELDUSER1: string = "X";
    private readonly DRAWFIELDUSER2: string = "O";

    private gameOver: boolean = false;

    public async main(): Promise<void> {
        await this.inputManager.getGameMode();
        console.log("Gamemode: " + this.gameMode);

        await this.inputManager.playAgainstWho();
        console.log("Against Computer: " + this.playAgainstComputer);

        Control.user = <User>await this.inputManager.howToPlay("What do you want to do?");
        if (!this.playAgainstComputer) {
            Control.user2 = <User>await this.inputManager.howToPlay("What want the other human to do?");
        } else {
            Control.user2 = this.regManager.registerComputerUser();
        }

        console.log("User1: " + Control.user.username);
        console.log("User2: " + Control.user2.username);
        console.log(Control.user.returnStatistic());

        await this.inputManager.createPlayground();
        this.drawPlayground();

        while (!this.gameOver) {
            await this.waitAndSetUserInput();
            this.drawPlayground();
            this.gameOver = this.checkIfGameOver();
            this.isUser1Playing = !this.isUser1Playing;
        }

        this.exitProgram();
    }

    public checkDiagonalLTRD(lastX: number, lastY: number): number {
        let inDiagonal: number = 1;

        // rechts unten nach links oben
        for (let i: number = 1; lastY - i >= 0 && lastX - i >= 0; i++) {
            if ((this.isUser1Playing && this.playArray[lastY - i][lastX - i] == this.FIELDUSER1) || (!this.isUser1Playing && this.playArray[lastY - i][lastX - i] == this.FIELDUSER2)) {
                inDiagonal++;
            } else {
                break;
            }
        }
        // links oben nach rechts unten
        for (let i: number = 1; lastY + i < this.sizeY && lastX + i < this.sizeX; i++) {
            if ((this.isUser1Playing && this.playArray[lastY + i][lastX + i] == this.FIELDUSER1) || (!this.isUser1Playing && this.playArray[lastY + i][lastX + i] == this.FIELDUSER2)) {
                inDiagonal++;
            } else {
                break;
            }
        }
        return inDiagonal;
    }
    public checkDiagonalLDRT(lastX: number, lastY: number): number {
        let inDiagonal: number = 1;

        // Links unten nach rechts oben
        for (let i: number = 1; i + lastX < this.sizeX && lastY - i >= 0; i++) {
            if ((this.isUser1Playing && this.playArray[lastY - i][lastX + i] == this.FIELDUSER1) || (!this.isUser1Playing && this.playArray[lastY - i][lastX + i] == this.FIELDUSER2)) {
                inDiagonal++;
            } else {
                break;
            }
        }
        // Rechts oben nach links unten
        for (let i: number = 1; lastX - i >= 0 && lastY + i < this.sizeY; i++) {
            if ((this.isUser1Playing && this.playArray[lastY + i][lastX - i] == this.FIELDUSER1) || (!this.isUser1Playing && this.playArray[lastY + i][lastX - i] == this.FIELDUSER2)) {
                inDiagonal++;
            } else {
                break;
            }
        }
        return inDiagonal;
    }
    public checkDiagonal(lastX: number, lastY: number): number {
        let inDiagonalLDRT: number = this.checkDiagonalLDRT(lastX, lastY);
        let inDiagonalLTRD: number = this.checkDiagonalLTRD(lastX, lastY);

        if (inDiagonalLDRT > inDiagonalLTRD)
            return inDiagonalLDRT;
        return inDiagonalLTRD;
    }
    public checkColumns(lastX: number, lastY: number): number {
        let inColumn: number = 0;
        for (let i: number = lastY; i < this.sizeY; i++) {
            if ((this.isUser1Playing && this.playArray[i][lastX] == this.FIELDUSER1) || (!this.isUser1Playing && this.playArray[i][lastX] == this.FIELDUSER2)) {
                inColumn++;
            } else {
                break;
            }
        }
        for (let i: number = lastY - 1; i >= 0; i--) {
            if ((this.isUser1Playing && this.playArray[i][lastX] == this.FIELDUSER1) || (!this.isUser1Playing && this.playArray[i][lastX] == this.FIELDUSER2)) {
                inColumn++;
            } else {
                break;
            }
        }
        return inColumn;
    }
    public checkRows(lastX: number, lastY: number): number {
        let inRow: number = 0;
        for (let i: number = lastX; i < this.sizeX; i++) {
            if ((this.isUser1Playing && this.playArray[lastY][i] == this.FIELDUSER1) || (!this.isUser1Playing && this.playArray[lastY][i] == this.FIELDUSER2)) {
                inRow++;
            } else {
                break;
            }
        }
        for (let i: number = lastX - 1; i >= 0; i--) {
            if ((this.isUser1Playing && this.playArray[lastY][i] == this.FIELDUSER1) || (!this.isUser1Playing && this.playArray[lastY][i] == this.FIELDUSER2)) {
                inRow++;
            } else {
                break;
            }
        }
        return inRow;
    }

    public getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    public async exitProgram(): Promise<void> {
        await database.disconnect();
        console.log("Program ended");
        process.exit(0);
    }

    private checkIfGameOver(): boolean {
        let ret: boolean = this.checkIfGameWon();
        if (!ret)
            ret = this.checkIfGameDrawn();
        return ret;
    }

    private checkIfGameWon(): boolean {
        let inDiagonal: number = this.checkDiagonal(this.lastFieldSetXY[0], this.lastFieldSetXY[1]);
        let inRow: number = this.checkRows(this.lastFieldSetXY[0], this.lastFieldSetXY[1]);
        let inColumn: number = this.checkColumns(this.lastFieldSetXY[0], this.lastFieldSetXY[1]);
        console.log("inDiagonal:" + inDiagonal);
        console.log("inRow:" + inRow);
        console.log("inColumn:" + inColumn);
        if (inDiagonal >= this.winningPointsInRow || inRow >= this.winningPointsInRow || inColumn >= this.winningPointsInRow) {
            let username: String = Control.user.username;
            if (!this.isUser1Playing) {
                username = Control.user2.username;
                console.log("Congratulations, " + username + ", you have won the game");
                if (Control.user2.registered)
                    Control.user2.statistics.setValues(true, false);
                if (Control.user.registered)
                    Control.user.statistics.setValues(false, true);
            } else {
                if (Control.user2.registered)
                    Control.user2.statistics.setValues(false, true);
                if (Control.user.registered)
                    Control.user.statistics.setValues(true, false);
            }
            if (Control.user.registered)
                console.log(Control.user.returnStatistic());
            if (Control.user2.registered)
                console.log(Control.user2.returnStatistic());
            return true;
        }
        return false;
    }

    private checkIfGameDrawn(): boolean {
        let ret: boolean = true;
        for (let x: number = 0; x < this.sizeX; x++) {
            for (let y: number = 0; y < this.sizeY; y++) {
                if (this.playArray[y][x] == this.FIELDEMPTY) {
                    ret = false;
                    break;
                }
            }
            if (!ret)
                break;
        }
        if (ret)
            console.log("Nobody won this game");
        return ret;
    }

    private drawPlayground(): void {
        let playground: string[] = [];
        let playgroundString: string;
        for (let y: number = 0; y < this.sizeY; y++) {
            for (let x: number = 0; x < this.sizeX; x++) {
                switch (this.playArray[y][x]) {
                    case this.FIELDEMPTY:
                        playground.push(this.DRAWFIELDEMPTY);
                        break;
                    case this.FIELDUSER1:
                        playground.push(this.DRAWFIELDUSER1);
                        break;
                    case this.FIELDUSER2:
                        playground.push(this.DRAWFIELDUSER2);
                        break;
                    default:
                        break;
                }
            }
        }
        let chunk: string[][] = this.chunkArray(playground, this.sizeY);
        let rows: string[] = [];
        for (let y: number = 0; y < this.sizeY; y++) {
            rows.push(chunk[y].join("|"));
        }
        playgroundString = rows.join("\n");
        console.log(playgroundString);
    }

    private async waitAndSetUserInput(): Promise<void> {
        let userName: String;
        if (this.isUser1Playing)
            userName = Control.user.username;
        else
            userName = Control.user2.username;
        console.log("User " + userName + ", where do you want to set?");
        if (userName === "Computer") {
            if (this.gameMode == this.GAMEMODETICTACTOE)
                this.computer.setComputerTictactoe();
            else if (this.gameMode == this.GAMEMODECONNECTFOUR)
                this.computer.setComputerInputConnectFour();
            else
                this.exitProgram();

        } else {
            if (this.gameMode == this.GAMEMODETICTACTOE)
                await this.inputManager.waitAndSetUserInputTictactoe();
            else if (this.gameMode == this.GAMEMODECONNECTFOUR)
                await this.inputManager.waitAndSetUserInputConnectFour();
            else
                this.exitProgram();
        }
    }

    private chunkArray(arr: string[], n: number): string[][] {
        // Code from https://stackoverflow.com/questions/9933662/
        let chunkLength: number = Math.max(arr.length / n, 1);
        let chunks: string[][] = [];
        for (let i: number = 0; i < n; i++) {
            if (chunkLength * (i + 1) <= arr.length)
                chunks.push(arr.slice(chunkLength * i, chunkLength * (i + 1)));
        }
        return chunks;
    }
}
