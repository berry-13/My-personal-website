import { useState, useId, type FormEvent } from "react";
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

const fieldClasses =
    "w-full border-0 border-b border-rule bg-transparent px-0 py-2 text-[17px] text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none focus:ring-0";

const MessageForm = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");
    const emailId = useId();
    const messageId = useId();
    const errorId = useId();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!email || !message) return setError(ERROR_MESSAGES.FIELD_EMPTY);
        if (!isValidEmail(email)) return setError(ERROR_MESSAGES.INVALID_EMAIL);

        setSending(true);
        setError("");
        try {
            const response = await fetch("/api/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, message }),
            });
            const data = (await response.json()) as { result: string };
            if (response.ok && data.result === "Success") {
                setSent(true);
            } else {
                setError(ERROR_MESSAGES[data.result] ?? GENERIC_ERROR);
            }
        } catch (err) {
            setError(
                err instanceof TypeError && err.message === "Failed to fetch"
                    ? "Network error. Please check your connection."
                    : GENERIC_ERROR,
            );
        } finally {
            setSending(false);
        }
    };

    if (sent) {
        return (
            <p role="status" className="mt-12 border-l-2 border-accent pl-4 text-[17px]">
                Message sent. I&apos;ll get back to you at <span className="font-mono text-sm">{email}</span>.
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="mt-12 max-w-[34rem] space-y-8">
            <div>
                <label htmlFor={emailId} className="font-mono text-xs text-muted">
                    your email
                </label>
                <input
                    id={emailId}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => {
                        setEmail(e.target.value);
                        setError("");
                    }}
                    aria-describedby={error ? errorId : undefined}
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
                    id={messageId}
                    rows={6}
                    maxLength={MAX_MESSAGE}
                    placeholder="Hi Marco, ..."
                    value={message}
                    onChange={e => {
                        setMessage(e.target.value);
                        setError("");
                    }}
                    aria-describedby={error ? errorId : undefined}
                    className={`${fieldClasses} resize-y`}
                />
            </div>
            {error && (
                <p id={errorId} role="alert" className="font-mono text-[13px] text-del">
                    {error}
                </p>
            )}
            <button
                type="submit"
                disabled={sending}
                className="cursor-pointer border border-ink px-5 py-2 font-mono text-[13px] text-ink transition-colors hover:bg-ink hover:text-paper disabled:cursor-wait disabled:opacity-60"
            >
                {sending ? "sending..." : "send message →"}
            </button>
        </form>
    );
};

export default MessageForm;
