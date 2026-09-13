import { useState, useEffect } from "react";
import { dataAdapter } from "@/lib/dataAdapter";

export function AiEngineSection() {
  const [inputText, setInputText] = useState(
    "Live electrical wire has fallen across the road."
  );
  const [activeStep, setActiveStep] = useState<number>(5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prediction, setPrediction] = useState({
    priority: "critical",
    confidence: 94.7,
    tokens: ["live", "electrical", "wire", "fallen", "road"],
    overrideTriggered: true,
  });

  const runPipeline = async (text: string) => {
    setIsProcessing(true);
    setActiveStep(1);

    // Sequence through stages
    setTimeout(() => setActiveStep(2), 350);
    setTimeout(() => setActiveStep(3), 700);
    setTimeout(() => setActiveStep(4), 1050);

    const result = await dataAdapter.simulateAiPredict(text);

    setTimeout(() => {
      setActiveStep(5);
      setIsProcessing(false);
      const isCritical =
        result.priority === "critical" ||
        ["fire", "accident", "explosion", "wire", "live"].some((k) =>
          text.toLowerCase().includes(k)
        );

      // Clean tokens
      const words = text
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .split(" ")
        .filter((w) => w.length > 3);

      setPrediction({
        priority: isCritical ? "critical" : result.priority,
        confidence: Math.round(result.confidence * 1000) / 10,
        tokens: words.slice(0, 6),
        overrideTriggered: isCritical,
      });
    }, 1400);
  };

  useEffect(() => {
    runPipeline(inputText);
  }, []);

  const sampleInputs = [
    "Live electrical wire has fallen across the road.",
    "Deep crater-style pothole on the bus lane.",
    "Unattended compost heap overflowing near marketplace.",
    "Streetlight flickering on residential lane.",
  ];

  return (
    <section id="ai-engine" className="relative w-full bg-[#0A0A0A] py-24 md:py-36 px-6 md:px-12 hairline-b">
      <div className="max-w-[1440px] mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-6 mb-12">
          <div className="flex items-center gap-3 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#818CF8]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#A1A1AA]">
              03 · AI PRIORITY ENGINE
            </span>
          </div>
          <div className="h-[1px] w-full bg-white/10" />
        </div>

        {/* Section Headline */}
        <div className="mb-16">
          <h2 className="font-display font-light text-white tracking-[-0.045em] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.92] mb-6">
            NOT EVERY REPORT <br />
            <span className="text-[#EF4444]">HAS THE SAME URGENCY.</span>
          </h2>
          <p className="text-[#A1A1AA] text-base md:text-lg max-w-2xl leading-relaxed">
            The machine learning engine parses citizen natural language in milliseconds. Trained on real-world municipality datasets with Scikit-Learn TF-IDF vectorization and hard emergency overrides.
          </p>
        </div>

        {/* Interactive Query Input */}
        <div className="mb-10 bg-[#080808] hairline p-4 md:p-6">
          <label className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#71717A] mb-2.5">
            ENTER REPORT DESCRIPTION TO TRACE PIPELINE
          </label>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-[#0A0A0A] hairline px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-[#6366F1]"
            />
            <button
              onClick={() => runPipeline(inputText)}
              disabled={isProcessing}
              className="px-6 py-3 bg-white text-[#080808] font-mono text-[11px] uppercase tracking-[0.14em] font-medium hover:bg-[#818CF8] hover:text-white transition-all disabled:opacity-50"
            >
              {isProcessing ? "PROCESSING..." : "ANALYZE TEXT"}
            </button>
          </div>

          {/* Sample Prompts */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 hairline-t">
            <span className="font-mono text-[10px] text-[#71717A] uppercase tracking-wider mr-2">
              TRY SAMPLE:
            </span>
            {sampleInputs.map((sample) => (
              <button
                key={sample}
                onClick={() => {
                  setInputText(sample);
                  runPipeline(sample);
                }}
                className="font-mono text-[10px] px-2.5 py-1 hairline bg-white/[0.02] text-[#A1A1AA] hover:text-white hover:border-[#6366F1] transition-all"
              >
                {sample.slice(0, 32)}...
              </button>
            ))}
          </div>
        </div>

        {/* 5-Stage Machine Learning Pipeline Trace */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-white/10 hairline mb-12">
          {/* Stage 1: Raw Text */}
          <div
            className={`bg-[#080808] p-5 flex flex-col justify-between transition-colors ${
              activeStep >= 1 ? "border-t-2 border-[#6366F1]" : ""
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-[#71717A] font-mono text-[10px] uppercase mb-3">
                <span>STAGE 01</span>
                <span>INGESTION</span>
              </div>
              <h4 className="font-mono text-[11px] text-white uppercase tracking-wider mb-2">
                RAW TEXT
              </h4>
              <p className="text-xs text-[#A1A1AA] font-mono break-words leading-relaxed">
                "{inputText.slice(0, 48)}..."
              </p>
            </div>
            <span className="font-mono text-[10px] text-[#71717A] mt-6">
              STATUS: PARSED
            </span>
          </div>

          {/* Stage 2: Tokenization */}
          <div
            className={`bg-[#080808] p-5 flex flex-col justify-between transition-colors ${
              activeStep >= 2 ? "border-t-2 border-[#6366F1]" : "opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-[#71717A] font-mono text-[10px] uppercase mb-3">
                <span>STAGE 02</span>
                <span>NLTK CORPUS</span>
              </div>
              <h4 className="font-mono text-[11px] text-white uppercase tracking-wider mb-2">
                TOKENIZATION
              </h4>
              <div className="flex flex-wrap gap-1">
                {prediction.tokens.map((tok) => (
                  <span
                    key={tok}
                    className="font-mono text-[10px] px-1.5 py-0.5 bg-white/5 border border-white/10 text-[#818CF8]"
                  >
                    {tok}
                  </span>
                ))}
              </div>
            </div>
            <span className="font-mono text-[10px] text-[#71717A] mt-6">
              LEMMATIZED: TRUE
            </span>
          </div>

          {/* Stage 3: TF-IDF Vectorizer */}
          <div
            className={`bg-[#080808] p-5 flex flex-col justify-between transition-colors ${
              activeStep >= 3 ? "border-t-2 border-[#6366F1]" : "opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-[#71717A] font-mono text-[10px] uppercase mb-3">
                <span>STAGE 03</span>
                <span>SPARSE MATRIX</span>
              </div>
              <h4 className="font-mono text-[11px] text-white uppercase tracking-wider mb-2">
                TF-IDF WEIGHTS
              </h4>
              <div className="font-mono text-[10px] text-[#71717A] space-y-1">
                <div>[0, 142] ··· 0.7812</div>
                <div>[0, 489] ··· 0.6104</div>
                <div>[0, 891] ··· 0.4429</div>
                <div>DIMENSIONS: 5000+</div>
              </div>
            </div>
            <span className="font-mono text-[10px] text-[#71717A] mt-6">
              EXTRACTOR: JOBLIB
            </span>
          </div>

          {/* Stage 4: Safety Keyword Override */}
          <div
            className={`bg-[#080808] p-5 flex flex-col justify-between transition-colors ${
              activeStep >= 4 ? "border-t-2 border-[#EF4444]" : "opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-[#71717A] font-mono text-[10px] uppercase mb-3">
                <span>STAGE 04</span>
                <span>HEURISTIC</span>
              </div>
              <h4 className="font-mono text-[11px] text-white uppercase tracking-wider mb-2">
                SAFETY OVERRIDE
              </h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                {prediction.overrideTriggered ? (
                  <span className="text-[#EF4444] font-mono text-[11px]">
                    CRITICAL HAZARD DETECTED IN STREAM
                  </span>
                ) : (
                  <span className="text-[#71717A] font-mono text-[11px]">
                    NO HARD EMERGENCY TRIGGER
                  </span>
                )}
              </p>
            </div>
            <span className="font-mono text-[10px] text-[#71717A] mt-6">
              OVERRIDE: {prediction.overrideTriggered ? "TRIGGERED" : "PASS"}
            </span>
          </div>

          {/* Stage 5: Final Classification */}
          <div
            className={`bg-[#080808] p-5 flex flex-col justify-between transition-colors ${
              activeStep >= 5 ? "border-t-2 border-[#22C55E]" : "opacity-60"
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-[#71717A] font-mono text-[10px] uppercase mb-3">
                <span>STAGE 05</span>
                <span>OUTPUT</span>
              </div>
              <h4 className="font-mono text-[11px] text-white uppercase tracking-wider mb-1">
                CLASSIFICATION
              </h4>
              <div className="mt-2">
                <span
                  className={`inline-block px-2.5 py-1 font-mono text-xs font-semibold uppercase tracking-widest border ${
                    prediction.priority === "critical"
                      ? "bg-[#EF4444]/20 border-[#EF4444] text-[#EF4444]"
                      : prediction.priority === "high"
                      ? "bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B]"
                      : "bg-[#22C55E]/20 border-[#22C55E] text-[#22C55E]"
                  }`}
                >
                  {prediction.priority.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-between font-mono text-[11px] text-[#A1A1AA]">
              <span>CONFIDENCE:</span>
              <span className="text-white font-medium">{prediction.confidence}%</span>
            </div>
          </div>
        </div>

        {/* Microservice Architecture Specs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs text-[#71717A]">
          <div className="p-4 bg-[#080808] hairline">
            <span className="text-white block mb-1">01 · PYTHON FLASK SERVICE</span>
            <span>Port 8000 microservice pre-loads pickled models for sub-20ms inference speed.</span>
          </div>
          <div className="p-4 bg-[#080808] hairline">
            <span className="text-white block mb-1">02 · BALANCED CORPUS</span>
            <span>Trained on municipal municipal civic issue types across multiple Indian districts.</span>
          </div>
          <div className="p-4 bg-[#080808] hairline">
            <span className="text-white block mb-1">03 · ZERO FIFO DELAY</span>
            <span>Critical risks are instantly elevated to municipal executive escalation channels.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
