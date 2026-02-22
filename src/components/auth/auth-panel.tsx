
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Chrome, Github, Monitor, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ForgotPasswordFlow } from './forgot-password-flow';
import { useAuth } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase';
import { useRouter } from 'next/navigation';

export function AuthPanel() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent, type: 'signin' | 'signup') => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      if (type === 'signup') {
        initiateEmailSignUp(auth, email, password);
      } else {
        initiateEmailSignIn(auth, email, password);
      }
      // Non-blocking, the user will be redirected via the auth state observer in layout
      // but for immediate feedback we can push to dashboard
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tighter">Welcome to SUFW</h1>
        <p className="text-muted-foreground text-sm font-medium">
          Start your journey with an intelligent cloud workspace.
        </p>
      </div>

      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 bg-white/5 border border-white/10 p-1 mb-8">
          <TabsTrigger value="signin" className="font-bold text-xs uppercase tracking-widest">Sign In</TabsTrigger>
          <TabsTrigger value="signup" className="font-bold text-xs uppercase tracking-widest">Create Account</TabsTrigger>
        </TabsList>

        <TabsContent value="signin" className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 gap-3">
            <Button variant="outline" className="h-11 font-bold gap-3 border-white/10 bg-white/5 hover:bg-white/10">
              <Chrome className="w-4 h-4 text-red-500" /> Continue with Google
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-11 font-bold gap-3 border-white/10 bg-white/5 hover:bg-white/10">
                <Monitor className="w-4 h-4 text-blue-500" /> Microsoft
              </Button>
              <Button variant="outline" className="h-11 font-bold gap-3 border-white/10 bg-white/5 hover:bg-white/10">
                <Github className="w-4 h-4" /> GitHub
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
              <span className="bg-background px-4">Or use email</span>
            </div>
          </div>

          <form onSubmit={(e) => handleAuth(e, 'signin')} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Email Address</Label>
              <Input name="email" type="email" placeholder="name@company.com" required className="h-11 bg-white/5 border-white/10 focus:ring-primary" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Password</Label>
                <button 
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required 
                  className="h-11 bg-white/5 border-white/10 pr-10 focus:ring-primary" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button disabled={loading} className="w-full h-12 bg-brand-gradient hover:opacity-90 font-bold text-sm shadow-xl shadow-primary/20">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In to Workspace"}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="signup" className="space-y-6 animate-in fade-in duration-300">
          <form onSubmit={(e) => handleAuth(e, 'signup')} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Work Email</Label>
              <Input name="email" type="email" placeholder="alex@sufw.io" required className="h-11 bg-white/5 border-white/10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest ml-1">Choose Password</Label>
              <div className="relative">
                <Input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="Min. 8 characters" 
                  required 
                  className="h-11 bg-white/5 border-white/10 pr-10" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                By creating an account, you agree to our <span className="text-primary font-bold">Terms</span> and <span className="text-primary font-bold">Privacy Policy</span>. We'll automatically set up your FREE workspace.
              </p>
            </div>
            <Button disabled={loading} className="w-full h-12 bg-brand-gradient hover:opacity-90 font-bold text-sm shadow-xl">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Free Workspace"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
              <span className="bg-background px-4">Or connect with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="h-11 bg-white/5 border-white/10"><Chrome className="w-4 h-4" /></Button>
            <Button variant="outline" className="h-11 bg-white/5 border-white/10"><Monitor className="w-4 h-4" /></Button>
            <Button variant="outline" className="h-11 bg-white/5 border-white/10"><Github className="w-4 h-4" /></Button>
          </div>
        </TabsContent>
      </Tabs>

      <ForgotPasswordFlow open={showForgotModal} onOpenChange={setShowForgotModal} />
    </div>
  );
}
