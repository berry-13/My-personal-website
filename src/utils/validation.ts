/**
 * Validates an email address format
 * @param email - The email string to validate
 * @returns true if the email format is valid
 */
export function isValidEmail(email: string): boolean {
    const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return emailRegex.test(email);
}

/**
 * Type guard to validate contact form data
 */
export interface ContactData {
    email: string;
    message: string;
}

export function isValidContactData(data: unknown): data is ContactData {
    return (
        typeof data === "object" &&
        data !== null &&
        "email" in data &&
        "message" in data &&
        typeof (data as ContactData).email === "string" &&
        typeof (data as ContactData).message === "string"
    );
}

/**
 * Validates contact form message constraints
 */
export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export function validateContactMessage(data: ContactData): ValidationResult {
    if (data.email.length < 1 || data.message.length < 1) {
        return { isValid: false, error: "FIELD_EMPTY" };
    }
    if (data.message.length > 1000) {
        return { isValid: false, error: "MESSAGE_TOO_LONG" };
    }
    if (!isValidEmail(data.email)) {
        return { isValid: false, error: "INVALID_EMAIL" };
    }
    if (data.email.length > 500) {
        return { isValid: false, error: "EMAIL_TOO_LONG" };
    }
    return { isValid: true };
}
