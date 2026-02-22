import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatInTimeZone } from "date-fns-tz";

interface TimeStatusState {
    time: string;
    awake: boolean | null;
    doNotDisturb: boolean;
}

const TimeStatus = () => {
    const [status, setStatus] = useState<TimeStatusState>({
        time: "00:00 AM",
        awake: null,
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
                        awake: data.isAwake ?? null,
                    }));
                }
            })
            .catch((error) => {
                console.warn("Failed to fetch awake status:", error instanceof Error ? error.message : "Unknown error");
            });

        return () => clearInterval(interval);
    }, []);

    const getStatusText = () => {
        if (status.awake === null) return "around";
        return status.awake ? "awake" : "sleeping";
    };

    const getStatusColor = () => {
        if (status.awake === null) return "text-gray-500/80 dark:text-gray-400/80";
        return status.awake
            ? "text-green-500/80 dark:text-green-400/80"
            : "text-blue-500/80 dark:text-blue-400/80";
    };

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
                    key={getStatusText()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`font-medium ${getStatusColor()}`}
                >
                    {getStatusText()}
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
