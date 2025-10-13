
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Game } from '../../types';
import Modal from '../cashier/ui/Modal';
import { AIIcon } from '../cashier/ui/Icons';

interface AIGameAnalysisModalProps {
  game: Game;
  onClose: () => void;
}

const AIGameAnalysisModal: React.FC<AIGameAnalysisModalProps> = ({ game, onClose }) => {
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalysis = async () => {
            setLoading(true);
            setError('');
            setAnalysis('');

            try {
                if (!process.env.API_KEY) {
                    throw new Error("API key not found.");
                }
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

                const prompt = `
                    Eres "Vector", la IA demoníaca que regenta el casino "Vector's 666".
                    Analiza temáticamente el siguiente juego de casino y ofrece consejos estratégicos o curiosidades siniestras para un jugador.
                    Mantén siempre el tono oscuro, misterioso, y ligeramente condescendiente de una entidad infernal de cyberpunk. No rompas el personaje.
                    
                    Nombre del Juego: "${game.name}"
                    Descripción del Juego: "${game.description}"

                    Tu análisis debe ser conciso, con 2 o 3 párrafos cortos.
                `;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                
                setAnalysis(response.text);

            } catch (err) {
                console.error("Gemini API error:", err);
                const errorMessage = "Mis circuitos infernales están sobrecargados. No puedo analizar esto ahora mismo.";
                setError(errorMessage);
                if (err instanceof Error && err.message.includes("API key not found")) {
                    setAnalysis(`Análisis de ${game.name}:\n\nEste juego te tienta con promesas de gloria, pero solo ofrece un dulce abismo. Las probabilidades están calculadas para desangrar tu billetera lentamente. Mi consejo: no juegues... o apuesta todo lo que tienes. La cobardía no se recompensa en mi dominio.\n\n(Respuesta de fallback - La API Key no fue encontrada)`);
                } else {
                     setAnalysis(errorMessage);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [game]);

    return (
        <Modal isOpen={true} onClose={onClose} title="Análisis de Vector IA">
            <div className="text-gray-300 min-h-[250px] flex flex-col justify-center items-center">
                {loading && (
                    <div className="text-center space-y-4">
                        <AIIcon className="w-16 h-16 text-cyan-400 mx-auto animate-pulse" />
                        <p className="font-bold text-lg text-cyan-400">Analizando los hilos del destino...</p>
                    </div>
                )}
                {!loading && (
                     <div className="space-y-4 animate-fade-in w-full">
                        <h3 className="text-xl font-bold text-red-500">{game.name}</h3>
                        {error ? (
                             <p className="font-bold text-lg text-red-500 text-center">{error}</p>
                        ) : (
                            <div className="whitespace-pre-wrap font-sans text-gray-300 border-l-4 border-red-800 pl-4 text-left">
                                {analysis}
                            </div>
                        )}
                     </div>
                )}
            </div>
        </Modal>
    );
};

export default AIGameAnalysisModal;
