
/* ========================================
   1. MENGAMBIL ELEMEN HTML
======================================== */
const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav-link");
const navMenu = document.getElementById("navMenu");
const menuToggle = document.getElementById("menuToggle");

const form = document.getElementById("registrationForm");
const resultSection = document.getElementById("resultSection");
const resultData = document.getElementById("resultData");

const galleryFilters = document.getElementById("galleryFilters");
const galleryCards = document.querySelectorAll(".gallery-card");
const galleryEmpty = document.getElementById("galleryEmpty");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

let currentImageIndex = 0;

/* ========================================
   2. NAVIGASI ANTARHALAMAN
======================================== */
function showPage(pageName) {
    const targetPage = document.getElementById(pageName);

    if (!targetPage) {
        return;
    }

    pages.forEach(function(page) {
        page.classList.toggle("hidden", page.id !== pageName);
    });

    navLinks.forEach(function(link) {
        link.classList.toggle(
            "active",
            link.dataset.page === pageName
        );
    });

    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    // Mengubah alamat hash tanpa memuat ulang halaman.
    history.replaceState(null, "", "#" + pageName);
}

// Navigasi dari menu utama dan footer.
document.querySelectorAll("[data-page]").forEach(function(link) {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        showPage(link.dataset.page);
    });
});

// Navigasi melalui tombol.
document.querySelectorAll("[data-go]").forEach(function(button) {
    button.addEventListener("click", function() {
        showPage(button.dataset.go);
    });
});

