
"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Shield, 
  CreditCard, 
  Bell, 
  Monitor, 
  Trash2, 
  Lock, 
  Key, 
  Smartphone,
  Save,
  ChevronRight,
  Globe,
  Camera
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export function SettingsContainer() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <header className="h-16 border-b border-white/5 bg-background/40 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 text-black" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-sm font-black tracking-tighter uppercase">Account Settings</h1>
            <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Personal Preferences</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-5xl mx-auto p-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col lg:flex-row gap-12">
            <aside className="w-full lg:w-64 shrink-0">
              <TabsList className="flex flex-col h-auto bg-transparent p-0 gap-1 items-start">
                {[
                  { id: 'profile', icon: User, label: 'MY PROFILE' },
                  { id: 'security', icon: Shield, label: 'SECURITY' },
                  { id: 'billing', icon: CreditCard, label: 'BILLING' },
                  { id: 'preferences', icon: Monitor, label: 'PREFERENCES' },
                  { id: 'notifications', icon: Bell, label: 'NOTIFICATIONS' },
                ].map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id} 
                    className="w-full justify-start px-4 py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:text-black text-muted-foreground font-black text-[10px] tracking-widest gap-3 transition-all"
                  >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </aside>

            <main className="flex-1 min-w-0">
              {/* PROFILE TAB */}
              <TabsContent value="profile" className="m-0 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <section className="space-y-6">
                  <div className="flex items-center gap-8 p-8 bg-white/5 rounded-[2rem] border border-white/5">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border-2 border-white/10">
                        <AvatarImage src="https://picsum.photos/seed/alex/200/200" />
                        <AvatarFallback>AD</AvatarFallback>
                      </Avatar>
                      <button className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black uppercase tracking-tighter">Alex Doe</h3>
                      <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Member since Jan 2025</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-8 border-white/10 text-[9px] font-black uppercase">Change Photo</Button>
                        <Button size="sm" variant="ghost" className="h-8 text-red-400 hover:text-red-500 text-[9px] font-black uppercase">Remove</Button>
                      </div>
                    </div>
                  </div>

                  <Card className="bg-card/40 border-white/5 overflow-hidden rounded-[2rem]">
                    <CardContent className="p-8 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                          <Input defaultValue="Alex Doe" className="h-12 bg-white/5 border-white/10 font-bold" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</Label>
                          <Input defaultValue="alex@ajn.io" disabled className="h-12 bg-white/5 border-white/10 font-bold opacity-50" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Job Role</Label>
                          <Input defaultValue="Creative Director" className="h-12 bg-white/5 border-white/10 font-bold" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</Label>
                          <Input defaultValue="London, UK" className="h-12 bg-white/5 border-white/10 font-bold" />
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/5 flex justify-end">
                        <Button className="bg-white text-black hover:bg-white/90 font-black text-xs px-10 h-12 rounded-xl gap-2">
                          <Save className="w-4 h-4" /> SAVE CHANGES
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </TabsContent>

              {/* SECURITY TAB */}
              <TabsContent value="security" className="m-0 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-white" />
                    <h2 className="text-xl font-black tracking-tight uppercase">Authentication</h2>
                  </div>
                  <Card className="bg-card/40 border-white/5 rounded-[2rem]">
                    <CardContent className="p-0">
                      <div className="divide-y divide-white/5">
                        <div className="p-8 flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-bold text-sm">Two-Factor Authentication</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Add an extra layer of security to your workspace.</p>
                          </div>
                          <Button variant="outline" className="border-white/10 font-black text-[10px] uppercase gap-2">
                            <Smartphone className="w-3.5 h-3.5" /> CONFIGURE
                          </Button>
                        </div>
                        <div className="p-8 flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-bold text-sm">Password Management</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Last changed 42 days ago.</p>
                          </div>
                          <Button variant="outline" className="border-white/10 font-black text-[10px] uppercase gap-2">
                            <Key className="w-3.5 h-3.5" /> UPDATE PASSWORD
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-white" />
                    <h2 className="text-xl font-black tracking-tight uppercase">Active Sessions</h2>
                  </div>
                  <Card className="bg-card/40 border-white/5 rounded-[2rem] overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white/10 rounded-lg"><Monitor className="w-5 h-5" /></div>
                          <div>
                            <p className="text-xs font-bold uppercase">MacOS • Chrome Desktop</p>
                            <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">CURRENT SESSION • LONDON, UK</p>
                          </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <div className="p-6 flex items-center justify-between opacity-60">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white/10 rounded-lg"><Smartphone className="w-5 h-5" /></div>
                          <div>
                            <p className="text-xs font-bold uppercase">iPhone 15 Pro • Safari Mobile</p>
                            <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">2 HOURS AGO • PARIS, FR</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase text-red-400">TERMINATE</Button>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </TabsContent>

              {/* PREFERENCES TAB */}
              <TabsContent value="preferences" className="m-0 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-white" />
                    <h2 className="text-xl font-black tracking-tight uppercase">System Preferences</h2>
                  </div>
                  <Card className="bg-card/40 border-white/5 rounded-[2rem]">
                    <CardContent className="p-8 space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-bold text-sm">Automatic Workspace Save</p>
                          <p className="text-[10px] text-muted-foreground">Always save processed files to my workspace library.</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-bold text-sm">Real-time Job Notifications</p>
                          <p className="text-[10px] text-muted-foreground">Show desktop notifications when a background job completes.</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-bold text-sm">Privacy Mode</p>
                          <p className="text-[10px] text-muted-foreground">Mask filenames in the UI when others are viewing my screen.</p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </TabsContent>

              {/* BILLING TAB */}
              <TabsContent value="billing" className="m-0 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-white" />
                      <h2 className="text-xl font-black tracking-tight uppercase">Subscription</h2>
                    </div>
                    <Badge className="bg-white/10 text-white border-none font-black text-[10px] uppercase px-3 h-6">FREE TIER</Badge>
                  </div>
                  <Card className="bg-white text-black border-none rounded-[2rem] overflow-hidden">
                    <CardContent className="p-8 flex items-center justify-between gap-8">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black tracking-tighter uppercase">Upgrade to Pro</h3>
                        <p className="text-sm font-medium opacity-70">Unlock unlimited conversions, 50GB storage, and parallel processing.</p>
                      </div>
                      <Button className="bg-black text-white hover:bg-black/90 font-black text-xs h-12 px-8 rounded-xl shadow-2xl">
                        VIEW PLANS
                      </Button>
                    </CardContent>
                  </Card>
                </section>
              </TabsContent>
            </main>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
