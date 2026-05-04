let soal = [];
let index = 0;
let waktu = 60;
let timer;

// AMBIL SEMUA ELEMEN HTML (WAJIB)
const startScreen = document.getElementById("startScreen");
const examScreen = document.getElementById("examScreen");
const cbtStatus = document.getElementById("cbtStatus");
const topik = document.getElementById("topik");
const soalElem = document.getElementById("soal");   // ✅ INI YANG HILANG
const opsi = document.getElementById("opsi");
const penjelasan = document.getElementById("penjelasan");
const timerElem = document.getElementById("timer");

// LOAD SOAL
fetch("Database_Soal_Matematika_SMP7_C6.json")
  .then(res => res.json())
  .then(data => {
    soal = data;
    console.log("Soal berhasil dimuat:", soal.length);
  })
  .catch(err => {
    alert("Gagal memuat soal. Periksa file JSON.");
    console.error(err);
  });

// MULAI UJIAN
function mulaiUjian() {
  document.documentElement.requestFullscreen();

  startScreen.style.display = "none";
  examScreen.style.display = "block";
  cbtStatus.style.display = "block";

  index = 0;
  tampilSoal();
}

// TAMPILKAN SOAL
function tampilSoal() {
  const s = soal[index];

  topik.innerText = s.topik;
  soalElem.innerText = s.soal; // ✅ sekarang aman
  penjelasan.style.display = "none";

  let html = "";
  s.opsi.forEach((o, i) => {
    const huruf = String.fromCharCode(65 + i);
    html += `
      <label>
        <input type="radio" name="jawaban" value="${huruf}">
        ${o}
      </label>
    `;
  });
  opsi.innerHTML = html;

  startTimer();
}

// TIMER
function startTimer() {
  clearInterval(timer);
  waktu = 120; // ⏱ 2 menit
  timerElem.innerText = waktu;

  timer = setInterval(() => {
    waktu--;
    timerElem.innerText = waktu;
    if (waktu <= 0) {
      clearInterval(timer);
      tampilPenjelasan();
    }
  }, 1000);
}

// JAWAB
function submitJawaban() {
  clearInterval(timer);
  tampilPenjelasan();
}

// LEWATI
function skipSoal() {
  clearInterval(timer);
  tampilPenjelasan();
}

// PENJELASAN
function tampilPenjelasan() {
  penjelasan.style.display = "block";
  penjelasan.innerText = soal[index].penjelasan;
  index++;

  setTimeout(tampilSoal, 4000);
}

function selesaiUjian() {
  document.exitFullscreen();
  alert("Ujian selesai.");
}
