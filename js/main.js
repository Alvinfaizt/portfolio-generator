/**
 * ==========================================================================
 * MAIN.JS - Pusat Kendali Aplikasi (Orchestrator)
 * ==========================================================================
 * File ini disederhanakan murni untuk menangani real-time preview, 
 * fitur localStorage, dan fungsionalitas print PDF. Navigasi 
 * One-Page Scroll ditangani seluruhnya oleh HTML/CSS murni.
 */

document.addEventListener("DOMContentLoaded", () => {

    // 1. Inisialisasi Data Awal (Ambil dari localStorage)
    const savedData = loadPortfolioData();
    renderAllPreview(savedData);

    // Set nilai form input sesuai dengan data yang dimuat
    applyDataToForm(savedData);

    // 2. LOGIKA EVENT: Deteksi Ketikan pada Form (Real-Time Rendering)
    const form = document.getElementById("portfolio-form");

    form.addEventListener("input", (event) => {
        // Ambil data terbaru dari input field
        const currentData = {
            profile: {
                nama: document.getElementById("input-nama").value,
                jurusan: document.getElementById("input-jurusan").value,
                kampus: document.getElementById("input-kampus").value,
                bioRingkas: document.getElementById("input-bio").value
            },
            skills: parseSkills(document.getElementById("input-skills").value)
        };

        // Render preview secara real-time
        renderAllPreview(currentData);

        // Simpan ke localStorage otomatis
        savePortfolioData(currentData);
    });

    // 3. LOGIKA EVENT: Fitur Ekspor PDF (Print Mode)
    const printButton = document.getElementById("btn-print");
    
    printButton.addEventListener("click", () => {
        // Memicu dialog cetak bawaan browser.
        // Konfigurasi visual saat dicetak sepenuhnya dikendalikan oleh @media print di style.css
        window.print();
    });

    // 4. LOGIKA EVENT: Deteksi Perubahan Tema Dropdown
    const themeSelect = document.getElementById("theme-select");
    
    // Sinkronisasi status dropdown dengan tema awal
    themeSelect.value = document.documentElement.getAttribute("data-theme") || "minimalist";

    themeSelect.addEventListener("change", (event) => {
        const selectedTheme = event.target.value;

        // Ubah variabel tema di root <html>
        document.documentElement.setAttribute("data-theme", selectedTheme);
        
        // Simpan preferensi tema
        saveThemePreference(selectedTheme);
    });

    // 5. LOGIKA EVENT: About Sub-Tabs Internal Navigation
    const subnavBtns = document.querySelectorAll(".subnav-btn");
    const aboutPanels = document.querySelectorAll(".about-panel");

    subnavBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Hapus kelas active dari semua tombol
            subnavBtns.forEach(b => b.classList.remove("active"));
            
            // Sembunyikan semua panel
            aboutPanels.forEach(panel => {
                panel.setAttribute("hidden", "true");
                panel.classList.remove("active");
            });

            // Aktifkan tombol yang ditekan
            btn.classList.add("active");

            // Tampilkan panel yang sesuai
            const targetId = btn.getAttribute("data-target");
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.removeAttribute("hidden");
                targetPanel.classList.add("active");
            }
        });
    });


    // 6. LOGIKA EVENT: Comment Image Upload Preview
    const imageUpload = document.getElementById("comment-image-upload");
    const placeholderBox = document.getElementById("upload-placeholder-box");
    const uploadIcon = document.getElementById("upload-icon");
    const uploadText = document.getElementById("upload-text");
    const removeImageBtn = document.getElementById("btn-remove-image");

    if (imageUpload) {
        // Klik pada box akan memicu input file, KECUALI jika klik pada tombol remove
        placeholderBox.addEventListener("click", function(event) {
            if (event.target.closest("#btn-remove-image")) return;
            imageUpload.click();
        });

        imageUpload.addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith("image/")) {
                // Terapkan state sukses yang estetik
                placeholderBox.classList.add("success");
                uploadIcon.className = "bx bx-check-circle";
                uploadText.textContent = file.name;
                removeImageBtn.removeAttribute("hidden");
            }
        });

        // Hapus file dan kembalikan ke state awal
        removeImageBtn.addEventListener("click", function(event) {
            event.stopPropagation(); // Mencegah terpicunya klik placeholder
            imageUpload.value = "";
            placeholderBox.classList.remove("success");
            uploadIcon.className = "bx bx-cloud-upload";
            uploadText.textContent = "Click to Upload Image (Optional)";
            removeImageBtn.setAttribute("hidden", "true");
        });
    }

});

// ==========================================================================
// FUNGSI GLOBAL: LIGHTBOX MODAL MURNI
// ==========================================================================
function openLightbox(imgSrc) {
    const lightbox = document.getElementById("certificate-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    if (lightbox && lightboxImg) {
        lightboxImg.src = imgSrc;
        lightbox.removeAttribute("hidden");
    }
}

function closeLightbox() {
    const lightbox = document.getElementById("certificate-lightbox");
    if (lightbox) {
        lightbox.setAttribute("hidden", "true");
    }
}

/**
 * Fungsi Pembantu (Helper) untuk mengubah teks koma menjadi Array murni.
 */
function parseSkills(skillsString) {
    if (!skillsString.trim()) return [];
    return skillsString.split(",").map(skill => skill.trim()).filter(skill => skill !== "");
}