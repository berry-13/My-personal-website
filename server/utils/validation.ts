const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(email: string): boolean {
    return EMAIL_REGEX.test(email);
}

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export function validateContactMessage(email: string, message: string): ValidationResult {
    if (email.length < 1 || message.length < 1) {
        return { isValid: false, error: "FIELD_EMPTY" };
    }
    if (email.length > 500) {
        return { isValid: false, error: "EMAIL_TOO_LONG" };
    }
    if (message.length > 1000) {
        return { isValid: false, error: "MESSAGE_TOO_LONG" };
    }
    if (!isValidEmail(email)) {
        return { isValid: false, error: "INVALID_EMAIL" };
    }
    return { isValid: true };
}
