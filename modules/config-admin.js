// ============================================
// ADMIN CONFIGURATION - config-admin.js
// ✅ Centralized Admin Config
// 📌 Ganti email admin HANYA di file ini!
// 📌 Kebijakan: Email BEBAS + Manual Approval untuk semua user
// ============================================

export const ADMIN_CONFIG = {
    // ✅ Email Admin Utama (Kontak untuk user & sistem)
    // 🔥 GANTI DI SINI SAJIKA INGIN UBAH EMAIL ADMIN
    email: 'radiah.tifarahs@gmail.com',
    
    // ✅ Nama & Kontak Display
    name: 'Administrator SDN 139 LAMANDA',
    contact: 'radiah.tifarahs@gmail.com',
    
    // ✅ Informasi Sekolah
    school: 'SDN 139 LAMANDA',
    
    // ✅ Email Support Tambahan (Opsional)
    supportEmail: 'hasriandi@guru.sd.belajar.com',
    
    // ✅ KEBIJAKAN REGISTRASI (Baru - Sesuai Kesepakatan)
    // 📌 Semua email diperbolehkan (Gmail/Yahoo/Outlook/dll)
    // 📌 Semua user memerlukan approval manual admin
    registrationPolicy: {
        allowFreeEmail: true,           // ✅ Izinkan email bebas (non-domain sekolah)
        requireManualApproval: true,    // ✅ Semua user harus di-approve admin
        trustedDomains: [],             // ❌ Tidak ada domain auto-approve (kosong = semua pending)
        approvalTimeframe: '1-3 hari kerja'  // ⏱️ Estimasi waktu approval
    }
};

// ============================================
// HELPER FUNCTIONS (Jangan diubah strukturnya)
// ============================================

/**
 * Cek apakah email adalah admin utama
 * @param {string} email - Email user yang dicek
 * @returns {boolean} - True jika email sama dengan ADMIN_CONFIG.email
 */
export function isAdmin(email) {
    return email === ADMIN_CONFIG.email;
}

/**
 * Get informasi kontak admin untuk ditampilkan di UI
 * @returns {Object} - Object berisi email, name, school
 */
export function getAdminContact() {
    return {
        email: ADMIN_CONFIG.contact,
        name: ADMIN_CONFIG.name,
        school: ADMIN_CONFIG.school
    };
}

/**
 * Cek apakah user memenuhi policy registrasi
 * @param {string} email - Email user yang daftar
 * @returns {Object} - { allowed: boolean, reason: string, requiresApproval: boolean }
 */
export function checkRegistrationPolicy(email) {
    const { allowFreeEmail, requireManualApproval, trustedDomains } = ADMIN_CONFIG.registrationPolicy;
    
    // Extract domain dari email
    const domain = email.split('@')[1]?.toLowerCase() || '';
    
    // Cek jika domain termasuk trusted (auto-approve)
    const isTrustedDomain = trustedDomains.includes(domain);
    
    // Logic policy
    if (allowFreeEmail) {
        // ✅ Email bebas diperbolehkan
        return {
            allowed: true,
            reason: 'Email bebas diperbolehkan',
            requiresApproval: !isTrustedDomain && requireManualApproval,
            status: isTrustedDomain ? 'active' : 'pending_approval'
        };
    } else {
        // ❌ Hanya domain tertentu yang diperbolehkan
        if (trustedDomains.includes(domain)) {
            return {
                allowed: true,
                reason: 'Domain sekolah terverifikasi',
                requiresApproval: false,
                status: 'pending_approval' // Tetap perlu approval meski domain trusted
            };
        } else {
            return {
                allowed: false,
                reason: `Hanya email domain ${trustedDomains.join(', ')} yang diperbolehkan`,
                requiresApproval: false,
                status: 'rejected'
            };
        }
    }
}
