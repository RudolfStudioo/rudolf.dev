// ==========================================
// 1. INITIALIZE ANIMATION (AOS)
// ==========================================
AOS.init({
  once: true, // anim hanya sekali saat scroll ke bawah
  offset: 100, // trigger offset
  duration: 800, // durasi animasi
  easing: "ease-out-cubic",
});

// ==========================================
// 2. LOGIKA DATA PROJECT (JSON & LOAD MORE)
// ==========================================

let allProjects = []; // Wadah untuk menyimpan data
const INITIAL_LIMIT = 6; // Jumlah project awal yang tampil
let isExpanded = false; // STATUS TRACKER: Apakah sedang terbuka semua atau tidak

// A. Fungsi Fetch Data dari JSON
async function loadProjectsData() {
  const loading = document.getElementById("loading-indicator");

  try {
    // Mengambil data dari file projects.json
    const response = await fetch("projects.json");

    if (!response.ok) throw new Error("Gagal mengambil data JSON");

    allProjects = await response.json();

    // Sembunyikan loading text jika ada
    if (loading) loading.style.display = "none";

    // Render awal
    renderProjects();
  } catch (error) {
    console.error("Error loading projects:", error);
    if (loading) {
      loading.innerHTML = `<p class="text-red-500">Gagal memuat data. Pastikan menggunakan Live Server.</p>`;
    }
  }
}

// B. Fungsi Render HTML ke Layar
function renderProjects() {
  const container = document.getElementById("project-grid");
  const btnContainer = document.getElementById("btn-container");
  const btn = document.getElementById("load-more-btn");

  // Jika container tidak ditemukan, stop fungsi (safety check)
  if (!container) return;

  // 1. Tentukan batas berdasarkan status isExpanded
  // Jika Expanded = ambil semua data, Jika tidak = ambil batas awal
  const limit = isExpanded ? allProjects.length : INITIAL_LIMIT;

  // 2. Potong Data array sesuai limit
  const projectsToDisplay = allProjects.slice(0, limit);

  // 3. Reset konten container
  container.innerHTML = "";

  let html = "";

  projectsToDisplay.forEach((item, index) => {
    // Delay animasi:
    // Jika sedang mode 'Lihat Semua' (Expanded), item baru (index >= 6) diberi delay bertahap
    // Jika sedang mode awal, delay normal
    let delay = (index % 3) * 100;

    // Opsional: Reset delay jadi 0 jika me-render ulang untuk 'Sembunyikan' agar lebih cepat
    if (isExpanded && index < INITIAL_LIMIT) delay = 0;

    html += `
      <div class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 group flex flex-col h-full" 
           data-aos="fade-up" 
           data-aos-delay="${delay}">
          
          <div class="relative overflow-hidden aspect-video">
              <img src="${item.image}" alt="${item.title}" 
                   class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" 
                   onerror="this.src='https://placehold.co/600x400/e2e8f0/1e3a8a?text=${encodeURIComponent(
                     item.title
                   )}'">
              
              <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  <a href="${
                    item.link
                  }" target="_blank" class="bg-white text-slate-900 px-6 py-2 rounded-full font-bold hover:bg-primary hover:text-white transition transform translate-y-4 group-hover:translate-y-0">Visit Site</a>
              </div>
          </div>

          <div class="p-6 flex-1 flex flex-col">
              <div class="flex gap-2 mb-3 flex-wrap">
                  ${item.tags
                    .map(
                      (tag) =>
                        `<span class="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded">${tag}</span>`
                    )
                    .join("")}
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">${
                item.title
              }</h3>
              <p class="text-slate-500 text-sm mb-4 flex-1">${item.desc}</p>
              <a href="${
                item.link
              }" target="_blank" class="text-primary font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">Lihat Project <i class="ph-bold ph-arrow-right"></i></a>
          </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // C. Logika Tombol (Toggle View)
  if (btnContainer && btn) {
    // Cek apakah total project lebih dari limit awal (misal > 6)
    if (allProjects.length > INITIAL_LIMIT) {
      btnContainer.classList.remove("hidden"); // Pastikan tombol muncul

      if (isExpanded) {
        // KONDISI TERBUKA: Ubah tombol jadi "Sembunyikan"
        btn.innerHTML = 'Sembunyikan <i class="ph-bold ph-caret-up ml-2"></i>';
      } else {
        // KONDISI TERTUTUP: Ubah tombol jadi "Lihat Semua"
        btn.innerHTML =
          'Lihat Semua Project <i class="ph-bold ph-caret-down ml-2"></i>';
      }
    } else {
      // Jika project sedikit, sembunyikan tombol
      btnContainer.classList.add("hidden");
    }
  }

  // Refresh animasi AOS agar elemen baru terdeteksi
  setTimeout(() => {
    if (typeof AOS !== "undefined") AOS.refresh();
  }, 100);
}

// C. Event Listeners
// 1. Load data saat web dibuka
document.addEventListener("DOMContentLoaded", loadProjectsData);

// 2. Klik tombol Toggle (Lihat Semua / Sembunyikan)
const loadMoreBtn = document.getElementById("load-more-btn");
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", function () {
    // Ubah status (True jadi False, False jadi True)
    isExpanded = !isExpanded;

    // Render ulang tampilan
    renderProjects();

    // LOGIKA SCROLL: Jika tombol diklik untuk "Sembunyikan" (status jadi false)
    if (!isExpanded) {
      const portfolioSection = document.getElementById("portfolio");
      if (portfolioSection) {
        // Scroll halus ke bagian atas portfolio
        portfolioSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
}

// ==========================================
// 3. UI INTERACTION (Mobile Menu & Navbar)
// ==========================================

// A. Mobile Menu Toggle
const btn = document.getElementById("mobile-menu-btn");
const menu = document.getElementById("mobile-menu");

if (btn && menu) {
  btn.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  // Close menu when clicking a link
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.add("hidden");
    });
  });
}

// B. Navbar Scroll Effect
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  if (nav) {
    if (window.scrollY > 50) {
      nav.classList.add("bg-white/95", "shadow-md");
      nav.classList.remove("border-transparent");
    } else {
      nav.classList.remove("shadow-md");
      // Optional: Kembalikan border transparan jika perlu
      // nav.classList.add("border-transparent");
    }
  }
});
