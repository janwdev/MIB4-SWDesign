import Database from "./database";
import { User } from "./user";
import { RegistrationManager } from "./registrationManager";
import { RegistrationManagerImp } from "./registrationManagerImp";
import { Computer } from "./computer";
import { InputManager } from "./inputManager";

export let database: Database = Database.getInstance(); // Singleton

export class Control {

    /** Variables for users */
    public static user: User;
    public static user2: User; // If you play against computer, it is always user2
    public playAgainstComputer: boolean = true;

    /** Size of game board */
    public sizeX: number = 0;
    public sizeY: number = 0;
    /**Points you need in Row to win */
    public winningPointsInRow: number = 0;

    /**Array to save all fields */
    public playArray: number[][] = [];
    /**Define if field is free or which user has it */
    public readonly FIELDEMPTY: number = 0;
    public readonly FIELDUSER1: number = 1;
    public readonly FIELDUSER2: number = 2;

    /**Save which field was last set */
    public lastFieldSetXY: [number, number] = [-1, -1];

    public isUser1Playing: boolean = true;

    /**Define if you play tictactoe or connectfour */
    public gameMode?: number;
    public readonly GAMEMODETICTACTOE: number = 0;
    public readonly GAMEMODECONNECTFOUR: number = 1;

    /**Instances from needed Classes */
    public regManager: RegistrationManager = new RegistrationManagerImp();
    private computer: Computer = new Computer();
    private inputManager: InputManager = new InputManager();

    /**Define how to draw fields */
    private readonly DRAWFIELDEMPTY: string = "-";
    private readonly DRAWFIELDUSER1: string = "X";
    private readonly DRAWFIELDUSER2: string = "O";

    private gameOver: boolean = false;

