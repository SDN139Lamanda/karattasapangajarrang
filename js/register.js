// ============================================
// REGISTER FORM LOGIC - register.js
// ✅ Updated: Fixed conditional dropdown + DOM ready safety
// ============================================

import { registerGuru } from '../modules/auth-register.js';
import { ADMIN_CONFIG } from '../modules/config-admin.js';

// ============================================
// MATA PELAJARAN KURIKULUM MERDEKA
// ✅ Lengkap untuk SMP & SMA
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
        'Fisika',
        'Kimia',
        'Biologi',
        'Geografi',
        'Sejarah',
        'Sosiologi',
        'Ekonomi',
        'Bahasa Jerman',
        'Bahasa Prancis',
        'Bahasa Arab',
        'Bahasa Jepang',
        'Bahasa Korea',
        'Bahasa Mandarin',
        'Pendidikan Agama Islam',
        'Pendidikan Agama Kristen',
        'Pendidikan Agama Katolik',
        'Pendidikan Agama Hindu',
        'Pendidikan Agama Buddha',
        'Pendidikan Agama Khonghucu'
    ]
};

// ============================================
// DOM ELEMENTS (Initialized in DOMContentLoaded)
// ============================================
let registerForm, jenjangSelect, mapelGroup, mapelSelect, submitBtn, loadingBtn;

// ============================================
// INIT: Wait for DOM to be fully loaded
// ✅ FIX: Ensure elements exist before attaching listeners
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('📋 Register page DOM loaded');
    
    // Get DOM elements with safety checks
    registerForm = document.getElementById('registerForm');
    jenjangSelect = document.getElementById('jenjang');
    mapelGroup = document.getElementById('mapelGroup');
    mapelSelect = document.getElementById('mataPelajaran');
    submitBtn = document.getElementById('submitBtn');
    loadingBtn = document.getElementById('loadingBtn');
    
    // Debug log
    console.log('🔍 Elements:', {
        registerForm: !!registerForm,
        jenjangSelect: !!jenjangSelect,
        mapelGroup: !!mapelGroup,
        mapelSelect: !!mapelSelect
    });
    
    // ✅ FIX: Attach event listener with null check
    if (jenjangSelect) {
        jenjangSelect.addEventListener('change', handleJenjangChange);
        console.log('✅ Event listener attached to jenjangSelect');
    } else {
        console.error('❌ ERROR: jenjangSelect element not found!');
    }
    
    // Attach form submit handler
    if (registerForm) {
        registerForm.addEventListener('submit', handleFormSubmit);
        console.log('✅ Form submit handler attached');
    }
    
    // Real-time validation on input
    document.querySelectorAll('.form-input').forEach(input => {
        input?.addEventListener('input', () => clearError(input.id));
        input?.addEventListener('blur', () => validateField(input.id));
    });
    
    // Initial check: if page loads with pre-filled jenjang (browser back button)
    if (jenjangSelect?.value) {
        handleJenjangChange({ target: jenjangSelect });
    }
});

// ============================================
// FUNGSI: Handle Jenjang Change
// ✅ FIX: Properly show/hide mata pelajaran field
// ============================================
function handleJenjangChange(e) {
    const jenjang = e.target?.value || e.value;
    
    console.log('🔄 Jenjang changed to:', jenjang);
    
    // Clear previous selection
    if (mapelSelect) {
        mapelSelect.value = '';
    }
    clearError('mataPelajaran');
    
    // Show/hide based on jenjang
    if (jenjang === 'smp' || jenjang === 'sma') {
        if (mapelGroup) {
            mapelGroup.classList.remove('hidden');
            mapelGroup.setAttribute('data-jenjang', jenjang);
            console.log('✅ mapelGroup shown for', jenjang);
        }
        populateMataPelajaran(jenjang);
        if (mapelSelect) {
            mapelSelect.required = true;
        }
    } else {
        if (mapelGroup) {
            mapelGroup.classList.add('hidden');
            mapelGroup.removeAttribute('data-jenjang');
            console.log('❌ mapelGroup hidden for SD');
        }
        if (mapelSelect) {
            mapelSelect.required = false;
        }
    }
}

// ============================================
// FUNGSI: Populate Mata Pelajaran Dropdown
// ✅ Dynamic options based on jenjang
// ============================================
function populateMataPelajaran(jenjang) {
    if (!mapelSelect) {
        console.error('❌ mapelSelect element not found!');
        return;
    }
    
    // Clear existing options (keep first option)
    mapelSelect.innerHTML = '<option value="">Pilih Mata Pelajaran</option>';
    
    // Get subjects for selected jenjang
    const subjects = MATA_PELAJARAN[jenjang] || [];
    
    console.log(`📚 Loading ${subjects.length} subjects for ${jenjang}`);
    
    // Add options
    subjects.forEach((subject, index) => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        mapelSelect.appendChild(option);
    });
    
    console.log('✅ Subjects populated');
}

