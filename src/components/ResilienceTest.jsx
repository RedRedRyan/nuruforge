import { useState, useEffect, useRef, useCallback } from "react";

/*
  ResilienceTest.jsx
  ──────────────────
  NURUFORGE — The Resilience Test
  Africa's Infrastructure Gaps × AIoT

  Dependencies:
    - React 18+
    - Tailwind CSS (with JIT / content config covering this file)
    - Google Fonts: IBM Plex Mono + Syne (add to your index.html or global CSS)

  Usage:
    import ResilienceTest from "./ResilienceTest";
    <ResilienceTest />
*/

const SCENARIOS = [
  { power: "on",  net: "strong", msg: "Normal conditions" },
  { power: "on",  net: "weak",   msg: "Network congestion — peak hours" },
  { power: "on",  net: "none",   msg: "Tower outage — connectivity lost" },
  { power: "off", net: "none",   msg: "Load-shedding — grid down" },
  { power: "off", net: "weak",   msg: "Grid still down, signal flickers back" },
  { power: "on",  net: "weak",   msg: "Power restored, network recovering" },
  { power: "on",  net: "strong", msg: "Back to normal — queue syncs" },
];

function useResilienceSim(power, net) {
  const [evCloud, setEvCloud] = useState(0);
  const [evEdge, setEvEdge]   = useState(0);
  const [queue, setQueue]     = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      const p = power === "on";
      const cloudAlive = p && net !== "none";
      const cloudSlow  = cloudAlive && net === "weak";

      setEvEdge(v => v + 2);

      setQueue(q => {
        if (p && net === "strong") return Math.max(0, q - 7);
        if (p && net === "weak")   return Math.max(0, q - 2);
        return q + 2;
      });

      setEvCloud(v => {
        if (!cloudAlive) return v;
        return v + (cloudSlow ? 1 : 2);
      });
    }, 650);
    return () => clearInterval(id);
  }, [power, net]);

  const uptime = !( power === "on") || net === "none" ? 0 : net === "weak" ? 55 : 100;

  const cloudAlive = power === "on" && net !== "none";
  const cloudSlow  = cloudAlive && net === "weak";

  return { evCloud, evEdge, queue, uptime, cloudAlive, cloudSlow };
}

function PulsingCore({ alive, dark }) {
  return (
    <div
      className={[
        "w-5 h-5 rounded-full transition-all duration-300",
        alive
          ? dark
            ? "bg-green animate-pulse"
            : "bg-green animate-pulse"
          : "bg-[#3a3a3a]",
      ].join(" ")}
    />
  );
}

function NodeBox({ alive, dark }) {
  return (
    <div
      className={[
        "w-14 h-14 sm:w-16 sm:h-16 border flex items-center justify-center flex-shrink-0 transition-all duration-300",
        "rounded-tl-2xl",
        dark
          ? "border-[#3a3a3a] bg-[#1a1a1a]"
          : alive
          ? "border-[#0f0f0f] bg-[#f5f4f0]"
          : "border-[#aaa] bg-[#e8e8e4] opacity-30",
      ].join(" ")}
    >
      <PulsingCore alive={alive} dark={dark} />
    </div>
  );
}

function LinkLine({ active, dark }) {
  return (
    <div
      className="flex-1 h-px mx-2 transition-opacity duration-300"
      style={{
        opacity: active ? 1 : 0.12,
        backgroundImage: `repeating-linear-gradient(90deg, ${
          dark ? "#3a3a3a" : "#0f0f0f"
        } 0 5px, transparent 5px 10px)`,
      }}
    />
  );
}

