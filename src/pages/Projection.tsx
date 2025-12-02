import { useStudents } from "@/hooks/useStudents";
import { BeltBadge } from "@/components/BeltBadge";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { CheckCircle, XCircle } from "lucide-react";

// waadti logo removed from carousel

export default function Projection() {
  const { students } = useStudents();
  const [controlledId, setControlledId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (db) {
      const unsub = onSnapshot(doc(db, "projection", "current"), (snap) => {
        const data = snap.data() as any;
        setControlledId(data?.currentId || null);
      });
      return () => unsub();
    } else {
      const read = () => {
        try {
          const raw = localStorage.getItem("projection-current-id");
          if (!raw) { setControlledId(null); return; }
          const obj = JSON.parse(raw);
          setControlledId(obj?.currentId || null);
        } catch {
          setControlledId(null);
        }
      };
      read();
      window.addEventListener("storage", read);
      return () => window.removeEventListener("storage", read);
    }
  }, []);
  
  const currentStudent = (controlledId ? students.find(s => s.id === controlledId) : undefined) ||
    students.find(s => s.status === "PENDING") || students[students.length - 1];

  const currentIndex = currentStudent ? students.findIndex((s) => s.id === currentStudent.id) : -1;
  const previousStudent = currentIndex > 0 ? students[currentIndex - 1] : undefined;
  const nextStudent = currentIndex >= 0 && currentIndex < students.length - 1 ? students[currentIndex + 1] : undefined;

  const lastAdvancedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!currentStudent) return;
    if (currentStudent.status !== "PENDING" && nextStudent && lastAdvancedRef.current !== currentStudent.id) {
      lastAdvancedRef.current = currentStudent.id;
      setProjectionCurrent(nextStudent.id);
    }
  }, [currentStudent?.id, currentStudent?.status, nextStudent?.id]);

  const setProjectionCurrent = (id: string) => {
    const payload = { currentId: id, ts: Date.now() };
    if (db) {
      setDoc(doc(db, "projection", "current"), payload).catch(() => {});
    } else {
      localStorage.setItem("projection-current-id", JSON.stringify(payload));
      window.dispatchEvent(new Event("storage"));
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

  const baseLogos = Array(6).fill(0).flatMap(() => LOGOS);
  const carouselLogosLoop = [...baseLogos, ...baseLogos];
  const motionDistance = -Math.max(1000, Math.floor((carouselLogosLoop.length * 120) / 2));
  const motionDuration = Math.max(25, carouselLogosLoop.length * 4);

  if (!currentStudent && students.length === 0) {
    return (
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold tracking-widest uppercase animate-pulse">En attente des candidats...</h1>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white font-sans selection:bg-red-500 selection:text-white flex flex-col">
      {/* Background with Gradient and Texture */}
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `url('${BASE}assets/bg-taekwondo.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "grayscale(100%) contrast(120%) brightness(60%)"
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-transparent to-black opacity-90" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-black/60 to-black" />

      {/* Main Content Area - Adjusted padding to not overlap with footer */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 pb-40 md:pb-48">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-center mb-8 md:mb-12"
        >
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent drop-shadow-2xl">
            Taekwondo Sbeitla
          </h1>
          <div className="h-1 w-24 md:w-32 mx-auto mt-4 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.8)]" />
          <p className="mt-4 text-lg md:text-xl text-gray-400 tracking-[0.3em] uppercase font-light">
            EXAMEN DE PASSAGE DE GRADE OFFICIEL
          </p>
        </motion.div>

        {/* Student Card */}
        <AnimatePresence mode="wait">
          {currentStudent ? (
            <motion.div
              key={currentStudent.id}
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="flex flex-col md:flex-row items-center gap-8 md:gap-24 max-w-7xl w-full px-4"
            >
              {/* Image Section */}
              <div className="relative group flex-shrink-0">
                <div className="absolute -inset-4 bg-gradient-to-r from-red-600 to-red-900 rounded-full opacity-30 blur-2xl group-hover:opacity-50 transition duration-1000 animate-pulse" />
                <div className="relative w-48 h-48 md:w-80 md:h-80 rounded-full border-4 md:border-8 border-neutral-800 shadow-2xl overflow-hidden bg-neutral-900 ring-4 ring-white/10">
                  <img 
                    src={currentStudent.photoUrl} 
                    alt={currentStudent.fullName} 
                    className={`w-full h-full object-cover ${currentStudent.status === 'APPROVED' ? '' : 'grayscale'} transition-all duration-700 transform group-hover:scale-105`}
                  />
                </div>
                
                {/* Status Overlay */}
                {currentStudent.status !== "PENDING" && (
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className={`absolute -bottom-4 -right-4 md:bottom-4 md:right-4 px-4 py-2 md:px-6 md:py-3 rounded-xl border-4 shadow-2xl flex items-center gap-2 md:gap-3 backdrop-blur-md
                      ${currentStudent.status === "APPROVED" 
                        ? "bg-green-900/90 border-green-500 text-green-100 shadow-green-900/50" 
                        : "bg-red-900/90 border-red-500 text-red-100 shadow-red-900/50"}`}
                  >
                    {currentStudent.status === "APPROVED" ? <CheckCircle size={24} className="md:w-8 md:h-8" /> : <XCircle size={24} className="md:w-8 md:h-8" />}
                    <span className="text-xl md:text-2xl font-black uppercase tracking-wider">
                      {currentStudent.status === "APPROVED" ? "ADMIS" : "REFUSÉ"}
                    </span>
                  </motion.div>
                )}
                {currentStudent.status === "PENDING" && (
                  <motion.div 
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute -bottom-4 -right-4 md:bottom-4 md:right-4 px-4 py-2 md:px-6 md:py-3 rounded-xl border-4 shadow-2xl flex items-center gap-2 md:gap-3 backdrop-blur-md bg-yellow-900/80 border-yellow-400 text-yellow-100 shadow-yellow-900/50"
                  >
                    <span className="text-xl md:text-2xl font-black uppercase tracking-wider animate-pulse">EN TEST</span>
                  </motion.div>
                )}
              </div>

              {/* Info Section */}
              <div className="flex-1 text-center md:text-left space-y-4 md:space-y-6 w-full">
                <div>
                  <h2 className="text-lg md:text-xl text-red-500 font-bold tracking-widest uppercase mb-2 flex items-center justify-center md:justify-start gap-3">
                    <span className="h-px w-8 bg-red-500"></span>
                    Candidat
                    <span className="h-px w-8 bg-red-500 md:hidden"></span>
                  </h2>
                  <h3 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-none drop-shadow-lg">
                    {currentStudent.fullName}
                  </h3>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-neutral-900/50 border border-neutral-800 p-4 md:p-5 rounded-2xl backdrop-blur-sm hover:bg-neutral-900/70 transition-colors">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">Grade Actuel</p>
                  <BeltBadge belt={currentStudent.currentBelt} size="lg" className="text-lg md:text-xl py-3 px-4 w-full shadow-lg" />
                </div>

                  <div className="relative bg-gradient-to-br from-neutral-900/80 to-red-900/20 border border-red-900/30 p-4 md:p-5 rounded-2xl backdrop-blur-sm overflow-hidden hover:border-red-500/50 transition-colors">
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="1" className="md:w-20 md:h-20">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                  <p className="text-red-400 text-xs uppercase tracking-wider mb-2 font-black">Test Pour Le Grade</p>
                  <BeltBadge belt={currentStudent.nextBelt} size="lg" className="text-xl md:text-2xl py-3 px-4 w-full scale-105 origin-left shadow-xl ring-2 ring-red-500/20" />
                </div>
              </div>

              <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-2xl text-center md:text-left">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">Ordre</p>
                  <p className="text-white text-sm md:text-base">Position: {currentIndex + 1} / {students.length}</p>
                  <p className="text-white text-sm md:text-base">Identifiant: #{currentStudent.order.toString().padStart(3, '0')}</p>
                </div>
                <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-2xl text-center md:text-left">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">Résultat</p>
                  <p className="text-white text-sm md:text-base">
                    {currentStudent.status === 'PENDING' ? 'En attente' : currentStudent.status === 'APPROVED' ? 'Admis' : 'Refusé'}
                  </p>
                </div>
                <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-2xl text-center md:text-left">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">Prochain</p>
                  <p className="text-white text-sm md:text-base">{nextStudent ? nextStudent.fullName : 'Aucun'}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center md:justify-start gap-3">
                <button
                  className="px-4 py-2 rounded-md border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => previousStudent && setProjectionCurrent(previousStudent.id)}
                  disabled={!previousStudent}
                >
                  Précédent
                </button>
                <button
                  className="px-4 py-2 rounded-md border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => nextStudent && setProjectionCurrent(nextStudent.id)}
                  disabled={!nextStudent}
                >
                  Suivant
                </button>
              </div>
            </div>
            </motion.div>
          ) : null}
          </AnimatePresence>
      </div>

      {/* Footer Section - Fixed to bottom to ensure visibility */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        
        {/* Infinite Logo Carousel */}
        <div className="w-full overflow-hidden py-2 md:py-3 relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
          
          <motion.div 
            className="flex items-center gap-2 md:gap-3 w-max will-change-transform"
            animate={{ x: [0, motionDistance] }}
            transition={{ 
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 0,
              duration: motionDuration, 
              ease: "linear" 
            }}
          >
            {carouselLogosLoop.map((logo, index) => (
              <LogoItem key={index} src={logo} />
            ))}
          </motion.div>
        </div>

        {/* Signature & Progress */}
        <div className="flex justify-between items-center px-4 md:px-8 py-2 border-t border-white/5 text-[10px] md:text-xs text-gray-500 font-mono bg-black">
          <div className="flex items-center gap-2">
            <span className="text-red-900/50">ID: {currentStudent?.order.toString().padStart(3, '0')}</span>
            <div className="flex gap-1">
               {students.map((s) => (
                 <div 
                  key={s.id} 
                  className={`h-1 rounded-full transition-all duration-500 ${s.id === currentStudent?.id ? "w-4 bg-red-800" : "w-1 bg-gray-900"}`} 
                 />
               ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              className="px-3 py-1 rounded-md border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition"
              onClick={() => {
                localStorage.removeItem("projectionAuth");
                navigate("/login", { replace: true });
              }}
            >
              Déconnexion
            </button>
            <div className="tracking-widest uppercase text-gray-400 font-bold">
              Créé par Maître <span className="text-red-600">Ali ZAYANI</span>
            </div>
          </div>
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
  const lower = src.toLowerCase();
  const isDiamond = lower.includes("diamond");
  const isFederation = lower.includes("federation");
  const isWaadti = lower.includes("waadti");
  const isSufetula = lower.includes("sufetula");
  const isLarge = isFederation || isWaadti || isSufetula;
  return (
    <div className={`${isLarge ? 'h-12 w-24 md:h-16 md:w-32' : 'h-10 w-20 md:h-12 md:w-24'} flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100 flex items-center justify-center`}
    >
      {failed ? (
        lower.includes("waadti") ? (
          <div className="w-full h-full flex items-center justify-center bg-black text-white font-black text-[11px] md:text-sm tracking-widest">WAADTI©</div>
        ) : lower.includes("federation") ? (
          <div className="w-full h-full flex items-center justify-center bg-black text-white font-bold text-[10px] md:text-sm tracking-widest text-center px-1">Fédération Tunisienne de Taekwondo</div>
        ) : lower.includes("diamond") ? (
          <div className="w-full h-full flex items-center justify-center bg-black text-white font-black text-[10px] md:text-xs tracking-widest">Diamond Gym</div>
        ) : null
      ) : (
        <img 
          src={cacheBustedSrc} 
          alt="Partner Logo" 
          className={`object-contain ${isDiamond ? 'max-h-[70%] max-w-[70%]' : 'max-h-full max-w-full'} ${isLarge ? 'scale-110' : ''}`} 
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
