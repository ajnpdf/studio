
"use client";

import { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, CheckCircle2, ArrowRight, Loader2, KeyRound } from 'lucide-react';

type Step = 'email' | 'otp' | 'reset' | 'success';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordFlow({ open, onOpenChange }: Props) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 'otp') {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length === 6) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep('reset');
      }, 1000);
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
    }, 1500);
  };

  const resetAll = () => {
    setStep('email');
    setEmail('');
    setOtp(['', '', '', '', '', '']);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-2xl border-white/10 shadow-2xl">
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <DialogHeader>
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-black">Reset Password</DialogTitle>
              <DialogDescription>
                Enter your workspace email and we'll send you a 6-digit verification code.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Email Address</Label>
                <Input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="h-11 bg-white/5"
                />
              </div>
            </div>
            <DialogFooter>
              <Button disabled={loading} className="w-full h-12 bg-brand-gradient hover:opacity-90 font-bold">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Code"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <DialogHeader>
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-black">Check your Email</DialogTitle>
              <DialogDescription>
                We sent a 6-digit code to <span className="text-white font-bold">{email}</span>.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-between gap-2">
              {otp.map((digit, idx) => (
                <Input
                  key={idx}
                  ref={(el) => { otpRefs.current[idx] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  className="w-full h-14 text-center text-xl font-bold bg-white/5 border-white/10"
                />
              ))}
            </div>
            <div className="text-center">
              <button type="button" className="text-xs font-bold text-primary hover:underline">Resend code in 0:59</button>
            </div>
            <DialogFooter>
              <Button 
                disabled={otp.join('').length < 6 || loading} 
                className="w-full h-12 bg-brand-gradient font-bold"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Code"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">New Password</DialogTitle>
              <DialogDescription>Create a secure password you haven't used before.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">New Password</Label>
                <Input type="password" placeholder="••••••••" required className="h-11 bg-white/5" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Confirm Password</Label>
                <Input type="password" placeholder="••••••••" required className="h-11 bg-white/5" />
              </div>
            </div>
            <DialogFooter>
              <Button disabled={loading} className="w-full h-12 bg-brand-gradient font-bold">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Set New Password"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === 'success' && (
          <div className="space-y-8 py-4 text-center">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black">Password Reset!</h3>
              <p className="text-muted-foreground">Your account security has been updated. You can now sign in with your new password.</p>
            </div>
            <Button onClick={resetAll} className="w-full h-12 bg-brand-gradient font-bold gap-2">
              Sign In Now <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
