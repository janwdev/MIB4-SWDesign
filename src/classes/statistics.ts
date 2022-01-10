import { Control, database } from "./control";

export class Statistics {

    public numOfQuizes: number = 0;
    public answersGiven: number = 0;
    public correctAnswers: number = 0;

    public async setValues(answersGiven: number, correctAnswers: number): Promise<void> {
        this.numOfQuizes++;
        this.answersGiven = this.answersGiven + answersGiven;
        this.correctAnswers = this.correctAnswers + correctAnswers;
        await this.saveStatistic();
    }

    public initSetValues(numOfQuizes: number, answersGiven: number, correctAnswers: number): void {
        this.numOfQuizes = numOfQuizes;
        this.answersGiven = this.answersGiven + answersGiven;
        this.correctAnswers = this.correctAnswers + correctAnswers;
    }

    private async saveStatistic(): Promise<void> {
        Control.user.statistics = this;
        if (Control.user.registered) {
            await database.saveStatistic(Control.user);
        }
    }
}