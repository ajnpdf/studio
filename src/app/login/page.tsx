import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Cloud, Github, Chrome } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="p-2 bg-brand-gradient rounded-lg">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-gradient">Cloud Edit Pro</span>
          </Link>
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-muted-foreground mt-2">Sign in to your intelligent cloud workspace</p>
        </div>

        <Card className="border-2 shadow-2xl">
          <CardHeader className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="gap-2 h-11">
                <Chrome className="w-4 h-4" /> Google
              </Button>
              <Button variant="outline" className="gap-2 h-11">
                <Github className="w-4 h-4" /> Github
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with email</span></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email address</label>
              <Input type="email" placeholder="name@example.com" className="h-11" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Password</label>
                <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input type="password" placeholder="••••••••" className="h-11" />
            </div>
            <Button className="w-full h-11 bg-brand-gradient hover:opacity-90">Sign In</Button>
          </CardContent>
          <CardFooter className="justify-center border-t py-4 bg-muted/30 rounded-b-lg">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
