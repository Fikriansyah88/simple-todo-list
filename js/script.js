// --- JAVASCRIPT TO-DO LIST ---

// 1. Ambil elemen-elemen dari HTML
const inputTugas = document.getElementById('todo-input');
const tombolTambah = document.getElementById('add-btn');
const listContainer = document.getElementById('todo-list');
const counterTugas = document.getElementById('task-counter');
const tombolTema = document.getElementById('theme-toggle');
const tombolHapusSelesai = document.getElementById('clear-completed');
const filterButtons = document.querySelectorAll('.filter-btn');

// 2. Variable untuk nyimpen data tugas
let daftarTugas = JSON.parse(localStorage.getItem('my_tasks')) || [];
let filterAktif = 'all';

// --- FUNGSI UTAMA ---

// Fungsi buat nampilin semua tugas ke layar
function renderTugas() {
    // Kosongin dulu list-nya biar ga numpuk
    listContainer.innerHTML = '';

    // Filter tugas berdasarkan pilihan user (Semua/Aktif/Selesai)
    const tugasTerfilter = daftarTugas.filter(tugas => {
        if (filterAktif === 'active') return !tugas.isDone;
        if (filterAktif === 'completed') return tugas.isDone;
        return true; // kalau 'all' tampilkan semua
    });

    // Kalau kosong, tampilin Empty State
    if (tugasTerfilter.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <p>Belum ada tugas nih. Yuk tambah!</p>
            </div>
        `;
    } else {
        // Gambar setiap tugas satu-satu
        tugasTerfilter.forEach((tugas, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${tugas.isDone ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" ${tugas.isDone ? 'checked' : ''} onchange="toggleTugas(${tugas.id})">
                <div class="task-info">
                    <span class="task-text">${tugas.text}</span>
                    <span class="timestamp"><i class="far fa-clock"></i> ${tugas.time}</span>
                </div>
                <div class="actions">
                    <button class="action-btn edit-btn" onclick="editTugas(${tugas.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="hapusTugas(${tugas.id})" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            listContainer.appendChild(li);
        });
    }

    // Update angka counter
    const sisaTugas = daftarTugas.filter(t => !t.isDone).length;
    counterTugas.innerText = `${sisaTugas} tugas belum selesai`;

    // Simpan ke LocalStorage setiap kali ada perubahan
    localStorage.setItem('my_tasks', JSON.stringify(daftarTugas));
}

// Fungsi buat nambah tugas baru
function tambahTugas() {
    const teks = inputTugas.value.trim();

    // Validasi: Jangan biarkan kosong
    if (teks === "") {
        alert("Waduh, isi dulu tugasnya ya!");
        return;
    }

    // Buat object tugas baru
    const tugasBaru = {
        id: Date.now(),
        text: teks,
        isDone: false,
        time: new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
    };

    // Masukin ke array
    daftarTugas.push(tugasBaru);
    
    // Kosongin input lagi
    inputTugas.value = '';
    
    // Gambar ulang
    renderTugas();
}

// Fungsi buat hapus tugas
function hapusTugas(id) {
    if (confirm("Beneran mau hapus tugas ini?")) {
        daftarTugas = daftarTugas.filter(t => t.id !== id);
        renderTugas();
    }
}

// Fungsi buat toggle (centang) tugas
function toggleTugas(id) {
    daftarTugas = daftarTugas.map(t => {
        if (t.id === id) {
            return { ...t, isDone: !t.isDone };
        }
        return t;
    });
    renderTugas();
}

// Fungsi buat edit tugas
function editTugas(id) {
    const tugas = daftarTugas.find(t => t.id === id);
    const teksBaru = prompt("Ubah tugas kamu:", tugas.text);
    
    if (teksBaru !== null && teksBaru.trim() !== "") {
        tugas.text = teksBaru.trim();
        renderTugas();
    }
}

// --- EVENT LISTENERS (Dengerin Klik User) ---

// Klik tombol tambah
tombolTambah.addEventListener('click', tambahTugas);

// Tekan tombol Enter di keyboard
inputTugas.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        tambahTugas();
    }
});

// Klik tombol Hapus yang sudah Selesai
tombolHapusSelesai.addEventListener('click', () => {
    if (confirm("Hapus semua tugas yang sudah selesai?")) {
        daftarTugas = daftarTugas.filter(t => !t.isDone);
        renderTugas();
    }
});

// Ganti-ganti filter (All, Active, Completed)
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Hapus class active dari tombol lain
        filterButtons.forEach(b => b.classList.remove('active'));
        // Tambah class active ke tombol yang diklik
        btn.classList.add('active');
        
        filterAktif = btn.getAttribute('data-filter');
        renderTugas();
    });
});

// Fitur Dark Mode
tombolTema.addEventListener('click', () => {
    const body = document.body;
    const ikon = tombolTema.querySelector('i');
    
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        ikon.className = 'fas fa-moon';
    } else {
        body.setAttribute('data-theme', 'dark');
        ikon.className = 'fas fa-sun';
    }
});

// Jalankan render pertama kali pas halaman dibuka
renderTugas();
