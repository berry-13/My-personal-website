import { useEffect, useState } from "react";

const TIME_ZONE = "Europe/Rome";

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
});

const hourFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    hour: "numeric",
    hourCycle: "h23",
});

interface SensorState {
    awake: boolean;
    doNotDisturb: boolean;
}

/** Local time in Rome plus awake status from the Home Assistant sensor, guessed from the hour if it is unreachable. */
export function useLocalStatus() {
    const [now, setNow] = useState(() => new Date());
    const [sensor, setSensor] = useState<SensorState | null>(null);

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 30_000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetch("/api/awake", { signal: controller.signal })
            .then(res => res.json())
            .then(data => {
                if (data.result === "Success") {
                    setSensor({ awake: data.isAwake ?? true, doNotDisturb: data.isDoNotDisturb ?? false });
                }
            })
            .catch(() => {
                // Sensor unreachable; fall back to the hour-based guess
            });
        return () => controller.abort();
    }, []);

    const hour = Number(hourFormatter.format(now));

    return {
        time: timeFormatter.format(now),
        awake: sensor ? sensor.awake : hour >= 8,
        doNotDisturb: sensor?.doNotDisturb ?? false,
    };
}
