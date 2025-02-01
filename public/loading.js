// script.js
document.getElementById('goToPage').addEventListener('click', function () {
    const loadingScreen = document.getElementById('loading');

    // Tampilkan loading screen
    loadingScreen.style.display = 'flex';

    // Setelah 3 detik, arahkan ke halaman baru
    setTimeout(() => {
        window.location.href = 'masuk.html'; // Ganti dengan URL halaman tujuan Anda
    }, 3000); // Durasi 3 detik (sesuai dengan durasi animasi)
});
