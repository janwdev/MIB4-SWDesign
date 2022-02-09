import Database from "./database";
import { User } from "./user";
import { RegistrationManager } from "./registrationManager";
import { RegistrationManagerImp } from "./registrationManagerImp";
import prompts from "prompts";

// https://www.npmjs.com/package/prompts#-types

export let database: Database = Database.getInstance(); // Singleton


export class Control {

    public static user: User;
    public static user2: User;
    public playAgainstComputer: boolean = true;

    private regManager: RegistrationManager = new RegistrationManagerImp();

    private gameMode?: number;
    private readonly GAMEMODETICTACTOE: number = 0;
    private readonly GAMEMODECONNECTFOUR: number = 1;

    private sizeX: number = 0;
    private sizeY: number = 0;
    private winningPointsInRow: number = 0;

    private playArray: number[][] = [];
    private readonly FIELDEMPTY: number = 0;
    private readonly DRAWFIELDEMPTY: string = "-";
    private readonly FIELDUSER1: number = 1;
    private readonly DRAWFIELDUSER1: string = "X";
    private readonly FIELDUSER2: number = 2;
    private readonly DRAWFIELDUSER2: string = "O";
    private lastFieldSetXY: [number, number] = [-1, -1];

    private isUser1Playing: boolean = true;
    private gameOver: boolean = false;

    private computerLastSet: number[] = [-1, -1];
    private computerMostConnected: number = -1;
    private CMCROW: number = 0;
    private CMCCOLUMN: number = 1;
    private CMCLDRT: number = 2;
    private CMCLTRD: number = 3;

    public async main(): Promise<void> {
        // Abfrage Spielmodus
        await this.getGameMode();
        console.log("Spielmodus: " + this.gameMode);

        // Abfrage gegen Computer / anderer Spieler
        await this.playAgainstWho();
        console.log("Gegen Computer: " + this.playAgainstComputer);

        // Evtl anmelden oder registrieren
        Control.user = <User>await this.howToPlay("Was willst du machen?");
        if (!this.playAgainstComputer) {
            Control.user2 = <User>await this.howToPlay("Was will dein Mitspieler machen?");
        } else {
            Control.user2 = this.regManager.registerComputerUser();
        }

        console.log("User1: " + Control.user.username);
        console.log("User2: " + Control.user2.username);

        await this.createPlayground();
        this.drawPlayground();

        while (!this.gameOver) {
            if (this.playAgainstComputer && !this.isUser1Playing) {
                //Computer hat gespielt
                if (this.gameMode == this.GAMEMODETICTACTOE)
                    this.searchForPositionWithMostConnectedComputerTTT();
            }
            await this.waitAndSetUserInput();
            this.drawPlayground();
            this.gameOver = this.checkIfGameOver();
            this.isUser1Playing = !this.isUser1Playing;
        }

        //TODO weiter gehts

        this.exitProgram();
    }

    private async exitProgram(): Promise<void> {
        await database.disconnect();
        console.log("Program ended");
        process.exit(0);
    }

    private checkIfGameOver(): boolean {
        let inDiagonal: number = this.checkDiagonal(this.lastFieldSetXY[0], this.lastFieldSetXY[1]);
        let inRow: number = this.checkRows(this.lastFieldSetXY[0], this.lastFieldSetXY[1]);
        let inColumn: number = this.checkColumns(this.lastFieldSetXY[0], this.lastFieldSetXY[1]);
        console.log("inDiagonal:" + inDiagonal);
        console.log("inRow:" + inRow);
        console.log("inColumn:" + inColumn);
        if (inDiagonal >= this.winningPointsInRow || inRow >= this.winningPointsInRow || inColumn >= this.winningPointsInRow)
            return true;
        return false;
    }

