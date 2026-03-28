// ============================================
// AUTH REGISTER - auth-register.js
// ============================================

import { auth, db } from './config-firebase.js';
import { ADMIN_CONFIG } from './config-admin.js';
import { 
    createUserWithEmailAndPassword, 
    updateProfile,
    sendEmailVerification 
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { 
    doc, 
    setDoc 
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// ============================================
// FUNGSI: Register Guru Baru
// ============================================
export async function registerGuru(formData) {
    console.log('📝 Registration attempt for:', formData.email);
    
    try {
        // ✅ STEP 1: CREATE USER di Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth, 
            formData.email, 
            formData.password
        );
        const user = userCredential.user;
        
        console.log('✅ Auth user created:', user.uid);
        
        // ✅ STEP 2: UPDATE PROFILE
        await updateProfile(user, {
            displayName: formData.namaLengkap
        });
        
        // ✅ STEP 3: KIRIM EMAIL VERIFIKASI
        await sendEmailVerification(user);
        console.log('📧 Verification email sent');
        
        // ✅ STEP 4: SIMPAN DATA USER di Firestore
        // Tentukan status berdasarkan domain email
        const emailDomain = formData.email.split('@')[1]?.toLowerCase();
        const isTrustedDomain = emailDomain === 'guru.sd.belajar.id' || 
                                emailDomain === 'guru.belajar.sd.id' ||
                                emailDomain.includes('sd.belajar');
        
        // Auto-approve untuk domain terpercaya, lainnya pending
        const initialStatus = isTrustedDomain ? 'pending_approval' : 'pending_approval';
        
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: formData.email,
            namaLengkap: formData.namaLengkap,
            noHp: formData.noHp,
            jenjang: formData.jenjang,
            mataPelajaran: formData.mataPelajaran,
            sekolah: formData.sekolah,
            role: 'guru',
            emailVerified: false,
            status: initialStatus,
            approvedBy: '',
            approvedAt: null,
            rejectedReason: '',
            createdAt: new Date(),
            lastLogin: null
        });
        
        console.log('✅ User profile saved to Firestore');
        console.log(`📋 Status: ${initialStatus}`);
        
        return {
            success: true,
            message: 'Registrasi berhasil! Silakan cek email untuk verifikasi.',
            needsVerification: true,
            user: {
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                status: initialStatus
            }
        };
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        
        // Handle specific Firebase errors
        let errorMessage = error.message;
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Email sudah terdaftar. Silakan login atau gunakan email lain.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Format email tidak valid.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password terlalu lemah. Minimal 8 karakter.';
        } else if (error.code === 'auth/network-request-failed') {
            errorMessage = 'Koneksi internet bermasalah. Silakan coba lagi.';
        }
        
        return {
            success: false,
            error: errorMessage
        };
    }
}
