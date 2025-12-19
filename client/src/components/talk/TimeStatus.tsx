import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatInTimeZone } from "date-fns-tz";

interface TimeStatusState {
    time: string;
    awake: boolean;
    doNotDisturb: boolean;
}

const TimeStatus = () => {
    const [status, setStatus] = useState<TimeStatusState>({
        time: "00:00 AM",
        awake: true,
        doNotDisturb: false,
    });

    const updateTime = () => {
        const now = new Date();
        const formattedTime = formatInTimeZone(now, "Europe/Rome", "hh:mm a");

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
                if (data.result === "Success") {
                    setStatus(prev => ({
                        ...prev,
                        doNotDisturb: data.isDoNotDisturb ?? false,
                        awake: data.isAwake ?? true,
                    }));
                }
            })
            .catch(() => {
                // Silently fail - keep default status
            });

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-black/50 dark:text-white/50 text-sm mb-10 tracking-wide"
        >
            It's currently{" "}
            <motion.span
                className="font-medium text-black/60 dark:text-white/60"
                whileHover={{ scale: 1.05 }}
            >
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
