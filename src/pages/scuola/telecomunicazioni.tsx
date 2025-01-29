import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Calculator, BookOpen } from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";

const LatexFormula = ({ formula }: { formula: string }) => {
    const htmlString = katex.renderToString(formula, {
        throwOnError: false,
        displayMode: true,
    });

    return <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: htmlString }} />;
};

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

const ElectroGuide = () => {
    const [expandedSection, setExpandedSection] = useState("ohm");
    const [voltage, setVoltage] = useState("");
    const [current, setCurrent] = useState("");
    const [resistance, setResistance] = useState("");

    useEffect(() => {
        // Force light theme
        const html = document.querySelector("html");
        if (html) {
            html.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, []);

    interface LatexFormulaProps {
        formula: string;
    }

    const renderLatex = (formula: string): React.ReactElement<LatexFormulaProps> => {
        return <LatexFormula formula={formula} />;
    };

    const calculateResult = () => {
        if (voltage && current && !resistance) {
            const r = (parseFloat(voltage) / parseFloat(current)).toFixed(2);
            return {
                formula: "R = V/I",
                calculation: `R = ${voltage}V / ${current}A`,
                result: `R = ${r} Ω`,
            };
        }
        if (voltage && resistance && !current) {
            const i = (parseFloat(voltage) / parseFloat(resistance)).toFixed(2);
            return {
                formula: "I = V/R",
                calculation: `I = ${voltage}V / ${resistance}Ω`,
                result: `I = ${i} A`,
            };
        }
        if (current && resistance && !voltage) {
            const v = (parseFloat(current) * parseFloat(resistance)).toFixed(2);
            return {
                formula: "V = R·I",
                calculation: `V = ${resistance}Ω · ${current}A`,
                result: `V = ${v} V`,
            };
        }
        return null;
    };

    const sections = [
        {
            id: "ohm",
            title: "Legge di Ohm",
            content: (
                <div className="space-y-6">
                    <p className="text-gray-600">
                        La legge di Ohm definisce la relazione tra tensione (V), corrente (I) e resistenza (R):
                    </p>
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                        {renderLatex("V = R \\cdot I")}
                        <div className="grid grid-cols-3 gap-4 text-sm mt-4">
                            <div>
                                <p className="font-medium text-gray-700">Tensione (V)</p>
                                <p className="text-gray-500">Volt [V]</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Resistenza (R)</p>
                                <p className="text-gray-500">Ohm [Ω]</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Corrente (I)</p>
                                <p className="text-gray-500">Ampere [A]</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-medium mb-4 text-gray-700">Formule derivate:</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>{renderLatex("I = \\frac{V}{R}")}</div>
                            <div>{renderLatex("R = \\frac{V}{I}")}</div>
                            <div>{renderLatex("V = R \\cdot I")}</div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: "kirchhoff",
            title: "Leggi di Kirchhoff",
            content: (
                <div className="space-y-6">
                    <div className="mb-6">
                        <h3 className="font-medium mb-2">Prima Legge - Legge dei nodi</h3>
                        <p className="text-gray-600 mb-4">
                            La somma delle correnti entranti in un nodo è uguale alla somma delle correnti uscenti.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                            {renderLatex("\\sum I_{entranti} = \\sum I_{uscenti}")}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium mb-2">Seconda Legge - Legge delle maglie</h3>
                        <p className="text-gray-600 mb-4">
                            La somma algebrica delle tensioni lungo una maglia chiusa è zero.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">{renderLatex("\\sum V = 0")}</div>
                    </div>
                </div>
            ),
        },
        {
            id: "generator",
            title: "Generatore Reale",
            content: (
                <div className="space-y-6">
                    <p className="text-gray-600">
                        Un generatore reale include una resistenza interna (Ri) che causa cadute di tensione:
                    </p>
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                        {renderLatex("V = E - R_i \\cdot I")}
                        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                            <div>
                                <p className="font-medium">E</p>
                                <p className="text-gray-500">Forza elettromotrice</p>
                            </div>
                            <div>
                                <p className="font-medium">Ri</p>
                                <p className="text-gray-500">Resistenza interna</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-medium mb-4 text-gray-700">Esempio pratico:</h3>
                        <p className="text-gray-600">Batteria da 12V con resistenza interna di 0.1Ω</p>
                        <div className="space-y-2 mt-4 text-gray-700">
                            <p>1. A vuoto (I = 0A):</p>
                            {renderLatex("V = 12V - 0.1Ω \\cdot 0A = 12V")}
                            <p>2. Con carico che assorbe 2A:</p>
                            {renderLatex("V = 12V - 0.1Ω \\cdot 2A = 11.8V")}
                            <p>3. Con carico che assorbe 10A:</p>
                            {renderLatex("V = 12V - 0.1Ω \\cdot 10A = 11V")}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: "resistance",
            title: "Resistenza Equivalente",
            content: (
                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-medium mb-4 text-gray-700">Resistenze in Serie</h3>
                        {renderLatex("R_{eq} = R_1 + R_2 + ... + R_n")}
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-medium mb-4 text-gray-700">Resistenze in Parallelo</h3>
                        {renderLatex("\\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2} + ... + \\frac{1}{R_n}")}
                        <p className="mt-4 text-gray-700">Per due resistenze in parallelo:</p>
                        {renderLatex("R_{eq} = \\frac{R_1 \\cdot R_2}{R_1 + R_2}")}
                    </div>
                </div>
            ),
        },
        {
            id: "superposition",
            title: "Sovrapposizione degli Effetti",
            content: (
                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-medium mb-4 text-gray-700">Metodo</h3>
                        <ol className="list-decimal list-inside space-y-2 text-gray-600">
                            <li>Considerare un solo generatore alla volta</li>
                            <li>Cortocircuitare i generatori di tensione (V=0)</li>
                            <li>Aprire i generatori di corrente (I=0)</li>
                            <li>Calcolare l'effetto del singolo generatore</li>
                            <li>Sommare tutti gli effetti</li>
                        </ol>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-medium mb-4 text-gray-700">Esempio Pratico</h3>
                        <p className="text-gray-600 mb-4">Circuito con:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                            <li>V1 = 12V</li>
                            <li>V2 = 6V</li>
                            <li>R1 = 4Ω</li>
                            <li>R2 = 2Ω</li>
                            <li>R3 = 6Ω</li>
                        </ul>
                        <div className="space-y-4 text-gray-700">
                            <p>1. Con V1 attivo (V2 cortocircuitato):</p>
                            {renderLatex(
                                "R_{eq} = R1 + \\frac{R2 \\cdot R3}{R2 + R3} = 4Ω + \\frac{2Ω \\cdot 6Ω}{8Ω} = 5.5Ω"
                            )}
                            {renderLatex("I_1 = \\frac{V1}{R_{eq}} = \\frac{12V}{5.5Ω} = 2.18A")}
                            {renderLatex("I_{R3,1} = 2.18A \\cdot \\frac{R2}{R2 + R3} = 0.55A")}

                            <p>2. Con V2 attivo (V1 cortocircuitato):</p>
                            {renderLatex("R_{eq} = R3 + \\frac{R1 \\cdot R2}{R1 + R2} = 6Ω + \\frac{8Ω}{6Ω} = 7.33Ω")}
                            {renderLatex("I_2 = \\frac{V2}{R_{eq}} = \\frac{6V}{7.33Ω} = 0.82A")}
                            {renderLatex("I_{R3,2} = 0.82A")}

                            <p>3. Corrente totale su R3:</p>
                            {renderLatex("I_{R3,tot} = I_{R3,1} + I_{R3,2} = 0.55A + 0.82A = 1.37A")}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: "current-voltage",
            title: "Calcolo Correnti e Tensioni",
            content: (
                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-medium mb-4">Regole Base</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="font-medium">In Serie:</p>
                                <ul className="list-disc list-inside space-y-2 text-gray-600">
                                    <li>Corrente uguale su tutti i componenti</li>
                                    <li>Tensioni si sommano</li>
                                    {renderLatex("I_{tot} = \\frac{V_{tot}}{R_{eq}}")}
                                </ul>
                            </div>
                            <div>
                                <p className="font-medium">In Parallelo:</p>
                                <ul className="list-disc list-inside space-y-2 text-gray-600">
                                    <li>Tensione uguale su tutti i rami</li>
                                    <li>Correnti si dividono</li>
                                    {renderLatex("I_n = \\frac{V}{R_n}")}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-medium mb-4">Esempio Circuito Misto</h3>
                        <p className="text-gray-600 mb-4">Componenti:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                            <li>Generatore V = 12V</li>
                            <li>R1 = 3Ω (serie)</li>
                            <li>R2 = 6Ω || R3 = 3Ω (parallelo)</li>
                            <li>R4 = 2Ω (serie)</li>
                        </ul>
                        <div className="space-y-4">
                            <div>
                                <p>1. Resistenza equivalente totale:</p>
                                {renderLatex(
                                    "R_{eq(2,3)} = \\frac{R2 \\cdot R3}{R2 + R3} = \\frac{6Ω \\cdot 3Ω}{9Ω} = 2Ω"
                                )}
                                {renderLatex("R_{eq(tot)} = R1 + R_{eq(2,3)} + R4 = 3Ω + 2Ω + 2Ω = 7Ω")}
                            </div>
                            <div>
                                <p>2. Corrente totale:</p>
                                {renderLatex("I_{tot} = \\frac{V}{R_{eq(tot)}} = \\frac{12V}{7Ω} = 1.71A")}
                            </div>
                            <div>
                                <p>3. Tensioni e correnti su ogni componente:</p>
                                <div className="pl-4 space-y-2">
                                    <p>R1 (serie):</p>
                                    {renderLatex("I_{R1} = I_{tot} = 1.71A")}
                                    {renderLatex("V_{R1} = R1 \\cdot I_{R1} = 3Ω \\cdot 1.71A = 5.14V")}

                                    <p>R2||R3 (parallelo):</p>
                                    {renderLatex(
                                        "V_{R2} = V_{R3} = I_{tot} \\cdot R_{eq(2,3)} = 1.71A \\cdot 2Ω = 3.43V"
                                    )}
                                    {renderLatex("I_{R2} = \\frac{V_{R2}}{R2} = \\frac{3.43V}{6Ω} = 0.57A")}
                                    {renderLatex("I_{R3} = \\frac{V_{R3}}{R3} = \\frac{3.43V}{3Ω} = 1.14A")}

                                    <p>R4 (serie):</p>
                                    {renderLatex("I_{R4} = I_{tot} = 1.71A")}
                                    {renderLatex("V_{R4} = R4 \\cdot I_{R4} = 2Ω \\cdot 1.71A = 3.43V")}
                                </div>
                            </div>
                            <div>
                                <p>4. Verifica:</p>
                                {renderLatex("V_{R1} + V_{R2} + V_{R4} = 5.14V + 3.43V + 3.43V = 12V")}
                                {renderLatex("I_{R2} + I_{R3} = 0.57A + 1.14A = 1.71A = I_{tot}")}
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: "examples",
            title: "Esempi Pratici",
            content: (
                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-medium mb-4 text-gray-700">Circuito Serie con due resistenze</h3>
                        <p className="text-gray-600 mb-4">
                            Calcolo di correnti e tensioni in un circuito con:
                            <br />- Generatore: 12V
                            <br />- R1 = 4Ω
                            <br />- R2 = 6Ω in serie
                        </p>
                        <div className="space-y-4 text-gray-700">
                            <div>
                                <p>1. Resistenza totale:</p>
                                {renderLatex("R_{tot} = R_1 + R_2 = 4Ω + 6Ω = 10Ω")}
                            </div>
                            <div>
                                <p>2. Corrente totale:</p>
                                {renderLatex("I = \\frac{V}{R_{tot}} = \\frac{12V}{10Ω} = 1.2A")}
                            </div>
                            <div>
                                <p>3. Tensione su R1:</p>
                                {renderLatex("V_{R1} = R_1 \\cdot I = 4Ω \\cdot 1.2A = 4.8V")}
                            </div>
                            <div>
                                <p>4. Tensione su R2:</p>
                                {renderLatex("V_{R2} = R_2 \\cdot I = 6Ω \\cdot 1.2A = 7.2V")}
                            </div>
                            <div>
                                <p>Verifica:</p>
                                {renderLatex("V_{R1} + V_{R2} = 4.8V + 7.2V = 12V")}
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: "calculator",
            title: "Calcolatore",
            content: (
                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tensione (V)</label>
                            <input
                                type="number"
                                value={voltage}
                                onChange={e => setVoltage(e.target.value)}
                                className="w-full p-2 border rounded-lg text-gray-800"
                                placeholder="Volt"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-1">Corrente (I)</label>
                            <input
                                type="number"
                                value={current}
                                onChange={e => setCurrent(e.target.value)}
                                className="w-full p-2 border rounded-lg text-gray-800"
                                placeholder="Ampere"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Resistenza (R)</label>
                            <input
                                type="number"
                                value={resistance}
                                onChange={e => setResistance(e.target.value)}
                                className="w-full p-2 border rounded-lg text-gray-800"
                                placeholder="Ohm"
                            />
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                        {calculateResult() && (
                            <>
                                <p className="font-medium">Formula utilizzata:</p>
                                {renderLatex(calculateResult().formula)}
                                <p className="font-medium mt-4">Calcolo:</p>
                                {renderLatex(calculateResult().calculation)}
                                <p className="font-medium mt-4">Risultato:</p>
                                {renderLatex(calculateResult().result)}
                            </>
                        )}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-3xl mx-auto p-6 bg-transparent">
            <h1 className="text-4xl font-light mb-8 text-center">Telecomunicazioni</h1>

            <div className="space-y-4">
                {sections.map(section => (
                    <div key={section.id} className="border rounded-lg overflow-hidden">
                        <button
                            onClick={() => setExpandedSection(section.id)}
                            className="w-full p-4 flex justify-between items-center bg-transparent hover:bg-gray-50"
                        >
                            <span className="text-lg font-medium text-gray-900">{section.title}</span>
                            {expandedSection === section.id ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>

                        {expandedSection === section.id && <div className="p-4 border-t">{section.content}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ElectroGuide;
