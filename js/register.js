// ============================================
// REGISTER FORM LOGIC - register.js
// ============================================

import { registerGuru } from '../modules/auth-register.js';
import { ADMIN_CONFIG } from '../modules/config-admin.js';

// ============================================
// MATA PELAJARAN KURIKULUM MERDEKA
// ============================================
const MATA_PELAJARAN = {
    smp: [
        'Pendidikan Pancasila',
        'Bahasa Indonesia',
        'Matematika',
        'IPA (Ilmu Pengetahuan Alam)',
        'IPS (Ilmu Pengetahuan Sosial)',
        'Bahasa Inggris',
        'PJOK (Pendidikan Jasmani, Olahraga, dan Kesehatan)',
        'Seni Musik',
        'Seni Rupa',
        'Seni Tari',
        'Seni Teater',
        'Prakarya',
        'Informatika',
        'Bahasa Daerah',
        'Pendidikan Agama Islam',
        'Pendidikan Agama Kristen',
        'Pendidikan Agama Katolik',
        'Pendidikan Agama Hindu',
        'Pendidikan Agama Buddha',
        'Pendidikan Agama Khonghucu'
    ],
    sma: [
        'Pendidikan Pancasila',
        'Bahasa Indonesia',
        'Matematika',
        'Bahasa Inggris',
        'PJOK',
        'Seni Musik',
        'Seni Rupa',
        'Seni Tari',
        'Seni Teater',
        'Prakarya',
        'Informatika',
        // IPA
        'Fisika',
        'Kimia',
        'Biologi',
        // IPS
        'Geografi',
        'Sejarah',
        'Sosiologi',
        'Ekonomi',
        // Bahasa
        'Bahasa Jerman',
        'Bahasa Prancis',
        'Bahasa Arab',
        'Bahasa Jepang',
        'Bahasa Korea',
        'Bahasa Mandarin',
        // Lainnya
        'Pendidikan Agama Islam',
        'Pendidikan Agama Kristen',
        'Pendidikan Agama Katolik',
        'Pendidikan Agama Hindu',
        'Pendidikan Agama Buddha',
        'Pendidikan Agama Khonghucu'
    ]
};

// ============================================
// DOM ELEMENTS
// ============================================
const registerForm = document.getElementById('registerForm');
const jenjangSelect = document.getElementById('jenjang');
const mapelGroup = document.getElementById('mapelGroup');
const mapelSelect = document.getElementById('mataPelajaran');
const submitBtn = document.getElementById('submitBtn');
const loadingBtn = document.getElementById('loadingBtn');

// ============================================
// FUNGSI: Toggle Password Visibility
// ============================================
window.togglePassword = (fieldId) => {
    const input = document.getElementById(fieldId);
    const icon = document.getElementById(`toggle${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)}Icon`);
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
};

// ============================================
// FUNGSI: Populate Mata Pelajaran Dropdown
// ============================================
function populateMataPelajaran(jenjang) {
    // Clear existing options (keep first option)
    mapelSelect.innerHTML = '<option value="">Pilih Mata Pelajaran</option>';
    
    // Get subjects for selected jenjang
    const subjects = MATA_PELAJARAN[jenjang] || [];
    
    // Add options
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        mapelSelect.appendChild(option);
    });
}

// ============================================
// FUNGSI: Show/Hide Mata Pelajaran Field
// ============================================
jenjangSelect?.addEventListener('change', (e) => {
    const jenjang = e.target.value;
    
    // Clear previous selection
    mapelSelect.value = '';
    clearError('mataPelajaran');
    
    // Show/hide based on jenjang
    if (jenjang === 'smp' || jenjang === 'sma') {
        mapelGroup.classList.remove('hidden');
        populateMataPelajaran(jenjang);
        mapelSelect.required = true;
    } else {
        mapelGroup.classList.add('hidden');
        mapelSelect.required = false;
    }
});

// ============================================
// FUNGSI: Validation
// ============================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^08[0-9]{8,11}$/;
    return re.test(phone);
}

function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`error-${fieldId}`);
    
    if (input) input.classList.add('error');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
    }
}

function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`error-${fieldId}`);
    
    if (input) input.classList.remove('error');
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
    }
}

