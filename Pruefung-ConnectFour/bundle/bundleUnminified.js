/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 752:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Computer = void 0;
const index_1 = __webpack_require__(607);
class Computer {
    constructor() {
        //TODO evtl wenn punkte +1 kleiner winningpoints && beide nächsten felder in reihe frei random 0 oder 1 zum aufaddieren (Lücke lassen)
        /**Where was computers last set */
        this.computerLastSet = [-1, -1];
        /** Directions where most connected Key */
        this.CMCROW = 0;
        this.CMCCOLUMN = 1;
        this.CMCLDRT = 2;
        this.CMCLTRD = 3;
        /** Direction where most connected */
        this.direction = -1;
    }
    /**
     * Computer set automatic at field in game mode tictactoe
     */
    setComputerTictactoe() {
        this.searchForPositionWithMostConnectedComputerTTT();
        if (this.computerLastSet[0] < 0 || this.computerLastSet[1] < 0) {
            // if Computer havent set already or in direction are not enought free fields
            // set random on free field
            let freeField = false;
            while (!freeField) {
                this.computerLastSet[0] = index_1.control.getRandomInt(0, index_1.control.sizeX);
                this.computerLastSet[1] = index_1.control.getRandomInt(0, index_1.control.sizeY);
                if (index_1.control.playArray[this.computerLastSet[1]][this.computerLastSet[0]] == index_1.control.FIELDEMPTY) {
                    freeField = true;
                    index_1.control.playArray[this.computerLastSet[1]][this.computerLastSet[0]] = index_1.control.FIELDUSER2;
                }
            }
        }
        else {
            // set on free field in right direction near field where most connected
            let lastX = this.computerLastSet[0];
            let lastY = this.computerLastSet[1];
            let alreadySet = false;
            switch (this.direction) {
                case this.CMCCOLUMN:
                    for (let i = 1; i < index_1.control.winningPointsInRow; i++) {
                        if (lastY + i < index_1.control.sizeY) {
                            if (index_1.control.playArray[lastY + i][lastX] == index_1.control.FIELDEMPTY) {
                                if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCCOLUMN)) {
                                    index_1.control.playArray[lastY + i][lastX] = index_1.control.FIELDUSER2;
                                    this.computerLastSet[1] = lastY + i;
                                    index_1.control.lastFieldSetXY = [lastX, lastY + i];
                                    alreadySet = true;
                                    break;
                                }
                            }
                            else if (index_1.control.playArray[lastY + i][lastX] == index_1.control.FIELDUSER1) {
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    if (!alreadySet) {
                        for (let i = 1; i < index_1.control.winningPointsInRow; i++) {
                            if (lastY - i >= 0) {
                                if (index_1.control.playArray[lastY - i][lastX] == index_1.control.FIELDEMPTY) {
                                    if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCCOLUMN)) {
                                        index_1.control.playArray[lastY - i][lastX] = index_1.control.FIELDUSER2;
                                        this.computerLastSet[1] = lastY - i;
                                        index_1.control.lastFieldSetXY = [lastX, lastY - i];
                                        alreadySet = true;
                                        break;
                                    }
                                }
                                else if (index_1.control.playArray[lastY - i][lastX] == index_1.control.FIELDUSER1) {
                                    break;
                                }
                            }
                            else {
                                break;
                            }
                        }
                    }
                case this.CMCROW:
                    for (let i = 1; i < index_1.control.winningPointsInRow; i++) {
                        if (lastX + i < index_1.control.sizeX) {
                            if (index_1.control.playArray[lastY][lastX + i] == index_1.control.FIELDEMPTY) {
                                if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCROW)) {
                                    index_1.control.playArray[lastY][lastX + i] = index_1.control.FIELDUSER2;
                                    this.computerLastSet[0] = lastX + i;
                                    index_1.control.lastFieldSetXY = [lastX + i, lastY];
                                    alreadySet = true;
                                    break;
                                }
                            }
                            else if (index_1.control.playArray[lastY][lastX + i] == index_1.control.FIELDUSER1) {
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    if (!alreadySet) {
                        for (let i = 1; i < index_1.control.winningPointsInRow; i++) {
                            if (lastX - i >= 0) {
                                if (index_1.control.playArray[lastY][lastX - i] == index_1.control.FIELDEMPTY) {
                                    if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCROW)) {
                                        index_1.control.playArray[lastY][lastX - i] = index_1.control.FIELDUSER2;
                                        this.computerLastSet[0] = lastX - i;
                                        index_1.control.lastFieldSetXY = [lastX - i, lastY];
                                        alreadySet = true;
                                        break;
                                    }
                                }
                                else if (index_1.control.playArray[lastY][lastX - i] == index_1.control.FIELDUSER1) {
                                    break;
                                }
                            }
                            else {
                                break;
                            }
                        }
                    }
                    break;
                case this.CMCLDRT:
                    for (let i = 1; i < index_1.control.winningPointsInRow; i++) {
                        if (lastX - i >= 0 && lastY + i < index_1.control.sizeY) {
                            if (index_1.control.playArray[lastY + i][lastX - i] == index_1.control.FIELDEMPTY) {
                                if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCLDRT)) {
                                    index_1.control.playArray[lastY + i][lastX - i] = index_1.control.FIELDUSER2;
                                    this.computerLastSet[0] = lastX - i;
                                    this.computerLastSet[1] = lastY + i;
                                    index_1.control.lastFieldSetXY = [lastX - i, lastY + i];
                                    alreadySet = true;
                                    break;
                                }
                            }
                            else if (index_1.control.playArray[lastY + i][lastX - i] == index_1.control.FIELDUSER1) {
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    if (!alreadySet) {
                        for (let i = 1; i < index_1.control.winningPointsInRow; i++) {
                            if (lastX + i < index_1.control.sizeX && lastY - i >= 0) {
                                if (index_1.control.playArray[lastY - i][lastX + i] == index_1.control.FIELDEMPTY) {
                                    if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCLDRT)) {
                                        index_1.control.playArray[lastY - i][lastX + i] = index_1.control.FIELDUSER2;
                                        this.computerLastSet[0] = lastX + i;
                                        this.computerLastSet[1] = lastY - i;
                                        index_1.control.lastFieldSetXY = [lastX + i, lastY - i];
                                        alreadySet = true;
                                        break;
                                    }
                                }
                                else if (index_1.control.playArray[lastY - i][lastX + i] == index_1.control.FIELDUSER1) {
                                    break;
                                }
                            }
                            else {
                                break;
                            }
                        }
                    }
                    break;
                case this.CMCLTRD:
                    for (let i = 1; i < index_1.control.winningPointsInRow; i++) {
                        if (lastY + i < index_1.control.sizeY && lastX - i >= 0) {
                            if (index_1.control.playArray[lastY + i][lastX - i] == index_1.control.FIELDEMPTY) {
                                if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCLTRD)) {
                                    index_1.control.playArray[lastY + i][lastX - i] = index_1.control.FIELDUSER2;
                                    this.computerLastSet[0] = lastX - i;
                                    this.computerLastSet[1] = lastY - i;
                                    index_1.control.lastFieldSetXY = [lastX - i, lastY + i];
                                    alreadySet = true;
                                    break;
                                }
                            }
                            else if (index_1.control.playArray[lastY + i][lastX - i] == index_1.control.FIELDEMPTY) {
                                break;
                            }
                        }
                        else {
                            break;
                        }
                    }
                    if (!alreadySet) {
                        for (let i = 1; i < index_1.control.winningPointsInRow; i++) {
                            if (lastY - i >= 0 && lastX + i < index_1.control.sizeX) {
                                if (index_1.control.playArray[lastY - i][lastX + i] == index_1.control.FIELDEMPTY) {
                                    if (this.enoughFreeFieldsAtPoint(lastX, lastY, this.CMCLTRD)) {
                                        index_1.control.playArray[lastY - i][lastX + i] = index_1.control.FIELDUSER2;
                                        this.computerLastSet[0] = lastX + i;
                                        this.computerLastSet[1] = lastY - i;
                                        index_1.control.lastFieldSetXY = [lastX + i, lastY - i];
                                        alreadySet = true;
                                        break;
                                    }
                                }
                                else if (index_1.control.playArray[lastY - i][lastX + i] == index_1.control.FIELDEMPTY) {
                                    break;
                                }
                            }
                            else {
                                break;
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
            if (!alreadySet) {
                let freeField = false;
                while (!freeField) {
                    this.computerLastSet[0] = index_1.control.getRandomInt(0, index_1.control.sizeX);
                    this.computerLastSet[1] = index_1.control.getRandomInt(0, index_1.control.sizeY);
                    if (index_1.control.playArray[this.computerLastSet[1]][this.computerLastSet[0]] == index_1.control.FIELDEMPTY) {
                        freeField = true;
                        index_1.control.playArray[this.computerLastSet[1]][this.computerLastSet[0]] = index_1.control.FIELDUSER2;
                        index_1.control.lastFieldSetXY = [this.computerLastSet[0], this.computerLastSet[1]];
                    }
                }
            }
        }
    }
    /**
     * Search for Position in game board where the computer has most connected fields and enough free fields to win
     */
    searchForPositionWithMostConnectedComputerTTT() {
        let countMostConnected = -1;
        for (let y = 0; y < index_1.control.sizeY; y++) {
            for (let x = 0; x < index_1.control.sizeX; x++) {
                if (index_1.control.playArray[y][x] == index_1.control.FIELDUSER2) {
                    let inRow = index_1.control.checkRows(x, y);
                    let inColumn = index_1.control.checkColumns(x, y);
                    let inDiagonalLDRT = index_1.control.checkDiagonalLDRT(x, y);
                    let inDiagonalLTRD = index_1.control.checkDiagonalLTRD(x, y);
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
    setComputerInputConnectFour() {
        if (this.computerLastSet[0] < 0 || this.computerLastSet[1] < 0) {
            // if Computer havent set already or in direction are not enought free fields
            // set random on free field
            let freeField = false;
            while (!freeField) {
                this.computerLastSet[0] = index_1.control.getRandomInt(0, index_1.control.sizeX);
                if (this.highestYPosinColumn(this.computerLastSet[0]) >= 0) {
                    this.computerLastSet[1] = this.highestYPosinColumn(this.computerLastSet[0]);
                    if (index_1.control.playArray[this.computerLastSet[1]][this.computerLastSet[0]] == index_1.control.FIELDEMPTY) {
                        freeField = true;
                        index_1.control.playArray[this.computerLastSet[1]][this.computerLastSet[0]] = index_1.control.FIELDUSER2;
                    }
                }
            }
        }
        else {
            // set on free field in right direction near field where most connected if possible
            let countMostConnected = -1;
            let direction = -1;
            let mostX = -1;
            let mostY = -1;
            for (let x = 0; x < index_1.control.sizeX; x++) {
                let y = this.highestYPosinColumn(x);
                if (y >= 0) {
                    if (index_1.control.playArray[y][x] == index_1.control.FIELDEMPTY) {
                        index_1.control.playArray[y][x] = index_1.control.FIELDUSER2;
                        let inRow = index_1.control.checkRows(x, y);
                        let inColumn = index_1.control.checkColumns(x, y);
                        let inDiagonalLDRT = index_1.control.checkDiagonalLDRT(x, y);
                        let inDiagonalLTRD = index_1.control.checkDiagonalLTRD(x, y);
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
                        index_1.control.playArray[y][x] = index_1.control.FIELDEMPTY;
                    }
                }
            }
            this.computerLastSet[0] = mostX;
            this.computerLastSet[1] = mostY;
            if (mostX >= 0 && mostY >= 0) {
                index_1.control.lastFieldSetXY[0] = mostX;
                index_1.control.lastFieldSetXY[1] = mostY;
                // console.log("X:" + mostX);
                // console.log("Y:" + mostY);
                index_1.control.playArray[mostY][mostX] = index_1.control.FIELDUSER2;
            }
            else {
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
    enoughFreeFieldsAtPoint(x, y, mode) {
        let freeFields = 1;
        switch (mode) {
            case this.CMCROW:
                for (let i = 1; i < index_1.control.winningPointsInRow; i++) {
                    if (x + i < index_1.control.sizeX) {
                        if (index_1.control.isUser1Playing && index_1.control.playArray[y][x + i] == index_1.control.FIELDUSER2 ||
                            !index_1.control.isUser1Playing && index_1.control.playArray[y][x + i] == index_1.control.FIELDUSER1) {
                            break;
                        }
                        else {
                            freeFields++;
                        }
                    }
                    else {
                        break;
                    }
                }
                for (let i = 1; i < index_1.control.winningPointsInRow; i++) {
                    if (x - i >= 0) {
                        if (index_1.control.isUser1Playing && index_1.control.playArray[y][x - i] == index_1.control.FIELDUSER2 ||
                            !index_1.control.isUser1Playing && index_1.control.playArray[y][x - i] == index_1.control.FIELDUSER1) {
                            break;
                        }
                        else {
                            freeFields++;
                        }
                    }
                    else {
                        break;
                    }
                }
                break;
            case this.CMCCOLUMN:
                for (let i = 1; i < index_1.control.winningPointsInRow; i++) {
                    if (y + i < index_1.control.sizeY) {
                        if (index_1.control.isUser1Playing && index_1.control.playArray[y + i][x] == index_1.control.FIELDUSER2 ||
                            !index_1.control.isUser1Playing && index_1.control.playArray[y + i][x] == index_1.control.FIELDUSER1) {
                            break;
                        }
                        else {
                            freeFields++;
                        }
                    }
                    else {
                        break;
                    }
                }
                for (let i = 1; i < index_1.control.winningPointsInRow; i++) {
                    if (y - i >= 0) {
                        if (index_1.control.isUser1Playing && index_1.control.playArray[y - i][x] == index_1.control.FIELDUSER2 ||
                            !index_1.control.isUser1Playing && index_1.control.playArray[y - i][x] == index_1.control.FIELDUSER1) {
                            break;
                        }
                        else {
                            freeFields++;
                        }
                    }
                    else {
                        break;
                    }
                }
                break;
            case this.CMCLTRD:
                for (let i = 1; i < index_1.control.winningPointsInRow; i++) {
                    if (y + i < index_1.control.sizeY && x + i < index_1.control.sizeX) {
                        if (index_1.control.isUser1Playing && index_1.control.playArray[y + i][x + i] == index_1.control.FIELDUSER2 ||
                            !index_1.control.isUser1Playing && index_1.control.playArray[y + i][x + i] == index_1.control.FIELDUSER1) {
                            break;
                        }
                        else {
                            freeFields++;
                        }
                    }
                    else {
                        break;
                    }
                }
                for (let i = 1; i < index_1.control.winningPointsInRow; i++) {
                    if (y - i >= 0 && x - i >= 0) {
                        if (index_1.control.isUser1Playing && index_1.control.playArray[y - i][x - i] == index_1.control.FIELDUSER2 ||
                            !index_1.control.isUser1Playing && index_1.control.playArray[y - i][x - i] == index_1.control.FIELDUSER1) {
                            break;
                        }
                        else {
                            freeFields++;
                        }
                    }
                    else {
                        break;
                    }
                }
                break;
            case this.CMCLDRT:
                for (let i = 1; i < index_1.control.winningPointsInRow; i++) {
                    if (y - i >= 0 && x + i < index_1.control.sizeX)
                        if (index_1.control.isUser1Playing && index_1.control.playArray[y - i][x + i] == index_1.control.FIELDUSER2 ||
                            !index_1.control.isUser1Playing && index_1.control.playArray[y - i][x + i] == index_1.control.FIELDUSER1) {
                            break;
                        }
                        else {
                            freeFields++;
                        }
                    else {
                        break;
                    }
                }
                for (let i = 1; i < index_1.control.winningPointsInRow; i++) {
                    if (y + i < index_1.control.sizeY && x - i >= 0) {
                        if (index_1.control.isUser1Playing && index_1.control.playArray[y + i][x - i] == index_1.control.FIELDUSER2 ||
                            !index_1.control.isUser1Playing && index_1.control.playArray[y + i][x - i] == index_1.control.FIELDUSER1) {
                            break;
                        }
                        else {
                            freeFields++;
                        }
                    }
                    else {
                        break;
                    }
                }
                break;
            default:
                break;
        }
        if (freeFields >= index_1.control.winningPointsInRow)
            return true;
        return false;
    }
    /**
     * Search for Y Position where you can set for given X-Direction in connectfour mode
     * @param x X-Position
     * @returns Y-Position where you can set
     */
    highestYPosinColumn(x) {
        let returnval = index_1.control.sizeY - 1;
        for (let i = 0; i < index_1.control.sizeY; i++) {
            if (index_1.control.playArray[i][x] != index_1.control.FIELDEMPTY) {
                returnval = i - 1;
                break;
            }
        }
        return returnval;
    }
}
exports.Computer = Computer;


/***/ }),

/***/ 941:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Control = exports.database = void 0;
const database_1 = __importDefault(__webpack_require__(467));
const registrationManagerImp_1 = __webpack_require__(435);
const computer_1 = __webpack_require__(752);
const inputManager_1 = __webpack_require__(361);
exports.database = database_1.default.getInstance(); // Singleton
class Control {
    constructor() {
        this.playAgainstComputer = true;
        /** Size of game board */
        this.sizeX = 0;
        this.sizeY = 0;
        /**Points you need in Row to win */
        this.winningPointsInRow = 0;
        /**Array to save all fields */
        this.playArray = [];
        /**Define if field is free or which user has it */
        this.FIELDEMPTY = 0;
        this.FIELDUSER1 = 1;
        this.FIELDUSER2 = 2;
        /**Save which field was last set */
        this.lastFieldSetXY = [-1, -1];
        this.isUser1Playing = true;
        this.GAMEMODETICTACTOE = 0;
        this.GAMEMODECONNECTFOUR = 1;
        /**Instances from needed Classes */
        this.regManager = new registrationManagerImp_1.RegistrationManagerImp();
        this.computer = new computer_1.Computer();
        this.inputManager = new inputManager_1.InputManager();
        /**Define how to draw fields */
        this.DRAWFIELDEMPTY = "-";
        this.DRAWFIELDUSER1 = "X";
        this.DRAWFIELDUSER2 = "O";
        this.gameOver = false;
    }
    /**
     * Main method
     */
    main() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.inputManager.getGameMode();
            console.log("Gamemode: " + this.gameMode);
            yield this.inputManager.playAgainstWho();
            console.log("Against Computer: " + this.playAgainstComputer);
            Control.user = (yield this.inputManager.howToPlay("What do you want to do?"));
            if (!this.playAgainstComputer) {
                Control.user2 = (yield this.inputManager.howToPlay("What want the other human to do?"));
            }
            else {
                Control.user2 = this.regManager.registerComputerUser();
            }
            console.log("User1: " + Control.user.username);
            console.log("User2: " + Control.user2.username);
            console.log(Control.user.returnStatistic());
            yield this.inputManager.createPlayground();
            this.drawPlayground();
            while (!this.gameOver) {
                yield this.waitAndSetUserInput();
                this.drawPlayground();
                this.gameOver = yield this.checkIfGameOver();
                this.isUser1Playing = !this.isUser1Playing;
            }
            this.exitProgram();
        });
    }
    /**
     * Count connected from Left top to right bottom and otherwise at last set position
     * @param lastX last x-position where was set
     * @param lastY last y-position where was set
     * @returns how many connected
     */
    checkDiagonalLTRD(lastX, lastY) {
        let inDiagonal = 1;
        // Right down to left top
        for (let i = 1; lastY - i >= 0 && lastX - i >= 0; i++) {
            if ((this.isUser1Playing && this.playArray[lastY - i][lastX - i] == this.FIELDUSER1) ||
                (!this.isUser1Playing && this.playArray[lastY - i][lastX - i] == this.FIELDUSER2)) {
                inDiagonal++;
            }
            else {
                break;
            }
        }
        // Left top to right down
        for (let i = 1; lastY + i < this.sizeY && lastX + i < this.sizeX; i++) {
            if ((this.isUser1Playing && this.playArray[lastY + i][lastX + i] == this.FIELDUSER1) ||
                (!this.isUser1Playing && this.playArray[lastY + i][lastX + i] == this.FIELDUSER2)) {
                inDiagonal++;
            }
            else {
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
    checkDiagonalLDRT(lastX, lastY) {
        let inDiagonal = 1;
        // left bottom to right top
        for (let i = 1; i + lastX < this.sizeX && lastY - i >= 0; i++) {
            if ((this.isUser1Playing && this.playArray[lastY - i][lastX + i] == this.FIELDUSER1) ||
                (!this.isUser1Playing && this.playArray[lastY - i][lastX + i] == this.FIELDUSER2)) {
                inDiagonal++;
            }
            else {
                break;
            }
        }
        /**Right top to left down */
        for (let i = 1; lastX - i >= 0 && lastY + i < this.sizeY; i++) {
            if ((this.isUser1Playing && this.playArray[lastY + i][lastX - i] == this.FIELDUSER1) ||
                (!this.isUser1Playing && this.playArray[lastY + i][lastX - i] == this.FIELDUSER2)) {
                inDiagonal++;
            }
            else {
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
    checkDiagonal(lastX, lastY) {
        let inDiagonalLDRT = this.checkDiagonalLDRT(lastX, lastY);
        let inDiagonalLTRD = this.checkDiagonalLTRD(lastX, lastY);
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
    checkColumns(lastX, lastY) {
        let inColumn = 0;
        for (let i = lastY; i < this.sizeY; i++) {
            if ((this.isUser1Playing && this.playArray[i][lastX] == this.FIELDUSER1) ||
                (!this.isUser1Playing && this.playArray[i][lastX] == this.FIELDUSER2)) {
                inColumn++;
            }
            else {
                break;
            }
        }
        for (let i = lastY - 1; i >= 0; i--) {
            if ((this.isUser1Playing && this.playArray[i][lastX] == this.FIELDUSER1) ||
                (!this.isUser1Playing && this.playArray[i][lastX] == this.FIELDUSER2)) {
                inColumn++;
            }
            else {
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
    checkRows(lastX, lastY) {
        let inRow = 0;
        for (let i = lastX; i < this.sizeX; i++) {
            if ((this.isUser1Playing && this.playArray[lastY][i] == this.FIELDUSER1) ||
                (!this.isUser1Playing && this.playArray[lastY][i] == this.FIELDUSER2)) {
                inRow++;
            }
            else {
                break;
            }
        }
        for (let i = lastX - 1; i >= 0; i--) {
            if ((this.isUser1Playing && this.playArray[lastY][i] == this.FIELDUSER1) ||
                (!this.isUser1Playing && this.playArray[lastY][i] == this.FIELDUSER2)) {
                inRow++;
            }
            else {
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
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    /**
     * Exit Programm
     */
    exitProgram() {
        return __awaiter(this, void 0, void 0, function* () {
            yield exports.database.disconnect();
            console.log("Program ended");
            process.exit(0);
        });
    }
    /**
     * checks if game over
     * @returns true if game over
     */
    checkIfGameOver() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.checkIfGameWon();
            if (!ret)
                ret = yield this.checkIfGameDrawn();
            return ret;
        });
    }
    /**
     * Checks if game won
     * @returns true if game won
     */
    checkIfGameWon() {
        return __awaiter(this, void 0, void 0, function* () {
            let inDiagonal = this.checkDiagonal(this.lastFieldSetXY[0], this.lastFieldSetXY[1]);
            let inRow = this.checkRows(this.lastFieldSetXY[0], this.lastFieldSetXY[1]);
            let inColumn = this.checkColumns(this.lastFieldSetXY[0], this.lastFieldSetXY[1]);
            // console.log("inDiagonal:" + inDiagonal);
            // console.log("inRow:" + inRow);
            // console.log("inColumn:" + inColumn);
            if (inDiagonal >= this.winningPointsInRow || inRow >= this.winningPointsInRow || inColumn >= this.winningPointsInRow) {
                let username = Control.user.username;
                // Output and if registered, save new statistic
                if (!this.isUser1Playing) {
                    username = Control.user2.username;
                    if (Control.user2.registered)
                        yield Control.user2.statistics.setValues(true, false);
                    if (Control.user.registered)
                        yield Control.user.statistics.setValues(false, true);
                }
                else {
                    if (Control.user2.registered)
                        yield Control.user2.statistics.setValues(false, true);
                    if (Control.user.registered)
                        yield Control.user.statistics.setValues(true, false);
                }
                console.log("Congratulations, " + username + ", you have won the game");
                if (Control.user.registered)
                    console.log(Control.user.returnStatistic());
                if (Control.user2.registered)
                    console.log(Control.user2.returnStatistic());
                return true;
            }
            return false;
        });
    }
    /**
     * Checks if game is drawn
     * @returns true if game is drawn
     */
    checkIfGameDrawn() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = true;
            for (let x = 0; x < this.sizeX; x++) {
                for (let y = 0; y < this.sizeY; y++) {
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
                    yield Control.user.statistics.setValues(false, false);
                }
                if (Control.user2.registered) {
                    yield Control.user2.statistics.setValues(false, false);
                }
            }
            return ret;
        });
    }
    /** Draw Playgroung at Console with console.log */
    drawPlayground() {
        // Array with all fields
        let playground = [];
        let playgroundString;
        for (let y = 0; y < this.sizeY; y++) {
            for (let x = 0; x < this.sizeX; x++) {
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
        let chunk = this.chunkArray(playground, this.sizeY);
        let rows = [];
        for (let y = 0; y < this.sizeY; y++) {
            rows.push(chunk[y].join("|"));
        }
        playgroundString = rows.join("\n");
        console.log(playgroundString);
    }
    /**
     * Wait and set userinput
     */
    waitAndSetUserInput() {
        return __awaiter(this, void 0, void 0, function* () {
            let userName;
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
            }
            else {
                if (this.gameMode == this.GAMEMODETICTACTOE)
                    yield this.inputManager.waitAndSetUserInputTictactoe();
                else if (this.gameMode == this.GAMEMODECONNECTFOUR)
                    yield this.inputManager.waitAndSetUserInputConnectFour();
                else
                    this.exitProgram();
            }
        });
    }
    /**
     * Chunk string arrays
     * @param arr array to chunk
     * @param n where to chunk
     * @returns chunked array
     */
    chunkArray(arr, n) {
        // Code from https://stackoverflow.com/questions/9933662/
        let chunkLength = Math.max(arr.length / n, 1);
        let chunks = [];
        for (let i = 0; i < n; i++) {
            if (chunkLength * (i + 1) <= arr.length)
                chunks.push(arr.slice(chunkLength * i, chunkLength * (i + 1)));
        }
        return chunks;
    }
}
exports.Control = Control;


/***/ }),

/***/ 467:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const Mongo = __importStar(__webpack_require__(13));
const bcrypt = __importStar(__webpack_require__(96));
const user_1 = __webpack_require__(376);
class Database {
    /**
     * Force to use singleton
     */
    constructor() {
        this.dbName = "ConnectFour";
        this.dbUsersCollectionName = "Users";
        if (Database.database)
            throw new Error("Please use getInstance()");
        Database.database = this;
    }
    /**
     * Returns Instance of Database
     * @returns Instance of Database
     */
    static getInstance() {
        return Database.database;
    }
    /**
     * Connects to Database
     * @returns true if connection was successfull
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dbUsers == undefined) {
                if (process.env.dbUserName && process.env.dbUserPW) {
                    let dbUserName = process.env.dbUserName;
                    let dbUserPW = process.env.dbUserPW;
                    const uri = "mongodb+srv://" + dbUserName + ":" + dbUserPW + "@swdesign.gu1ll.mongodb.net/" + this.dbName + "?retryWrites=true&w=majority";
                    this.mongoClient = new Mongo.MongoClient(uri, {});
                    yield this.mongoClient.connect();
                    this.dbUsers = this.mongoClient.db(this.dbName).collection(this.dbUsersCollectionName);
                    console.log("Database connection", this.dbUsers != undefined);
                    return this.dbUsers != undefined;
                }
                return false;
            }
            return this.dbUsers != undefined;
        });
    }
    /**
     * Disconnect from Database
     */
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mongoClient) {
                yield this.mongoClient.close();
                console.log("DBConnection disconnected successfull");
            }
        });
    }
    /**
     * Adds user in Database
     * @param user User to add in DB
     */
    addUserToDB(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dbUsers.insertOne(user);
        });
    }
    /**
     * Login
     * @param userName username to login
     * @param password pasword to login
     * @returns user if login was successfull
     */
    login(userName, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let dbUser = yield this.findUserByUsername(userName);
            if (dbUser) {
                // Compare hashed Passwords
                if (yield bcrypt.compare(password, dbUser.password)) {
                    return dbUser;
                }
                else {
                    console.log("Wrong Password");
                }
            }
            return null;
        });
    }
    /**
     * register
     * @param userOld user, which wants to register
     * @returns new user after register
     */
    register(userOld) {
        return __awaiter(this, void 0, void 0, function* () {
            let dbUser = yield this.findUserByUsername(userOld.username);
            if (!dbUser) {
                // password hash
                const saltRounds = 10;
                const hashedPassword = yield bcrypt.hash(userOld.password, saltRounds);
                let user = new user_1.User(userOld.registered, userOld.username, hashedPassword);
                yield this.addUserToDB(user);
                dbUser = yield this.findUserByUsername(user.username);
                if (dbUser) {
                    let userNew = new user_1.User(true, dbUser.username, undefined, dbUser.statistics, dbUser._id);
                    return userNew;
                }
                else {
                    console.log("Something went wrong");
                    return null;
                }
            }
            else {
                console.log("username already exist");
                return null;
            }
        });
    }
    /**
     * Save statistics from user
     * @param user user from which statistics should be saved
     */
    saveStatistic(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateDoc = {
                $set: {
                    statistics: user.statistics
                }
            };
            yield this.dbUsers.updateOne({ _id: user._id }, updateDoc);
        });
    }
    /**
     * Finds user by username
     * @param username username to find
     * @returns User if user with username exists
     */
    findUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.dbUsers.findOne({ username: username });
            if (user) {
                return user;
            }
            else
                return null;
        });
    }
}
exports["default"] = Database;
// Database Object needed for Singleton
Database.database = new Database();