    /**
     * Main method
     */
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
            this.gameOver = await this.checkIfGameOver();
            this.isUser1Playing = !this.isUser1Playing;
        }

        this.exitProgram();
    }

    /**
     * Count connected from Left top to right bottom and otherwise at last set position
     * @param lastX last x-position where was set
     * @param lastY last y-position where was set
     * @returns how many connected
     */
    public checkDiagonalLTRD(lastX: number, lastY: number): number {
        let inDiagonal: number = 1;

        // Right down to left top
        for (let i: number = 1; lastY - i >= 0 && lastX - i >= 0; i++) {
            if ((this.isUser1Playing && this.playArray[lastY - i][lastX - i] == this.FIELDUSER1) ||
                (!this.isUser1Playing && this.playArray[lastY - i][lastX - i] == this.FIELDUSER2)) {
                inDiagonal++;
            } else {
                break;
            }
        }
        // Left top to right down
        for (let i: number = 1; lastY + i < this.sizeY && lastX + i < this.sizeX; i++) {
            if ((this.isUser1Playing && this.playArray[lastY + i][lastX + i] == this.FIELDUSER1) ||
                (!this.isUser1Playing && this.playArray[lastY + i][lastX + i] == this.FIELDUSER2)) {
                inDiagonal++;
            } else {
                break;
            }
        }
        return inDiagonal;
    }
    /**
     * Count connected from Left bottom to right top and otherwise at last set position
     * @param lastX last x-position where was set
     * @param lastY last y-position where was set
     * @returns how many connected
     */
    public checkDiagonalLDRT(lastX: number, lastY: number): number {
        let inDiagonal: number = 1;

        // left bottom to right top
        for (let i: number = 1; i + lastX < this.sizeX && lastY - i >= 0; i++) {
            if ((this.isUser1Playing && this.playArray[lastY - i][lastX + i] == this.FIELDUSER1) ||
                (!this.isUser1Playing && this.playArray[lastY - i][lastX + i] == this.FIELDUSER2)) {
                inDiagonal++;
            } else {
                break;
            }
        }
        /**Right top to left down */
        for (let i: number = 1; lastX - i >= 0 && lastY + i < this.sizeY; i++) {
            if ((this.isUser1Playing && this.playArray[lastY + i][lastX - i] == this.FIELDUSER1) ||
                (!this.isUser1Playing && this.playArray[lastY + i][lastX - i] == this.FIELDUSER2)) {
                inDiagonal++;
            } else {
                break;
            }
        }
        return inDiagonal;
    }

    /**
     * Count connected diagonal (from Left bottom to right top and otherwise and left top to right bottom) at last set position
     * @param lastX last x-position where was set
     * @param lastY last y-position where was set
     * @returns how many connected
     */
    public checkDiagonal(lastX: number, lastY: number): number {
        let inDiagonalLDRT: number = this.checkDiagonalLDRT(lastX, lastY);
        let inDiagonalLTRD: number = this.checkDiagonalLTRD(lastX, lastY);

        if (inDiagonalLDRT > inDiagonalLTRD)
            return inDiagonalLDRT;
        return inDiagonalLTRD;
    }

    /**
     * Count connected in column at last set position
     * @param lastX last x-position where was set
     * @param lastY last y-position where was set
     * @returns how many connected
     */
    public checkColumns(lastX: number, lastY: number): number {
        let inColumn: number = 0;
        for (let i: number = lastY; i < this.sizeY; i++) {
            if ((this.isUser1Playing && this.playArray[i][lastX] == this.FIELDUSER1) ||
                (!this.isUser1Playing && this.playArray[i][lastX] == this.FIELDUSER2)) {
                inColumn++;
            } else {
                break;
            }
        }
        for (let i: number = lastY - 1; i >= 0; i--) {
            if ((this.isUser1Playing && this.playArray[i][lastX] == this.FIELDUSER1) ||
                (!this.isUser1Playing && this.playArray[i][lastX] == this.FIELDUSER2)) {
                inColumn++;
            } else {
                break;
            }
        }
        return inColumn;
    }
    /**
     * Count connected in row at last set position
     * @param lastX last x-position where was set
     * @param lastY last y-position where was set
     * @returns how many connected
     */
    public checkRows(lastX: number, lastY: number): number {
        let inRow: number = 0;
        for (let i: number = lastX; i < this.sizeX; i++) {
            if ((this.isUser1Playing && this.playArray[lastY][i] == this.FIELDUSER1) ||
                (!this.isUser1Playing && this.playArray[lastY][i] == this.FIELDUSER2)) {
                inRow++;
            } else {
                break;
            }
        }
        for (let i: number = lastX - 1; i >= 0; i--) {
            if ((this.isUser1Playing && this.playArray[lastY][i] == this.FIELDUSER1) ||
                (!this.isUser1Playing && this.playArray[lastY][i] == this.FIELDUSER2)) {
                inRow++;
            } else {
                break;
            }
        }
        return inRow;
    }

    /**
     * Returns a random Integer in between min and max
     * @param min minimum random number
     * @param max maximum random number
     * @returns a random number
     */
    public getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
     * Exit Programm
     */
    public async exitProgram(): Promise<void> {
        await database.disconnect();
        console.log("Program ended");
        process.exit(0);
    }

    /**
     * checks if game over
     * @returns true if game over
     */
    private async checkIfGameOver(): Promise<boolean> {
        let ret: boolean = await this.checkIfGameWon();
        if (!ret)
            ret = await this.checkIfGameDrawn();
        return ret;
    }

    /**
     * Checks if game won
     * @returns true if game won
     */
    private async checkIfGameWon(): Promise<boolean> {
        let inDiagonal: number = this.checkDiagonal(this.lastFieldSetXY[0], this.lastFieldSetXY[1]);
        let inRow: number = this.checkRows(this.lastFieldSetXY[0], this.lastFieldSetXY[1]);
        let inColumn: number = this.checkColumns(this.lastFieldSetXY[0], this.lastFieldSetXY[1]);
        // console.log("inDiagonal:" + inDiagonal);
        // console.log("inRow:" + inRow);
        // console.log("inColumn:" + inColumn);
        if (inDiagonal >= this.winningPointsInRow || inRow >= this.winningPointsInRow || inColumn >= this.winningPointsInRow) {
            let username: String = Control.user.username;
            // Output and if registered, save new statistic
            if (!this.isUser1Playing) {
                username = Control.user2.username;
                if (Control.user2.registered)
                    await Control.user2.statistics.setValues(true, false);
                if (Control.user.registered)
                    await Control.user.statistics.setValues(false, true);
            } else {
                if (Control.user2.registered)
                    await Control.user2.statistics.setValues(false, true);
                if (Control.user.registered)
                    await Control.user.statistics.setValues(true, false);
            }
            console.log("Congratulations, " + username + ", you have won the game");
            if (Control.user.registered)
                console.log(Control.user.returnStatistic());
            if (Control.user2.registered)
                console.log(Control.user2.returnStatistic());
            return true;
        }
        return false;
    }

    /**
     * Checks if game is drawn
     * @returns true if game is drawn
     */
    private async checkIfGameDrawn(): Promise<boolean> {
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
        if (ret) {
            console.log("Nobody won this game");
            if (Control.user.registered) {
                await Control.user.statistics.setValues(false, false);
            }
            if (Control.user2.registered) {
                await Control.user2.statistics.setValues(false, false);
            }
        }
        return ret;
    }

    /** Draw Playgroung at Console with console.log */
    private drawPlayground(): void {
        // Array with all fields
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
        // Split array and join to big right formatted string
        let chunk: string[][] = this.chunkArray(playground, this.sizeY);
        let rows: string[] = [];
        for (let y: number = 0; y < this.sizeY; y++) {
            rows.push(chunk[y].join("|"));
        }
        playgroundString = rows.join("\n");
        console.log(playgroundString);
    }

    /**
     * Wait and set userinput
     */
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

    /**
     * Chunk string arrays
     * @param arr array to chunk
     * @param n where to chunk
     * @returns chunked array
     */
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
