<script>
    document.querySelector('.search-bar').addEventListener('input', function () {
        const searchValue = this.value.trim().toLowerCase(); // Menggunakan trim untuk menghapus spasi
        const rows = document.querySelectorAll('.status-table tbody tr');
        
        rows.forEach(row => {
            const tujuanSurat = row.cells[0].textContent.trim().toLowerCase(); // trim untuk membersihkan nilai
            const status = row.cells[1].textContent.trim().toLowerCase();
            const keterangan = row.cells[2].textContent.trim().toLowerCase();
            
            // Cek apakah salah satu kolom mengandung nilai pencarian
            if (tujuanSurat.includes(searchValue) || status.includes(searchValue) || keterangan.includes(searchValue)) {
                row.style.display = ''; // Tampilkan baris jika cocok
            } else {
                row.style.display = 'none'; // Sembunyikan baris jika tidak cocok
            }
        });
    });
</script>
