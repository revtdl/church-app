// Email Authentication Module
// Handles email-based login for Church App

function sendLoginEmail() {
    const email = document.getElementById('emailInput').value;
    if (!email) {
        alert('Please enter your email address');
        return;
    }

    console.log('📧 Login link sent to:', email);
    document.getElementById('emailStep').style.display = 'none';
    document.getElementById('verificationStep').style.display = 'block';
    document.getElementById('emailVerificationDisplay').textContent = email;
}

function resendLoginEmail() {
    alert('✅ Login link resent!');
}

function backToEmailInput() {
    document.getElementById('verificationStep').style.display = 'none';
    document.getElementById('emailStep').style.display = 'block';
}

function checkMemberLogin() {
    // Placeholder for email/Firebase authentication
    console.log('Checking member login...');
}
