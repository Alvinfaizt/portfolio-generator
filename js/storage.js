const mahasiswaPortfolio = {
    profile: {
        nama: "",
        jurusan: "",
        universitas: "",
        bioRingkas: "",
        email: "",
        linkedin: ""
    },
    skills: [], // Array of strings: ["Python", "Public Speaking", "Accounting"]
    experiences: [
        {
            id: 1,
            tipe: "", // "Proyek" atau "Organisasi" atau "Kerja"
            namaAktivitas: "",
            peran: "",
            tahun: "",
            deskripsi: ""
        }
    ],
    config: {
        tema: "minimalist" // opsi: tech, minimalist, creative
    }
};

/**
 * ==========================================================================
 * STORAGE.JS - Manajemen Penyimpanan Data Lokal (Web Storage API)
 * ==========================================================================
 * File ini mengurus penyimpanan data portfolio dan preferensi tema pengguna
 * ke localStorage browser, sehingga data tidak hilang saat browser ditutup.
 */

// Kunci unik untuk membedakan data aplikasi kita dengan aplikasi lain di domain yang sama
const STORAGE_KEY_PORTFOLIO = "universal_portfolio_data";
const STORAGE_KEY_THEME = "universal_portfolio_theme";

/**
 * Logika Menyimpan Data: Mengubah objek JavaScript menjadi string JSON
 * @param {Object} data - Objek portfolio terbaru dari form
 */
function savePortfolioData(data) {
    try {
        // Tipe data objek di memori lokal harus diubah menjadi String (Serialization)
        const jsonString = JSON.stringify(data);
        localStorage.setItem(STORAGE_KEY_PORTFOLIO, jsonString);
    } catch (error) {
        console.error("Gagal menyimpan data ke localStorage:", error);
    }
}

/**
 * Logika Memuat Data: Mengambil string JSON dan mengembalikannya menjadi Objek
 * @returns {Object} Data portfolio mahasiswa atau objek default jika kosong
 */
function loadPortfolioData() {
    try {
        const rawData = localStorage.getItem(STORAGE_KEY_PORTFOLIO);

        // Jika data ada di storage, ubah kembali string JSON menjadi Objek murni
        if (rawData) {
            return JSON.parse(rawData);
        }
    } catch (error) {
        console.error("Gagal membaca data dari localStorage:", error);
    }

    // Jika data kosong/baru pertama kali dibuka, kembalikan objek struktur data default
    return {
        profile: {
            nama: "",
            jurusan: "",
            kampus: "",
            bioRingkas: ""
        },
        skills: []
    };
}

/**
 * Menyimpan preferensi tema yang dipilih pengguna (tech / minimalist)
 * @param {String} themeName 
 */
function saveThemePreference(themeName) {
    localStorage.setItem(STORAGE_KEY_THEME, themeName);
}

/**
 * Membaca preferensi tema terakhir kali dan langsung menerapkannya pada tag HTML
 */
function initThemeFromStorage() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || "minimalist";
    document.documentElement.setAttribute("data-theme", savedTheme);
}

// Langsung eksekusi pengecekan tema begitu file storage.js dibaca oleh browser
initThemeFromStorage();