    private checkDiagonalLTRD(lastX: number, lastY: number): number {
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

    private checkDiagonalLDRT(lastX: number, lastY: number): number {
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

    private checkDiagonal(lastX: number, lastY: number): number {
        let inDiagonalLDRT: number = this.checkDiagonalLDRT(lastX, lastY);
        let inDiagonalLTRD: number = this.checkDiagonalLTRD(lastX, lastY);

        if (inDiagonalLDRT > inDiagonalLTRD)
            return inDiagonalLDRT;
        return inDiagonalLTRD;
    }

    private checkColumns(lastX: number, lastY: number): number {
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

    private checkRows(lastX: number, lastY: number): number {
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
        console.log("Benutzer " + userName + ", wo wollen Sie setzen?");
        if (userName === "Computer") {
            if (this.gameMode == this.GAMEMODETICTACTOE)
                this.setComputerTictactoe();
            else if (this.gameMode == this.GAMEMODECONNECTFOUR)
                this.setComputerInputConnectFour();
            else
                this.exitProgram();

        } else {
            if (this.gameMode == this.GAMEMODETICTACTOE)
                await this.waitAndSetUserInputTictactoe();
            else if (this.gameMode == this.GAMEMODECONNECTFOUR)
                await this.waitAndSetUserInputConnectFour();
            else
                this.exitProgram();
        }
    }

    private setComputerTictactoe(): void {
        if (this.computerLastSet[0] < 0 || this.computerLastSet[1] < 0) {
            let freeField: boolean = false;
            while (!freeField) {
                this.computerLastSet[0] = this.getRandomInt(0, this.sizeX);
                this.computerLastSet[1] = this.getRandomInt(0, this.sizeY);
                if (this.playArray[this.computerLastSet[1]][this.computerLastSet[0]] == this.FIELDEMPTY) {
                    freeField = true;
                    this.playArray[this.computerLastSet[1]][this.computerLastSet[0]] = this.FIELDUSER2;
                    // this.lastFieldSetXY = [this.computerLastSet[0], this.computerLastSet[1]];
                }
            }
        } else {
            let lastX: number = this.computerLastSet[0];
            let lastY: number = this.computerLastSet[1];
            let alreadySet: boolean = false;
            // console.log(this.computerMostConnected);
            switch (this.computerMostConnected) {
                //TODO evtl wenn punkte +1 kleiner winningpoints && beide nächsten felder in reihe frei random 0 oder 1 zum aufaddieren (Lücke lassen) 
                case this.CMCCOLUMN:
                    for (let i: number = 1; i < this.winningPointsInRow; i++) {
                        if (lastY + i < this.sizeY) {
                            if (this.playArray[lastY + i][lastX] == this.FIELDEMPTY) {
                                if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCCOLUMN)) {
                                    this.playArray[lastY + i][lastX] = this.FIELDUSER2;
                                    this.computerLastSet[1] = lastY + i;
                                    this.lastFieldSetXY = [lastX, lastY + i];
                                    alreadySet = true;
                                    break;
                                }
                            } else if (this.playArray[lastY + i][lastX] == this.FIELDUSER1) {
                                break;
                            }
                        } else {
                            break;
                        }

                    }

                    if (!alreadySet) {
                        for (let i: number = 1; i < this.winningPointsInRow; i++) {
                            if (lastY - i >= 0) {
                                if (this.playArray[lastY - i][lastX] == this.FIELDEMPTY) {
                                    if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCCOLUMN)) {
                                        this.playArray[lastY - i][lastX] = this.FIELDUSER2;
                                        this.computerLastSet[1] = lastY - i;
                                        this.lastFieldSetXY = [lastX, lastY - i];
                                        alreadySet = true;
                                        break;
                                    }
                                } else if (this.playArray[lastY + i][lastX] == this.FIELDUSER1) {
                                    break;
                                }
                            } else {
                                break;
                            }
                        }
                    }
                case this.CMCROW:
                    for (let i: number = 1; i < this.winningPointsInRow; i++) {
                        if (lastX + i < this.sizeX) {
                            if (this.playArray[lastY][lastX + i] == this.FIELDEMPTY) {
                                if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCROW)) {
                                    this.playArray[lastY][lastX + i] = this.FIELDUSER2;
                                    this.computerLastSet[0] = lastX + i;
                                    this.lastFieldSetXY = [lastX + i, lastY];
                                    alreadySet = true;
                                    break;
                                }
                            } else if (this.playArray[lastY + i][lastX] == this.FIELDUSER1) {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    if (!alreadySet) {
                        for (let i: number = 1; i < this.winningPointsInRow; i++) {
                            if (lastX - i >= 0) {
                                if (this.playArray[lastY][lastX - i] == this.FIELDEMPTY) {
                                    if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCROW)) {
                                        this.playArray[lastY][lastX - i] = this.FIELDUSER2;
                                        this.computerLastSet[0] = lastX - i;
                                        this.lastFieldSetXY = [lastX - i, lastY];
                                        alreadySet = true;
                                        break;
                                    }
                                } else if (this.playArray[lastY + i][lastX] == this.FIELDUSER1) {
                                    break;
                                }
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                case this.CMCLDRT:
                    for (let i: number = 1; i < this.winningPointsInRow; i++) {
                        if (lastX - i >= 0 && lastY + i < this.sizeY) {
                            if (this.playArray[lastY + i][lastX - i] == this.FIELDEMPTY) {
                                if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCLDRT)) {
                                    this.playArray[lastY + i][lastX - i] = this.FIELDUSER2;
                                    this.computerLastSet[0] = lastX - i;
                                    this.computerLastSet[1] = lastY + i;
                                    this.lastFieldSetXY = [lastX - i, lastY + i];
                                    alreadySet = true;
                                    break;
                                }
                            }
                        } else {
                            break;
                        }
                    }
                    if (!alreadySet) {
                        for (let i: number = 1; i < this.winningPointsInRow; i++) {
                            if (lastX + i < this.sizeX && lastY - i >= 0) {
                                if (this.playArray[lastY - i][lastX + i] == this.FIELDEMPTY) {
                                    if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCLDRT)) {
                                        this.playArray[lastY - i][lastX + i] = this.FIELDUSER2;
                                        this.computerLastSet[0] = lastX + i;
                                        this.computerLastSet[1] = lastY - i;
                                        this.lastFieldSetXY = [lastX + i, lastY - i];
                                        alreadySet = true;
                                        break;
                                    }
                                }
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                case this.CMCLTRD:
                    for (let i: number = 1; i < this.winningPointsInRow; i++) {
                        if (lastY + i < this.sizeY && lastX - i >= 0) {
                            if (this.playArray[lastY + i][lastX - i] == this.FIELDEMPTY) {
                                if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCLTRD)) {
                                    this.playArray[lastY + i][lastX - i] = this.FIELDUSER2;
                                    this.computerLastSet[0] = lastX - i;
                                    this.computerLastSet[1] = lastY - i;
                                    this.lastFieldSetXY = [lastX - i, lastY + i];
                                    alreadySet = true;
                                    break;
                                }
                            }
                        } else {
                            break;
                        }
                    }
                    if (!alreadySet) {
                        for (let i: number = 1; i < this.winningPointsInRow; i++) {
                            if (lastY - i >= 0 && lastX + i < this.sizeX) {
                                if (this.playArray[lastY - i][lastX + i] == this.FIELDEMPTY) {
                                    if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCLTRD)) {
                                        this.playArray[lastY - i][lastX + i] = this.FIELDUSER2;
                                        this.computerLastSet[0] = lastX + i;
                                        this.computerLastSet[1] = lastY - i;
                                        this.lastFieldSetXY = [lastX + i, lastY - i];
                                        alreadySet = true;
                                        break;
                                    }
                                }
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
            if (!alreadySet) {
                // this.searchForPositionWithMostConnectedTTT();
                // this.setComputerTictactoe();
                let freeField: boolean = false;
                while (!freeField) {
                    this.computerLastSet[0] = this.getRandomInt(0, this.sizeX);
                    this.computerLastSet[1] = this.getRandomInt(0, this.sizeY);
                    if (this.playArray[this.computerLastSet[1]][this.computerLastSet[0]] == this.FIELDEMPTY) {
                        freeField = true;
                        this.playArray[this.computerLastSet[1]][this.computerLastSet[0]] = this.FIELDUSER2;
                        this.lastFieldSetXY = [this.computerLastSet[0], this.computerLastSet[1]];
                    }
                }
            }
        }
    }

