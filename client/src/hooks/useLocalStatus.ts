import { useEffect, useState } from "react";
import useSWR from "swr";

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

const guessFromHour = (date: Date): SensorState => ({
    awake: Number(hourFormatter.format(date)) >= 8,
    doNotDisturb: false,
});

const fetchSensor = async (url: string): Promise<SensorState> => {
    const response = await fetch(url);
    const data = await response.json();
    if (data.result !== "Success") throw new Error(data.result);
    return { awake: data.isAwake ?? true, doNotDisturb: data.isDoNotDisturb ?? false };
};

/**
 * Local time in Rome plus awake status from the Home Assistant sensor.
 * Status is null until the sensor answers; if it cannot be reached, it falls back to a guess from the hour.
 * The sensor request is shared through SWR, so header and footer make one call.
 */
export function useLocalStatus() {
    const [now, setNow] = useState(() => new Date());
    const { data, error } = useSWR("/api/awake", fetchSensor, {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        dedupingInterval: 5 * 60 * 1000,
    });

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 30_000);
        return () => clearInterval(interval);
    }, []);

    const sensor = data ?? (error ? guessFromHour(now) : null);

    return {
        time: timeFormatter.format(now),
        awake: sensor ? sensor.awake : null,
        doNotDisturb: sensor?.doNotDisturb ?? false,
    };
}
