
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-black border-t-2 border-gray-800">
            <div className="container mx-auto px-4 py-6 text-center text-gray-500">
                <p className="font-bold text-lg text-yellow-400 mb-2">El juego puede ser adictivo. Juega con responsabilidad.</p>
                <p>&copy; {new Date().getFullYear()} Vector's 666 Casino. Todos los derechos reservados. Este es un proyecto de simulación.</p>
                <div className="flex justify-center space-x-4 mt-4">
                    <a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a>
                    <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
                    <a href="#" className="hover:text-white transition-colors">Juego Responsable</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
