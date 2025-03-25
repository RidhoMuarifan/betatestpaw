// ------------------------------
// Script untuk Image Slider
// ------------------------------
const images = [
  "https://i.pinimg.com/736x/2b/a6/ba/2ba6ba984d89a87881fd3f14877cf3c2.jpg",
  "https://rri-assets.s3.ap-southeast-3.amazonaws.com/berita/81/o/not_angka_lagu_tanah_airku_ibu_sud_ok/egl3vgrwan83p9m.png",
  "https://assets.pikiran-rakyat.com/crop/0x0:0x0/x/photo/2021/08/19/237429508.jpg",
  "https://asset.kompas.com/crops/ioIbjtmRtaQRhoEkxC7E6FEKo2Y=/24x0:459x290/375x240/data/photo/2021/03/07/60443ab40ca32.jpg",
  "https://id-static.z-dn.net/files/dfe/b0bf4a3d7418be2e5e21025e24cd8eec.jpg",
  "https://i.pinimg.com/736x/7f/29/2f/7f292fb595ca26f14032d6a4eb4bc862.jpg",
];
let sliderIndex = 0;
const sliderImg = document.getElementById("slider-img");

function changeImage() {
  sliderImg.style.transform = "scale(0.8) rotateY(-90deg)";
  setTimeout(() => {
    sliderImg.src = images[sliderIndex];
    sliderImg.style.transform = "scale(1) rotateY(0deg)";
  }, 250);
}
function nextSlide() {
  sliderIndex = (sliderIndex + 1) % images.length;
  changeImage();
}
function prevSlide() {
  sliderIndex = (sliderIndex - 1 + images.length) % images.length;
  changeImage();
}

// ------------------------------
// Script untuk Piano Interaktif
// ------------------------------
const keys = document.querySelectorAll(".key");
const notationElement = document.getElementById("notation");
let playedNotes = [];
let noteIdCounter = 0;

// Audio setup
const activeSounds = {};
let oggVolume = 0.2;
let oggDuration = 2.5;

function updateNotationDisplay() {
  if (playedNotes.length === 0) {
    notationElement.textContent = "Tekan tombol piano";
  } else {
    const texts = playedNotes.map((item) => item.text);
    notationElement.textContent = "Notasi: " + texts.join(" → ");
  }
}

function addNotation(note, solfege) {
  const noteObj = { id: noteIdCounter++, text: `${solfege} (${note})` };
  playedNotes.push(noteObj);
  updateNotationDisplay();
  setTimeout(() => {
    playedNotes = playedNotes.filter((item) => item.id !== noteObj.id);
    updateNotationDisplay();
  }, 5000);
}

function playSound(note) {
  if (activeSounds[note]) {
    activeSounds[note].pause();
    activeSounds[note].currentTime = 0;
  }
  const audioMP3 = new Audio(`Nada/${encodeURIComponent(note)}.mp3`);
  const audioOGG = new Audio(`Nada/${encodeURIComponent(note)}.ogg`);
  audioMP3.volume = 1.0;
  audioOGG.volume = oggVolume;
  audioMP3
    .play()
    .then(() => {
      activeSounds[note] = audioMP3;
    })
    .catch(() => {
      console.warn(`MP3 gagal diputar: ${note}, mencoba OGG...`);
      audioOGG
        .play()
        .then(() => {
          activeSounds[note] = audioOGG;
          setTimeout(() => {
            audioOGG.pause();
            audioOGG.currentTime = 0;
          }, oggDuration * 1000);
        })
        .catch((error) => console.error("MP3 & OGG gagal diputar:", error));
    });
}

keys.forEach((key) => {
  const solfege = key.getAttribute("data-solfege");
  const label = document.createElement("div");
  label.className = "solfege";
  label.textContent = solfege;
  key.appendChild(label);

  key.addEventListener("mousedown", () => {
    const note = key.getAttribute("data-note");
    const solfege = key.getAttribute("data-solfege");
    playSound(note);
    addNotation(note, solfege);
    key.classList.add("active");
  });
  key.addEventListener("mouseup", () => {
    key.classList.remove("active");
  });
  key.addEventListener("mouseenter", (event) => {
    if (event.buttons === 1) {
      const note = key.getAttribute("data-note");
      const solfege = key.getAttribute("data-solfege");
      playSound(note);
      addNotation(note, solfege);
      key.classList.add("active");
    }
  });
});

const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", () => {
  playedNotes = [];
  updateNotationDisplay();
});
