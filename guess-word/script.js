//Word and Hints Object
const options = {
  html: "Apa singkatan HyperText Markup Language?",
  a: "Tag HTML apa yang digunakan untuk membuat hyperlink?",
  img: "Tag HTML apa yang digunakan untuk menyisipkan gambar ke dalam halaman web?",
  strong: "Bagaimana cara membuat teks tebal menggunakan HTML?",
  background:
    "Apa properti CSS yang digunakan untuk mengatur latar belakang elemen?",
  globalisasi: "Proses masuknya ke ruang lingkup duni",
  p: "Apa tag HTML yang digunakan untuk membuat paragraf?",
  i: "Bagaimana cara membuat teks miring menggunakan HTML?",
  fontsize: "Apa properti CSS yang digunakan untuk mengubah ukuran teks?",
  table: "Tag HTML apa yang digunakan untuk membuat tabel?",
};

//Initial References
const message = document.getElementById("message");
const hintRef = document.querySelector(".hint-ref");
const controls = document.querySelector(".controls-container");
const startBtn = document.getElementById("start");
const letterContainer = document.getElementById("letter-container");
const userInpSection = document.getElementById("user-input-section");
const resultText = document.getElementById("result");
const word = document.getElementById("word");
const words = Object.keys(options);
let randomWord = "",
  randomHint = "";
let winCount = 0,
  lossCount = 0;

//Generate random value
const generateRandomValue = (array) => Math.floor(Math.random() * array.length);

//Block all the buttons
const blocker = () => {
  let lettersButtons = document.querySelectorAll(".letters");
  stopGame();
};

//Start Game
startBtn.addEventListener("click", () => {
  controls.classList.add("hide");
  init();
});

//Stop Game
const stopGame = () => {
  controls.classList.remove("hide");
};

//Generate Word Function
const generateWord = () => {
  letterContainer.classList.remove("hide");
  userInpSection.innerText = "";
  randomWord = words[generateRandomValue(words)];
  randomHint = options[randomWord];
  hintRef.innerHTML = `<div id="wordHint">
  <span>Hint: </span>${randomHint}</div>`;
  let displayItem = "";
  randomWord.split("").forEach((value) => {
    displayItem += '<span class="inputSpace">_ </span>';
  });

  //Display each element as span
  userInpSection.innerHTML = displayItem;
  userInpSection.innerHTML += `<div id='chanceCount'>Kesempatan: ${lossCount}</div>`;
};

//Initial Function
const init = () => {
  winCount = 0;
  lossCount = 5;
  randomWord = "";
  word.innerText = "";
  randomHint = "";
  message.innerText = "";
  userInpSection.innerHTML = "";
  letterContainer.classList.add("hide");
  letterContainer.innerHTML = "";
  generateWord();

  //For creating letter buttons
  for (let i = 65; i < 91; i++) {
    let button = document.createElement("button");
    button.classList.add("letters");

    //Number to ASCII[A-Z]
    button.innerText = String.fromCharCode(i);

    //Character button onclick
    button.addEventListener("click", () => {
      message.innerText = `Correct Letter`;
      message.style.color = "#008000";
      let charArray = randomWord.toUpperCase().split("");
      let inputSpace = document.getElementsByClassName("inputSpace");

      //If array contains clicked value replace the matched Dash with Letter
      if (charArray.includes(button.innerText)) {
        charArray.forEach((char, index) => {
          //If character in array is same as clicked button
          if (char === button.innerText) {
            button.classList.add("correct");
            //Replace dash with letter
            inputSpace[index].innerText = char;
            //increment counter
            winCount += 1;
            //If winCount equals word length
            if (winCount == charArray.length) {
              resultText.innerHTML = "<b>BENAR</b>";
              startBtn.innerText = "START GAME";
              //block all buttons
              blocker();
            }
          }
        });
      } else {
        //lose count
        button.classList.add("incorrect");
        lossCount -= 1;
        document.getElementById(
          "chanceCount"
        ).innerText = `Kesempatan: ${lossCount}`;
        message.innerText = `Incorrect Letter`;
        message.style.color = "#ff0000";
        if (lossCount == 0) {
          word.innerHTML = `JAWABAN: <span>${randomWord}</span>`;
          resultText.innerHTML = `<b>GAME OVER</b>`;
          blocker();
        }
      }

      //Disable clicked buttons
      button.disabled = true;
    });

    //Append generated buttons to the letters container
    letterContainer.appendChild(button);
  }
};

window.onload = () => {
  init();
};
