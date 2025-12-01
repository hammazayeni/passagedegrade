import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, Tv } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const from = (location.state as any)?.from as string | undefined;
  const initialMode = useMemo(() => (from && from.startsWith("/projection") ? "projection" : "dashboard"), [from]);
  const [mode, setMode] = useState<"projection" | "dashboard">(initialMode as any);

  useEffect(() => {
    setMode(initialMode as any);
  }, [initialMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validUser = mode === "projection" ? "parent" : "master";
    const validPass = mode === "projection" ? "diamondgym" : "aziz2004";
    if (username === validUser && password === validPass) {
      if (mode === "projection") {
        localStorage.setItem("projectionAuth", "true");
        localStorage.setItem("projectionUser", username);
        const target = from && from.startsWith("/projection") ? from : "/projection";
        navigate(target, { replace: true });
      } else {
        localStorage.setItem("dashboardAuth", "true");
        localStorage.setItem("dashboardUser", username);
        const target = from === "/dashboard" ? from : "/dashboard";
        navigate(target, { replace: true });
      }
    } else {
      setError("Invalid username or password");
    }
  };

  const BASE = import.meta.env.BASE_URL || "/";
  const LOGOS = [
    `${BASE}assets/logos/TAEKWONDO_SBEITLA_-removebg-preview.png`,
    `${BASE}assets/logos/kukkiwon.png`,
    `${BASE}assets/logos/Elite Sportive - 1.png`,
    `${BASE}assets/logos/img_4026_nobg_new.png`,
    `${BASE}assets/logos/WAADTI.png`,
    `${BASE}assets/logos/federation-tunisienne-de-taekwondo.png`,
    `${BASE}assets/logos/diamond-gym.png`,
  ];
  const carouselLogos = Array(10).fill(null).flatMap(() => LOGOS);

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40" style={{ backgroundImage: `url('${BASE}assets/bg-taekwondo.jpg')`, backgroundSize: "cover", backgroundPosition: "center", filter: "grayscale(100%) contrast(120%) brightness(60%)" }} />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-transparent to-black opacity-90" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black/60 to-black" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black tracking-tighter uppercase bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">Taekwondo Sbeitla</h1>
          <div className="h-1 w-24 mx-auto mt-3 bg-red-600 rounded-full" />
        </div>
        <Card className="w-full max-w-md bg-neutral-900/80 border-neutral-800 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-xl">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ToggleGroup type="single" value={mode} onValueChange={(v) => setMode(v as any)} className="grid grid-cols-2 gap-2 w-full">
                <ToggleGroupItem
                  value="dashboard"
                  size="lg"
                  variant="outline"
                  className="flex flex-col items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800/60 px-3 py-3 text-sm text-white transition-all data-[state=on]:border-red-600 data-[state=on]:bg-red-900/30 data-[state=on]:shadow-[0_0_20px_rgba(220,38,38,0.25)]"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-semibold">Dashboard</span>
                  <span className="text-[10px] text-white">Gestion et édition</span>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="projection"
                  size="lg"
                  variant="outline"
                  className="flex flex-col items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800/60 px-3 py-3 text-sm text-white transition-all data-[state=on]:border-red-600 data-[state=on]:bg-red-900/30 data-[state=on]:shadow-[0_0_20px_rgba(220,38,38,0.25)]"
                >
                  <Tv className="w-5 h-5" />
                  <span className="font-semibold">Projection</span>
                  <span className="text-[10px] text-white">Affichage en direct</span>
                </ToggleGroupItem>
              </ToggleGroup>
              <div className="text-xs text-neutral-400 text-center">
                {mode === "dashboard" ? "Connectez-vous pour gérer les candidats et les résultats." : "Connectez-vous pour afficher la projection en temps réel."}
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label className="block text-sm mb-1">Username</label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Password</label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                </div>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button type="submit" className="w-full">Sign in</Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/90 backdrop-blur-xl border-t border-white/10">
        <div className="w-full overflow-hidden py-3 relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
          <motion.div className="flex items-center gap-3 w-max" animate={{ x: [0, -800] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
            {carouselLogos.map((logo, index) => (
              <LogoItem key={index} src={logo} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function LogoItem({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);
  const [encodedTried, setEncodedTried] = useState(false);
  useEffect(() => {
    if (failed) {
      const t = setInterval(() => {
        setFailed(false);
        setReloadCount((c) => c + 1);
      }, 30000);
      return () => clearInterval(t);
    }
  }, [failed]);
  const cacheBustedSrc = useMemo(() => {
    const s = encodedTried ? src.replace(/ /g, '%20') : src;
    return `${s}?v=${reloadCount}`;
  }, [src, reloadCount, encodedTried]);
  const isDiamond = src.toLowerCase().includes("diamond");
  return (
    <div className="h-12 w-20 md:h-14 md:w-24 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100 flex items-center justify-center">
      {failed ? (
        src.toLowerCase().includes("waadti") ? (
          <div className="w-full h-full flex items-center justify-center bg-black text-white font-black text-[10px] md:text-xs tracking-widest">WAADTI©</div>
        ) : src.toLowerCase().includes("federation") ? (
          <div className="w-full h-full flex items-center justify-center bg-black text-white font-bold text-[9px] md:text-[10px] tracking-widest text-center px-1">Fédération Tunisienne de Taekwondo</div>
        ) : src.toLowerCase().includes("diamond") ? (
          <div className="w-full h-full flex items-center justify-center bg-black text-white font-black text-[10px] md:text-xs tracking-widest">Diamond Gym</div>
        ) : null
      ) : (
        <img 
          src={cacheBustedSrc} 
          alt="Partner Logo" 
          className={`object-contain ${isDiamond ? 'max-h-[70%] max-w-[70%]' : 'max-h-full max-w-full'}`} 
          onError={() => {
            if (!encodedTried && src.includes(' ')) {
              setEncodedTried(true);
              setReloadCount((c) => c + 1);
            } else {
              setFailed(true);
            }
          }}
        />
      )}
    </div>
  );
}
