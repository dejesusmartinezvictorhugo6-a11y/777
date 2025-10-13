import React, { useState } from 'react';
import Modal from '../cashier/ui/Modal';
import Input from '../cashier/ui/Input';
import Button from '../cashier/ui/Button';
import { useUser } from '../../hooks/useUser';
import { CameraIcon, GoogleIcon, FacebookIcon, XIcon } from '../cashier/ui/Icons';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onAuthSuccess }) => {
  const [view, setView] = useState<'login' | 'register'>('login');
  
  // States for both forms
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [idFile, setIdFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);

  const { login } = useUser();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login(email);
      onAuthSuccess();
    } else {
      alert("Por favor, completa tu email y contraseña.");
    }
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && dob && email && password && idFile && agreed) {
      login(email); // Simulate registration by logging in
      onAuthSuccess();
    } else {
      alert("Por favor, completa todos los campos, sube tu ID y acepta los términos.");
    }
  };

  const handleSocialLogin = (provider: string) => {
    // In a real app, this would trigger the OAuth flow.
    // Here, we'll just simulate a login.
    login(`user.${provider}@social.com`);
    onAuthSuccess();
  };

  const SocialLoginButtons = () => (
    <>
        <div className="relative flex pt-4 pb-2 items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">O</span>
            <div className="flex-grow border-t border-gray-700"></div>
        </div>
        <div className="space-y-3">
            <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
            >
                <GoogleIcon className="w-5 h-5 mr-3" />
                Continuar con Google
            </button>
            <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
            >
                <FacebookIcon className="w-5 h-5 mr-3 text-[#1877F2]" />
                Continuar con Facebook
            </button>
            <button
                type="button"
                onClick={() => handleSocialLogin('x')}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
            >
                <XIcon className="w-5 h-5 mr-3" />
                Continuar con X
            </button>
        </div>
    </>
  );

  const TabButton: React.FC<{tab: 'login' | 'register', children: React.ReactNode}> = ({ tab, children }) => (
    <button 
        type="button"
        onClick={() => setView(tab)}
        className={`w-1/2 py-3 text-lg font-black uppercase transition-colors ${view === tab ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500 hover:text-white'}`}
    >
        {children}
    </button>
  );

  return (
    <Modal isOpen={true} onClose={onClose} title={view === 'login' ? 'Entrar al Abismo' : 'Crear Cuenta Infernal'}>
      <div className="flex border-b border-gray-700 mb-6">
        <TabButton tab="login">Entrar</TabButton>
        <TabButton tab="register">Crear Cuenta</TabButton>
      </div>

      {view === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
            <p className="text-center text-yellow-400 font-bold mb-2">
            ¡Bienvenido de vuelta, pecador!
            </p>
            <Input
              label="Email"
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Contraseña"
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full !mt-6">
              Entrar
            </Button>
            <SocialLoginButtons />
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
            <p className="text-center text-yellow-400 font-bold -mt-2 mb-2">
                ¡Regístrate y recibe un bono de bienvenida de $1,000!
            </p>
            <Input label="Nombre Completo" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Fecha de Nacimiento" id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
            <Input label="Email" id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Contraseña" id="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <div>
              <label className="block text-sm font-bold text-cyan-400 mb-2 uppercase tracking-wider">Identificación Oficial</label>
              <label htmlFor="idFile" className="w-full bg-gray-800 border-2 border-dashed border-gray-700 rounded-md py-3 px-3 text-white leading-tight focus-within:border-cyan-500 focus-within:shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300 flex items-center justify-center cursor-pointer hover:bg-gray-700">
                <CameraIcon className="w-6 h-6 mr-3 text-cyan-400" />
                <span className="text-gray-400">{idFile ? idFile.name : 'Subir archivo (Foto o Escaneo)'}</span>
              </label>
              <input id="idFile" type="file" className="hidden" onChange={e => setIdFile(e.target.files ? e.target.files[0] : null)} accept="image/*,.pdf" required/>
            </div>
            <div className="pt-2">
                <label className="flex items-center text-gray-400">
                    <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 bg-gray-800 border-gray-600 text-red-600 focus:ring-red-500"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                    />
                    <span className="ml-2 text-sm">
                    Acepto los <a href="#" className="text-cyan-400 hover:underline">Términos y Condiciones</a> y confirmo que soy mayor de 18 años.
                    </span>
                </label>
            </div>
            <Button type="submit" className="w-full" disabled={!agreed}>
                Crear Cuenta
            </Button>
            <SocialLoginButtons />
        </form>
      )}
    </Modal>
  );
};

export default AuthModal;