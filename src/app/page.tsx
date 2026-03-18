"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Copy, Gift, Medal, Ticket, Zap, Trophy, TrendingUp, CheckCircle2, Camera, ScanLine, X, Crown, Users } from "lucide-react";

type Reward = {
  id: string;
  title: string;
  pointsRequired: number;
  icon: React.ElementType;
  description: string;
  imageColor: string;
};

type Badge = {
  id: string;
  title: string;
  description: string;
  pointsThreshold: number;
  icon: React.ElementType;
};

const REWARDS: Reward[] = [
  { id: "shaker", title: "Free Shaker Bottle", pointsRequired: 100, icon: Zap, description: "Hydrate like a hero.", imageColor: "bg-[#F7F7F7]" },
  { id: "whey", title: "Free Tub of SuperYou Whey", pointsRequired: 500, icon: Trophy, description: "Fuel your super gains.", imageColor: "bg-brand-red/10" },
  { id: "hoodie", title: "Exclusive Gym Hoodie", pointsRequired: 1000, icon: Gift, description: "Look the part.", imageColor: "bg-[#F7F7F7]" },
  { id: "meet-greet", title: "The Ranveer Singh Experience", pointsRequired: 5000, icon: Ticket, description: "Meet & Greet with the legend.", imageColor: "bg-brand-red/10" },
];

const BADGES: Badge[] = [
  { id: "rookie", title: "Rookie", description: "Just starting out.", pointsThreshold: 0, icon: TrendingUp },
  { id: "hero", title: "Hero", description: "Making serious gains.", pointsThreshold: 500, icon: Zap },
  { id: "superhuman", title: "SuperHuman", description: "Unstoppable force.", pointsThreshold: 1000, icon: Trophy },
  { id: "legend", title: "Legend", description: "Top tier status.", pointsThreshold: 5000, icon: Medal },
];

const LEADERBOARD = [
  { rank: 1, name: "Arjun M.", points: 8450, bars: 84 },
  { rank: 2, name: "Priya S.", points: 6200, bars: 61 },
  { rank: 3, name: "Rahul K.", points: 5800, bars: 57 },
  { rank: 4, name: "Sneha D.", points: 4100, bars: 40 },
  { rank: 5, name: "Vikram R.", points: 3750, bars: 37 },
  { rank: 6, name: "Ananya P.", points: 2900, bars: 28 },
  { rank: 7, name: "Karan T.", points: 2100, bars: 20 },
  { rank: 8, name: "Meera J.", points: 1650, bars: 16 },
];

