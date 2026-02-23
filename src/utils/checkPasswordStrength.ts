import { PasswordStrengthType } from "../components/PasswordStrength";

export function checkPasswordStrength(password: string): PasswordStrengthType {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let score = 0;

    // Base scoring (2 points each)
    if (minLength) score += 1;
    if (hasUpperCase) score += 2;
    if (hasLowerCase) score += 2;
    if (hasNumber) score += 2;
    if (hasSpecialChar) score += 2;
    if (password.length > 12) score += 1;

    let strength: 'Weak' | 'Fair' | 'Good' | 'Strong';

    if (score === 0) {
        strength = 'Weak';
    } else if (score < 4) {
        strength = 'Weak';
    } else if (score < 8) {
        strength = 'Fair';
    } else if (score < 10) {
        strength = 'Good';
    } else {
        strength = 'Strong';
    }

    return {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumber,
        hasSpecialChar,
        score,
        strength,
    };
}