/***/ }),

/***/ 361:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InputManager = void 0;
const prompts_1 = __importDefault(__webpack_require__(650));
const index_1 = __webpack_require__(607);
const control_1 = __webpack_require__(941);
class InputManager {
    /**
     * Asks and sets value for game mode
     */
    getGameMode() {
        return __awaiter(this, void 0, void 0, function* () {
            let proceed = false;
            while (!proceed) {
                let response = yield prompts_1.default.prompt({
                    type: "select",
                    name: "answer",
                    message: "Choose Game-Mode:",
                    choices: [
                        { title: "TicTacToe", value: index_1.control.GAMEMODETICTACTOE },
                        { title: "ConnectFour", value: index_1.control.GAMEMODECONNECTFOUR },
                        { title: "Quit program", value: 2 }
                    ]
                });
                switch (response.answer) {
                    case index_1.control.GAMEMODETICTACTOE:
                        index_1.control.gameMode = index_1.control.GAMEMODETICTACTOE;
                        proceed = true;
                        break;
                    case index_1.control.GAMEMODECONNECTFOUR:
                        index_1.control.gameMode = index_1.control.GAMEMODECONNECTFOUR;
                        proceed = true;
                        break;
                    case 2:
                        proceed = true;
                        index_1.control.exitProgram();
                        break;
                    default:
                        console.log("Wrong Type, try again");
                        break;
                }
            }
        });
    }
    /**
     * Asks how to play (against computer or other human)
     */
    playAgainstWho() {
        return __awaiter(this, void 0, void 0, function* () {
            let proceed = false;
            while (!proceed) {
                let response = yield prompts_1.default.prompt({
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
                        index_1.control.playAgainstComputer = true;
                        proceed = true;
                        break;
                    case 1:
                        index_1.control.playAgainstComputer = false;
                        proceed = true;
                        break;
                    case 2:
                        proceed = true;
                        index_1.control.exitProgram();
                        break;
                    default:
                        console.log("Wrong Type, try again");
                        break;
                }
            }
        });
    }
    /**
     * Question if you want to login, register or play anonymous
     * @param message Question to display
     * @returns User if all went right
     */
    howToPlay(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let proceed = false;
            while (!proceed) {
                let response = yield prompts_1.default.prompt({
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
                        if (yield control_1.database.connect()) {
                            let user = yield index_1.control.regManager.login();
                            if (user) {
                                proceed = true;
                                console.log("Login successfull: ", proceed);
                                return user;
                            }
                        }
                        else {
                            console.log("No connection to DB");
                            index_1.control.exitProgram();
                        }
                        break;
                    case 1:
                        //play anonymous
                        let user = index_1.control.regManager.registerAnonymousUser();
                        proceed = true;
                        return user;
                    case 2:
                        //register
                        if (yield control_1.database.connect()) {
                            let user = yield index_1.control.regManager.register();
                            if (user) {
                                proceed = true;
                                console.log("Registration successfull: ", proceed);
                                return user;
                            }
                        }
                        else {
                            console.log("No connection to DB");
                            index_1.control.exitProgram();
                        }
                        break;
                    case 3:
                        proceed = true;
                        index_1.control.exitProgram();
                        break;
                    default:
                        console.log("Wrong Type, try again");
                        break;
                }
            }
        });
    }
    /**
     * Asks question to create Playground (Size and how many winning points)
     */
    createPlayground() {
        return __awaiter(this, void 0, void 0, function* () {
            let proceed = false;
            while (!proceed) {
                let response = yield prompts_1.default.prompt({
                    type: "number",
                    name: "size",
                    message: "Size of board in X-Direction:"
                });
                index_1.control.sizeX = response.size;
                if (index_1.control.sizeX == undefined) {
                    console.log("SizeX: " + index_1.control.sizeX);
                    yield index_1.control.exitProgram();
                }
                response = yield prompts_1.default.prompt({
                    type: "number",
                    name: "size",
                    message: "Size of board in Y-Direction:"
                });
                index_1.control.sizeY = response.size;
                if (index_1.control.sizeY == undefined) {
                    console.log("SizeY: " + index_1.control.sizeY);
                    yield index_1.control.exitProgram();
                }
                if (index_1.control.sizeX >= 3 && index_1.control.sizeY >= 3 && index_1.control.sizeX <= 15 && index_1.control.sizeY <= 15) {
                    proceed = true;
                }
                else {
                    console.log("Board have to has a minimum size of 3x3 and a maximum of 15x15!\nPlease try again");
                }
            }
            proceed = false;
            while (!proceed) {
                let response = yield prompts_1.default.prompt({
                    type: "number",
                    name: "winningPoints",
                    message: "How many elements in row to win?"
                });
                index_1.control.winningPointsInRow = response.winningPoints;
                if (index_1.control.winningPointsInRow == undefined) {
                    console.log("winningPointsInRow: " + index_1.control.winningPointsInRow);
                    yield index_1.control.exitProgram();
                }
                if (index_1.control.winningPointsInRow <= index_1.control.sizeX && index_1.control.winningPointsInRow <= index_1.control.sizeY && index_1.control.winningPointsInRow > 1) {
                    proceed = true;
                }
                else {
                    console.log("Winning points must be smaller than shortest side of board and minimum 2!\nPlease try again");
                }
            }
            //initialise Playarray with all fields empty
            for (let y = 0; y < index_1.control.sizeY; y++) {
                index_1.control.playArray[y] = [];
                for (let x = 0; x < index_1.control.sizeX; x++) {
                    index_1.control.playArray[y][x] = index_1.control.FIELDEMPTY;
                }
            }
        });
    }
    /**
     * Asks user where to set and sets in ConnectFour
     */
    waitAndSetUserInputConnectFour() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Possible from (X:1) (left) until (X:" + index_1.control.sizeX + " (right)");
            let proceed = false;
            let x;
            while (!proceed) {
                let response = yield prompts_1.default.prompt({
                    type: "number",
                    name: "positionX",
                    message: "X:"
                });
                x = response.positionX;
                if (x == undefined) {
                    console.log("X: " + x);
                    yield index_1.control.exitProgram();
                }
                if (x <= index_1.control.sizeX && x > 0) {
                    x--;
                    // Sets Field for user when empty
                    for (let y = index_1.control.sizeY - 1; y >= 0; y--) {
                        if (index_1.control.playArray[y][x] == index_1.control.FIELDEMPTY) {
                            index_1.control.lastFieldSetXY = [x, y];
                            if (index_1.control.isUser1Playing) {
                                index_1.control.playArray[y][x] = index_1.control.FIELDUSER1;
                                proceed = true;
                                break;
                            }
                            else {
                                index_1.control.playArray[y][x] = index_1.control.FIELDUSER2;
                                proceed = true;
                                break;
                            }
                        }
                    }
                    if (!proceed) {
                        console.log("Column: " + (x + 1) + " is full, please try again");
                    }
                }
                else {
                    console.log("X:" + x + ", field is outside the board, please type in again");
                }
            }
        });
    }
    /**
     * Asks user where to set and sets in TicTacToe
     */
    waitAndSetUserInputTictactoe() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Possible from(1,1) (top left) until (X:" + index_1.control.sizeX + ",Y:" + index_1.control.sizeY + ") (bottom right)");
            let proceed = false;
            let x;
            let y;
            while (!proceed) {
                let response = yield prompts_1.default.prompt({
                    type: "number",
                    name: "positionX",
                    message: "X:"
                });
                x = response.positionX;
                response = yield prompts_1.default.prompt({
                    type: "number",
                    name: "positionY",
                    message: "Y:"
                });
                y = response.positionY;
                if (x == undefined || y == undefined) {
                    console.log("X: " + x + ", Y: " + y);
                    yield index_1.control.exitProgram();
                }
                // Sets for user if empty
                if (x <= index_1.control.sizeX && y <= index_1.control.sizeY && x > 0 && y > 0) {
                    x--;
                    y--;
                    if (index_1.control.playArray[y][x] == index_1.control.FIELDEMPTY) {
                        index_1.control.lastFieldSetXY = [x, y];
                        if (index_1.control.isUser1Playing) {
                            index_1.control.playArray[y][x] = index_1.control.FIELDUSER1;
                            proceed = true;
                        }
                        else {
                            index_1.control.playArray[y][x] = index_1.control.FIELDUSER2;
                            proceed = true;
                        }
                    }
                    else {
                        console.log("Field isn't empty, please try again");
                    }
                }
                else {
                    console.log("X:" + x + ", Y:" + y);
                    console.log("Field is outside the board, please type in again");
                }
            }
        });
    }
}
exports.InputManager = InputManager;


