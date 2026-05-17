/**
 * ==========================================================================
 * DOM.JS - Manajemen Manipulasi Tampilan (User Interface)
 * ==========================================================================
 * File ini berfokus pada logika manipulasi elemen HTML berdasarkan data 
 * yang dikirim oleh pusat kendali (main.js).
 */

/**
 * Fungsi Utama untuk memperbarui seluruh komponen preview portfolio
 * @param {Object} data - Objek portfolio mahasiswa berisi profile dan skills
 */
function renderAllPreview(data) {
    if (!data) return;

    // 1. Ambil data profil atau gunakan teks default jika input masih kosong (Short-circuit evaluation)
    const nama = data.profile.nama.trim() || "Nama Mahasiswa";
    const jurusan = data.profile.jurusan.trim() || "Jurusan";
    const kampus = data.profile.kampus.trim() || "Kampus";
    const bio = data.profile.bioRingkas.trim() || "Deskripsi diri anda akan muncul di sini setelah form diisi.";

    // 2. Manipulasi konten teks elemen HTML menggunakan textContent (Aman dari celah XSS)
    document.getElementById("view-nama").textContent = nama;
    document.getElementById("view-jurusan").textContent = jurusan;
    document.getElementById("view-kampus").textContent = kampus;
    document.getElementById("view-bio").textContent = bio;

    // 3. Render komponen Array (Skills) ke dalam bentuk elemen HTML dinamis
    renderSkillsPreview(data.skills);
}

/**
 * Logika Looping: Mengubah Array of Strings menjadi elemen-elemen tag HTML
 * @param {Array} skillsArray - Contoh: ["Python", "HTML"]
 */
function renderSkillsPreview(skillsArray) {
    const skillsContainer = document.getElementById("view-skills");
    
    // Bersihkan kontainer terlebih dahulu dari sisa render sebelumnya (Reset State)
    skillsContainer.innerHTML = "";

    // Jika array kosong, tampilkan satu tag penanda default
    if (skillsArray.length === 0) {
        const defaultTag = document.createElement("span");
        defaultTag.className = "skill-tag";
        defaultTag.textContent = "Skill Anda";
        skillsContainer.appendChild(defaultTag);
        return;
    }

    // Algoritma Looping untuk membuat elemen baru secara dinamis
    skillsArray.forEach(skillName => {
        // Buat elemen baru berupa tag <span>
        const tag = document.createElement("span");
        
        // Berikan kelas CSS agar styling di style.css otomatis diterapkan
        tag.className = "skill-tag";
        
        // Masukkan teks nama skill
        tag.textContent = skillName;
        
        // Masukkan (append) elemen span baru tersebut ke dalam kontainer utama di HTML
        skillsContainer.appendChild(tag);
    });
}

/**
 * Fungsi untuk memetakan data yang tersimpan di LocalStorage kembali ke form input saat reload
 * @param {Object} data - Objek portfolio yang berhasil dimuat dari storage
 */
function applyDataToForm(data) {
    if (!data) return;

    // Masukkan kembali nilai teks ke elemen input form masing-masing
    document.getElementById("input-nama").value = data.profile.nama || "";
    document.getElementById("input-jurusan").value = data.profile.jurusan || "";
    document.getElementById("input-kampus").value = data.profile.kampus || "";
    document.getElementById("input-bio").value = data.profile.bioRingkas || "";
    
    // Gabungkan kembali array menjadi string yang dipisahkan koma untuk input skill
    document.getElementById("input-skills").value = data.skills ? data.skills.join(", ") : "";
}