
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
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const generateImageAnalysis = async () => {
            setLoading(true);
            setError('');
            setImageUrl('');

            try {
                if (!process.env.API_KEY) {
                    throw new Error("API key not found.");
                }
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

                const prompt = `A high-quality, professional graphic design of a 'Simplified PAR Sheet' (Probability and Accounting Report) for a fictional slot game named '${game.name}'. The image should look like a technical document with clear, modern typography, tables detailing RTP (96.15%), volatility (Medium-High), payout table symbols (Pyramid, Aztec Warrior, A, K), and feature probabilities (Free Spins 1 in 135 spins). Use a dark blue or black background with clean white/yellow text, mimicking a digital gaming analysis report. The title should be clearly visible in Spanish: 'Hoja PAR Simplificada'.`;

                const response = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: prompt,
                    config: {
                      numberOfImages: 1,
                      outputMimeType: 'image/jpeg',
                      aspectRatio: '3:4',
                    },
                });

                const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
                setImageUrl(`data:image/jpeg;base64,${base64ImageBytes}`);

            } catch (err) {
                console.error("Gemini API error:", err);
                let errorMessage = "Mis circuitos infernales están sobrecargados. No puedo generar el análisis visual en este momento.";
                if (err instanceof Error && err.message.includes("API key not found")) {
                    errorMessage = "Clave de API no configurada. Imposible contactar con la colmena de datos.";
                }
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        generateImageAnalysis();
    }, [game]);

    return (
        <Modal isOpen={true} onClose={onClose} title="Análisis de Vector IA" size="md">
            <div className="text-gray-300 min-h-[400px] flex flex-col justify-center items-center">
                {loading && (
                    <div className="text-center space-y-4">
                        <AIIcon className="w-16 h-16 text-cyan-400 mx-auto animate-pulse" />
                        <p className="font-bold text-lg text-cyan-400">Generando análisis visual infernal...</p>
                        <p className="text-sm text-gray-500">Esto puede tomar un momento.</p>
                    </div>
                )}
                {!loading && (
                     <div className="space-y-4 animate-fade-in w-full">
                        {error ? (
                             <p className="font-bold text-lg text-red-500 text-center p-8">{error}</p>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-red-500 text-center">{game.name} - Hoja PAR Simplificada</h3>
                                {imageUrl && (
                                    <div className="border-4 border-cyan-800 p-1 bg-gray-800 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                                        <img src={imageUrl} alt={`Análisis PAR para ${game.name}`} className="w-full h-auto object-contain rounded" />
                                    </div>
                                )}
                            </>
                        )}
                     </div>
                )}
            </div>
        </Modal>
    );
};

export default AIGameAnalysisModal;
