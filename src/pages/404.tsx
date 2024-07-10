import React from "react";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const NotFound: React.FC = () => {
    const particlesInit = React.useCallback(async (engine: any) => {
        await loadSlim(engine);
    }, []);

    return (
        <div className="relative h-screen w-full">
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={{
                    fpsLimit: 120,
                    interactivity: {
                        events: {
                            onHover: {
                                enable: true,
                                mode: "attract",
                            },
                            resize: true,
                        },
                        modes: {
                            attract: {
                                distance: 300,
                                duration: 1,
                            },
                        },
                    },
                    particles: {
                        color: {
                            value: "#ffffff",
                        },
                        links: {
                            color: "#ffffff",
                            distance: 150,
                            enable: true,
                            opacity: 0.5,
                            width: 1,
                        },
                        collisions: {
                            enable: true,
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outModes: {
                                default: "bounce",
                            },
                            random: false,
                            speed: 1,
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 1000,
                            },
                            value: 15,
                        },
                        opacity: {
                            value: 0.5,
                        },
                        shape: {
                            type: "circle",
                        },
                        size: {
                            value: { min: 1, max: 5 },
                        },
                    },
                    detectRetina: true,
                }}
                className="absolute inset-0"
            />
            <div className="relative z-10 flex items-center justify-center h-full">
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ ease: "easeOut", duration: 0.25 }}
                >
                    <h1 className="text-white text-center font-bold text-3xl">Nothing to see here 🤷‍♂️</h1>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
