/* ==========================================================================
   INTERACTIVE LOGIC: MODAL CERTIFICATE & IMAGE COMMENT PREVIEW
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Menjalankan inisialisasi fitur saat halaman selesai dimuat
    initPreloaderAndTypewriter();
    initCertificateModal();
    initCommentImageUpload();
    initRevealAnimations();
    initMobileNavigation();
});

/* ==========================================================================
   [ ARSITEKTUR TATA LETAK: REVEAL ANIMATIONS DETECTOR - MULAI ]
   ========================================================================== */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => observer.observe(el));
}
/* [ ARSITEKTUR TATA LETAK: REVEAL ANIMATIONS DETECTOR - SELESAI ] */

/* ==========================================================================
   1. LOGIKA MODAL POP-UP PREVIEW SERTIFIKAT
   ========================================================================== */
function initCertificateModal() {
    // Membuat elemen modal secara dinamis di HTML jika belum ada di index.html
    let modal = document.getElementById("cert-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "cert-modal";

        // Desain container modal hitam transparan (overlay) memenuhi layar
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(13, 14, 16, 0.95); display: none;
            justify-content: center; align-items: center; z-index: 2000;
            backdrop-filter: blur(8px);
        `;

        // Struktur dalam modal (Tombol Close dan Elemen Gambar)
        modal.innerHTML = `
            <div style="position: relative; max-width: 80%; max-height: 80%;">
                <span id="close-modal" style="position: absolute; top: -40px; right: 0; color: #fff; font-size: 1.2rem; cursor: pointer; font-family: monospace; letter-spacing: 0.1em;">[ &times; CLOSE ]</span>
                <img id="modal-img" src="" alt="Certificate Preview" style="width: 100%; max-height: 75vh; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); object-fit: contain;">
            </div>
        `;
        document.body.appendChild(modal);
    }

    const modalImg = document.getElementById("modal-img");
    const closeModal = document.getElementById("close-modal");

    // Event Listener: Mendeteksi klik pada tombol sertifikat
    // (Tombol di HTML wajib memiliki class "view-cert-btn" dan atribut data-src="lokasi_gambar.jpg")
    document.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("view-cert-btn")) {
            const certSrc = e.target.getAttribute("data-src");
            if (certSrc) {
                modalImg.src = certSrc;
                modal.style.display = "flex"; // Memunculkan modal
            }
        }
    });

    // Menutup modal saat teks [ X CLOSE ] diklik
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        modalImg.src = ""; // Reset gambar agar menghemat memori
    });

    // Menutup modal secara otomatis jika user mengklik area luar gambar
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            modalImg.src = "";
        }
    });
}

/* ==========================================================================
   2. LOGIKA UPLOAD GAMBAR & PREVIEW DI KOLOM KOMENTAR
   ========================================================================== */
function initCommentImageUpload() {
    const imageInput = document.getElementById("comment-image-input"); // Elemen <input type="file">
    const previewContainer = document.getElementById("comment-preview-box"); // Kotak placeholder border putus-putus

    if (!imageInput || !previewContainer) return;

    // Mendeteksi ketika ada file gambar yang dipilih oleh user
    imageInput.addEventListener("change", function () {
        const file = this.files[0];

        if (file) {
            // Validasi keamanan: Memastikan berkas yang diunggah benar-benar gambar
            if (!file.type.startsWith("image/")) {
                alert("Harap pilih berkas gambar saja (PNG/JPG/WebP)!");
                this.value = ""; // Reset input
                return;
            }

            // Menggunakan FileReader API untuk membaca data file dari perangkat lokal
            const reader = new FileReader();

            // Ketika browser selesai membaca file gambar
            reader.addEventListener("load", function () {
                // Memasukkan gambar ke dalam kotak placeholder dan menambahkan tombol hapus
                previewContainer.innerHTML = `
                    <div style="position: relative; width: 100%; height: 100%;">
                        <img src="${this.result}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 6px;" alt="Uploaded Preview">
                        <button type="button" id="remove-preview-img" style="position: absolute; top: 10px; right: 10px; background: #ff4a4a; color: #fff; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.75rem; font-family: monospace;">REMOVE</button>
                    </div>
                `;

                // Menyalakan fungsi tombol hapus jika user ingin membatalkan gambar tersebut
                document.getElementById("remove-preview-img").addEventListener("click", (e) => {
                    e.stopPropagation();
                    imageInput.value = ""; // Mengosongkan input file
                    resetPreviewPlaceholder(previewContainer); // Mengembalikan ke tampilan kotak kosong
                });
            });

            // Membaca file sebagai URL data (Base64 String)
            reader.readAsDataURL(file);
        } else {
            resetPreviewPlaceholder(previewContainer);
        }
    });
}

// Fungsi pembantu untuk mengembalikan tampilan kotak upload ke kondisi awal (kosong)
function resetPreviewPlaceholder(container) {
    container.innerHTML = `
        <span style="color: #64748b; font-size: 0.85rem; text-align: center; font-family: monospace; line-height: 1.6;">
            [ IMAGE PREVIEW PLACEHOLDER ]<br>
            <span style="font-size: 0.75rem; color: #475569;">Your uploaded image will appear here</span>
        </span>
    `;
}

/* ==========================================================================
   [ REVISI OPENING PRELOADER TIRAI SIBER & TYPEWRITER CEPAT - MULAI ]
   ========================================================================== */
function initPreloaderAndTypewriter() {
    const preloader = document.getElementById("preloader");

    if (preloader) {
        // Jeda untuk memastikan animasi CSS sudah siap, lalu geser ke atas
        setTimeout(() => {
            preloader.classList.add("slide-up");
            setTimeout(() => {
                preloader.style.display = "none";
                startHeroTypewriterLooping();
            }, 700); // Durasi transisi slide-up CSS
        }, 1500); // Durasi animasi preloader (icons + text) selesai
    } else {
        startHeroTypewriterLooping();
    }
}

/**
 * Fungsi looping typewriter effect dengan 3 kalimat profesional bergantian
 * Berjalan terus-menerus di hero section setelah preloader selesai
 */
function startHeroTypewriterLooping() {
    const typewriterElement = document.getElementById("hero-typewriter");
    if (!typewriterElement) return;

    const sentences = [
        "Building a scalable web ecosystem.",
        "Transforming ideas into precise code.",
        "Simplifying complexity through design."
    ];

    let currentSentenceIndex = 0;
    let isErasing = false;

    /* [ FUNGSI TYPING DENGAN KECEPATAN ALAMI ] */
    function typewriterLoop() {
        const currentSentence = sentences[currentSentenceIndex];
        let charIndex = 0;

        if (!isErasing) {
            /* Mode ketik: tampilkan karakter satu per satu */
            function typeChar() {
                if (charIndex < currentSentence.length) {
                    typewriterElement.textContent += currentSentence.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeChar, 50); // Kecepatan ketik 50ms per karakter
                } else {
                    /* Selesai ketik, jeda baca 2 detik sebelum hapus */
                    isErasing = true;
                    setTimeout(typewriterLoop, 2000);
                }
            }
            typeChar();
        } else {
            /* Mode hapus: hilangkan karakter satu per satu */
            function eraseChar() {
                if (typewriterElement.textContent.length > 0) {
                    typewriterElement.textContent = typewriterElement.textContent.slice(0, -1);
                    setTimeout(eraseChar, 30); // Kecepatan hapus 30ms per karakter
                } else {
                    /* Selesai hapus, lanjut ke kalimat berikutnya */
                    currentSentenceIndex = (currentSentenceIndex + 1) % sentences.length;
                    isErasing = false;
                    setTimeout(typewriterLoop, 300); // Jeda sebelum mulai ketik kalimat baru
                }
            }
            eraseChar();
        }
    }

    typewriterLoop();
}


/* [ REVISI TOTAL PRELOADER CINEMATIC SHUTTER & TYPEWRITER LOOPING - SELESAI ] */

/* ==========================================================================
   [ MOBILE ONE-BUTTON DROPDOWN NAVIGATION - LOGIC ]
   ========================================================================== */
function initMobileNavigation() {
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (mobileMenuBtn && navMenu) {
        // Toggle menu dropdown saat tombol diklik
        mobileMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Mencegah klik menyebar ke document
            navMenu.classList.toggle("active");
            
            // Ubah teks tombol secara dinamis
            if (navMenu.classList.contains("active")) {
                mobileMenuBtn.innerHTML = "CLOSE ▴";
            } else {
                mobileMenuBtn.innerHTML = "MENU ▾";
            }
        });

        // Tutup menu saat layar diklik di luar area menu
        document.addEventListener("click", (e) => {
            if (navMenu.classList.contains("active") && !navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove("active");
                mobileMenuBtn.innerHTML = "MENU ▾";
            }
        });

        // Tutup menu otomatis setelah memilih opsi navigasi (smooth scroll diatur oleh CSS bawaan)
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                mobileMenuBtn.innerHTML = "MENU ▾";
            });
        });
    }
}