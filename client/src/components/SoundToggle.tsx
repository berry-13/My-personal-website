import { useSyncExternalStore } from "react";

const STORAGE_KEY = "sound";
const CHANGE_EVENT = "sound-preference-change";
let sessionPreference: boolean | null = null;

export function isSoundEnabled(): boolean {
    if (sessionPreference !== null) return sessionPreference;
    try {
        return localStorage.getItem(STORAGE_KEY) !== "off";
    } catch {
        return true;
    }
}

function setSoundEnabled(enabled: boolean) {
    sessionPreference = enabled;
    try {
        localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
    } catch {
        // Storage unavailable (private mode); sessionPreference covers this visit
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
}

// Desktop and mobile navs each render a toggle; a shared store keeps them in sync
function subscribe(callback: () => void) {
    window.addEventListener(CHANGE_EVENT, callback);
    return () => window.removeEventListener(CHANGE_EVENT, callback);
}

const SoundToggle = ({ className = "" }: { className?: string }) => {
    const enabled = useSyncExternalStore(subscribe, isSoundEnabled, () => true);

    return (
        <button
            type="button"
            onClick={() => setSoundEnabled(!enabled)}
            aria-label="Navigation sounds"
            aria-pressed={enabled}
            className={`cursor-pointer text-muted transition-colors hover:text-ink ${className}`}
        >
            [sound {enabled ? "on" : "off"}]
        </button>
    );
};

export default SoundToggle;
