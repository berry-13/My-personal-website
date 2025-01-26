import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, getHours } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

interface TimeStatus {
    time: string;
    awake: boolean;
    doNotDisturb: boolean;
}

const TimeStatus = () => {
    const [status, setStatus] = useState<TimeStatus>({
        time: "00:00 AM",
        awake: true,
        doNotDisturb: false,
    });

    const updateTime = () => {
        const now = new Date();
        const romeTime = toZonedTime(now, "Europe/Rome");
        const formattedTime = formatInTimeZone(now, "Europe/Rome", "hh:mm a");
        const hour = getHours(romeTime);

        setStatus(prev => ({
            ...prev,
            time: formattedTime,
        }));
    };

    useEffect(() => {
        updateTime();
        const interval = setInterval(updateTime, 60000);

        fetch("/api/awake")
            .then(res => res.json())
            .then(data => {
                setStatus(prev => ({
                    ...prev,
                    doNotDisturb: data.isDoNotDisturb,
                    awake: data.isAwake,
                }));
            })
            .catch(console.error);

        return () => clearInterval(interval);
    }, []);

    console.log(status);

    return (
        <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-black/50 dark:text-white/50 text-sm mb-10 tracking-wide"
        >
            It's currently{" "}
            <motion.span className="font-medium text-black/60 dark:text-white/60" whileHover={{ scale: 1.05 }}>
                {status.time}
            </motion.span>{" "}
            for me and I'm probably{" "}
            <AnimatePresence mode="wait">
                <motion.span
                    key={status.awake ? "awake" : "sleeping"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`font-medium ${
                        status.awake
                            ? "text-green-500/80 dark:text-green-400/80"
                            : "text-blue-500/80 dark:text-blue-400/80"
                    }`}
                >
                    {status.awake ? "awake" : "sleeping"}
                </motion.span>
            </AnimatePresence>
            {status.doNotDisturb && status.awake && (
                <>
                    {" "}
                    but I have{" "}
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-medium text-amber-500/80 dark:text-amber-400/80"
                    >
                        do not disturb mode enabled on my phone
                    </motion.span>
                </>
            )}
            .
        </motion.p>
    );
};

export default TimeStatus;