function SegButton({ label, active, onClick, darkBg }) {
  return (
    <button
      onClick={onClick}
      className={[
        "backdrop-blur-2xl flex-1 font-mono text-xs  font-bold uppercase tracking-widest py-2 px-1 transition-all duration-100 border-r border-[#2e2e2e] last:border-r-0",
        active
          ? "bg-white text-black"
          : darkBg
          ? "bg-transparent text-white hover:text-green"
          : "bg-transparent text-[#888] hover:bg-[#111] hover:text-[#f5f4f0]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function LogFeed({ entries }) {
  return (
    <div className="flex flex-col-reverse gap-0.5 h-10 sm:h-24 overflow-hidden px-4 sm:px-5 py-3">
      {entries.map((e, i) => (
        <div
          key={e.id}
          className={[
            "font-mono text-xs  uppercase tracking-wider",
            i === 0
              ? e.hi ? "text-red-500" : "text-green"
              : "text-[#2e2e2e]",
          ].join(" ")}
        >
          › {e.msg}
        </div>
      ))}
    </div>
  );
}

function Verdict({ power, net }) {
  const key = `${power}-${net}`;

  const content = {
    "on-strong": (
      <>
        Both systems online{" "}
        <span className="text-green">.  Cut the power</span> or{" "}
        <span className="text-[#f5f4f0]">  drop the network</span> — watch which one keeps thinking.
      </>
    ),
    "off-none": (
      <>
        Power&apos;s out. The cloud system is{" "}
        <span className="text-[#3a3a3a]">dark and useless.</span> The AIoT node runs on{" "}
        <span className="text-[#f5f4f0]">battery and solar — still detecting, still deciding.</span>
      </>
    ),
    "off-weak": (
      <>
        Grid still down. Cloud is{" "}
        <span className="text-[#3a3a3a]">dead.</span> Edge keeps running on backup power,{" "}
        <span className="text-[#f5f4f0]">trickling data through the faint signal.</span>
      </>
    ),
    "on-none": (
      <>
        No network. The cloud system is{" "}
        <span className="text-[#3a3a3a]">blind — can&apos;t think without the cloud.</span> The AIoT node{" "}
        <span className="text-green">processes on-device and queues events to sync later.</span> Nothing is lost.
      </>
    ),
    "on-weak": (
      <>
        Weak signal. Cloud{" "}
        <span className="text-[#3a3a3a]">lags 8 seconds behind reality.</span> The AIoT node already{" "}
        <span className="text-[#f5f4f0]">decided locally</span> — it only uses the link to sync.
      </>
    ),
    "off-strong": (
      <>
        Power&apos;s out. Signal is there but useless — the cloud server{" "}
        <span className="text-[#3a3a3a]">needs grid power to run.</span> Edge keeps going on{" "}
        <span className="text-green">battery and solar.</span>
      </>
    ),
  };

  return (
    <div
      key={key}
      className="px-4 sm:px-5 py-4 border-b border-[#1e1e1e] font-sans text-[13px] sm:text-[14px] font-medium text-[#666] leading-relaxed min-h-[56px] flex items-center animate-fadeIn"
    >
      {content[key] || content["on-strong"]}
    </div>
  );
}

export default function ResilienceTest() {
  const [power, setPower] = useState("on");
  const [net, setNet]     = useState("strong");
  const [simRunning, setSimRunning] = useState(false);
  const [simLabel, setSimLabel]     = useState("");
  const [log, setLog]   = useState([{ id: 0, msg: "System initialised — both nodes online", hi: false }]);
  const simRef   = useRef(null);
  const simIdx   = useRef(0);
  const logIdRef = useRef(1);

  const { evCloud, evEdge, queue, uptime, cloudAlive, cloudSlow } = useResilienceSim(power, net);

  const addLog = useCallback((msg, hi = false) => {
    setLog(prev => {
      const next = [{ id: logIdRef.current++, msg, hi }, ...prev].slice(0, 6);
      return next;
    });
  }, []);

  const stopSim = useCallback(() => {
    if (simRef.current) { clearInterval(simRef.current); simRef.current = null; }
    setSimRunning(false);
    setSimLabel("");
  }, []);

  const startSim = useCallback(() => {
    simIdx.current = 0;
    setSimRunning(true);
    const step = () => {
      const sc = SCENARIOS[simIdx.current % SCENARIOS.length];
      setPower(sc.power);
      setNet(sc.net);
      addLog(sc.msg.toUpperCase(), sc.net === "none" || sc.power === "off");
      setSimLabel(sc.msg);
      simIdx.current++;
    };
    step();
    simRef.current = setInterval(step, 2600);
  }, [addLog]);

  useEffect(() => () => { if (simRef.current) clearInterval(simRef.current); }, []);

  const handlePower = (val) => {
    stopSim();
    setPower(val);
    addLog(val === "off" ? "GRID POWER CUT" : "GRID POWER RESTORED", val === "off");
  };

  const handleNet = (val) => {
    stopSim();
    setNet(val);
    addLog("NETWORK → " + val.toUpperCase(), val === "none");
  };

  const cloudNodeAlive = power === "on" && net !== "none";
  const cloudLinkActive = cloudNodeAlive;

  const edgeLinkActive = net !== "none";

  const edgeStatus = (() => {
    if (power === "off") return "◐ ON BATTERY · SOLAR — RUNNING";
    if (net === "none")  return "● LOCAL PROCESSING — STORING";
    if (net === "weak")  return "● PROCESSING — SYNCING SLOWLY";
    return "● PROCESSING + SYNCED";
  })();

  const cloudStatus = (() => {
    if (power === "off") return "✕ OFFLINE — NO POWER";
    if (net === "none")  return "✕ BLIND — NO CLOUD LINK";
    if (net === "weak")  return "◌ LAGGING — ~8s LATENCY";
    return "● ONLINE";
  })();

  const cloudStatusColor = cloudNodeAlive
    ? net === "weak" ? "text-[#888]" : "text-green"
    : "text-[#aaa]";

  const uptimeColor = uptime === 0 ? "text-[#3a3a3a]" : uptime < 100 ? "text-[#888]" : "text-green";

  return (
    <section
      id='test'
      
    >
      

      {/* Header */}
      <div className=" px-4 sm:px-5 py-3 flex flex-wrap justify-between items-baseline gap-1.5">
        <span
          className="font-comfortaa text-[11px] sm:text-[12px] font-bold text-[#f5f4f0] uppercase tracking-widest"
    
        >
          The Resilience // Test
        
        </span>
        <span
          className="font-comfortaa text-[9px] sm:text-[10px] text-green uppercase tracking-widest"
    
        >
          Africa&apos;s infrastructure gaps × AIoT
        </span>
      </div>

      {/* Controls */}
      <div className="] grid grid-cols-1 sm:grid-cols-2 border-b border-[#0f0f0f]">
        <div className="px-4 sm:px-5 py-4 border-b sm:border-b-0 sm:border-r border-[#2a2a2a]">
          <div
            className=""
    
          >
             <p className="font-comfortaa text-xl sm:text-[10px] text-green uppercase tracking-widest"> Grid power</p>
             <img src="./images/power.png" className="size-8"/>
          </div>
          <div className="flex border border-[#2e2e2e]">
            {[["on", "On"], ["off", "Cut power"]].map(([v, label]) => (
              <SegButton key={v} label={label} active={power === v} darkBg onClick={() => handlePower(v)} />
            ))}
          </div>
        </div>
        <div className="px-4 sm:px-5 py-4">
          <div
            className="font-comfortaa text-[9px] sm:text-[10px] text-green uppercase tracking-widest mb-2.5"
    
          >
            📶 Network
          </div>
          <div className="flex border border-[#2e2e2e]">
            {[["strong", "Strong"], ["weak", "Weak"], ["none", "None"]].map(([v, label]) => (
              <SegButton key={v} label={label} active={net === v} darkBg onClick={() => handleNet(v)} />
            ))}
          </div>
        </div>
      </div>



      {/* Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-[#0f0f0f]">

        {/* Cloud Panel */}
        <div className="bg-[#f5f4f0] border-b sm:border-b-0 sm:border-r border-[#0f0f0f]">
          <div className="px-4 sm:px-5 py-3 border-b border-[#0f0f0f] flex justify-between items-center">
            <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-tight text-[#0f0f0f]">
              Cloud-first
            </span>
            <span
              className="font-comfortaa text-[8px] sm:text-[9px] uppercase tracking-widest px-2 py-1 border border-[#0f0f0f] text-[#0f0f0f]"
              
            >
              Conventional
            </span>
          </div>

          <div className="px-4 sm:px-5 py-6 sm:py-7 flex flex-col items-center gap-3 border-b border-[#0f0f0f] min-h-[140px] sm:min-h-[160px] justify-center">
            <div className="flex items-center w-full max-w-[200px] justify-center">
              <NodeBox alive={cloudNodeAlive} dark={false} />
              <LinkLine active={cloudLinkActive} dark={false} />
              <span
                className="font-comfortaa text-[9px] sm:text-[10px] text-[#888] flex-shrink-0"
                
              >
                ☁ CLOUD
              </span>
            </div>
            <div
              className={`font-source text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-center leading-snug transition-colors duration-300 ${cloudStatusColor}`}
              
            >
              {cloudStatus}
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="px-4 sm:px-5 py-4 border-r border-[#0f0f0f]">
              <div
                className={`font-source text-[22px] sm:text-[26px] font-bold leading-none transition-colors duration-300 ${cloudNodeAlive ? "text-[#0f0f0f]" : "text-[#bbb]"}`}
                
              >
                {evCloud}
              </div>
              <div
                className="font-comfortaa text-[8px] sm:text-[9px] uppercase tracking-widest text-[#888] mt-1.5"
                
              >
                Events processed
              </div>
            </div>
            <div className="px-4 sm:px-5 py-4">
              <div
                className={`font-source text-[22px] sm:text-[26px] font-bold leading-none transition-colors duration-300 ${uptimeColor}`}
                
              >
                {uptime}%
              </div>
              <div
                className="font-comfortaa text-[8px] sm:text-[9px] uppercase tracking-widest text-[#888] mt-1.5"
                
              >
                Intelligence uptime
              </div>
            </div>
          </div>
        </div>

        {/* Edge Panel */}
        <div className="bg-green">
          <div className="px-4 sm:px-5 py-3 border-b border-[#2a2a2a] flex justify-between items-center">
            <span className="text-[12px] sm:text-[13px] font-bold uppercase tracking-tight text-white">
              Edge-first · AIoT
            </span>
            <span
              className="font-comfortaa text-[8px] sm:text-[9px] uppercase tracking-widest px-2 py-1 border border-[#3a3a3a] text-[#666]"
              
            >
              NURUFORGE
            </span>
          </div>

          <div className="px-4 sm:px-5 py-6 sm:py-7 flex flex-col items-center gap-3 border-b border-[#2a2a2a] min-h-[140px] sm:min-h-[160px] justify-center">
            <div className="flex items-center w-full max-w-[200px] justify-center">
              <NodeBox alive dark />
              <LinkLine active={edgeLinkActive} dark />
              <span
                className="font-comfortaa text-[9px] sm:text-[10px] text-[#444] flex-shrink-0"
                
              >
                ☁ SYNC
              </span>
            </div>
            <div
              className="font-source text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-center text-white leading-snug"
              
            >
              {edgeStatus}
            </div>
          </div>

          <div className="grid grid-cols-2">
            <div className="px-4 sm:px-5 py-4 border-r border-[#2a2a2a]">
              <div
                className="font-source text-[22px] sm:text-[26px] font-bold text-white leading-none"
                
              >
                {evEdge}
              </div>
              <div
                className="font-comfortaa text-[8px] sm:text-[9px] uppercase tracking-widest text-[#444] mt-1.5"
                
              >
                Events processed
              </div>
            </div>
            <div className="px-4 sm:px-5 py-4">
              <div
                className="font-source text-[22px] sm:text-[26px] font-bold text-[#f5f4f0] leading-none"
                
              >
                {queue}
              </div>
              <div
                className="font-comfortaa text-[8px] sm:text-[9px] uppercase tracking-widest text-[#444] mt-1.5"
                
              >
                Queued to sync
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black">
        <Verdict power={power} net={net} />
        <button
          onClick={simRunning ? stopSim : startSim}
          className="font-comfortaa text-[10px] sm:text-[11px] font-bold uppercase tracking-widest px-3 sm:px-4 py-2 bg-transparent text-[#f5f4f0] border border-[#3a3a3a] hover:bg-green hover:text-[#0f0f0f] transition-all duration-100"
          
        >
          {simRunning ? "■ Stop simulation" : "▶ Simulate real conditions"}
        </button>
        <LogFeed entries={log} />
        
      </div>
    </section>
  );
}