    private searchForPositionWithMostConnectedComputerTTT(): void {
        let countMostConnected: number = -1;
        for (let y: number = 0; y < this.sizeY; y++) {
            for (let x: number = 0; x < this.sizeX; x++) {
                if (this.playArray[y][x] == this.FIELDUSER2) {
                    let inRow: number = this.checkRows(x, y);
                    let inColumn: number = this.checkColumns(x, y);
                    let inDiagonalLDRT: number = this.checkDiagonalLDRT(x, y);
                    let inDiagonalLTRD: number = this.checkDiagonalLTRD(x, y);
                    // console.log(inDiagonalLDRT);
                    // console.log(inDiagonalLTRD);
                    if (countMostConnected < inRow) {
                        if (this.enoughFreeFieldsAtPoint(x, y, this.CMCROW)) {
                            countMostConnected = inRow;
                            this.computerLastSet[0] = x;
                            this.computerLastSet[1] = y;
                            this.computerMostConnected = this.CMCROW;
                        }
                    }
                    if (countMostConnected < inColumn) {
                        if (this.enoughFreeFieldsAtPoint(x, y, this.CMCCOLUMN)) {
                            countMostConnected = inColumn;
                            this.computerLastSet[0] = x;
                            this.computerLastSet[1] = y;
                            this.computerMostConnected = this.CMCCOLUMN;
                        }
                    }
                    if (countMostConnected < inDiagonalLDRT) {
                        if (this.enoughFreeFieldsAtPoint(x, y, this.CMCLDRT)) {
                            countMostConnected = inDiagonalLDRT;
                            this.computerLastSet[0] = x;
                            this.computerLastSet[1] = y;
                            this.computerMostConnected = this.CMCLDRT;
                        }
                    }
                    if (countMostConnected < inDiagonalLTRD) {
                        if (this.enoughFreeFieldsAtPoint(x, y, this.CMCLTRD)) {
                            countMostConnected = inDiagonalLTRD;
                            this.computerLastSet[0] = x;
                            this.computerLastSet[1] = y;
                            this.computerMostConnected = this.CMCLTRD;
                        }
                    }
                }
            }
        }
        if (this.computerMostConnected == -1) {
            this.computerLastSet[0] = -1;
            this.computerLastSet[1] = -1;
            console.log("Cant find most connected");
        }
        console.log("XComputerMostConnected: " + this.computerLastSet[0]);
        console.log("YComputerMostConnected: " + this.computerLastSet[1]);
        switch (this.computerMostConnected) {
            case this.CMCROW:
                console.log("Mode Row");
                break;
            case this.CMCCOLUMN:
                console.log("Mode Column");
                break;
            case this.CMCLDRT:
                console.log("Mode LDRT");
                break;
            case this.CMCLTRD:
                console.log("Mode LTRD");
                break;
            default:
                break;
        }

    }

