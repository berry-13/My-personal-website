import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const NotFoundParticles = () => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let cancelled = false;
        initParticlesEngine(async engine => {
            await loadSlim(engine);
        }).then(() => {
            if (!cancelled) setReady(true);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    if (!ready) return null;

    return (
        <Particles
            id="tsparticles"
            options={{
                fpsLimit: 60,
                interactivity: {
                    events: {
                        onHover: { enable: true, mode: "attract" },
                        resize: { enable: true },
                    },
                    modes: {
                        attract: { distance: 300, duration: 1 },
                    },
                },
                particles: {
                    color: { value: ["#818cf8", "#6366f1", "#4f46e5"] },
                    links: {
                        color: "#6366f1",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 1,
                    },
                    collisions: { enable: true },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: { default: "bounce" },
                        random: false,
                        speed: 1,
                        straight: false,
                    },
                    number: {
                        density: { enable: true, height: 1000, width: 1000 },
                        value: 15,
                    },
                    opacity: { value: 0.5 },
                    shape: { type: "circle" },
                    size: { value: { min: 1, max: 5 } },
                },
                detectRetina: true,
            }}
            className="absolute inset-0"
        />
    );
};

export default NotFoundParticles;
