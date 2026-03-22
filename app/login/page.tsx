'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { GraduationCap, ShieldCheck, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('000000');

  const { login, validateCredentials, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setGeneratedOtp(String(Math.floor(100000 + Math.random() * 900000)));
  }, []);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    setError('');
    
    try {
      await validateCredentials(username, password);
      setShowOtp(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp !== generatedOtp) {
      setError('Invalid OTP code. Please try again.');
      return;
    }

    try {
      await login(username, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <Card className="w-full max-w-md border-none shadow-2xl overflow-hidden bg-white">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
        <CardHeader className="space-y-1 text-center pt-8 pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            DGVC<br /> Attendance Portal
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8">
          {!showOtp ? (
            <form onSubmit={handleInitialSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-semibold">Username or Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    placeholder="name@college.edu"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-11 border-slate-200 focus:ring-blue-500 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                  <a href="#" className="text-xs text-blue-600 hover:underline font-medium">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 border-slate-200 focus:ring-blue-500 rounded-lg"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-100 disabled:opacity-70"
              >
                {isLoading ? 'Validating...' : 'Continue'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">Security Verification</h3>
                <p className="text-sm text-slate-500">Enter the 6-digit code shown below to continue</p>
                <div className="py-4 px-6 bg-slate-100 rounded-xl inline-block mx-auto mb-4 border border-slate-200">
                  <span className="text-3xl font-black tracking-[0.5em] text-blue-700 italic">{generatedOtp}</span>
                </div>
              </div>

              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(val) => setOtp(val)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-emerald-100"
                  disabled={otp.length !== 6 || isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Access Dashboard'}
                </Button>
                <button
                  type="button"
                  onClick={() => { setShowOtp(false); setOtp(''); }}
                  className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                  Back to login
                </button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="bg-slate-50 px-8 py-4 border-t border-slate-100">
          <p className="text-xs text-center w-full text-slate-400 font-medium uppercase tracking-widest">
            Secured by DGVC IT Services
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
