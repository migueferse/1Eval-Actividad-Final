import './styles.css';
import { default as  words } from "./dictionary";
const WORD = words[Math.floor(Math.random() * words.length)];
let rightWordString = WORD.toUpperCase();
let predictionWordArray = [];
let wordDiv;

function removeSlotsSelected() {
  let slotsDiv = wordDiv.children;
  for (const slot of slotsDiv) {
    slot.classList.remove('selected');
  }
}

function selectSlot(event) {
  removeSlotsSelected();
  event.target.classList.add('selected');
}

function createRow() {
  let wordsDiv = document.getElementById('words');
  wordDiv = document.createElement('div');
  wordDiv.className = 'word';
  for (let i = 0; i < 5; i++) {
    let slotDiv = document.createElement('div');
    slotDiv.className = 'slot';
    if (i === 0) {
    slotDiv.classList.add('selected');
    }
    wordDiv.appendChild(slotDiv);
  }

  wordsDiv.appendChild(wordDiv);  
}

function insertLetter(letter) {
  let slotsDiv = wordDiv.children;
  for (let i = 0; i < slotsDiv.length; i++) {
    let slot = slotsDiv[i];
    if (slot.classList.value === 'slot selected') {
      slot.textContent = letter;
      predictionWordArray[i]= letter;
    } else {
      continue;
    }    
  }

  removeSlotsSelected();
  for (let slot of slotsDiv) {
    if (!slot.textContent) {
      slot.classList.add('selected')
      return;
    }
  }
}

function selectLetter(e) {
  let letter = e.target.textContent;
  insertLetter(letter);
}

function conditionsDeleteNotSelected(reverseSlotsDiv) {
  predictionWordArray[4] = '';
  reverseSlotsDiv[0].textContent = '';
  reverseSlotsDiv[0].classList.add('selected');
}

function conditionsDelete(reverseSlot, reverseSlotBefore ) {
  if ((reverseSlot.textContent === '' || !reverseSlot.textContent) && reverseSlotBefore ) {
    removeSlotsSelected();
    reverseSlotBefore.classList.add('selected');
  }

  let index = predictionWordArray.indexOf(reverseSlot.textContent);
  predictionWordArray[index] = '';
  reverseSlot.textContent = '';
}

function deleteLetter(e) {
  let slotsDiv = wordDiv.children;
  e.target.classList.add('selected');
  let reverseSlotsDiv = Array.from(slotsDiv).reverse();
  let reverseSlotSelected = Array.from(reverseSlotsDiv).find( function(slot) { return slot.classList.value === 'slot selected' } ); 
  for (let i = 0; i < reverseSlotsDiv.length; i++) {
    const reverseSlot = reverseSlotsDiv[i];
    const reverseSlotBefore = reverseSlotsDiv[i + 1]
    if (reverseSlot.classList.value === 'slot selected') {
      conditionsDelete(reverseSlot, reverseSlotBefore);
    } else if (!reverseSlotSelected){
      conditionsDeleteNotSelected(reverseSlotsDiv);
    }
    
  }
}

function changeColourLetter() {
  let rightWordArray = Array.from(rightWordString);
  for (let i = 0; i < 5; i++) {
    let letterColour = '';
    let slot = wordDiv.children[i];
    let letterPosition = rightWordArray.indexOf(predictionWordArray[i]);
    if (letterPosition === -1) {
      letterColour = 'grey';
    } else {
      if (rightWordArray[i] === predictionWordArray[i]) {
        letterColour = 'green';
      } else {
        letterColour =  'yellow';
      }
    }
    
    slot.classList.add(letterColour);
  }
}

function validateWord(predictionString) {
  if (predictionString.length < 5) {
    alert('No hay suficientes letras');
    return 'error';
  }

  if (!words.includes(predictionString.toLowerCase())) {
    alert('La palabra no está en la lista');
    return 'error';
  }
}

function startRowAgain() {
  wordDiv.removeEventListener('click', selectSlot);
  predictionWordArray = [];
  createRow();
  wordDiv.addEventListener('click', selectSlot);
}

function checkWord() {
  let predictionString = '';
  for (const val of predictionWordArray) {
    predictionString += val;
  }

  if (validateWord(predictionString)) {
    return;
  }

  changeColourLetter();
  if (rightWordString === predictionString) {
    alert('Has ganado');
    return;
  } else {
    startRowAgain();
  }
}

function addEvents() {
  wordDiv.addEventListener('click', selectSlot);
  let keyboardDiv = document.getElementsByClassName('key');
  for (const key of keyboardDiv) {
    key.addEventListener('click', selectLetter);  
  }

  let backspace = document.getElementById('backspace');
  backspace.addEventListener('click', deleteLetter);

  let enter = document.getElementById('enter');
  enter.addEventListener('click', checkWord);
}

function start() {
  createRow();
  addEvents();
}

start();

