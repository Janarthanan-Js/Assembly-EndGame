
import { useState } from "react";
import { Header } from "./header";
import { clsx } from "clsx";
import { languages } from "./languages";
import { getFarewellText,getrandomWord} from "./utils";
import Confetti from "react-confetti";

export function App() {

    // 1. State
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [currentWord, setCurrentWord] = useState(getrandomWord());

    const lastGuesssedLetter=guessedLetters[guessedLetters.length-1]
    const lastGuessIncorrect=lastGuesssedLetter&&!currentWord.includes(lastGuesssedLetter)

    // 2. Function to store guessed letters
    function guessedLetter(letter) {
        setGuessedLetters(prev =>
            prev.includes(letter) ? prev : [...prev, letter]
        );
    }

    // 4. Create keyboard buttons
    const alphabet = "abcdefghijklmnopqrstuvwxyz";

    // 5. Display language chips
    const wrongGuessCount = guessedLetters.filter(
    letter => !currentWord.includes(letter)
).length;

const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount;

    const className = clsx("chip", {
        lost: isLanguageLost
    });

    const styles = {
        backgroundColor: lang.backgroundColor,
        color: lang.color
    };

    return (
        <span
            className={className}
            style={styles}
            key={lang.name}
        >
            {lang.name}
        </span>
    );
});
const isGameWon=currentWord.split("").every(letter=>guessedLetters.includes(letter))
const isGameLost=wrongGuessCount>=languages.length-1
const isGameOver=isGameWon||isGameLost
const gameStatusClass=clsx("game-status",{
    won:isGameWon,
    lost:isGameLost,
    farewell:!isGameOver&&lastGuessIncorrect
})
 // 3. Display the word letters
    const letterElements = currentWord.split("").map((letter, index) => {
        const shoulRevealLetter=isGameLost||guessedLetters.includes(letter)
        const letterclassName=clsx(
            isGameLost && !guessedLetters.includes(letter) && 'missed-letter'
        )
        return(
        <span key={index} className={letterclassName}>
            {shoulRevealLetter
                ? letter.toUpperCase()
                : ""}
        </span>)
    });
const keyboardElements = alphabet.split("").map(letter => {

        const isGuessed = guessedLetters.includes(letter);
        const isCorrect = isGuessed && currentWord.includes(letter);
        const isWrong = isGuessed && !currentWord.includes(letter);

        const className = clsx({
            correct: isCorrect,
            wrong: isWrong
        });

        return (
            <button
                key={letter}
                className={className}
                disabled={isGameOver}
                aria-disabled={guessedLetters.includes(letter)}
                onClick={() => guessedLetter(letter)}
            >
                {letter.toUpperCase()}
            </button>
        );
    });

function renderGameStatus() {
    if (!isGameOver && lastGuessIncorrect) {
        const lastLanguage = languages[wrongGuessCount - 1];

        return (
            <p className="farewell-text">
                {getFarewellText(lastLanguage.name)}
            </p>
        );
    }

    if (isGameWon) {
        return (
            <>
                <h2>You win!</h2>
                <p>Well done! 🎉</p>
            </>
        );
    }

    if (isGameLost) {
        return (
            <>
                <h2>Game over!</h2>
                <p>You lose! Better start learning Assembly 😭</p>
            </>
        );
    }

    return null;
}
function reset(){
   setCurrentWord(getrandomWord())
   setGuessedLetters([])
    
} 
 // 6. UI
    return (
        <main>{
            isGameWon&&
            <Confetti
            recycle={false}
            numberOfPieces={1000}
            />
            }

            <Header />

            <section className={gameStatusClass} aria-live="polite" role="status">
                {renderGameStatus()} 
            </section>

            <section className="language-chips">
                {languageElements}
            </section>

            <section className="word">
                {letterElements}
            </section>

            <section className="sr-only" aria-live="polite" role="status">
                <p>
                    {currentWord.includes(lastGuesssedLetter)?
                    `Correct! The letter ${lastGuesssedLetter} is in the word.`:
                    `Sorry, the letter ${lastGuesssedLetter} is not in the word,`
                    }
                    You have {languages.length-1-wrongGuessCount} attempts left
                </p>
                <p>Current word: {currentWord.split("").map(letter=>guessedLetters.includes(letter)?letter+".":"blank.").join(" ")}</p>

            </section>

            <section className="keyboard">
                {keyboardElements}
            </section>

            {isGameOver&&<button className="new-game" onClick={reset}>
                New Game
            </button>}

        </main>
    );
}
