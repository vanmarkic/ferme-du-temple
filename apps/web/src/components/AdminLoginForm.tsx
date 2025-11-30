import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mail, Loader2, ChevronDown, ChevronUp, KeyRound, Lock } from 'lucide-react';

interface AdminLoginFormProps {
  redirectTo?: string;
}

const AUTHORIZED_EMAILS = [
  'annabelleczyz@gmail.com',
  'severinm@me.com',
  'j.michel.production@gmail.com',
  'julieluyten@me.com',
  'cathyweyders@gmail.com',
  'drag.markovic@gmail.com',
  'colinponthot@gmail.com',
  'uuunam@gmail.com',
];

type LoginStep = 'email' | 'otp' | 'password';

export function AdminLoginForm({ redirectTo = '/admin/dashboard' }: AdminLoginFormProps) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<LoginStep>('email');
  const [showEmails, setShowEmails] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Echec de l\'envoi');
        setLoading(false);
        return;
      }

      setHasPassword(data.hasPassword || false);
      setStep('otp');
      setLoading(false);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez reessayer.');
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Code invalide');
        setLoading(false);
        return;
      }

      // Successfully verified - redirect or ask for password setup
      if (!hasPassword) {
        setStep('password');
        setLoading(false);
      } else {
        window.location.href = redirectTo;
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez reessayer.');
      setLoading(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erreur lors de la configuration');
        setLoading(false);
        return;
      }

      window.location.href = redirectTo;
    } catch (err) {
      setError('Une erreur est survenue. Veuillez reessayer.');
      setLoading(false);
    }
  };

  const handleSkipPassword = () => {
    window.location.href = redirectTo;
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Identifiants invalides');
        setLoading(false);
        return;
      }

      window.location.href = redirectTo;
    } catch (err) {
      setError('Une erreur est survenue. Veuillez reessayer.');
      setLoading(false);
    }
  };

  // OTP verification step
  if (step === 'otp') {
    return (
      <div className="w-full max-w-md mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-rich-black mb-2">Verification</h1>
          <p className="text-gray-600 mb-2">
            Un email a ete envoye a <strong>{email}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-6 bg-blue-50 p-3 rounded border border-blue-200">
            Copiez le code a 6 chiffres depuis l'email et collez-le ci-dessous.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <Label htmlFor="otp">Code de verification (6 chiffres)</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                required
                disabled={loading}
                autoFocus
                className="mt-1 text-center text-2xl tracking-widest font-mono"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-magenta hover:bg-magenta-dark"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verification...
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 mr-2" />
                  Verifier le code
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 flex justify-between items-center text-sm">
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setOtp('');
                setError('');
              }}
              className="text-gray-500 hover:text-magenta"
            >
              Changer d'email
            </button>
            <button
              type="button"
              onClick={() => {
                setOtp('');
                setError('');
                handleSendOtp({ preventDefault: () => {} } as React.FormEvent);
              }}
              className="text-gray-500 hover:text-magenta"
            >
              Renvoyer le code
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Password setup step (after first OTP login)
  if (step === 'password') {
    return (
      <div className="w-full max-w-md mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-rich-black mb-2">Definir un mot de passe</h1>
          <p className="text-gray-600 mb-6">
            Optionnel: definissez un mot de passe pour vous connecter plus rapidement
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSetPassword} className="space-y-4">
            <div>
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
                required
                disabled={loading}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 8 caracteres</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-magenta hover:bg-magenta-dark"
              disabled={loading || password.length < 8}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Configuration...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Definir le mot de passe
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleSkipPassword}
              className="text-sm text-gray-500 hover:text-magenta"
            >
              Passer cette etape
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Email entry step (default)
  return (
    <div className="w-full max-w-md mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-rich-black mb-2">Connexion Admin</h1>
        <p className="text-gray-600 mb-6">Connectez-vous avec votre email</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* OTP Login Form */}
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={loading}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-magenta hover:bg-magenta-dark"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Recevoir un code
              </>
            )}
          </Button>
        </form>

        {/* Password Login Option */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-500 mb-4 text-center">Ou connectez-vous avec votre mot de passe</p>
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <Label htmlFor="password-login">Mot de passe</Label>
              <Input
                id="password-login"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading || !email}
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              variant="outline"
              className="w-full border-rich-black"
              disabled={loading || !email || !password}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Se connecter avec mot de passe
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Liste des emails autorises */}
        <div className="mt-6 border-t pt-4">
          <button
            type="button"
            onClick={() => setShowEmails(!showEmails)}
            className="flex items-center justify-between w-full text-sm text-gray-500 hover:text-gray-700"
          >
            <span>Membres autorises ({AUTHORIZED_EMAILS.length})</span>
            {showEmails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showEmails && (
            <div className="mt-3 space-y-1">
              {AUTHORIZED_EMAILS.map((authorizedEmail) => (
                <button
                  key={authorizedEmail}
                  type="button"
                  onClick={() => setEmail(authorizedEmail)}
                  className={`block w-full text-left text-sm px-3 py-2 rounded transition-colors ${
                    email === authorizedEmail
                      ? 'bg-magenta/10 text-magenta font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {authorizedEmail}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
