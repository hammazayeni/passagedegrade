import { useStudents } from "@/hooks/useStudents";
import { BeltBadge } from "@/components/BeltBadge";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { ImageFromStore } from "@/components/ImageFromStore";
import { LOGOS } from "@/lib/constants";
import { logout } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

export default function Projection() {
  const navigate = useNavigate();
  const { students, syncStatus, currentId } = useStudents();

  const ordered = students.slice().sort((a, b) => a.order - b.order);
  const selected = currentId ? students.find((s) => s.id === currentId) : undefined;
  const currentStudent = selected || ordered.find((s) => s.status === "PENDING") || ordered[ordered.length - 1];
  const nextStudent = currentStudent
    ? ordered.find((s) => s.status === "PENDING" && s.order > currentStudent.order)
    : undefined;
  const positionIndex = currentStudent ? ordered.findIndex((s) => s.id === currentStudent.id) : -1;
  const positionLabel = positionIndex >= 0 ? `${positionIndex + 1} / ${ordered.length}` : "--";
  const identValue = positionIndex >= 0 ? String(positionIndex + 1).padStart(3, '0') : "--";
  
  // Duplicate logos for infinite scroll effect
  const carouselLogos = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

  if (!currentStudent && students.length === 0) {
    return (
      <div className="h-screen w-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold tracking-widest uppercase animate-pulse">En attente des candidats...</h1>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-y-auto md:overflow-hidden bg-black text-white font-sans selection:bg-red-500 selection:text-white flex flex-col">
      {/* Background with Gradient and Texture */}
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
          {currentStudent && (
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
                  <ImageFromStore 
                    src={currentStudent.photoUrl} 
                    alt={currentStudent.fullName} 
                    className={`${currentStudent.status === "APPROVED" ? "" : "grayscale hover:grayscale-0"} w-full h-full object-cover transition-all duration-700 transform group-hover:scale-105`}
                  />
                </div>
                
                <motion.div 
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className={`absolute -bottom-4 -right-4 md:bottom-4 md:right-4 px-4 py-2 md:px-6 md:py-3 rounded-xl border-4 shadow-2xl flex items-center gap-2 md:gap-3 backdrop-blur-md
                    ${currentStudent.status === "APPROVED" 
                      ? "bg-green-900/90 border-green-500 text-green-100 shadow-green-900/50" 
                      : currentStudent.status === "REFUSED" 
                        ? "bg-red-900/90 border-red-500 text-red-100 shadow-red-900/50" 
                        : "bg-yellow-900/90 border-yellow-500 text-yellow-100 shadow-yellow-900/50"}`}
                >
                  {currentStudent.status === "APPROVED" ? (
                    <CheckCircle size={24} className="md:w-8 md:h-8" />
                  ) : currentStudent.status === "REFUSED" ? (
                    <XCircle size={24} className="md:w-8 md:h-8" />
                  ) : (
                    <Clock size={24} className="md:w-8 md:h-8" />
                  )}
                  <span className="text-xl md:text-2xl font-black uppercase tracking-wider">
                    {currentStudent.status === "APPROVED" ? "ADMIS" : currentStudent.status === "REFUSED" ? "REFUSÉ" : "EN TEST"}
                  </span>
                </motion.div>
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

                {/* Info Boxes placed under grade section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-3">
                  <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                    <p className="text-[11px] uppercase tracking-wider text-gray-400">Ordre</p>
                    <div className="mt-1 text-xs text-gray-300">
                      <p>Position: <span className="font-bold text-white">{positionLabel}</span></p>
                      <p>Identifiant: <span className="font-bold text-white">#{identValue}</span></p>
                    </div>
                  </div>
                  <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                    <p className="text-[11px] uppercase tracking-wider text-gray-400">Résultat</p>
                    <p className="mt-1 text-sm md:text-base font-black uppercase text-white">
                      {currentStudent ? (currentStudent.status === "APPROVED" ? "ADMIS" : currentStudent.status === "REFUSED" ? "REFUSÉ" : "EN ATTENTE") : "--"}
                    </p>
                  </div>
                  <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                    <p className="text-[11px] uppercase tracking-wider text-gray-400">Prochain</p>
                    <p className="mt-1 text-sm font-bold text-white">{nextStudent ? nextStudent.fullName : "Aucun"}</p>
                  </div>
                </div>

                <div className="block md:hidden mt-6">
                  <div className="w-full overflow-hidden py-3 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
                    <motion.div 
                      className="flex items-center gap-8 w-max"
                      animate={{ x: [0, -1000] }}
                      transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    >
                      {carouselLogos.map((logo, index) => {
                        const filename = logo.split('/').pop() || logo;
                        const isBig = filename === 'WAADTI.png' || filename === 'federation-tunisienne-de-taekwondo.png' || filename.toLowerCase().includes('sufetula');
                        const isSmall = filename === 'diamond-gym.png';
                        const box = isBig ? 'h-12 w-28' : isSmall ? 'h-8 w-16' : 'h-10 w-20';
                        return (
                          <div key={index} className={`${box} flex-shrink-0 grayscale opacity-80`}>
                            <img src={logo} alt="Partner Logo" className="h-full w-full object-contain" />
                          </div>
                        );
                      })}
                    </motion.div>
                  </div>

                  <div className="flex justify-between items-center px-4 py-2 border-t border-white/5 text-[10px] text-gray-500 font-mono bg-black/60 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-red-900/50">ID: {identValue}</span>
                      <div className="flex gap-1">
                        {students.map((s) => (
                          <div key={s.id} className={`h-1 rounded-full ${s.id === currentStudent?.id ? "w-4 bg-red-800" : "w-1 bg-gray-900"}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 uppercase text-gray-400 font-bold">
                      <span className={`inline-block px-2 py-0.5 rounded-full ${syncStatus === 'online' ? 'bg-green-900 text-green-100' : syncStatus === 'connecting' ? 'bg-yellow-900 text-yellow-100' : 'bg-red-900 text-red-100'}`}>Cloud Sync: {syncStatus}</span>
                      <button
                        className="text-white/90 hover:text-white"
                        onClick={() => { logout(); navigate("/"); }}
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Section - Fixed to bottom to ensure visibility */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
        
        {/* Infinite Logo Carousel */}
        <div className="w-full overflow-hidden py-3 md:py-4 relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
          
          <motion.div 
            className="flex items-center gap-8 md:gap-10 w-max"
            animate={{ x: [0, -1000] }}
            transition={{ 
              repeat: Infinity, 
              duration: 25, 
              ease: "linear" 
            }}
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

        {/* Signature & Progress */}
        <div className="flex justify-between items-center px-4 md:px-8 py-2 border-t border-white/5 text-[10px] md:text-xs text-gray-500 font-mono bg-black">
          <div className="flex items-center gap-2">
            <span className="text-red-900/50">ID: {identValue}</span>
            <div className="flex gap-1">
               {students.map((s) => (
                 <div 
                  key={s.id} 
                  className={`h-1 rounded-full transition-all duration-500 ${s.id === currentStudent?.id ? "w-4 bg-red-800" : "w-1 bg-gray-900"}`} 
                 />
               ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4 tracking-widest uppercase text-gray-400 font-bold">
            <span>
              Créé par Maître <span className="text-red-600">Ali ZAYANI</span>
            </span>
            <span className={`inline-block text-[10px] md:text-xs px-2 py-0.5 rounded-full ${syncStatus === 'online' ? 'bg-green-900 text-green-100' : syncStatus === 'connecting' ? 'bg-yellow-900 text-yellow-100' : 'bg-red-900 text-red-100'}`}>Cloud Sync: {syncStatus}</span>
            <button
              className="text-white/90 hover:text-white text-[10px] md:text-xs"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
