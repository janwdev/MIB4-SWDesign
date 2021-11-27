
abstract class QuizSelector {
    protected quizName: String;
    public abstract isNil(): boolean;
    public abstract getQuiz(): Quiz;
}

class RealQuiz extends QuizSelector {
    setName(quizName: String) {
        this.quizName = quizName;
    }

    public isNil(): boolean {
        return false;
    }

    public getQuiz(): Quiz {
        return quiz; //Liste nach quizNamen absuchen dann quiz returnen
    }
}

class NullQuiz extends QuizSelector {
    public getQuiz(): Quiz {
        return "Not Available in Customer Database"; //As Quiz
    }

    public isNil(): boolean {
        return true;
    }
}


class QuizSelectorFactory {
    public static quizNames: String[] = ["Rob", "Joe", "Julie"]

    public static getQuiz(name: String): QuizSelector {
        for (let i: number = 0; i < QuizSelectorFactory.quizNames.length; i++) {
            if (QuizSelectorFactory.quizNames[i].toLowerCase() == name.toLowerCase()) {
                let success: RealQuiz = new RealQuiz();
                success.setName(name)
                return success.getQuiz()
            }
        }
        return new NullQuiz();
    }
}