function validateForm() {
    let isValid = true;
    
    // Nama Lengkap
    const namaLengkap = document.getElementById('namaLengkap').value.trim();
    if (!namaLengkap) {
        showError('namaLengkap', 'Nama lengkap wajib diisi');
        isValid = false;
    } else {
        clearError('namaLengkap');
    }
    
    // Email
    const email = document.getElementById('email').value.trim();
    if (!email) {
        showError('email', 'Email wajib diisi');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Format email tidak valid');
        isValid = false;
    } else {
        clearError('email');
    }
    
    // No HP
    const noHp = document.getElementById('noHp').value.trim();
    if (!noHp) {
        showError('noHp', 'Nomor WhatsApp wajib diisi');
        isValid = false;
    } else if (!validatePhone(noHp)) {
        showError('noHp', 'Format nomor tidak valid (contoh: 081234567890)');
        isValid = false;
    } else {
        clearError('noHp');
    }
    
    // Jenjang
    const jenjang = jenjangSelect?.value;
    if (!jenjang) {
        showError('jenjang', 'Jenjang pendidikan wajib dipilih');
        isValid = false;
    } else {
        clearError('jenjang');
    }
    
    // Mata Pelajaran (jika SMP/SMA)
    if (jenjang === 'smp' || jenjang === 'sma') {
        const mataPelajaran = mapelSelect?.value;
        if (!mataPelajaran) {
            showError('mataPelajaran', 'Mata pelajaran wajib dipilih');
            isValid = false;
        } else {
            clearError('mataPelajaran');
        }
    }
    
    // Sekolah
    const sekolah = document.getElementById('sekolah').value.trim();
    if (!sekolah) {
        showError('sekolah', 'Nama sekolah wajib diisi');
        isValid = false;
    } else {
        clearError('sekolah');
    }
    
    // Password
    const password = document.getElementById('password').value;
    if (!password) {
        showError('password', 'Password wajib diisi');
        isValid = false;
    } else if (password.length < 8) {
        showError('password', 'Password minimal 8 karakter');
        isValid = false;
    } else {
        clearError('password');
    }
    
    // Confirm Password
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (!confirmPassword) {
        showError('confirmPassword', 'Konfirmasi password wajib diisi');
        isValid = false;
    } else if (confirmPassword !== password) {
        showError('confirmPassword', 'Password tidak sama');
        isValid = false;
    } else {
        clearError('confirmPassword');
    }
    
    // Terms
    const terms = document.getElementById('terms')?.checked;
    if (!terms) {
        showError('terms', 'Anda harus menyetujui syarat & ketentuan');
        isValid = false;
    } else {
        clearError('terms');
    }
    
    return isValid;
}

// ============================================
// FUNGSI: Handle Form Submit
// ============================================
registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        // Scroll to first error
        const firstError = document.querySelector('.form-error.visible');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('hidden');
    loadingBtn.classList.remove('hidden');
    
    // Get form data
    const formData = {
        namaLengkap: document.getElementById('namaLengkap').value.trim(),
        email: document.getElementById('email').value.trim(),
        noHp: document.getElementById('noHp').value.trim(),
        jenjang: jenjangSelect?.value,
        mataPelajaran: mapelSelect?.value || null,
        sekolah: document.getElementById('sekolah').value.trim(),
        password: document.getElementById('password').value
    };
    
    try {
        // Call register function
        const result = await registerGuru(formData);
        
        if (result.success) {
            // Show success message
            alert(`✅ ${result.message}\n\nSilakan cek email Anda untuk verifikasi.`);
            // Redirect to login
            window.location.href = 'login.html';
        } else {
            // Show error
            alert(`❌ ${result.error}`);
            // Reset button state
            submitBtn.classList.remove('hidden');
            loadingBtn.classList.add('hidden');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert(`❌ Terjadi kesalahan: ${error.message}`);
        // Reset button state
        submitBtn.classList.remove('hidden');
        loadingBtn.classList.add('hidden');
    }
});

// ============================================
// REAL-TIME VALIDATION (Optional Enhancement)
// ============================================
// Clear error on input
document.querySelectorAll('.form-input').forEach(input => {
    input?.addEventListener('input', () => {
        clearError(input.id);
    });
});
