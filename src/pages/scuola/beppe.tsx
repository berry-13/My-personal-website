import React, { useEffect, useState } from "react";
import "katex/dist/katex.min.css";

const TramontoEBuio = () => {
    const [tramonto, setTramonto] = useState(null);
    const [buioCompleto, setBuioCompleto] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSunsetData = async () => {
            try {
                const response = await fetch("https://api.sunrise-sunset.org/json?lat=45.4642&lng=9.1900&formatted=0");
                const data = await response.json();

                if (data.status === "OK") {
                    // Converte il tramonto e il buio completo in orario locale (CET/CEST)
                    const sunsetUTC = new Date(data.results.sunset);
                    const twilightEndUTC = new Date(data.results.astronomical_twilight_end);

                    const sunsetLocal = sunsetUTC.toLocaleTimeString("it-IT", {
                        timeZone: "Europe/Rome",
                        hour: "2-digit",
                        minute: "2-digit",
                    });

                    const twilightEndLocal = twilightEndUTC.toLocaleTimeString("it-IT", {
                        timeZone: "Europe/Rome",
                        hour: "2-digit",
                        minute: "2-digit",
                    });

                    setTramonto(sunsetLocal);
                    setBuioCompleto(twilightEndLocal);
                } else {
                    console.error("Errore nel recupero dei dati:", data);
                }
            } catch (error) {
                console.error("Errore nella richiesta API:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSunsetData();
    }, []);

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Orari del Tramonto e del Buio Completo a Milano</h2>
            {loading ? (
                <p>Caricamento...</p>
            ) : tramonto && buioCompleto ? (
                <p>
                    🌅 Il sole tramonterà alle <strong>{tramonto}</strong> <br />
                    🌌 Il buio completo arriverà alle <strong>{buioCompleto}</strong>
                </p>
            ) : (
                <p>Impossibile ottenere i dati.</p>
            )}
        </div>
    );
};

const Beppe = () => {
    return (
        <div className="max-w-3xl mx-auto p-6 bg-transparent">
            <h1 className="text-4xl font-light mb-8 text-center">Ciao Beppe!</h1>

            <div className="flex justify-center mb-6">
                <img
                    src="https://c.tenor.com/xDKmOyBg0h4AAAAd/tenor.gif"
                    alt="Emoji feet kicking gif"
                    className="rounded-md"
                />
            </div>

            <div className="space-y-4">{TramontoEBuio()}</div>
        </div>
    );
};

export default Beppe;