/***/ }),

/***/ 429:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.testPasswordSecurity = void 0;
function testPasswordSecurity(password) {
    if (password)
        //Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
        return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) != null;
    return false;
}
exports.testPasswordSecurity = testPasswordSecurity;


/***/ }),

/***/ 435:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegistrationManagerImp = void 0;
const user_1 = __webpack_require__(376);
const control_1 = __webpack_require__(941);
const prompts_1 = __importDefault(__webpack_require__(650));
const registrationManager_1 = __webpack_require__(429);
/**
 * Implemention of Registration Manager
 */
class RegistrationManagerImp {
    /**
     * Register an anonymous user
     * @returns the anonymous user
     */
    registerAnonymousUser() {
        let user = new user_1.User(false, "Anon");
        return user;
    }
    /**
     * Register a Computer as user
     * @returns the computer user
     */
    registerComputerUser() {
        let user = new user_1.User(false, "Computer");
        return user;
    }
    /**
     * Register a new User
     * @returns the user if successfull, else null
     */
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            // gets username and password
            let userName = yield this.getUserName();
            let password = null;
            if (userName)
                password = yield this.getPassword();
            // if username and password were provided successfull
            if (userName && password) {
                if (password.trim().length <= 1 || userName.trim().length <= 1) {
                    // if password and username where empty
                    console.log("Please provide non-empty input");
                    // recall register
                    return this.register();
                }
                // register user in db and return new user
                let userOld = new user_1.User(true, userName, password);
                let user = yield control_1.database.register(userOld);
                if (user) {
                    return user;
                }
                else {
                    console.log("Registration went wrong, please try again!");
                    return null;
                }
            }
            else {
                // if username and password werent provided successfully recall register
                return this.register();
            }
        });
    }
    /**
     * Login a user
     * @returns the user if successfull, else null
     */
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            // ask for username and password
            let userName = yield this.getUserName();
            let password = null;
            if (userName)
                password = yield this.getPassword();
            if (userName && password) {
                // if username and password were provided successfull
                if (password.trim().length < 1 || userName.trim().length < 1) {
                    // if password and username were empty
                    console.log("Please provide non-empty input");
                    // recall login
                    return this.login();
                }
                // login user
                let userDB = yield control_1.database.login(userName, password);
                if (userDB) {
                    // if login successfull, init user and return user
                    let user = new user_1.User(true, userName);
                    user.setValuesFromUser(userDB);
                    return user;
                }
                else {
                    // error and return null
                    console.log("Login went wrong, please try again!");
                    return null;
                }
            }
            else {
                // recall login if username and password weren't provided successfully
                return this.login();
            }
        });
    }
    /**
     * Checks Password security
     * @param password Password which is checked
     * @returns true if password is secure enough
     */
    testPasswordSecurity(password) {
        return (0, registrationManager_1.testPasswordSecurity)(password);
    }
    /**
     * Checks if username matches pattern
     * @param username username to check
     * @returns true if username match pattern
     */
    checkUsername(username) {
        if (username)
            //will accept alphanumeric usernames between 5 and 20 characters, no special characters.  
            return username.match(/^(?=.{5,20}$)[a-zA-Z0-9._]+(?<![_.])$/) != null;
        return false;
    }
    /**
     * Get the username
     * @returns username or null if input wasnt correct
     */
    getUserName() {
        return __awaiter(this, void 0, void 0, function* () {
            let userName = null;
            let response = yield prompts_1.default.prompt({
                type: "text",
                name: "answer",
                message: "Please enter your username:"
            });
            if (this.checkUsername(response.answer)) {
                userName = response.answer;
            }
            else {
                console.log("Username doesn't match pattern: \"alphanumeric usernames between 5 and 20 characters, no special characters\"");
            }
            return userName;
        });
    }
    /**
     * Asks for password
     * @returns password or null if input wasnt correct
     */
    getPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            let password = null;
            let response = yield prompts_1.default.prompt({
                type: "password",
                name: "answer",
                message: "Please enter your password:"
            });
            if (this.testPasswordSecurity(response.answer)) {
                password = response.answer;
            }
            else {
                console.log("Password doesn't match pattern: \"Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character\"");
            }
            return password;
        });
    }
}
exports.RegistrationManagerImp = RegistrationManagerImp;