    private enoughFreeFieldsAtPoint(x: number, y: number, mode: number): boolean {
        let freeFields: number = 1;
        switch (mode) {
            case this.CMCROW:
                for (let i: number = 1; i < this.winningPointsInRow; i++) {
                    if (x + i < this.sizeX) {
                        if (this.isUser1Playing && this.playArray[y][x + i] == this.FIELDUSER2 ||
                            !this.isUser1Playing && this.playArray[y][x + i] == this.FIELDUSER1) {
                            break;
                        } else {
                            freeFields++;
                        }
                    } else {
                        break;
                    }
                }
                for (let i: number = 1; i < this.winningPointsInRow; i++) {
                    if (x - i >= 0) {
                        if (this.isUser1Playing && this.playArray[y][x - i] == this.FIELDUSER2 ||
                            !this.isUser1Playing && this.playArray[y][x - i] == this.FIELDUSER1) {
                            break;
                        } else {
                            freeFields++;
                        }
                    } else {
                        break;
                    }
                }
                break;
            case this.CMCCOLUMN:
                for (let i: number = 1; i < this.winningPointsInRow; i++) {
                    if (y + i < this.sizeY) {
                        if (this.isUser1Playing && this.playArray[y + i][x] == this.FIELDUSER2 ||
                            !this.isUser1Playing && this.playArray[y + i][x] == this.FIELDUSER1) {
                            break;
                        } else {
                            freeFields++;
                        }
                    } else {
                        break;
                    }
                }
                for (let i: number = 1; i < this.winningPointsInRow; i++) {
                    if (y - i >= 0) {
                        if (this.isUser1Playing && this.playArray[y - i][x] == this.FIELDUSER2 ||
                            !this.isUser1Playing && this.playArray[y - i][x] == this.FIELDUSER1) {
                            break;
                        } else {

                            freeFields++;
                        }
                    } else {
                        break;
                    }
                }
                break;
            case this.CMCLTRD:
                for (let i: number = 1; i < this.winningPointsInRow; i++) {
                    if (y + i < this.sizeY && x + i < this.sizeX) {
                        if (this.isUser1Playing && this.playArray[y + i][x + i] == this.FIELDUSER2 ||
                            !this.isUser1Playing && this.playArray[y + i][x + i] == this.FIELDUSER1) {
                            break;
                        } else {
                            freeFields++;
                        }
                    } else {
                        break;
                    }
                }
                for (let i: number = 1; i < this.winningPointsInRow; i++) {
                    if (y - i >= 0 && x - i >= 0) {
                        if (this.isUser1Playing && this.playArray[y - i][x - i] == this.FIELDUSER2 ||
                            !this.isUser1Playing && this.playArray[y - i][x - i] == this.FIELDUSER1) {
                            break;
                        } else {
                            freeFields++;
                        }
                    } else {
                        break;
                    }
                }
                break;
            case this.CMCLDRT:
                for (let i: number = 1; i < this.winningPointsInRow; i++) {
                    if (y - i >= 0 && x + i < this.sizeX)
                        if (this.isUser1Playing && this.playArray[y - i][x + i] == this.FIELDUSER2 ||
                            !this.isUser1Playing && this.playArray[y - i][x + i] == this.FIELDUSER1) {
                            break;
                        } else {
                            freeFields++;
                        }
                    else {
                        break;
                    }
                }
                for (let i: number = 1; i < this.winningPointsInRow; i++) {
                    if (y + i < this.sizeY && x - i >= 0) {
                        if (this.isUser1Playing && this.playArray[y + i][x - i] == this.FIELDUSER2 ||
                            !this.isUser1Playing && this.playArray[y + i][x - i] == this.FIELDUSER1) {
                            break;
                        } else {
                            freeFields++;
                        }
                    } else {
                        break;
                    }
                }
                break;
            default:
                break;
        }
        if (freeFields >= this.winningPointsInRow)
            return true;
        return false;
    }

