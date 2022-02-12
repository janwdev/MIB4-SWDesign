import { control } from "../index";

export class Computer {

    //TODO evtl wenn punkte +1 kleiner winningpoints && beide nächsten felder in reihe frei random 0 oder 1 zum aufaddieren (Lücke lassen)

    /**Where was computers last set */
    private computerLastSet: number[] = [-1, -1];
    /** Directions where most connected Key */
    private CMCROW: number = 0;
    private CMCCOLUMN: number = 1;
    private CMCLDRT: number = 2;
    private CMCLTRD: number = 3;

    /** Direction where most connected */
    private direction: number = -1;

    /**
     * Computer set automatic at field in game mode tictactoe
     */
    public setComputerTictactoe(): void {
        this.searchForPositionWithMostConnectedComputerTTT();
        if (this.computerLastSet[0] < 0 || this.computerLastSet[1] < 0) {
            // if Computer havent set already or in direction are not enought free fields
            // set random on free field
            let freeField: boolean = false;
            while (!freeField) {
                this.computerLastSet[0] = control.getRandomInt(0, control.sizeX);
                this.computerLastSet[1] = control.getRandomInt(0, control.sizeY);
                if (control.playArray[this.computerLastSet[1]][this.computerLastSet[0]] == control.FIELDEMPTY) {
                    freeField = true;
                    control.playArray[this.computerLastSet[1]][this.computerLastSet[0]] = control.FIELDUSER2;
                }
            }
        } else {
            // set on free field in right direction near field where most connected
            let lastX: number = this.computerLastSet[0];
            let lastY: number = this.computerLastSet[1];
            let alreadySet: boolean = false;
            switch (this.direction) {
                case this.CMCCOLUMN:
                    for (let i: number = 1; i < control.winningPointsInRow; i++) {
                        if (lastY + i < control.sizeY) {
                            if (control.playArray[lastY + i][lastX] == control.FIELDEMPTY) {
                                if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCCOLUMN)) {
                                    control.playArray[lastY + i][lastX] = control.FIELDUSER2;
                                    this.computerLastSet[1] = lastY + i;
                                    control.lastFieldSetXY = [lastX, lastY + i];
                                    alreadySet = true;
                                    break;
                                }
                            } else if (control.playArray[lastY + i][lastX] == control.FIELDUSER1) {
                                break;
                            }
                        } else {
                            break;
                        }
                    }

                    if (!alreadySet) {
                        for (let i: number = 1; i < control.winningPointsInRow; i++) {
                            if (lastY - i >= 0) {
                                if (control.playArray[lastY - i][lastX] == control.FIELDEMPTY) {
                                    if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCCOLUMN)) {
                                        control.playArray[lastY - i][lastX] = control.FIELDUSER2;
                                        this.computerLastSet[1] = lastY - i;
                                        control.lastFieldSetXY = [lastX, lastY - i];
                                        alreadySet = true;
                                        break;
                                    }
                                } else if (control.playArray[lastY - i][lastX] == control.FIELDUSER1) {
                                    break;
                                }
                            } else {
                                break;
                            }
                        }
                    }
                case this.CMCROW:
                    for (let i: number = 1; i < control.winningPointsInRow; i++) {
                        if (lastX + i < control.sizeX) {
                            if (control.playArray[lastY][lastX + i] == control.FIELDEMPTY) {
                                if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCROW)) {
                                    control.playArray[lastY][lastX + i] = control.FIELDUSER2;
                                    this.computerLastSet[0] = lastX + i;
                                    control.lastFieldSetXY = [lastX + i, lastY];
                                    alreadySet = true;
                                    break;
                                }
                            } else if (control.playArray[lastY][lastX + i] == control.FIELDUSER1) {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    if (!alreadySet) {
                        for (let i: number = 1; i < control.winningPointsInRow; i++) {
                            if (lastX - i >= 0) {
                                if (control.playArray[lastY][lastX - i] == control.FIELDEMPTY) {
                                    if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCROW)) {
                                        control.playArray[lastY][lastX - i] = control.FIELDUSER2;
                                        this.computerLastSet[0] = lastX - i;
                                        control.lastFieldSetXY = [lastX - i, lastY];
                                        alreadySet = true;
                                        break;
                                    }
                                } else if (control.playArray[lastY][lastX - i] == control.FIELDUSER1) {
                                    break;
                                }
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                case this.CMCLDRT:
                    for (let i: number = 1; i < control.winningPointsInRow; i++) {
                        if (lastX - i >= 0 && lastY + i < control.sizeY) {
                            if (control.playArray[lastY + i][lastX - i] == control.FIELDEMPTY) {
                                if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCLDRT)) {
                                    control.playArray[lastY + i][lastX - i] = control.FIELDUSER2;
                                    this.computerLastSet[0] = lastX - i;
                                    this.computerLastSet[1] = lastY + i;
                                    control.lastFieldSetXY = [lastX - i, lastY + i];
                                    alreadySet = true;
                                    break;
                                }
                            } else if (control.playArray[lastY + i][lastX - i] == control.FIELDUSER1) {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    if (!alreadySet) {
                        for (let i: number = 1; i < control.winningPointsInRow; i++) {
                            if (lastX + i < control.sizeX && lastY - i >= 0) {
                                if (control.playArray[lastY - i][lastX + i] == control.FIELDEMPTY) {
                                    if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCLDRT)) {
                                        control.playArray[lastY - i][lastX + i] = control.FIELDUSER2;
                                        this.computerLastSet[0] = lastX + i;
                                        this.computerLastSet[1] = lastY - i;
                                        control.lastFieldSetXY = [lastX + i, lastY - i];
                                        alreadySet = true;
                                        break;
                                    }
                                } else if (control.playArray[lastY - i][lastX + i] == control.FIELDUSER1) {
                                    break;
                                }
                            } else {
                                break;
                            }
                        }
                    }
                    break;
                case this.CMCLTRD:
                    for (let i: number = 1; i < control.winningPointsInRow; i++) {
                        if (lastY + i < control.sizeY && lastX - i >= 0) {
                            if (control.playArray[lastY + i][lastX - i] == control.FIELDEMPTY) {
                                if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCLTRD)) {
                                    control.playArray[lastY + i][lastX - i] = control.FIELDUSER2;
                                    this.computerLastSet[0] = lastX - i;
                                    this.computerLastSet[1] = lastY - i;
                                    control.lastFieldSetXY = [lastX - i, lastY + i];
                                    alreadySet = true;
                                    break;
                                }
                            } else if (control.playArray[lastY + i][lastX - i] == control.FIELDEMPTY) {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    if (!alreadySet) {
                        for (let i: number = 1; i < control.winningPointsInRow; i++) {
                            if (lastY - i >= 0 && lastX + i < control.sizeX) {
                                if (control.playArray[lastY - i][lastX + i] == control.FIELDEMPTY) {
                                    if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCLTRD)) {
                                        control.playArray[lastY - i][lastX + i] = control.FIELDUSER2;
                                        this.computerLastSet[0] = lastX + i;
                                        this.computerLastSet[1] = lastY - i;
                                        control.lastFieldSetXY = [lastX + i, lastY - i];
                                        alreadySet = true;
                                        break;
                                    }
                                } else if (control.playArray[lastY - i][lastX + i] == control.FIELDEMPTY) {
                                    break;
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
                let freeField: boolean = false;
                while (!freeField) {
                    this.computerLastSet[0] = control.getRandomInt(0, control.sizeX);
                    this.computerLastSet[1] = control.getRandomInt(0, control.sizeY);
                    if (control.playArray[this.computerLastSet[1]][this.computerLastSet[0]] == control.FIELDEMPTY) {
                        freeField = true;
                        control.playArray[this.computerLastSet[1]][this.computerLastSet[0]] = control.FIELDUSER2;
                        control.lastFieldSetXY = [this.computerLastSet[0], this.computerLastSet[1]];
                    }
                }
            }
        }
    }

    /**
     * Search for Position in game board where the computer has most connected fields and enough free fields to win
     */
    public searchForPositionWithMostConnectedComputerTTT(): void {
        let countMostConnected: number = -1;
        for (let y: number = 0; y < control.sizeY; y++) {
            for (let x: number = 0; x < control.sizeX; x++) {
                if (control.playArray[y][x] == control.FIELDUSER2) {
                    let inRow: number = control.checkRows(x, y);
                    let inColumn: number = control.checkColumns(x, y);
                    let inDiagonalLDRT: number = control.checkDiagonalLDRT(x, y);
                    let inDiagonalLTRD: number = control.checkDiagonalLTRD(x, y);
                    if (countMostConnected < inRow) {
                        if (this.enoughFreeFieldsAtPoint(x, y, this.CMCROW)) {
                            countMostConnected = inRow;
                            this.computerLastSet[0] = x;
                            this.computerLastSet[1] = y;
                            this.direction = this.CMCROW;
                        }
                    }
                    if (countMostConnected < inColumn) {
                        if (this.enoughFreeFieldsAtPoint(x, y, this.CMCCOLUMN)) {
                            countMostConnected = inColumn;
                            this.computerLastSet[0] = x;
                            this.computerLastSet[1] = y;
                            this.direction = this.CMCCOLUMN;
                        }
                    }
                    if (countMostConnected < inDiagonalLDRT) {
                        if (this.enoughFreeFieldsAtPoint(x, y, this.CMCLDRT)) {
                            countMostConnected = inDiagonalLDRT;
                            this.computerLastSet[0] = x;
                            this.computerLastSet[1] = y;
                            this.direction = this.CMCLDRT;
                        }
                    }
                    if (countMostConnected < inDiagonalLTRD) {
                        if (this.enoughFreeFieldsAtPoint(x, y, this.CMCLTRD)) {
                            countMostConnected = inDiagonalLTRD;
                            this.computerLastSet[0] = x;
                            this.computerLastSet[1] = y;
                            this.direction = this.CMCLTRD;
                        }
                    }
                }
            }
        }
        if (this.direction == -1) {
            this.computerLastSet[0] = -1;
            this.computerLastSet[1] = -1;
            console.log("Cant find most connected");
        }
        // console.log("XComputerMostConnected: " + this.computerLastSet[0]);
        // console.log("YComputerMostConnected: " + this.computerLastSet[1]);
        // switch (this.direction) {
        //     case this.CMCROW:
        //         console.log("Mode Row");
        //         break;
        //     case this.CMCCOLUMN:
        //         console.log("Mode Column");
        //         break;
        //     case this.CMCLDRT:
        //         console.log("Mode LDRT");
        //         break;
        //     case this.CMCLTRD:
        //         console.log("Mode LTRD");
        //         break;
        //     default:
        //         break;
        // }

    }

    /**
     * Computer set automatic at field in game mode connectfour
     */
    public setComputerInputConnectFour(): void {
        if (this.computerLastSet[0] < 0 || this.computerLastSet[1] < 0) {
            // if Computer havent set already or in direction are not enought free fields
            // set random on free field
            let freeField: boolean = false;
            while (!freeField) {
                this.computerLastSet[0] = control.getRandomInt(0, control.sizeX);
                if (this.highestYPosinColumn(this.computerLastSet[0]) >= 0) {
                    this.computerLastSet[1] = this.highestYPosinColumn(this.computerLastSet[0]);
                    if (control.playArray[this.computerLastSet[1]][this.computerLastSet[0]] == control.FIELDEMPTY) {
                        freeField = true;
                        control.playArray[this.computerLastSet[1]][this.computerLastSet[0]] = control.FIELDUSER2;
                    }
                }
            }
        } else {
            // set on free field in right direction near field where most connected if possible
            let countMostConnected: number = -1;
            let direction: number = -1;
            let mostX: number = -1;
            let mostY: number = -1;
            for (let x: number = 0; x < control.sizeX; x++) {
                let y: number = this.highestYPosinColumn(x);
                if (y >= 0) {
                    if (control.playArray[y][x] == control.FIELDEMPTY) {
                        control.playArray[y][x] = control.FIELDUSER2;

                        let inRow: number = control.checkRows(x, y);
                        let inColumn: number = control.checkColumns(x, y);
                        let inDiagonalLDRT: number = control.checkDiagonalLDRT(x, y);
                        let inDiagonalLTRD: number = control.checkDiagonalLTRD(x, y);
                        if (countMostConnected < inRow) {
                            if (this.enoughFreeFieldsAtPoint(x, y, this.CMCROW)) {
                                countMostConnected = inRow;
                                mostX = x;
                                mostY = y;
                                direction = this.CMCROW;
                            }
                        }
                        if (countMostConnected < inColumn) {
                            if (this.enoughFreeFieldsAtPoint(x, y, this.CMCCOLUMN)) {
                                countMostConnected = inColumn;
                                mostX = x;
                                mostY = y;
                                direction = this.CMCROW;
                            }
                        }
                        if (countMostConnected < inDiagonalLDRT) {
                            if (this.enoughFreeFieldsAtPoint(x, y, this.CMCLDRT)) {
                                countMostConnected = inDiagonalLDRT;
                                mostX = x;
                                mostY = y;
                                direction = this.CMCROW;
                            }
                        }
                        if (countMostConnected < inDiagonalLTRD) {
                            if (this.enoughFreeFieldsAtPoint(x, y, this.CMCLTRD)) {
                                countMostConnected = inDiagonalLTRD;
                                mostX = x;
                                mostY = y;
                                direction = this.CMCROW;
                            }
                        }

                        control.playArray[y][x] = control.FIELDEMPTY;
                    }
                }
            }
            this.computerLastSet[0] = mostX;
            this.computerLastSet[1] = mostY;

            if (mostX >= 0 && mostY >= 0) {
                control.lastFieldSetXY[0] = mostX;
                control.lastFieldSetXY[1] = mostY;
                // console.log("X:" + mostX);
                // console.log("Y:" + mostY);
                control.playArray[mostY][mostX] = control.FIELDUSER2;
            } else {
                return this.setComputerInputConnectFour();
            }
        }
    }

    /**
     * Checks if there are enough free fields in given direction
     * @param x X-Position
     * @param y Y-Position
     * @param mode Mode where to search (Row, comlumn, ...)
     * @returns true if enough free fields in given direction
     */
    private enoughFreeFieldsAtPoint(x: number, y: number, mode: number): boolean {
        let freeFields: number = 1;
        switch (mode) {
            case this.CMCROW:
                for (let i: number = 1; i < control.winningPointsInRow; i++) {
                    if (x + i < control.sizeX) {
                        if (control.isUser1Playing && control.playArray[y][x + i] == control.FIELDUSER2 ||
                            !control.isUser1Playing && control.playArray[y][x + i] == control.FIELDUSER1) {
                            break;
                        } else {
                            freeFields++;
                        }
                    } else {
                        break;
                    }
                }
                for (let i: number = 1; i < control.winningPointsInRow; i++) {
                    if (x - i >= 0) {
                        if (control.isUser1Playing && control.playArray[y][x - i] == control.FIELDUSER2 ||
                            !control.isUser1Playing && control.playArray[y][x - i] == control.FIELDUSER1) {
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
                for (let i: number = 1; i < control.winningPointsInRow; i++) {
                    if (y + i < control.sizeY) {
                        if (control.isUser1Playing && control.playArray[y + i][x] == control.FIELDUSER2 ||
                            !control.isUser1Playing && control.playArray[y + i][x] == control.FIELDUSER1) {
                            break;
                        } else {
                            freeFields++;
                        }
                    } else {
                        break;
                    }
                }
                for (let i: number = 1; i < control.winningPointsInRow; i++) {
                    if (y - i >= 0) {
                        if (control.isUser1Playing && control.playArray[y - i][x] == control.FIELDUSER2 ||
                            !control.isUser1Playing && control.playArray[y - i][x] == control.FIELDUSER1) {
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
                for (let i: number = 1; i < control.winningPointsInRow; i++) {
                    if (y + i < control.sizeY && x + i < control.sizeX) {
                        if (control.isUser1Playing && control.playArray[y + i][x + i] == control.FIELDUSER2 ||
                            !control.isUser1Playing && control.playArray[y + i][x + i] == control.FIELDUSER1) {
                            break;
                        } else {
                            freeFields++;
                        }
                    } else {
                        break;
                    }
                }
                for (let i: number = 1; i < control.winningPointsInRow; i++) {
                    if (y - i >= 0 && x - i >= 0) {
                        if (control.isUser1Playing && control.playArray[y - i][x - i] == control.FIELDUSER2 ||
                            !control.isUser1Playing && control.playArray[y - i][x - i] == control.FIELDUSER1) {
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
                for (let i: number = 1; i < control.winningPointsInRow; i++) {
                    if (y - i >= 0 && x + i < control.sizeX)
                        if (control.isUser1Playing && control.playArray[y - i][x + i] == control.FIELDUSER2 ||
                            !control.isUser1Playing && control.playArray[y - i][x + i] == control.FIELDUSER1) {
                            break;
                        } else {
                            freeFields++;
                        }
                    else {
                        break;
                    }
                }
                for (let i: number = 1; i < control.winningPointsInRow; i++) {
                    if (y + i < control.sizeY && x - i >= 0) {
                        if (control.isUser1Playing && control.playArray[y + i][x - i] == control.FIELDUSER2 ||
                            !control.isUser1Playing && control.playArray[y + i][x - i] == control.FIELDUSER1) {
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
        if (freeFields >= control.winningPointsInRow)
            return true;
        return false;
    }

    /**
     * Search for Y Position where you can set for given X-Direction in connectfour mode
     * @param x X-Position
     * @returns Y-Position where you can set
     */
    private highestYPosinColumn(x: number): number {
        let returnval: number = control.sizeY - 1;
        for (let i: number = 0; i < control.sizeY; i++) {
            if (control.playArray[i][x] != control.FIELDEMPTY) {
                returnval = i - 1;
                break;
            }
        }
        return returnval;
    }

}