/***/ }),

/***/ 328:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Statistics = void 0;
const control_1 = __webpack_require__(941);
class Statistics {
    constructor() {
        this.gamesPlayed = 0;
        this.gamesWon = 0;
        this.gamesLost = 0;
    }
    /**
     * Call this after game is over
     * @param won true if this game was won
     * @param lost true if game was lost
     */
    setValues(won, lost) {
        return __awaiter(this, void 0, void 0, function* () {
            this.gamesPlayed++;
            if (won && !lost) {
                this.gamesWon++;
            }
            if (!won && lost) {
                this.gamesLost++;
            }
            if (!won && !lost) {
                this.gamesPlayed++;
            }
            yield this.saveStatistic();
        });
    }
    /**
     * Adds values to values in Object
     * @param gamesPlayed How many games where played
     * @param gamesWon How many games where won
     * @param gamesLost How many games where list
     */
    initSetValues(gamesPlayed, gamesWon, gamesLost) {
        this.gamesPlayed = this.gamesPlayed + gamesPlayed;
        this.gamesWon = this.gamesWon + gamesWon;
        this.gamesLost = this.gamesLost + gamesLost;
    }
    /**
     * Save statistics in database
     */
    saveStatistic() {
        return __awaiter(this, void 0, void 0, function* () {
            control_1.Control.user.statistics = this;
            if (control_1.Control.user.registered) {
                yield control_1.database.saveStatistic(control_1.Control.user);
            }
        });
    }
}
exports.Statistics = Statistics;


