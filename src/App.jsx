//CSS
import './App.css';
//REACT
import { useCallback, useEffect, useState } from 'react';
//DATA
import { wordsList } from './data/word';
//COMPONENTS
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id:1, name:"start"},
  {id:2, name:"game"},
  {id:3, name:"end"},
];
const guessesQty = 3

function App() {
  const[gameStage, setGameStage]= useState(stages[0].name);
  const [word] = useState(wordsList);

  const [pickedword, setPickedword] = useState("")
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState ([]) 

  const[guessedLetters, setGuessedLetters]= useState([]);
  const[wrongLetters, setWrongLetters] = useState ([]);
  const[guesses, setGuesses] = useState (guessesQty);
  const[score, setScore] = useState (0)

  const pickWordAndCategory = useCallback( () =>{
    //pick a random category
    const categories = Object.keys(word)
    const category = categories[Math.floor(Math.random()* Object.keys(categories).length)];
  
    // pick and word
    const words = word[category][Math.floor(Math.random()* word[category].length)];
    

    return {words, category};
  },[word]);

// starts the secret word

  const startGame =useCallback (()=>{
    //clear all letters
    clearLetterStages();
   // pick word and pick category
   const {words,category} = pickWordAndCategory ();
   // create an array of letters
   let wordsLetters = words.split("");

   wordsLetters = wordsLetters.map((l) => l.toLowerCase());
   
  
   // fill states
   setPickedword(words);
   setPickedCategory(category);
   setLetters(wordsLetters);


    setGameStage(stages[1].name);

  },[pickWordAndCategory]);
  // process the letter input
  const verifyLetter = (letter) => {
   const normalizedLetter = letter.toLowerCase()
   // check if letter has already been ulilized
   if (
    guessedLetters.includes(normalizedLetter) ||
    wrongLetters.includes(normalizedLetter)
  ){
    return;
  }

  // push guessed letter or remove a guess
  if(letters.includes(normalizedLetter)){
    setGuessedLetters((actualGuessedLatters) =>[
      ...actualGuessedLatters,
      normalizedLetter
    ]);

  } else{
    setWrongLetters((actualWrongLatters) =>[
      ...actualWrongLatters,
      normalizedLetter
    ]);
    setGuesses((actualGuesses)=> actualGuesses - 1);

    }
  };
  const clearLetterStages = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };
// check if guesses ended
  useEffect(()=>{
    if(guesses <= 0){
      // reset all stage
      clearLetterStages()

      setGameStage(stages[2].name);
    }
  },[guesses])
  // check win condition
 useEffect (()=>{
  //ovo
  //o-o
  const uniqueLetters = [... new Set(letters)];
  //win condition
  if(guessedLetters.length === uniqueLetters.length){
    // add score
    setScore((actualScore)=>actualScore += 100)

    //restart game with new word
    startGame();
  }
 },[guessedLetters,letters,startGame]);

  //restarts the gane
  const retry = () =>{
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name);

  }
  return (
    <div className="App">
     {gameStage === 'start' && <StartScreen startGame={startGame} />}
     {gameStage === 'game' && 
     <Game 
        verifyLetter={verifyLetter}
        pickedword={pickedword}
        pickedCategory ={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}

       />}
     {gameStage === 'end' && <GameOver retry={retry} score={score}/>}
   
    </div>
  )
}

export default App
 