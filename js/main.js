/**
 * ==========================================================================
 * MAIN.JS - Pusat Kendali Aplikasi (Orchestrator)
 * ==========================================================================
 * File ini berfungsi sebagai otak yang menghubungkan interaksi UI (Event)
 * dengan logika manipulasi tampilan (DOM) dan penyimpanan data (Storage).
 */

// Event Listener: Dijalankan otomatis saat seluruh struktur HTML selesai dimuat browser
document.addEventListener("DOMContentLoaded", () => {

    // 1. Inisialisasi Data Awal (Ambil dari localStorage atau pakai template kosong)
    // Fungsi 'loadPortfolioData' dan 'renderAllPreview' akan kita buat di file js berikutnya.
    const savedData = loadPortfolioData();
    renderAllPreview(savedData);

    // Set nilai form input sesuai dengan data yang berhasil dimuat
    applyDataToForm(savedData);

    // 2. LOGIKA EVENT: Deteksi Ketikan Pengguna pada Form Input (Real-Time)
    const form = document.getElementById("portfolio-form");

    // 3. LOGIKA EVENT: Ekspor ke PDF / Cetak
    const printButton = document.getElementById("btn-print");

    printButton.addEventListener("click", () => {
        // Fungsi bawaan browser untuk memicu dialog print/save PDF
        window.print();
    });

    form.addEventListener("input", (event) => {
        // Ambil seluruh data terbaru dari elemen-elemen form
        const currentData = {
            profile: {
                nama: document.getElementById("input-nama").value,
                jurusan: document.getElementById("input-jurusan").value,
                kampus: document.getElementById("input-kampus").value,
                bioRingkas: document.getElementById("input-bio").value
            },
            // Logika String Manipulation: Mengubah teks koma menjadi Array murni
            skills: parseSkills(document.getElementById("input-skills").value)
        };

        // Perbarui tampilan preview secara real-time
        renderAllPreview(currentData);

        // Simpan data terbaru ke dalam localStorage agar tidak hilang saat refresh
        savePortfolioData(currentData);
    });

    // 3. LOGIKA EVENT: Deteksi Perubahan Tema (Dropdown)
    const themeSelect = document.getElementById("theme-select");

    // Set dropdown select ke tema yang terakhir kali disimpan
    themeSelect.value = document.documentElement.getAttribute("data-theme") || "minimalist";

    themeSelect.addEventListener("change", (event) => {
        const selectedTheme = event.target.value;

        // Ubah atribut data-theme di tag <html> untuk memicu perubahan CSS Variables
        document.documentElement.setAttribute("data-theme", selectedTheme);

        // Simpan preferensi tema pengguna ke localStorage
        saveThemePreference(selectedTheme);
    });

    // 4. LOGIKA EVENT: SPA Tab Navigation (Vanilla JS)
    const navLinks = document.querySelectorAll(".nav-menu a[data-tab]");
    const tabContents = document.querySelectorAll(".tab-content");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Mencegah reload halaman standar
            
            // 1. Hapus status active dari semua link navigasi
            navLinks.forEach(l => l.classList.remove("active"));
            
            // 2. Sembunyikan semua tab konten (tambahkan attribut hidden dan cabut active)
            tabContents.forEach(tab => {
                tab.classList.remove("active");
                tab.setAttribute("hidden", "true");
            });

            // 3. Aktifkan link yang baru diklik
            link.classList.add("active");
            
            // 4. Tampilkan tab konten yang bersesuaian dengan target
            const targetTabId = link.getAttribute("data-tab");
            const targetTab = document.getElementById(targetTabId);
            
            if (targetTab) {
                targetTab.classList.add("active");
                targetTab.removeAttribute("hidden");
            }
        });
    });
});

/**
 * Fungsi Pembantu (Helper Function) untuk memproses teks skill menjadi array.
 * Contoh Input: "Python, HTML, CSS" -> Output: ["Python", "HTML", "CSS"]
 */
function parseSkills(skillsString) {
    if (!skillsString.trim()) return [];

    // Pisahkan berdasarkan koma, lalu bersihkan spasi di awal/akhir tiap kata (trim)
    return skillsString.split(",").map(skill => skill.trim()).filter(skill => skill !== "");
}