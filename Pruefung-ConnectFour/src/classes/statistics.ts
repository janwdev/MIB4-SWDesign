import { Control, database } from "./control";

export class Statistics {

    public gamesPlayed: number = 0;
    public gamesWon: number = 0;
    public gamesLost: number = 0;

    /**
     * Call this after game is over
     * @param won true if this game was won
     * @param lost true if game was lost
     */
    public async setValues(won: boolean, lost: boolean): Promise<void> {
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
        await this.saveStatistic();
    }

    /**
     * Adds values to values in Object
     * @param gamesPlayed How many games where played
     * @param gamesWon How many games where won
     * @param gamesLost How many games where list
     */
    public initSetValues(gamesPlayed: number, gamesWon: number, gamesLost: number): void {
        this.gamesPlayed = this.gamesPlayed + gamesPlayed;
        this.gamesWon = this.gamesWon + gamesWon;
        this.gamesLost = this.gamesLost + gamesLost;
    }

    /**
     * Save statistics in database
     */
    private async saveStatistic(): Promise<void> {
        Control.user.statistics = this;
        if (Control.user.registered) {
            await database.saveStatistic(Control.user);
        }
    }
}