export default function Home() {
  const [points, setPoints] = useState(0);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [unlockedRewards, setUnlockedRewards] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Scanner State
  const [activeTab, setActiveTab] = useState<'code' | 'scan'>('code');
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    setIsClient(true);
    return () => stopCamera();
  }, []);

  const currentBadgeIndex = [...BADGES].reverse().findIndex(b => points >= b.pointsThreshold);
  const currentBadge = currentBadgeIndex !== -1 ? [...BADGES].reverse()[currentBadgeIndex] : BADGES[0];

  const nextBadgeIndex = BADGES.findIndex(b => b.pointsThreshold > points);
  const nextBadge = nextBadgeIndex !== -1 ? BADGES[nextBadgeIndex] : null;

  const progressPercentage = nextBadge
    ? ((points - currentBadge.pointsThreshold) / (nextBadge.pointsThreshold - currentBadge.pointsThreshold)) * 100
    : 100;

  const triggerConfetti = (isSuper = false) => {
    confetti({
      particleCount: isSuper ? 250 : 150,
      spread: isSuper ? 100 : 70,
      origin: { y: 0.6 },
      colors: ['#EF1400', '#000000', '#ffffff']
    });
  };

  const handleClaimPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    if (code.toUpperCase() === "SUPER100") {
      setPoints(prev => prev + 100);
      setSuccessMsg("Boom! 100 Points Added!");
      triggerConfetti();
      setCode("");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else if (code.toUpperCase() === "HERO500") {
      setPoints(prev => prev + 500);
      setSuccessMsg("Incredible! 500 Points Added!");
      triggerConfetti(true);
      setCode("");
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setError("Invalid or expired code.");
      setTimeout(() => setError(""), 3000);
    }
  };

  // Camera Scanner Handlers
  const startCamera = async () => {
    setError("");
    setSuccessMsg("");
    setIsScanning(true);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Camera access denied or unavailable.");
      setIsScanning(false);
      setTimeout(() => setError(""), 4000);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  // Simulate AI Scanner Detection
  useEffect(() => {
    if (isScanning && stream) {
      const detectTimer = setTimeout(() => {
        stopCamera();
        setPoints(prev => prev + 250);
        setSuccessMsg("AI DETECTED: SUPERYOU BAR! +250 PTS");
        triggerConfetti(true);
        setTimeout(() => setSuccessMsg(""), 4000);
      }, 3500); // 3.5 seconds to "detect"
      return () => clearTimeout(detectTimer);
    }
  }, [isScanning, stream]);

  // Clean up if the user changes tabs while scanning
  useEffect(() => {
    if (activeTab === 'code' && isScanning) {
      stopCamera();
    }
  }, [activeTab]);

  const handleRedeem = (reward: Reward) => {
    if (points >= reward.pointsRequired && !unlockedRewards.includes(reward.id)) {
      setPoints(prev => prev - reward.pointsRequired);
      setUnlockedRewards(prev => [...prev, reward.id]);
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#EF1400', '#ffffff']
      });
    }
  };

  if (!isClient) {
    return <div className="min-h-screen bg-brand-background" />;
  }

  return (
    <div className="min-h-screen pb-20 bg-[#F7F7F7] text-brand-black selection:bg-brand-red selection:text-white">
      <header className="sticky top-0 z-50 bg-white border-b-2 border-brand-red px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          {/* Unfiltered original logo to match brand identity exactly */}
          <img src="/logo.svg" alt="SuperYou Logo" className="h-10 w-auto" />
        </div>
        <div className="bg-white px-5 py-2 rounded-full border border-gray-200 flex items-center gap-2 hard-shadow">
          <span className="text-brand-red font-bold text-lg font-archivo">{points}</span>
          <span className="text-sm font-bold text-black font-archivo uppercase">PTS</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-16 space-y-24">

        {/* Welcome Section */}
        <section className="relative">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between relative z-10">
            <div className="md:w-1/2">
              <h2 className="text-5xl md:text-7xl font-extrabold uppercase tracking-tight mb-4 text-brand-black font-archivo leading-none">
                WELCOME <br /><span className="text-brand-red">CHAMPION.</span>
              </h2>
              <p className="text-black text-lg font-medium mb-10 max-w-md">Your super journey continues. Stack those points and claim your legendary gear.</p>

              <div className="flex items-center gap-5 bg-white p-4 rounded-[19px] border border-brand-red hard-shadow max-w-sm">
                <div className="bg-[#F7F7F7] text-brand-red w-16 h-16 rounded-xl flex items-center justify-center border border-gray-200">
                  <currentBadge.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 uppercase tracking-widest font-bold font-roboto">Current Status</h3>
                  <p className="text-3xl font-extrabold text-brand-black font-archivo uppercase">{currentBadge.title}</p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 bg-white p-8 rounded-[19px] border border-brand-red hard-shadow">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider font-roboto">Next Tier</p>
                  <p className="font-extrabold text-3xl text-brand-black font-archivo uppercase">{nextBadge ? nextBadge.title : "MAX LEVEL!"}</p>
                </div>
                <div className="text-right">
                  <p className="text-brand-red font-extrabold text-3xl font-archivo">{points} <span className="text-lg text-black">PTS</span></p>
                  {nextBadge && <p className="text-sm text-gray-500 font-medium font-roboto">{nextBadge.pointsThreshold - points} to go</p>}
                </div>
              </div>

              <div className="h-6 bg-[#F7F7F7] rounded-full overflow-hidden border border-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-brand-red"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Claim Points / Scanner Section */}
        <section className="bg-white p-10 rounded-[19px] border border-brand-red hard-shadow flex flex-col md:flex-row gap-10 items-center">
          <div className="md:w-1/2 flex flex-col items-start w-full">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 flex items-center gap-3 w-fit text-brand-black font-archivo uppercase">
              CLAIM POINTS <Zap className="text-brand-red w-8 h-8" />
            </h2>
            <p className="text-black text-lg font-medium mb-8">
              Track your daily protein intake with SuperYou. Scan your bar or enter the code to log it and earn points towards exclusive rewards. <br /><br />Try <strong className="text-brand-red bg-red-50 px-2 py-1 rounded">SUPER100</strong>!
            </p>

            <div className="flex w-full md:w-auto bg-[#F7F7F7] p-1.5 rounded-md border-2 border-gray-200">
              <button
                onClick={() => setActiveTab('code')}
                className={`flex-1 md:flex-none px-6 py-2 rounded font-archivo uppercase font-bold text-lg transition-all ${activeTab === 'code' ? 'bg-white border-2 border-black hard-shadow-sm text-brand-black' : 'text-gray-500 hover:text-black border-2 border-transparent'}`}
              >
                Enter Code
              </button>
              <button
                onClick={() => setActiveTab('scan')}
                className={`flex-1 md:flex-none px-6 py-2 rounded font-archivo uppercase font-bold text-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'scan' ? 'bg-white border-2 border-black hard-shadow-sm text-brand-red' : 'text-gray-500 hover:text-brand-red border-2 border-transparent'}`}
              >
                <Camera className="w-5 h-5" /> AI Scan
              </button>
            </div>
          </div>
          <div className="md:w-1/2 w-full relative min-h-[220px]">
            {activeTab === 'code' ? (
              <form onSubmit={handleClaimPoints} className="space-y-6 relative h-full flex flex-col justify-center">
                <div className="relative">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <Copy className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="ENTER CODE"
                    className="w-full bg-[#F7F7F7] border-2 border-black rounded-[8px] py-5 pl-16 pr-6 text-brand-black placeholder:text-gray-400 focus:outline-none focus:border-brand-red transition-all font-archivo uppercase text-xl font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-brand-red text-white font-extrabold uppercase tracking-wide py-5 rounded-[4px] hover:bg-black transition-colors duration-300 font-archivo text-xl hard-shadow active:translate-y-1 active:translate-x-1 active:shadow-none"
                >
                  UNLOCK POWER
                </button>
              </form>
            ) : (
              // Scanner UI
              <div className="bg-[#F7F7F7] border-2 border-black rounded-[8px] p-6 flex flex-col items-center justify-center h-full min-h-[235px] relative overflow-hidden">
                {!isScanning && !stream && (
                  <div className="text-center z-10 w-full flex flex-col items-center">
                    <ScanLine className="w-16 h-16 text-gray-400 mb-4" />
                    <p className="font-roboto font-bold text-gray-500 mb-6 uppercase tracking-wider text-sm">Ready to detect products</p>
                    <button
                      onClick={startCamera}
                      className="w-full bg-brand-red text-white font-extrabold uppercase tracking-wide py-4 mx-4 rounded-[4px] hover:bg-black transition-colors duration-300 font-archivo text-xl hard-shadow active:translate-y-1 active:translate-x-1 active:shadow-none flex justify-center items-center gap-2 max-w-sm"
                    >
                      <Camera className="w-6 h-6" /> ACTIVATE SCANNER
                    </button>
                  </div>
                )}

                {(isScanning || stream) && (
                  <div className="absolute inset-0 bg-black z-0 flex items-center justify-center overflow-hidden rounded-[6px]">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />

                    {/* Scanning overlay animation */}
                    <div className="absolute inset-0 pointer-events-none z-10 p-6">
                      <div className="w-full h-full relative">
                        {/* Corner brackets */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-red"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-red"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-red"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-red"></div>

                        {/* Moving scan line */}
                        <motion.div
                          className="w-full h-1 bg-brand-red shadow-[0_0_15px_rgba(239,20,0,1)] absolute"
                          animate={{ top: ["5%", "95%", "5%"] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        />

                        {/* AI Analyzing text */}
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                          <span className="bg-brand-red text-white font-archivo text-lg px-3 py-1 rounded font-bold uppercase tracking-widest animate-pulse border border-red-400/50">
                            AI Analyzing...
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={stopCamera}
                      className="absolute top-3 right-3 bg-black/60 hover:bg-brand-red p-2 rounded-full text-white backdrop-blur-sm z-20 transition-colors border border-white/10"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white bg-black py-2 px-4 rounded-md text-sm text-center font-bold absolute -bottom-14 left-0 right-0 shadow-lg z-30"
                >
                  {error}
                </motion.p>
              )}
              {successMsg && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-white bg-[#00A144] py-3 px-4 outline outline-2 outline-black rounded-md text-sm md:text-base text-center font-extrabold flex items-center justify-center gap-2 absolute -bottom-16 left-0 right-0 hard-shadow z-30 tracking-wide font-archivo uppercase"
                >
                  <CheckCircle2 className="w-5 h-5" /> {successMsg}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Rewards Vault Section */}
        <section>
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 border-b-2 border-black pb-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black font-archivo uppercase">REWARDS VAULT</h2>
            <p className="text-brand-red font-bold uppercase text-lg font-archivo mt-2 md:mt-0">SPEND YOUR POINTS</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {REWARDS.map((reward) => {
              const affordable = points >= reward.pointsRequired;
              const unlocked = unlockedRewards.includes(reward.id);

              return (
                <div key={reward.id} className={`flex flex-col bg-white rounded-[19px] border border-brand-red overflow-hidden transition-all duration-300 ${affordable && !unlocked ? "hard-shadow -translate-y-1" : "shadow-sm"}`}>
                  <div className={`h-40 ${reward.imageColor} flex items-center justify-center relative overflow-hidden border-b border-gray-100 p-6`}>
                    <reward.icon className="w-16 h-16 text-black relative z-10" />
                    {unlocked && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex items-center justify-center">
                        <span className="bg-black text-white px-6 py-2 rounded-md text-sm font-bold uppercase tracking-wider font-archivo">CLAIMED</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-extrabold text-2xl leading-tight text-brand-black font-archivo uppercase mb-2">{reward.title}</h3>
                    <p className="text-gray-600 text-sm mb-8 font-medium font-roboto flex-grow">{reward.description}</p>

                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!affordable || unlocked}
                      className={`w-full py-4 rounded-[4px] font-extrabold uppercase text-lg font-archivo transition-all ${unlocked ? "bg-[#F7F7F7] text-gray-400 cursor-not-allowed border-2 border-gray-200" :
                        affordable ? "bg-brand-red text-white hover:bg-black hard-shadow active:translate-y-1 active:translate-x-1 active:shadow-none" :
                          "bg-[#F7F7F7] text-gray-400 border-2 border-gray-200 cursor-not-allowed"
                        }`}
                    >
                      {reward.pointsRequired} PTS
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Leaderboard Section */}
        <section>
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 border-b-2 border-black pb-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black font-archivo uppercase flex items-center gap-3">
              LEADERBOARD <Users className="text-brand-red w-8 h-8" />
            </h2>
            <p className="text-brand-red font-bold uppercase text-lg font-archivo mt-2 md:mt-0">TOP PROTEIN TRACKERS</p>
          </div>

          <div className="bg-white rounded-[19px] border border-brand-red hard-shadow overflow-hidden">
            {LEADERBOARD.map((entry, i) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-4 px-6 md:px-8 py-5 ${i !== LEADERBOARD.length - 1 ? "border-b border-gray-100" : ""} ${entry.rank <= 3 ? "bg-[#FFFAF9]" : ""}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold font-archivo text-lg shrink-0 ${
                  entry.rank === 1 ? "bg-brand-red text-white" :
                  entry.rank === 2 ? "bg-brand-black text-white" :
                  entry.rank === 3 ? "bg-gray-400 text-white" :
                  "bg-[#F7F7F7] text-gray-500 border border-gray-200"
                }`}>
                  {entry.rank === 1 ? <Crown className="w-5 h-5" /> : entry.rank}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-brand-black font-archivo uppercase text-lg truncate">{entry.name}</p>
                  <p className="text-sm text-gray-500 font-roboto font-medium">{entry.bars} bars tracked</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-extrabold text-brand-red font-archivo text-xl">{entry.points.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 font-roboto font-bold uppercase">PTS</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gamification Badges Section */}
        <section>
          <div className="mb-10 border-b-2 border-black pb-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black font-archivo uppercase">ACHIEVEMENTS</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 hover:cursor-default">
            {BADGES.map((badge) => {
              const unlocked = points >= badge.pointsThreshold;
              return (
                <div
                  key={badge.id}
                  className={`p-8 rounded-[19px] border bg-white flex flex-col items-center text-center transition-all ${unlocked ? "border-brand-red hard-shadow" : "border-gray-200 opacity-70 grayscale"}`}
                >
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 ${unlocked ? "bg-brand-red text-white border-black" : "bg-[#F7F7F7] text-gray-400 border-gray-200"}`}>
                    <badge.icon className="w-10 h-10" />
                  </div>
                  <h3 className="font-extrabold text-2xl mb-2 text-brand-black font-archivo uppercase">{badge.title}</h3>
                  <p className="text-sm text-gray-600 font-medium font-roboto">{badge.description}</p>
                  <div className="mt-4 pt-4 border-t border-gray-100 w-full">
                    <p className={`text-lg font-extrabold uppercase font-archivo ${unlocked ? 'text-brand-red' : 'text-gray-400'}`}>{badge.pointsThreshold} PTS</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      <footer className="mt-24 border-t-4 border-black py-12 text-center text-white bg-black">
        <img src="/logo.svg" alt="SuperYou Logo" className="h-8 w-auto mx-auto mb-6" style={{ filter: 'brightness(0) invert(1)' }} />
        <p className="uppercase font-archivo text-lg tracking-widest text-gray-400">© {new Date().getFullYear()} SUPERYOU REWARDS. ALL SUPERPOWERS RESERVED.</p>
      </footer>
    </div>
  );
}
