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

    // 5. LOGIKA EVENT: About Sub-Tabs Internal Navigation dengan Transisi Efek
    const subnavBtns = document.querySelectorAll(".subnav-btn");
    const aboutPanels = document.querySelectorAll(".about-panel");

    subnavBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const activePanel = document.querySelector(".about-panel.active");
            const targetId = btn.getAttribute("data-target");
            const targetPanel = document.getElementById(targetId);

            if (activePanel && targetPanel && activePanel !== targetPanel) {
                // Hapus kelas active dari semua tombol
                subnavBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                // 1. Hilangkan panel lama dengan transisi opacity & transform (slide-up)
                activePanel.classList.add("fade-out");

                setTimeout(() => {
                    activePanel.classList.remove("active", "fade-out");
                    activePanel.setAttribute("hidden", "true");

                    // 2. Munculkan panel baru dengan efek slide-up & fade-in
                    targetPanel.removeAttribute("hidden");
                    
                    // Trigger reflow untuk mengaktifkan animasi transisi
                    void targetPanel.offsetWidth;
                    targetPanel.classList.add("active");
                }, 300); // Sinkron dengan durasi transisi CSS (0.3 detik)
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

    // 7. LOGIKA EVENT: Sakelar Terapung Dark/Light Mode
    initThemeToggle();

});

/* ==========================================================================
   [ LOGIKA INTERAKSI SAKELAR DARK/LIGHT MODE - MULAI ]
   ========================================================================== */
function initThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle");
    const toggleIcon = document.getElementById("theme-toggle-icon");
    if (!toggleBtn || !toggleIcon) return;

    // Baca preferensi mode awal dari localStorage
    const savedMode = localStorage.getItem("theme-mode") || "dark";
    document.documentElement.setAttribute("data-mode", savedMode);
    updateToggleIcon(savedMode);

    toggleBtn.addEventListener("click", () => {
        const currentMode = document.documentElement.getAttribute("data-mode") || "dark";
        const newMode = currentMode === "light" ? "dark" : "light";
        
        document.documentElement.setAttribute("data-mode", newMode);
        localStorage.setItem("theme-mode", newMode);
        updateToggleIcon(newMode);
    });

    function updateToggleIcon(mode) {
        if (mode === "light") {
            toggleIcon.className = "bx bx-moon";
        } else {
            toggleIcon.className = "bx bx-sun";
        }
    }
}
/* [ LOGIKA INTERAKSI SAKELAR DARK/LIGHT MODE - SELESAI ] */

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