import { lazy, Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";

const ParticlesBackdrop = lazy(() => import("./NotFoundParticles"));

const NotFound = () => {
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) return;
        const id = window.requestIdleCallback
            ? window.requestIdleCallback(() => setShouldRender(true))
            : window.setTimeout(() => setShouldRender(true), 200);
        return () => {
            if (window.cancelIdleCallback && typeof id === "number") {
                window.cancelIdleCallback(id);
            } else {
                clearTimeout(id as number);
            }
        };
    }, []);

    return (
        <div className="relative h-screen w-full" role="img" aria-label="404 page not found">
            {shouldRender && (
                <Suspense fallback={null}>
                    <ParticlesBackdrop />
                </Suspense>
            )}
            <div className="relative z-10 flex items-center justify-center h-full">
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ ease: "easeOut", duration: 0.25 }}
                >
                    <h1 className="text-black dark:text-white text-center font-bold text-3xl">
                        Nothing to see here
                    </h1>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
