document.addEventListener("DOMContentLoaded", function() {
  // Tombol kembali ke menu utama
  document.getElementById("backButton").addEventListener("click", function() {
    window.location.href = "../index.html";
  });

  // Fitur Dark Mode Toggle
  const darkModeToggle = document.getElementById("darkModeToggle");
  darkModeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    // Simpan preferensi dark mode ke localStorage
    if(document.body.classList.contains("dark-mode")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.setItem("darkMode", "disabled");
    }
  });

  // Cek preferensi dark mode saat load halaman
  if(localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }

  // Event listener untuk setiap developer card
  const cards = document.querySelectorAll(".developer-card");
  cards.forEach(function(card) {
    card.addEventListener("click", function() {
      const name = card.getAttribute("data-name");
      alert("Anda memilih: " + name);
    });
  });
});
