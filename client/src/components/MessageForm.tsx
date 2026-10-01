import { useState, useId, useRef, useLayoutEffect, type FormEvent } from "react";
import { isValidEmail } from "~/utils/validation";

const ERROR_MESSAGES: Record<string, string> = {
    RATE_LIMIT_EXCEEDED: "You've sent a few messages already. Please wait a bit and try again.",
    INVALID_EMAIL: "Please enter a valid email address.",
    FIELD_EMPTY: "Please fill out both fields.",
    EMAIL_TOO_LONG: "That email address is too long.",
    MESSAGE_TOO_LONG: "Please keep your message under 1,000 characters.",
};
const GENERIC_ERROR = "Something went wrong sending your message. Please try again, or email me directly.";
const MAX_MESSAGE = 1000;

type Field = "email" | "message";

const fieldClasses =
    "w-full border-0 border-b border-rule bg-transparent px-0 py-3 text-lg text-ink transition-colors duration-300 placeholder:text-muted focus:border-accent focus:shadow-[inset_0_-1px_0_var(--accent)] focus:outline-none focus:ring-0 aria-invalid:border-del aria-invalid:shadow-[inset_0_-1px_0_var(--del)]";

const MessageForm = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<{ text: string; field: Field | null } | null>(null);
    const [formHeight, setFormHeight] = useState<number>();
    const formRef = useRef<HTMLFormElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);
    const statusRef = useRef<HTMLDivElement>(null);
    const emailId = useId();
    const messageId = useId();
    const errorId = useId();

    // After a successful send, move focus to the confirmation so it is announced and keyboard users are not lost
    useLayoutEffect(() => {
        if (sent) statusRef.current?.focus();
    }, [sent]);

    const fail = (text: string, field: Field | null) => {
        setError({ text, field });
        if (field === "email") emailRef.current?.focus();
        if (field === "message") messageRef.current?.focus();
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (sending) return;
        if (!email) return fail("Please enter your email address.", "email");
        if (!isValidEmail(email)) return fail(ERROR_MESSAGES.INVALID_EMAIL, "email");
        if (!message.trim()) return fail("Please write a message.", "message");

        setSending(true);
        setError(null);
        try {
            const response = await fetch("/api/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, message }),
            });
            const data = (await response.json()) as { result: string };
            if (response.ok && data.result === "Success") {
                setFormHeight(formRef.current?.offsetHeight);
                setSent(true);
            } else {
                const field = data.result === "INVALID_EMAIL" || data.result === "EMAIL_TOO_LONG" ? "email" : null;
                fail(ERROR_MESSAGES[data.result] ?? GENERIC_ERROR, field);
            }
        } catch (err) {
            fail(
                err instanceof TypeError && err.message === "Failed to fetch"
                    ? "Network error. Please check your connection and try again."
                    : GENERIC_ERROR,
                null,
            );
        } finally {
            setSending(false);
        }
    };

    if (sent) {
        return (
            // Same height as the form it replaces, so the page does not collapse
            <div
                ref={statusRef}
                role="status"
                tabIndex={-1}
                style={{ minHeight: formHeight }}
                className="page-enter flex flex-col justify-center border-l-2 border-accent pl-6 outline-none"
            >
                <p className="text-2xl leading-snug">Message sent.</p>
                <p className="mt-2 text-lg text-ink/85">
                    I&apos;ll reply to <span className="font-mono text-base">{email}</span>.
                </p>
            </div>
        );
    }

    const invalid = (field: Field) => error?.field === field;

    return (
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-9">
            <div>
                <label htmlFor={emailId} className="font-mono text-xs text-muted">
                    your email
                </label>
                <input
                    ref={emailRef}
                    id={emailId}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => {
                        setEmail(e.target.value);
                        if (invalid("email")) setError(null);
                    }}
                    aria-invalid={invalid("email") || undefined}
                    aria-describedby={invalid("email") ? errorId : undefined}
                    className={fieldClasses}
                />
            </div>
            <div>
                <div className="flex justify-between font-mono text-xs text-muted">
                    <label htmlFor={messageId}>message</label>
                    <span aria-hidden="true" className="tabular-nums">
                        {message.length}/{MAX_MESSAGE}
                    </span>
                </div>
                <textarea
                    ref={messageRef}
                    id={messageId}
                    rows={5}
                    maxLength={MAX_MESSAGE}
                    placeholder="Hi Marco, ..."
                    value={message}
                    onChange={e => {
                        setMessage(e.target.value);
                        if (invalid("message")) setError(null);
                    }}
                    aria-invalid={invalid("message") || undefined}
                    aria-describedby={invalid("message") ? errorId : undefined}
                    className={`${fieldClasses} resize-y`}
                />
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <button
                    type="submit"
                    aria-disabled={sending}
                    className="min-h-11 cursor-pointer border border-ink px-6 font-mono text-[13px] text-ink transition-colors duration-300 hover:bg-ink hover:text-paper aria-disabled:cursor-wait aria-disabled:opacity-60"
                >
                    {sending ? "sending..." : "send message →"}
                </button>
                {/* Always rendered so announcements are reliable; empty until there is an error */}
                <p id={errorId} role="alert" className="min-w-0 font-mono text-[13px] text-del">
                    {error?.text}
                </p>
            </div>
        </form>
    );
};

export default MessageForm;
