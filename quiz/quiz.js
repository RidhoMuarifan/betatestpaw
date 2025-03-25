// Data quiz: 5 soal (2 soal audio dan 3 soal gambar)
const quizData = [
  {
    type: "audio",
    question: "Lagu daerah ini berasal dari provinsi mana?",
    audio:
      "https://od.lk/s/NzVfNDgyNTMyOTFf/Lirik%20Ampar%20Ampar%20Pisang%20-%20Lagu%20Daerah%20Kalimantan%20Selatan.mp3",
    options: ["Jawa Barat", "Sumatera Utara", "Kalimantan Selatan", "Bali"],
    answer: "Kalimantan Selatan",
  },
  {
    type: "audio",
    question: "Lagu 'Gundul Pacul' berasal dari provinsi mana?",
    audio:
      "https://od.lk/s/NzVfNDgyNTMyOTVf/Lirik%20Gundul%20Pacul%20-%20Lagu%20Daerah%20Jawa%20Tengah.mp3",
    options: ["Aceh", "Riau", "Kalimantan Timur", "Jawa Tengah"],
    answer: "Jawa Tengah",
  },
  {
    type: "image",
    question:
      "Gambar alat musik ini adalah alat musik tradisional dari daerah mana?",
    image:
      "https://media.suara.com/pictures/653x366/2021/07/27/53119-ilustrasi-alat-musik-sampe-istimewa.jpg",
    options: [
      "Maluku",
      "Sumatera Barat",
      "Sulawesi Selatan",
      "Kalimantan Timur",
    ],
    answer: "Kalimantan Timur",
  },
  {
    type: "image",
    question: "Gambar alat musik ini dikenal dengan sebutan apa?",
    image:
      "https://data.hellowork-asia.com/images/blogs/2311-651ebff84bad4.jpeg",
    options: ["Angklung", "Gamelan", "Sasando", "Kolintang"],
    answer: "Angklung",
  },
  {
    type: "image",
    question: "Alat musik pada gambar tersebut berasal dari provinsi mana?",
    image:
      "https://www.djkn.kemenkeu.go.id/files/images/2021/09/Manado_-_Kolintang_IE1.jpeg",
    options: ["Jawa Timur", "Bali", "Sumatera Utara", "Sulawesi Utara"],
    answer: "Sulawesi Utara",
  },
];

let currentQuestion = 0;
let score = 0;
const pointPerQuestion = 25;
const answered = Array(quizData.length).fill(false);
let imageZoomLevel = 1;

const questionNumberEl = document.getElementById("question-number");
const questionTextEl = document.getElementById("question-text");
const mediaContainerEl = document.getElementById("media-container");
const optionsEl = document.getElementById("options");
const scoreDisplayEl = document.getElementById("score-display");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressEl = document.getElementById("progress");

// Notifikasi
const notificationEl = document.getElementById("notification");

function showNotification(message, type = "success") {
  notificationEl.textContent = message;
  notificationEl.className = `fixed top-5 right-5 z-50 px-4 py-2 rounded shadow ${
    type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
  }`;
  notificationEl.classList.remove("hidden");
  setTimeout(() => {
    notificationEl.classList.add("hidden");
  }, 2000);
}

function updateProgress() {
  const progressPercentage = (currentQuestion / quizData.length) * 100;
  progressEl.style.width = `${progressPercentage}%`;
}

