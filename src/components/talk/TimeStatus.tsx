import { useEffect, useState } from "react";

const TimeStatus = () => {
    const [time, setTime] = useState<string>("00:00:00 p.m.");
    const [awake, setAwake] = useState<boolean>(true);
    const [doNotDisturb, setDoNotDisturb] = useState<boolean>(false);

    async function fetchAwake() {
        let response = await fetch("/api/awake");

        const data = await response.json();

        if (data.isDoNotDisturb) setDoNotDisturb(true);
    }

    function updateTime() {
        let current = new Date().toLocaleString("en-US", { timeZone: "Europe/Rome" });
        setTime(`${current.slice(-11, -6)}${current.slice(-3, -1)}.M.`);
        setTimeout(updateTime, 60 * 1000);

        if (new Date().getHours() < 7) setAwake(false);
    }

    useEffect(() => {
        updateTime();
        fetchAwake();
    }, []);

    return (
        <p className="text-black/50 dark:text-white/50 text-sm mb-10">
            It's currently <span className="font-semibold text-black/60 dark:text-white/60">{time}</span> for me, so I'm
            probably{" "}
            <span className="font-semibold text-black/60 dark:text-white/60">{awake ? "awake" : "sleeping"}</span>
            {awake && doNotDisturb && " but I have "}
            <span className="font-semibold text-black/60 dark:text-white/60">
                {awake && doNotDisturb && "do not disturb mode enabled."}
            </span>
        </p>
    );
};

export default TimeStatus;