// Menu navigasi untuk perangkat mobile.
menuToggle.addEventListener("click", function() {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

// Membuka halaman sesuai hash ketika website pertama kali dibuka.
function loadInitialPage() {
    const pageName = window.location.hash.slice(1);
    const allowedPages = ["home", "gallery", "programs", "register"];

    showPage(allowedPages.includes(pageName) ? pageName : "home");
}

loadInitialPage();

/* ========================================
   3. FILTER GALLERY
======================================== */
galleryFilters.addEventListener("click", function(event) {
    const button = event.target.closest("[data-filter]");

    if (!button) {
        return;
    }

    const selectedCategory = button.dataset.filter;
    let visibleCount = 0;

    galleryFilters.querySelectorAll(".filter-btn").forEach(function(item) {
        item.classList.toggle("active", item === button);
    });

    galleryCards.forEach(function(card) {
        const matches =
            selectedCategory === "all" ||
            card.dataset.category === selectedCategory;

        card.classList.toggle("hidden", !matches);

        if (matches) {
            visibleCount++;
        }
    });

    galleryEmpty.classList.toggle("hidden", visibleCount > 0);
});

/* ========================================
   4. LIGHTBOX FOTO GALLERY
======================================== */
const imageButtons = Array.from(
    document.querySelectorAll(".gallery-image")
);

function openLightbox(index) {
    currentImageIndex = index;
    updateLightbox();

    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    document.getElementById("lightboxClose").focus();
}

function updateLightbox() {
    const button = imageButtons[currentImageIndex];
    const image = button.querySelector("img");
    const card = button.closest(".gallery-card");
    const title = card.querySelector("h3").textContent;

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent =
        title + " — Foto " + (currentImageIndex + 1) +
        " dari " + imageButtons.length;
}

function closeLightbox() {
    lightbox.classList.add("hidden");
    document.body.style.overflow = "";
}

function changeLightboxImage(direction) {
    currentImageIndex =
        (currentImageIndex + direction + imageButtons.length) %
        imageButtons.length;

    updateLightbox();
}

imageButtons.forEach(function(button, index) {
    button.addEventListener("click", function() {
        openLightbox(index);
    });
});

document.getElementById("lightboxClose").addEventListener(
    "click", closeLightbox
);

document.getElementById("lightboxPrev").addEventListener(
    "click", function() {
        changeLightboxImage(-1);
    }
);

document.getElementById("lightboxNext").addEventListener(
    "click", function() {
        changeLightboxImage(1);
    }
);

// Menutup lightbox jika area gelap di luar foto diklik.
lightbox.addEventListener("click", function(event) {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

// Navigasi foto menggunakan keyboard.
document.addEventListener("keydown", function(event) {
    if (lightbox.classList.contains("hidden")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    } else if (event.key === "ArrowRight") {
        changeLightboxImage(1);
    } else if (event.key === "ArrowLeft") {
        changeLightboxImage(-1);
    }
});

/* ========================================
   5. PILIH PROGRAM DAN ISI FORM OTOMATIS
======================================== */
document.querySelectorAll("[data-language]").forEach(function(button) {
    button.addEventListener("click", function() {
        const language = button.dataset.language;

        showPage("register");

        document.getElementById("bahasa").value = language;

        document.getElementById("nama").focus();
    });
});

/* ========================================
   6. VALIDASI INPUT ANGKA
======================================== */
const nikInput = document.getElementById("nik");
const hpInput = document.getElementById("hp");

// Hanya menerima angka pada kolom NIK.
nikInput.addEventListener("input", function() {
    nikInput.value = nikInput.value.replace(/\D/g, "").slice(0, 16);
});

// Hanya menerima angka pada kolom nomor HP.
hpInput.addEventListener("input", function() {
    hpInput.value = hpInput.value.replace(/\D/g, "").slice(0, 15);
});

/* ========================================
   7. KONFIRMASI PENDAFTARAN
======================================== */
form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Browser memeriksa semua kolom required dan pola input
    // sebelum event submit ini dijalankan.
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Dialog konfirmasi sesuai permintaan tugas.
    const yakin = window.confirm(
        "Apakah Anda sudah yakin untuk menyimpan?"
    );

    // Jika memilih Cancel/Tidak, form tidak diubah.
    if (!yakin) {
        return;
    }

    // Mengambil data dari form setelah konfirmasi Ya.
    const dataPendaftar = {
        nik: nikInput.value.trim(),
        nama: document.getElementById("nama").value.trim(),
        gender: document.getElementById("gender").value,
        hp: hpInput.value.trim(),
        alamat: document.getElementById("alamat").value.trim(),
        bahasa: document.getElementById("bahasa").value
    };

    tampilkanHasil(dataPendaftar);
});

/* ========================================
   8. MENAMPILKAN HASIL PENDAFTARAN
======================================== */
function tampilkanHasil(data) {
    const daftarData = [
        ["NIK", data.nik],
        ["Nama Lengkap", data.nama],
        ["Jenis Kelamin", data.gender],
        ["Nomor HP", data.hp],
        ["Alamat", data.alamat],
        ["Bahasa Pemrograman", data.bahasa]
    ];

    // Menghapus ringkasan sebelumnya.
    resultData.replaceChildren();

    daftarData.forEach(function(item) {
        const row = document.createElement("div");
        row.className = "result-row";

        const label = document.createElement("strong");
        label.textContent = item[0];

        const value = document.createElement("span");
        value.textContent = item[1];

        row.appendChild(label);
        row.appendChild(value);

        resultData.appendChild(row);
    });

    resultSection.classList.remove("hidden");

    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

/* ========================================
   9. EDIT DATA DAN PENDAFTARAN BARU
======================================== */
document.getElementById("editDataBtn").addEventListener(
    "click", function() {
        resultSection.classList.add("hidden");

        document.getElementById("register").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        document.getElementById("nama").focus();
    }
);

document.getElementById("newRegistrationBtn").addEventListener(
    "click", function() {
        form.reset();

        resultData.replaceChildren();
        resultSection.classList.add("hidden");

        showPage("register");

        nikInput.focus();
    }
);

// Tombol reset hanya mengosongkan isian form.
form.addEventListener("reset", function() {
    resultSection.classList.add("hidden");
    resultData.replaceChildren();
});