/***/ }),

/***/ 376:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
const statistics_1 = __webpack_require__(328);
class User {
    /**
     * Create new User
     * @param registered true if this user is registered
     * @param username Name of the user
     * @param password password of the user, optional
     * @param statistics statistics of this user, optional
     * @param _id DatabaseId of this user, optional
     */
    constructor(registered, username, password, statistics, _id) {
        this.statistics = new statistics_1.Statistics();
        if (_id)
            this._id = _id;
        this.registered = registered;
        this.username = username;
        if (password)
            this.password = password;
        if (statistics)
            this.statistics.initSetValues(statistics.gamesPlayed, statistics.gamesWon, statistics.gamesLost);
    }
    /**
     * Sets values for this user from other user
     * @param userDB user to get the values from
     */
    setValuesFromUser(userDB) {
        if (userDB._id)
            this._id = userDB._id;
        if (userDB.registered)
            this.registered = userDB.registered;
        if (userDB.username)
            this.username = userDB.username;
        if (userDB.statistics)
            this.statistics.initSetValues(userDB.statistics.gamesPlayed, userDB.statistics.gamesWon, userDB.statistics.gamesLost);
        this.password = undefined;
    }
    /**
     * Returns Statistic from User as string
     * @returns Statistic as String
     */
    returnStatistic() {
        // Calculate percentages
        let percentWon = Math.round(this.statistics.gamesWon / this.statistics.gamesPlayed * 100);
        if (Number.isNaN(percentWon) || percentWon == undefined)
            percentWon = 0;
        let percentDrawn = Math.round((this.statistics.gamesPlayed - this.statistics.gamesWon - this.statistics.gamesLost) / this.statistics.gamesPlayed * 100);
        if (Number.isNaN(percentDrawn) || percentDrawn == undefined)
            percentDrawn = 0;
        let percentLost = Math.round(this.statistics.gamesLost / this.statistics.gamesPlayed * 100);
        if (Number.isNaN(percentLost) || percentLost == undefined)
            percentLost = 0;
        // Return statistic as string
        return "You played " + this.statistics.gamesPlayed + " games with " + this.statistics.gamesWon + " games won (" + percentWon + "%) and " +
            (this.statistics.gamesPlayed - this.statistics.gamesWon - this.statistics.gamesLost) + " drawn games(" + percentDrawn + "%). " +
            "You lost " + this.statistics.gamesLost + " games(" + percentLost + "%).";
    }
}
exports.User = User;


/***/ }),

/***/ 607:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.control = void 0;
const control_1 = __webpack_require__(941);
// in real server, this should not be set here
process.env.dbUserName = "ConnectFourUser";
process.env.dbUserPW = "5RUAlpGA8sfAN2eJ";
// create Control and start program
exports.control = new control_1.Control();
exports.control.main();


/***/ }),

/***/ 96:
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ 13:
/***/ ((module) => {

module.exports = require("mongodb");

/***/ }),

/***/ 650:
/***/ ((module) => {

module.exports = require("prompts");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(607);
/******/ 	
/******/ })()
;