function loadQuestion() {
  updateProgress();
  questionNumberEl.textContent = `Pertanyaan ${currentQuestion + 1} dari ${
    quizData.length
  }`;
  scoreDisplayEl.textContent = `Score: ${score}`;

  // Bersihkan konten lama
  questionTextEl.textContent = "";
  mediaContainerEl.innerHTML = "";
  optionsEl.innerHTML = "";

  imageZoomLevel = 1; // reset zoom untuk soal gambar
  const quiz = quizData[currentQuestion];
  questionTextEl.textContent = quiz.question;

  // Tampilkan media sesuai tipe
  if (quiz.type === "audio") {
    const audioDiv = document.createElement("div");
    audioDiv.classList.add("audio-player", "mb-4");
    audioDiv.innerHTML = `
      <button id="audio-btn-${currentQuestion}" onclick="toggleAudio(${currentQuestion})" class="py-2 px-4 text-base rounded bg-[#1e3c72] text-white">Putar Audio</button>
      <audio id="audio-${currentQuestion}" src="${quiz.audio}" class="hidden"></audio>
    `;
    mediaContainerEl.appendChild(audioDiv);
  } else if (quiz.type === "image") {
    const img = document.createElement("img");
    img.id = "quiz-image";
    img.src = quiz.image;
    img.alt = "Gambar Alat Musik";
    img.classList.add("rounded-lg", "transition-transform", "duration-300");
    img.style.transform = `scale(${imageZoomLevel})`;
    mediaContainerEl.appendChild(img);

    // Tambahkan tombol zoom
    const zoomControls = document.createElement("div");
    zoomControls.classList.add("mt-2", "flex", "gap-2");
    zoomControls.innerHTML = `
      <button onclick="zoomImage(1.1)" class="py-1 px-3 rounded bg-blue-500 text-white">Zoom In</button>
      <button onclick="zoomImage(0.9)" class="py-1 px-3 rounded bg-blue-500 text-white">Zoom Out</button>
    `;
    mediaContainerEl.appendChild(zoomControls);
  }

  // Tampilkan pilihan jawaban
  quiz.options.forEach((optionText) => {
    const optionDiv = document.createElement("div");
    optionDiv.className =
      "option p-2.5 border-2 border-[#1e3c72] rounded-lg cursor-pointer transition-colors duration-300";
    optionDiv.textContent = optionText;
    optionDiv.onclick = () => selectOption(optionDiv, quiz.answer);
    optionsEl.appendChild(optionDiv);
  });

  prevBtn.disabled = currentQuestion === 0;
  if (answered[currentQuestion]) {
    Array.from(optionsEl.children).forEach(
      (child) => (child.style.pointerEvents = "none")
    );
  } else {
    Array.from(optionsEl.children).forEach(
      (child) => (child.style.pointerEvents = "auto")
    );
  }
}

function selectOption(optionDiv, correctAnswer) {
  if (answered[currentQuestion]) return;
  answered[currentQuestion] = true;
  const selected = optionDiv.textContent.trim();
  if (selected === correctAnswer) {
    score += pointPerQuestion;
    optionDiv.style.background = "#4CAF50";
    showNotification("Benar!", "success");
  } else {
    optionDiv.style.background = "#f44336";
    showNotification("Salah!", "error");
    // Tandai jawaban yang benar
    Array.from(optionsEl.children).forEach((child) => {
      if (child.textContent.trim() === correctAnswer) {
        child.style.background = "#4CAF50";
      }
    });
  }
  scoreDisplayEl.textContent = `Score: ${score}`;
  Array.from(optionsEl.children).forEach(
    (child) => (child.style.pointerEvents = "none")
  );
}

function nextQuestion() {
  if (currentQuestion < quizData.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    showFinalPage();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
}

// Fungsi toggle play/pause audio
function toggleAudio(index) {
  const audioEl = document.getElementById(`audio-${index}`);
  const btnEl = document.getElementById(`audio-btn-${index}`);
  if (audioEl.paused) {
    audioEl.play();
    btnEl.textContent = "Pause Audio";
  } else {
    audioEl.pause();
    btnEl.textContent = "Putar Audio";
  }
}

// Fungsi zoom untuk gambar
function zoomImage(factor) {
  imageZoomLevel *= factor;
  const img = document.getElementById("quiz-image");
  if (img) {
    img.style.transform = `scale(${imageZoomLevel})`;
  }
}

// Tampilan akhir quiz
function showFinalPage() {
  let finalScore = score;
  if (score === quizData.length * pointPerQuestion) {
    finalScore = 100;
  }
  const quizContainer = document.getElementById("quiz-container");
  quizContainer.innerHTML = `
    <div class="p-5">
      <h1 class="text-3xl font-bold text-[#1e3c72] mb-5">Selamat!</h1>
      <p class="text-xl mb-5">Quiz selesai! Nilai akhir Anda: <span class="font-bold">${finalScore}</span></p>
      <div class="flex flex-col gap-4 items-center">
        <button onclick="location.reload()" class="py-3 px-6 bg-[#1e3c72] text-white font-bold rounded-full transition-transform duration-300 hover:scale-110">Ulangi Quiz</button>
        <button onclick="location.href='../index.html'" class="py-3 px-6 bg-[#1e3c72] text-white font-bold rounded-full transition-transform duration-300 hover:scale-110">Kembali ke Menu Utama</button>
      </div>
    </div>
  `;
  progressEl.style.width = `100%`;
}

// Navigasi keyboard: panah kiri untuk prev dan panah kanan untuk next
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    nextQuestion();
  } else if (e.key === "ArrowLeft") {
    prevQuestion();
  }
});

loadQuestion();