    private highestYPosinColumn(x: number): number {
        let returnval: number = this.sizeY - 1;
        for (let i: number = 0; i < this.sizeY; i++) {
            if (this.playArray[i][x] != this.FIELDEMPTY) {
                returnval = i - 1;
                break;
            }
        }
        return returnval;
    }

    private setComputerInputConnectFour(): void {
        if (this.computerLastSet[0] < 0 || this.computerLastSet[1] < 0) {
            let freeField: boolean = false;
            while (!freeField) {
                this.computerLastSet[0] = this.getRandomInt(0, this.sizeX);
                if (this.highestYPosinColumn(this.computerLastSet[0]) > 0) {
                    this.computerLastSet[1] = this.highestYPosinColumn(this.computerLastSet[0]);
                    if (this.playArray[this.computerLastSet[1]][this.computerLastSet[0]] == this.FIELDEMPTY) {
                        freeField = true;
                        this.playArray[this.computerLastSet[1]][this.computerLastSet[0]] = this.FIELDUSER2;
                    }
                }
            }
        } else {
            //TODO
            let originalArray: number[][] = this.playArray;
            let countMostConnected: number = -1;
            let computerMostConnected: number = -1;
            let mostX: number = -1;
            let mostY: number = -1;
            for (let x: number = 0; x < this.sizeX; x++) {
                let y: number = this.highestYPosinColumn(x);

                if (this.playArray[y][x] == this.FIELDEMPTY) {
                    this.playArray[y][x] = this.FIELDUSER2;

                    //
                    let inRow: number = this.checkRows(x, y);
                    let inColumn: number = this.checkColumns(x, y);
                    let inDiagonalLDRT: number = this.checkDiagonalLDRT(x, y);
                    let inDiagonalLTRD: number = this.checkDiagonalLTRD(x, y);
                    // console.log(inDiagonalLDRT);
                    // console.log(inDiagonalLTRD);
                    if (countMostConnected < inRow) {
                        if (this.enoughFreeFieldsAtPoint(x, y, this.CMCROW)) {
                            countMostConnected = inRow;
                            mostX = x;
                            mostY = y;
                            computerMostConnected = this.CMCROW;
                        }
                    }
                    if (countMostConnected < inColumn) {
                        if (this.enoughFreeFieldsAtPoint(x, y, this.CMCCOLUMN)) {
                            countMostConnected = inColumn;
                            mostX = x;
                            mostY = y;
                            computerMostConnected = this.CMCROW;
                        }
                    }
                    if (countMostConnected < inDiagonalLDRT) {
                        if (this.enoughFreeFieldsAtPoint(x, y, this.CMCLDRT)) {
                            countMostConnected = inDiagonalLDRT;
                            mostX = x;
                            mostY = y;
                            computerMostConnected = this.CMCROW;
                        }
                    }
                    if (countMostConnected < inDiagonalLTRD) {
                        if (this.enoughFreeFieldsAtPoint(x, y, this.CMCLTRD)) {
                            countMostConnected = inDiagonalLTRD;
                            mostX = x;
                            mostY = y;
                            computerMostConnected = this.CMCROW;
                        }
                    }
                    this.playArray[y][x] = this.FIELDEMPTY;
                }
            }
            this.computerLastSet[0] = mostX;
            this.computerLastSet[1] = mostY;
            this.lastFieldSetXY[0] = mostX;
            this.lastFieldSetXY[1] = mostY;
            console.log("X:" + mostX);
            console.log("Y:" + mostY);
            console.log(this.highestYPosinColumn(0));
            this.playArray[mostY][mostX] = this.FIELDUSER2;
        }
    }

