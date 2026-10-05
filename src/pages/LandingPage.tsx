import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThreeElectronicsHero } from '../components/landing/ThreeElectronicsHero.tsx';
import { MatchBadge } from '../components/common/MatchBadge.tsx';
import { api } from '../services/api.ts';
import { useAuthStore } from '../store/useAuthStore.ts';
import {
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Zap,
  Hammer,
  HelpCircle,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, demoLogin } = useAuthStore();

  // Interactive Live Sandbox state for guest visitors
  const [sandboxComponents, setSandboxComponents] = useState<string[]>([
    'comp_esp32',
    'comp_hcsr04',
    'comp_dc_motor',
    'comp_battery_18650',
  ]);
  const [sandboxResults, setSandboxResults] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const availableSandboxOptions = [
    { id: 'comp_esp32', label: 'ESP32 Wi-Fi & BLE MCU' },
    { id: 'comp_hcsr04', label: 'HC-SR04 Ultrasonic Sensor' },
    { id: 'comp_dc_motor', label: 'Dual TT DC Motors (2x)' },
    { id: 'comp_battery_18650', label: '18650 Li-Ion Cell' },
    { id: 'comp_servo_sg90', label: 'SG90 Micro Servo' },
    { id: 'comp_oled_096', label: '0.96" OLED I2C Screen' },
    { id: 'comp_dht11', label: 'DHT11 Temp & Humidity' },
    { id: 'comp_relay_5v', label: '5V Relay Module' },
  ];

  // Run live matching when sandbox components change
  useEffect(() => {
    let isMounted = true;
    const runAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        const payload = sandboxComponents.map((id) => ({
          componentId: id,
          quantity: id === 'comp_dc_motor' ? 2 : 1,
        }));
        const res = await api.analyzeAdHoc(payload);
        if (isMounted && res.success) {
          setSandboxResults(res.data.recommendations.slice(0, 3));
        }
      } catch (err) {
        // Fallback
      } finally {
        if (isMounted) setIsAnalyzing(false);
      }
    };

    runAnalysis();
    return () => {
      isMounted = false;
    };
  }, [sandboxComponents]);

  const toggleSandboxComponent = (id: string) => {
    if (sandboxComponents.includes(id)) {
      setSandboxComponents(sandboxComponents.filter((c) => c !== id));
    } else {
      setSandboxComponents([...sandboxComponents, id]);
    }
  };

  const handleLaunchMonishDemo = async () => {
    await demoLogin('monish');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex flex-col">
      {/* 1. Hero Section with Three.js 3D Canvas */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-slate-800/80">
        {/* Three.js 3D Interactive Floating Components Canvas */}
        <ThreeElectronicsHero />

        {/* Ambient Dark Gradient Vignette for Contrast */}
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#0B1220]/60 to-[#0B1220] pointer-events-none z-10" />

        {/* Hero Content Container */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-7">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-teal-400 bg-teal-950/60 border border-teal-800/60 px-3 py-1 rounded-md backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>TechTrove 3.0 · Problem Statement 3</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight font-sans text-balance">
            Turn unused electronics into <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-200">
              something you can build.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-sans text-balance">
            List the electronic components you already have. SecondLife matches your inventory against real-world engineering blueprints, calculates build feasibility, identifies missing parts, and eliminates e-waste.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleLaunchMonishDemo}
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-teal-400 text-[#0B1220] font-semibold hover:bg-teal-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 text-sm"
            >
              <span>Explore Monish's Inventory Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/projects"
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white transition-colors text-sm font-medium"
            >
              Browse 10+ Blueprints
            </Link>
          </div>

          {/* Metric Highlights */}
          <div className="pt-6 grid grid-cols-3 max-w-lg mx-auto border-t border-slate-800/80 text-center gap-4 text-xs font-mono">
            <div>
              <div className="text-lg font-bold text-white tabular-nums">100%</div>
              <div className="text-slate-400">Rule-Based Match</div>
            </div>
            <div>
              <div className="text-lg font-bold text-teal-400 tabular-nums">22+</div>
              <div className="text-slate-400">Standard Parts</div>
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-400 tabular-nums">0g</div>
              <div className="text-slate-400">E-Waste Landfill</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The Core Problem Statement & Mission */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-teal-400">
              The Electronic Waste Dilemma
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Why buy new parts when your drawer is full of potential?
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed text-balance">
              Makers and student engineers purchase duplicate microcontrollers, sensors, and actuators for single projects, only to shelve them afterward.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-3">
              <div className="w-8 h-8 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-semibold text-white">The Orphan Hardware Trap</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Over 53 million metric tons of e-waste is generated annually. Millions of pristine ESP32s, stepper motors, and sensors get discarded simply because makers don't know what to build with them.
              </p>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-3">
              <div className="w-8 h-8 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-semibold text-white">Component-to-Project Friction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Existing websites show tutorials that demand specific shopping lists. SecondLife reverses this paradigm: you declare what you already own, and the platform discovers matching projects.
              </p>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-lg space-y-3">
              <div className="w-8 h-8 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-semibold text-white">Measurable Ecological Value</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every reused lithium cell or salvaged microcontroller prevents raw copper, silicon, and toxic heavy metals from leaching into groundwater while mitigating manufacturing CO₂ emissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Matching Engine Sandbox */}
      <section className="py-20 border-b border-slate-800/80 bg-[#0B1220]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-teal-400">
              Live Interactive Sandbox
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Test the Rule-Based Matching Engine
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed text-balance">
              Toggle components below to see how our deterministic algorithm compares inventory against project bills of materials in real time.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Component Picker (Interactive) */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-semibold text-white">Simulate Your Hardware Bin</span>
                <span className="text-[11px] font-mono text-teal-400">
                  {sandboxComponents.length} selected
                </span>
              </div>

              <div className="space-y-2">
                {availableSandboxOptions.map((opt) => {
                  const isSelected = sandboxComponents.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleSandboxComponent(opt.id)}
                      className={`w-full p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-teal-500/10 border-teal-500/40 text-teal-200'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-teal-400 text-slate-900 font-bold' : 'border border-slate-700'
                          }`}
                        >
                          {isSelected && '✓'}
                        </span>
                        <span className="font-medium">{opt.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {isSelected ? 'IN INVENTORY' : '+ ADD'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span>Runs quantity-aware deterministic feasibility analysis</span>
              </div>
            </div>

            {/* Matching Engine Output */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
                  Calculated Project Recommendations
                </h3>
                {isAnalyzing && (
                  <span className="text-[11px] font-mono text-teal-400 animate-pulse">
                    Computing feasibility...
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {sandboxResults.map((result) => {
                  const isReady = result.status === 'READY_TO_BUILD';
                  return (
                    <div
                      key={result.project.id}
                      className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h4 className="text-sm font-semibold text-white">
                            {result.project.name}
                          </h4>
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {result.project.description}
                          </div>
                        </div>
                        <MatchBadge
                          status={result.status}
                          percentage={result.compatibilityPercentage}
                        />
                      </div>

                      {/* Missing or Available breakdown */}
                      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          {isReady ? (
                            <span className="text-emerald-400 flex items-center gap-1 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>100% Ready to Build Now</span>
                            </span>
                          ) : (
                            <span className="text-amber-400/90 flex items-center gap-1 font-medium">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>
                                Missing {result.missingComponents.length} component(s):{' '}
                                <span className="text-slate-300">
                                  {result.missingComponents
                                    .map((m: any) => `${m.componentName} (${m.missingQuantity}x)`)
                                    .join(', ')}
                                </span>
                              </span>
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/projects/${result.project.id}`}
                          className="text-teal-400 hover:text-teal-300 font-medium text-xs flex items-center gap-1"
                        >
                          <span>View Blueprint</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-900/30 border border-slate-800/60 rounded-lg text-center">
                <span className="text-xs text-slate-400">
                  Ready to test with your actual hardware?{' '}
                </span>
                <button
                  onClick={handleLaunchMonishDemo}
                  className="text-xs text-teal-400 hover:underline font-semibold"
                >
                  Load Monish's Benchmark Inventory →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works: The 4-Step Engineering Workflow */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-teal-400">
              System Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              From Maker Drawer to Functional Device
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
              <span className="text-xs font-mono text-teal-400">01. Inventory</span>
              <h4 className="text-sm font-semibold text-white mt-1 mb-2">Declare Hardware</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add microcontrollers, sensors, motors, and battery cells with condition ratings and quantities.
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
              <span className="text-xs font-mono text-teal-400">02. Normalize</span>
              <h4 className="text-sm font-semibold text-white mt-1 mb-2">Catalog Normalization</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Component parameters and electrical compatibility are unified against master pinout specs.
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
              <span className="text-xs font-mono text-teal-400">03. Matching</span>
              <h4 className="text-sm font-semibold text-white mt-1 mb-2">BOM Comparison</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Matching engine compares required quantities vs. available inventory and flags missing parts.
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
              <span className="text-xs font-mono text-teal-400">04. Build</span>
              <h4 className="text-sm font-semibold text-white mt-1 mb-2">Build & Track Waste</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Access step-by-step schematics, complete the project, and log verified e-waste diverted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Frequently Asked Questions */}
      <section className="py-20 border-b border-slate-800/80 bg-[#0B1220]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <div className="text-xs font-mono uppercase tracking-wider text-teal-400">
              Technical FAQ
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2">
              <h4 className="font-semibold text-white text-sm">
                Is the matching engine powered by AI or deterministic rules?
              </h4>
              <p className="text-slate-400 leading-relaxed">
                In this production prototype, the matching engine uses an exact, quantity-aware rule-based algorithm comparing inventory items and required bill-of-materials. This guarantees 100% deterministic accuracy without hallucinations. The architecture is prepared with clean service boundaries for future Gemini computer-vision component recognition.
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2">
              <h4 className="font-semibold text-white text-sm">
                How is the e-waste and CO₂ reduction calculated?
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Impact values are prototype estimates based on component and project catalog weights and standard embodied carbon indices for silicon, lithium, and copper manufacturing. They are transparently displayed as estimates and encourage sustainable reuse.
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2">
              <h4 className="font-semibold text-white text-sm">
                How does the demo scenario work for judging?
              </h4>
              <p className="text-slate-400 leading-relaxed">
                The demo user "Monish" comes pre-loaded with the exact PS3 benchmark items: ESP32 (1x), HC-SR04 (1x), DC Motors (2x), 18650 Battery (1x), Servo (1x), and DHT11 (1x). This immediately unlocks 100% match on the Obstacle Avoidance Rover and Smart Dustbin, with partial matches on the Weather Station and Plant Monitor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom Conversion CTA */}
      <section className="py-16 bg-gradient-to-b from-[#0B1220] to-slate-950 border-b border-slate-800/80">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Ready to give your components a second life?
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl mx-auto text-balance">
            Log in to manage your inventory, test project feasibility, and view complete hardware assembly schematics.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={handleLaunchMonishDemo}
              className="px-6 py-2.5 rounded-lg bg-teal-400 text-[#0B1220] font-semibold hover:bg-teal-300 transition-colors text-xs shadow-md shadow-teal-500/20"
            >
              Launch Platform Demo
            </button>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-medium"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Engineering Footer */}
      <footer className="py-8 bg-[#0B1220] border-t border-slate-800/60 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-teal-400" />
            <span className="font-semibold text-slate-300">SecondLife</span>
            <span className="text-slate-600">·</span>
            <span>TechTrove 3.0 (PS3)</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Engineered by C. Monish Nandha Balan & Parameshwaran S
          </div>
        </div>
      </footer>
    </div>
  );
};
