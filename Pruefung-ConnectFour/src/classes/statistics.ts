import { Control, database } from "./control";

export class Statistics {

    public gamesPlayed: number = 0;
    public gamesWon: number = 0;
    public gamesLost: number = 0;

    public async setValues(won: boolean, lost: boolean): Promise<void> {
        this.gamesPlayed++;
        if (won && !lost) {
            this.gamesWon++;
        }
        if (!won && lost) {
            this.gamesLost++;
        }
        await this.saveStatistic();
    }

    public initSetValues(gamesPlayed: number, gamesWon: number, gamesLost: number): void {
        this.gamesPlayed = this.gamesPlayed + gamesPlayed;
        this.gamesWon = this.gamesWon + gamesWon;
        this.gamesLost = this.gamesLost + gamesLost;
    }

    private async saveStatistic(): Promise<void> {
        Control.user.statistics = this;
        if (Control.user.registered) {
            await database.saveStatistic(Control.user);
        }
    }
}