    private getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    private async waitAndSetUserInputConnectFour(): Promise<void> {
        console.log("Möglich ist es ab (X:1) (links) bis (X:" + this.sizeX + " (rechts)");
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
                await this.exitProgram();
            }
            if (x <= this.sizeX && x > 0) {
                x--;
                for (let y: number = this.sizeY - 1; y >= 0; y--) {
                    if (this.playArray[y][x] == this.FIELDEMPTY) {
                        this.lastFieldSetXY = [x, y];
                        if (this.isUser1Playing) {
                            this.playArray[y][x] = this.FIELDUSER1;
                            proceed = true;
                            break;
                        } else {
                            this.playArray[y][x] = this.FIELDUSER2;
                            proceed = true;
                            break;
                        }
                    }
                }
                if (!proceed) {
                    console.log("Spalte: " + (x + 1) + " ist voll, bitte erneut eingeben");
                }
            } else {
                console.log("X:" + x + ", Eingegebenes Feld befindet sich außerhalb des Spielfeldes, bitte erneut eingeben");
            }
        }
    }

    private async waitAndSetUserInputTictactoe(): Promise<void> {
        console.log("Möglich ist es ab (1,1) (oben links) bis (X:" + this.sizeX + ",Y:" + this.sizeY + ") (unten rechts)");
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
                await this.exitProgram();
            }

            if (x <= this.sizeX && y <= this.sizeY && x > 0 && y > 0) {
                x--;
                y--;
                if (this.playArray[y][x] == this.FIELDEMPTY) {
                    this.lastFieldSetXY = [x, y];
                    if (this.isUser1Playing) {
                        this.playArray[y][x] = this.FIELDUSER1;
                        proceed = true;
                    } else {
                        this.playArray[y][x] = this.FIELDUSER2;
                        proceed = true;
                    }
                } else {
                    console.log("Eingegebenes Feld ist nicht leer, bitte neue leere Positionen eingeben");
                }
            } else {
                console.log("X:" + x + ", Y:" + y);
                console.log("Eingegebenes Feld befindet sich außerhalb des Spielfeldes, bitte erneut eingeben");
            }
        }
    }

    private async getGameMode(): Promise<void> {
        let proceed: boolean = false;
        while (!proceed) {
            let response: prompts.Answers<string> = await prompts.prompt({
                type: "select",
                name: "answer",
                message: "Spielmodus wählen:",
                choices: [
                    { title: "TicTacToe", value: this.GAMEMODETICTACTOE },
                    { title: "ConnectFour", value: this.GAMEMODECONNECTFOUR },
                    { title: "Programm beenden", value: 2 }
                ]
            });
            switch (response.answer) {
                case this.GAMEMODETICTACTOE:
                    this.gameMode = this.GAMEMODETICTACTOE;
                    proceed = true;
                    break;
                case this.GAMEMODECONNECTFOUR:
                    this.gameMode = this.GAMEMODECONNECTFOUR;
                    proceed = true;
                    break;
                case 2:
                    proceed = true;
                    this.exitProgram();
                    break;
                default:
                    console.log("Wrong Type, try again");
                    break;
            }
        }
    }

    private async playAgainstWho(): Promise<void> {
        let proceed: boolean = false;
        while (!proceed) {
            let response: prompts.Answers<string> = await prompts.prompt({
                type: "select",
                name: "answer",
                message: "Wie möchtest du spielen?",
                choices: [
                    { title: "Mit dem Computer", value: 0 },
                    { title: "Mit jemand anderem", value: 1 },
                    { title: "Programm beenden", value: 2 }
                ]
            });
            switch (response.answer) {
                case 0:
                    this.playAgainstComputer = true;
                    proceed = true;
                    break;
                case 1:
                    this.playAgainstComputer = false;
                    proceed = true;
                    break;
                case 2:
                    proceed = true;
                    this.exitProgram();
                    break;
                default:
                    console.log("Wrong Type, try again");
                    break;
            }
        }
    }

    private async howToPlay(message: string): Promise<User | undefined> {
        let proceed: boolean = false;
        while (!proceed) {
            let response: prompts.Answers<string> = await prompts.prompt({
                type: "select",
                name: "answer",
                message: message,
                choices: [
                    { title: "Anmelden", value: 0 },
                    { title: "Anonym spielen", value: 1 },
                    { title: "Registrieren", value: 2 },
                    { title: "Programm beenden", value: 3 }
                ]
            });
            switch (response.answer) {
                case 0:
                    //Anmelden
                    if (await database.connect()) {
                        let user: User | null = await this.regManager.login();
                        if (user) {
                            proceed = true;
                            console.log("Login successfull: ", proceed);
                            return user;
                        }
                    } else {
                        console.log("No connection to DB");
                        this.exitProgram();
                    }
                    break;
                case 1:
                    //Anonym Spielen
                    let user: User = this.regManager.registerAnonymousUser();
                    proceed = true;
                    return user;
                case 2:
                    //Registrieren
                    if (await database.connect()) {
                        let user: User | null = await this.regManager.register();
                        if (user) {
                            proceed = true;
                            console.log("Registration successfull: ", proceed);
                            return user;
                        }
                    } else {
                        console.log("No connection to DB");
                        this.exitProgram();
                    }
                    break;
                case 3:
                    proceed = true;
                    this.exitProgram();
                    break;
                default:
                    console.log("Wrong Type, try again");
                    break;
            }
        }
    }

    private async createPlayground(): Promise<void> {
        let proceed: boolean = false;

        while (!proceed) {
            let response: prompts.Answers<string> = await prompts.prompt({
                type: "number",
                name: "size",
                message: "Größe des Spielfeldes in X?"
            });
            this.sizeX = response.size;
            if (this.sizeX == undefined) {
                console.log("SizeX: " + this.sizeX);
                await this.exitProgram();
            }
            response = await prompts.prompt({
                type: "number",
                name: "size",
                message: "Größe des Spielfeldes in Y?"
            });
            this.sizeY = response.size;
            if (this.sizeY == undefined) {
                console.log("SizeY: " + this.sizeY);
                await this.exitProgram();
            }
            if (this.sizeX >= 3 && this.sizeY >= 3 && this.sizeX <= 15 && this.sizeY <= 15) {
                proceed = true;
            } else {
                console.log("Spielfeld muss mindestens 3x3 und höchstens 15x15 groß sein!\nBitte nochmal eingeben");
            }
        }
        proceed = false;
        while (!proceed) {
            let response: prompts.Answers<string> = await prompts.prompt({
                type: "number",
                name: "winningPoints",
                message: "Wie viele Elemente in Reihe für den Sieg?"
            });
            this.winningPointsInRow = response.winningPoints;
            if (this.winningPointsInRow == undefined) {
                console.log("winningPointsInRow: " + this.winningPointsInRow);
                await this.exitProgram();
            }
            if (this.winningPointsInRow <= this.sizeX && this.winningPointsInRow <= this.sizeY && this.winningPointsInRow > 1) {
                proceed = true;
            } else {
                console.log("Siegpunkte müssen kleiner als kürzeste Spielfeldseite und mindestens 2 sein!\nBitte nochmal eingeben");
            }
        }
        for (let y: number = 0; y < this.sizeY; y++) {
            this.playArray[y] = [];
            for (let x: number = 0; x < this.sizeX; x++) {
                this.playArray[y][x] = this.FIELDEMPTY;
            }
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
