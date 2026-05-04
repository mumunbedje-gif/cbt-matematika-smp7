let soal = [];
let index = 0;
let skor = 0;
let waktu = 60;
let timer;

// LOAD DATABASE
fetch("Database_Soal_Matematika_SMP7_C6.json")
  .then(r => r.json())
  .then(data => soal = data);

// BLOK REFRESH & BACK
window.onbeforeunload = () => "Ujian sedang berlangsung!";
history.pushState(null, null, location.href);
window.onpopstate = () =>
  history.pushState(null, null, location.href);

// SEED RANDOM
function hashIdentitas(nama, nis) {
  let s = nama + nis, h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function seededRandom(seed) {
  return Math.abs(Math.sin(seed) * 10000) % 1;
}

function shuffleDenganSeed(arr, seed) {
  let a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    seed++;
    const j = Math.floor(seededRandom(seed) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// START CBT
function mulaiUjian() {
  const nama = namaSiswa.value.trim();
  const nis = nisSiswa.value.trim();
  if (!nama || !nis) {
    alert("Nama dan NIS wajib diisi");
    return;
  }

  document.documentElement.requestFullscreen();

  startScreen.style.display = "none";
  examScreen.style.display = "block";
  cbtStatus.style.display = "block";

  const seed = hashIdentitas(nama, nis);
  soal = shuffleDenganSeed(soal, seed);

  tampilSoal();
}

function tampilSoal() {
  const s = soal[index];
  topik.innerText = s.topik;
  soalElem.innerText = s.soal;
  penjelasan.style.display = "none";

  let html = "";
  s.opsi.forEach((o, i) => {
    html += `
      <label>
        <input type="radio" name="jawaban" value="${String.fromCharCode(65+i)}">
        ${o}
      </label>`;
  });
  opsi.innerHTML = html;

  startTimer();
}

function startTimer() {
  clearInterval(timer);
  waktu = 60;
  timer = setInterval(() => {
    timerElem.innerText = waktu--;
    if (waktu < 0) nilaiSkip();
  }, 1000);
}

function submitJawaban() {
  clearInterval(timer);
  const pilih = document.querySelector("input[name=jawaban]:checked");
  if (pilih) {
    skor += (pilih.value === soal[index].jawaban_benar) ? 4 : -1;
  }
  tampilPenjelasan();
}

function skipSoal() {
  clearInterval(timer);
  tampilPenjelasan();
}

function nilaiSkip() {
  tampilPenjelasan();
}

function tampilPenjelasan() {
  penjelasan.style.display = "block";
  penjelasan.innerText = soal[index].penjelasan;
  index++;
  setTimeout(() => {
    if (index < soal.length) tampilSoal();
    else {
      document.exitFullscreen();
      alert(`Ujian selesai.\nSkor akhir: ${skor}`);
    }
  }, 5000);
}