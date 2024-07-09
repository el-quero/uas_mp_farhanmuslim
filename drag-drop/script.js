let draggableObjects;
let dropPoints;
const startButton = document.getElementById("start");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const dragContainer = document.querySelector(".draggable-objects");
const dropContainer = document.querySelector(".drop-points");
const data = [
  "red",
  "green",
  "blue",
  "yellow",
  "black",
  "white",
  "gray",
  "brown",
  "orange",
  "purple",
];

let deviceType = "";
let initialX = 0,
  initialY = 0;
let currentElement = "";
let moveElement = false;

//Deteksi perangkat sentuh
const isTouchDevice = () => {
  try {
    //Kita coba membuat Touch Event (Akan gagal untuk desktop dan melemparkan error)
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

let count = 0;

//Nilai acak dari Array
const randomValueGenerator = () => {
  return data[Math.floor(Math.random() * data.length)];
};

//Tampilan Win Game
const stopGame = () => {
  controls.classList.remove("hide");
  startButton.classList.remove("hide");
};

//Fungsi Drag & Drop
function dragStart(e) {
  if (isTouchDevice()) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
    //Mulai gerakan untuk sentuh
    moveElement = true;
    currentElement = e.target;
  } else {
    //Untuk perangkat non-sentuh, set data yang akan ditransfer
    e.dataTransfer.setData("text", e.target.id);
  }
}

//Event yang terjadi pada target drop
function dragOver(e) {
  e.preventDefault();
}

//Untuk gerakan layar sentuh
const touchMove = (e) => {
  if (moveElement) {
    e.preventDefault();
    let newX = e.touches[0].clientX;
    let newY = e.touches[0].clientY;
    let currentSelectedElement = document.getElementById(e.target.id);
    currentSelectedElement.parentElement.style.top =
      currentSelectedElement.parentElement.offsetTop - (initialY - newY) + "px";
    currentSelectedElement.parentElement.style.left =
      currentSelectedElement.parentElement.offsetLeft -
      (initialX - newX) +
      "px";
    initialX = newX;
    initialY = newY;
  }
};

const drop = (e) => {
  e.preventDefault();
  //Untuk layar sentuh
  if (isTouchDevice()) {
    moveElement = false;
    //Pilih div nama negara menggunakan atribut khusus
    const currentDrop = document.querySelector(`div[data-id='${e.target.id}']`);
    //Dapatkan batas div
    const currentDropBound = currentDrop.getBoundingClientRect();
    //Jika posisi bendera jatuh di dalam batas nama negara
    if (
      initialX >= currentDropBound.left &&
      initialX <= currentDropBound.right &&
      initialY >= currentDropBound.top &&
      initialY <= currentDropBound.bottom
    ) {
      currentDrop.classList.add("dropped");
      //Sembunyikan gambar sebenarnya
      currentElement.classList.add("hide");
      currentDrop.innerHTML = ``;
      //Masukkan elemen img baru
      currentDrop.insertAdjacentHTML(
        "afterbegin",
        `<img src= "${currentElement.id}.png">`
      );
      count += 1;
    }
  } else {
    //Akses data
    const draggedElementData = e.dataTransfer.getData("text");
    //Dapatkan nilai atribut khusus
    const droppableElementData = e.target.getAttribute("data-id");
    if (draggedElementData === droppableElementData) {
      const draggedElement = document.getElementById(draggedElementData);
      //Kelas dropped
      e.target.classList.add("dropped");
      //Sembunyikan gambar saat ini
      draggedElement.classList.add("hide");
      //Draggable diset ke false
      draggedElement.setAttribute("draggable", "false");
      e.target.innerHTML = ``;
      //Masukkan img baru
      e.target.insertAdjacentHTML(
        "afterbegin",
        `<img src="${draggedElementData}.png">`
      );
      count += 1;
    }
  }
  //Menang
  if (count == 3) {
    result.innerText = `Anda Menang!`;
    stopGame();
  }
};

//Membuat bendera dan negara
const creator = () => {
  dragContainer.innerHTML = "";
  dropContainer.innerHTML = "";
  let randomData = [];
  //untuk nilai acak string dalam array
  for (let i = 1; i <= 3; i++) {
    let randomValue = randomValueGenerator();
    if (!randomData.includes(randomValue)) {
      randomData.push(randomValue);
    } else {
      //Jika nilai sudah ada maka kurangi i dengan 1
      i -= 1;
    }
  }
  for (let i of randomData) {
    const flagDiv = document.createElement("div");
    flagDiv.classList.add("draggable-image");
    flagDiv.setAttribute("draggable", true);
    if (isTouchDevice()) {
      flagDiv.style.position = "absolute";
    }
    flagDiv.innerHTML = `<img src="${i}.png" id="${i}">`;
    dragContainer.appendChild(flagDiv);
  }
  //Urutkan array secara acak sebelum membuat div negara
  randomData = randomData.sort(() => 0.5 - Math.random());
  for (let i of randomData) {
    const countryDiv = document.createElement("div");
    // Tampilkan nama warna di dalam kotak kosong
    countryDiv.innerHTML = `<div class='countries' data-id='${i}' style='border: 2px dashed #000; color: black; text-align: center; line-height: 100px; height: 100px; width: 100px; border-radius: 10px; font-size: 24px;'>
    ${i.charAt(0).toUpperCase() + i.slice(1)}
    </div>
    `;
    dropContainer.appendChild(countryDiv);
  }
};

//Mulai Permainan
startButton.addEventListener(
  "click",
  (startGame = async () => {
    currentElement = "";
    controls.classList.add("hide");
    startButton.classList.add("hide");
    //Ini akan menunggu creator untuk membuat gambar dan kemudian melanjutkan
    await creator();
    count = 0;
    dropPoints = document.querySelectorAll(".countries");
    draggableObjects = document.querySelectorAll(".draggable-image");

    //Event
    draggableObjects.forEach((element) => {
      element.addEventListener("dragstart", dragStart);
      //untuk layar sentuh
      element.addEventListener("touchstart", dragStart);
      element.addEventListener("touchend", drop);
      element.addEventListener("touchmove", touchMove);
    });
    dropPoints.forEach((element) => {
      element.addEventListener("dragover", dragOver);
      element.addEventListener("drop", drop);
    });
  })
);
