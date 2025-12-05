import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, type AuthPage } from '@/lib/auth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { LOGOS } from '@/lib/constants';

export default function Login() {
  const navigate = useNavigate();
  const [page, setPage] = useState<AuthPage>('dashboard');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const ok = login(page, username.trim(), password.trim());
    if (!ok) {
      setError('Identifiants invalides');
      return;
    }
    setError('');
    navigate(page === 'dashboard' ? '/dashboard' : '/projection');
  };

  const carouselLogos = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans selection:bg-red-500 selection:text-white flex flex-col">
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}assets/bg-taekwondo.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(100%) contrast(120%) brightness(60%)"
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-transparent to-black opacity-90" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black/60 to-black" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 pb-40 md:pb-48">
        <div className="w-full text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent drop-shadow-2xl">Taekwondo Sbeitla</h1>
          <div className="h-1 w-24 md:w-32 mx-auto mt-4 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.8)]" />
          <p className="mt-4 text-lg md:text-xl text-gray-400 tracking-[0.3em] uppercase font-light">Connexion</p>
        </div>

        <Card className="bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Choisir la page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={page} onValueChange={(v) => setPage(v as AuthPage)}>
              <TabsList className="w-full bg-black/30 backdrop-blur-sm text-gray-300 border border-white/10">
                <TabsTrigger value="dashboard" className="flex-1 data-[state=active]:text-white data-[state=active]:bg-black/40 border-b-2 border-transparent data-[state=active]:border-white pb-1">Dashboard</TabsTrigger>
                <TabsTrigger value="projection" className="flex-1 data-[state=active]:text-white data-[state=active]:bg-black/40 border-b-2 border-transparent data-[state=active]:border-white pb-1">Projection</TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard" />
              <TabsContent value="projection" />
            </Tabs>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Nom d'utilisateur</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Entrez le nom" className="bg-transparent border-white/20 text-white placeholder:text-neutral-400 focus-visible:ring-red-600" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Mot de passe</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Entrez le mot de passe" className="bg-transparent border-white/20 text-white placeholder:text-neutral-400 focus-visible:ring-red-600" />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button className="w-full bg-red-600 hover:bg-red-700" onClick={handleLogin}>Se connecter</Button>
          </CardContent>
        </Card>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        <div className="w-full overflow-hidden py-3 md:py-4 relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
          <motion.div 
            className="flex items-center gap-8 md:gap-10 w-max"
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
          >
            {carouselLogos.map((logo, index) => {
              const filename = logo.split('/').pop() || logo;
              const isBig = filename === 'WAADTI.png' || filename === 'federation-tunisienne-de-taekwondo.png' || filename.toLowerCase().includes('sufetula');
              const isSmall = filename === 'diamond-gym.png';
              const box = isBig
                ? 'h-14 w-32 md:h-16 md:w-40'
                : isSmall
                  ? 'h-8 w-16 md:h-10 md:w-20'
                  : 'h-10 w-20 md:h-12 md:w-24';
              return (
                <div key={index} className={`${box} flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100`}>
                  <img src={logo} alt="Partner Logo" className="h-full w-full object-contain" />
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
