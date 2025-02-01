document.addEventListener('DOMContentLoaded', () => {
    const btnBandung = document.getElementById('btnBandung');
    const btnTasikmalaya = document.getElementById('btnTasiknalaya');
    const btnKabBandung = document.getElementById('btnKabBandung');

    const statusBandung = document.getElementById('statusBandung').querySelector('ul');
    const statusTasikmalaya = document.getElementById('statusTasikmalaya').querySelector('ul');
    const statusKabBandung = document.getElementById('statusKabBandung').querySelector('ul');

    const statuses = {
        bandung: [
            { status: 'Diterima', description: 'Pesan telah diterima' },
            { status: 'Dibaca', description: 'Pesan telah dibaca' },
            { status: 'Diunduh', description: 'Pesan telah diunduh' },
        ],
        tasiknalaya: [
            { status: 'Diterima', description: 'Pesan telah diterima' },
            { status: 'Dibaca', description: 'Pesan telah dibaca' },
        ],
        kabBandung: [
            { status: 'Diterima', description: 'Pesan telah diterima' },
        ],
    };

    function updateStatus(statusContainer, location) {
        statusContainer.innerHTML = '';
        statuses[location].forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="status-icon">&#10003;</span>
                            <span class="status-text">
                                <strong>${item.status}</strong>
                                <p>${item.description}</p>
                            </span>`;
            statusContainer.appendChild(li);
        });
    }

    function toggleDropdown(button, statusContainer, location) {
        const arrow = button.querySelector('.arrow');

        if (statusContainer.parentElement.style.display === 'block') {
            statusContainer.parentElement.style.display = 'none';
            arrow.innerHTML = '&#x25BC;'; // Arrow down
        } else {
            statusContainer.parentElement.style.display = 'block';
            updateStatus(statusContainer, location);
            arrow.innerHTML = '&#x25B2;'; // Arrow up
        }
    }

    btnBandung.addEventListener('click', () => toggleDropdown(btnBandung, statusBandung, 'bandung'));
    btnTasikmalaya.addEventListener('click', () => toggleDropdown(btnTasikmalaya, statusTasikmalaya, 'tasiknalaya'));
    btnKabBandung.addEventListener('click', () => toggleDropdown(btnKabBandung, statusKabBandung, 'kabBandung'));

    // Initialize all status containers as hidden
    document.querySelectorAll('.status').forEach(status => status.style.display = 'none');
});