// ============================================
// FUNGSI: Toggle Password Visibility
// ✅ Global function for HTML onclick
// ============================================
window.togglePassword = (fieldId) => {
    const input = document.getElementById(fieldId);
    const icon = document.getElementById(`toggle${fieldId.charAt(0).toUpperCase() + fieldId.slice(1)}Icon`);
    
    if (!input || !icon) return;
    
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
// FUNGSI: Validation Helpers
// ============================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    const re = /^08[0-9]{8,11}$/;
    return re.test(phone);
}

function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`error-${fieldId}`);
    
    if (input) {
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
    }
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
        errorEl.setAttribute('role', 'alert');
    }
}

function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`error-${fieldId}`);
    
    if (input) {
        input.classList.remove('error');
        input.removeAttribute('aria-invalid');
    }
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
    }
}

function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    if (!input) return true;
    
    const value = input.value.trim();
    
    switch(fieldId) {
        case 'email':
            if (!value) {
                showError('email', 'Email wajib diisi');
                return false;
            } else if (!validateEmail(value)) {
                showError('email', 'Format email tidak valid');
                return false;
            }
            break;
        case 'noHp':
            if (!value) {
                showError('noHp', 'Nomor WhatsApp wajib diisi');
                return false;
            } else if (!validatePhone(value)) {
                showError('noHp', 'Format nomor tidak valid (08xxxxxxxxxx)');
                return false;
            }
            break;
        case 'password':
            if (!value) {
                showError('password', 'Password wajib diisi');
                return false;
            } else if (value.length < 8) {
                showError('password', 'Password minimal 8 karakter');
                return false;
            }
            break;
        case 'confirmPassword':
            const password = document.getElementById('password')?.value;
            if (!value) {
                showError('confirmPassword', 'Konfirmasi password wajib diisi');
                return false;
            } else if (value !== password) {
                showError('confirmPassword', 'Password tidak sama');
                return false;
            }
            break;
    }
    
    clearError(fieldId);
    return true;
}

function validateForm() {
    let isValid = true;
    
    // Nama Lengkap
    const namaLengkap = document.getElementById('namaLengkap')?.value.trim();
    if (!namaLengkap) {
        showError('namaLengkap', 'Nama lengkap wajib diisi');
        isValid = false;
    } else {
        clearError('namaLengkap');
    }
    
    // Email
    const email = document.getElementById('email')?.value.trim();
    if (!validateField('email')) isValid = false;
    
    // No HP
    const noHp = document.getElementById('noHp')?.value.trim();
    if (!validateField('noHp')) isValid = false;
    
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
    const sekolah = document.getElementById('sekolah')?.value.trim();
    if (!sekolah) {
        showError('sekolah', 'Nama sekolah wajib diisi');
        isValid = false;
    } else {
        clearError('sekolah');
    }
    
    // Password
    if (!validateField('password')) isValid = false;
    
    // Confirm Password
    if (!validateField('confirmPassword')) isValid = false;
    
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
async function handleFormSubmit(e) {
    e.preventDefault();
    
    console.log('📝 Form submit triggered');
    
    // Validate form
    if (!validateForm()) {
        console.log('❌ Validation failed');
        // Scroll to first error (mobile-friendly)
        const firstError = document.querySelector('.form-error.visible');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Focus the related input for mobile keyboard
            const inputId = firstError.id.replace('error-', '');
            document.getElementById(inputId)?.focus();
        }
        return;
    }
    
    console.log('✅ Validation passed');
    
    // Show loading state
    if (submitBtn) submitBtn.classList.add('hidden');
    if (loadingBtn) loadingBtn.classList.remove('hidden');
    
    // Get form data
    const formData = {
        namaLengkap: document.getElementById('namaLengkap')?.value.trim(),
        email: document.getElementById('email')?.value.trim(),
        noHp: document.getElementById('noHp')?.value.trim(),
        jenjang: jenjangSelect?.value,
        mataPelajaran: (jenjangSelect?.value === 'smp' || jenjangSelect?.value === 'sma') 
            ? mapelSelect?.value || null 
            : null,
        sekolah: document.getElementById('sekolah')?.value.trim(),
        password: document.getElementById('password')?.value
    };
    
    console.log('📦 Form data:', { ...formData, password: '[REDACTED]' });
    
    try {
        // Call register function from module
        const result = await registerGuru(formData);
        
        if (result.success) {
            console.log('✅ Registration successful');
            // Show success message
            alert(`✅ ${result.message}\n\nSilakan cek email Anda untuk verifikasi.`);
            // Redirect to login
            window.location.href = 'login.html';
        } else {
            console.error('❌ Registration failed:', result.error);
            // Show error
            alert(`❌ ${result.error}`);
            // Reset button state
            if (submitBtn) submitBtn.classList.remove('hidden');
            if (loadingBtn) loadingBtn.classList.add('hidden');
        }
    } catch (error) {
        console.error('❌ Registration error:', error);
        alert(`❌ Terjadi kesalahan: ${error.message || 'Silakan coba lagi'}`);
        // Reset button state
        if (submitBtn) submitBtn.classList.remove('hidden');
        if (loadingBtn) loadingBtn.classList.add('hidden');
    }
}

// Export for global access (if needed)
window.togglePassword = togglePassword;
