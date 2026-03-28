// ============================================
// ADMIN CONFIGURATION - config-admin.js
// ✅ Centralized Admin Config
// Ganti email admin HANYA di file ini!
// ============================================

export const ADMIN_CONFIG = {
    email: 'andi@139batuassung.com',      // ← GANTI EMAIL DI SINI SAJA!
    name: 'Administrator SDN 139 LAMANDA',
    contact: 'andi@139batuassung.com',
    school: 'SDN 139 LAMANDA',
    supportEmail: 'hasriandi@guru.sd.belajar.com'
};

// Helper function: Check if email is admin
export function isAdmin(email) {
    return email === ADMIN_CONFIG.email;
}

// Helper function: Get admin contact info
export function getAdminContact() {
    return {
        email: ADMIN_CONFIG.contact,
        name: ADMIN_CONFIG.name,
        school: ADMIN_CONFIG.school
    };
}
