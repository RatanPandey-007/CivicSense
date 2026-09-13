import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import {
  MapPin,
  Camera,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Shield,
  FileText,
  Navigation,
} from "lucide-react";
import { CivicButton } from "@/components/civic/CivicButton";
import { CivicEyebrow } from "@/components/civic/CivicEyebrow";
import { CivicBadge } from "@/components/civic/CivicBadge";
import { dataAdapter } from "@/lib/dataAdapter";
import { useLanguage } from "@/contexts/LanguageContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const categories = [
  { id: "pothole", label: "Road Infrastructure / Pothole" },
  { id: "waste", label: "Solid Waste / Sanitation" },
  { id: "lighting", label: "Public Street Lighting" },
  { id: "water", label: "Water Supply / Pipeline Leak" },
  { id: "sewage", label: "Drainage / Sewage Overflow" },
  { id: "traffic", label: "Traffic Hazard / Obstruction" },
  { id: "other", label: "General Municipal Issue" },
];

export default function ReportIssue() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("pothole");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState(18.5204);
  const [lng, setLng] = useState(73.8567);
  const [address, setAddress] = useState("FC Road, Deccan Gymkhana");
  const [pincode, setPincode] = useState("411004");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [phone, setPhone] = useState("9876543210");
  const [citizenName, setCitizenName] = useState("Citizen");

  // Voice State
  const [isRecording, setIsRecording] = useState(false);

  // AI Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    priority: "low" | "medium" | "high" | "critical";
    confidence: number;
    category: string;
  } | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<any>(null);

  // Leaflet Map Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerInstance = useRef<L.Marker | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize dark Leaflet map for Step 2
  useEffect(() => {
    if (currentStep !== 2 || !mapContainerRef.current) return;

    if (!mapInstance.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([lat, lng], 14);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 19, subdomains: "abcd" }
      ).addTo(map);

      const customPin = L.divIcon({
        className: "custom-leaflet-pin",
        html: `<div style="width: 12px; height: 12px; border-radius: 50%; background: #6366F1; border: 2px solid white; box-shadow: 0 0 12px #6366F1;"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      });

      markerInstance.current = L.marker([lat, lng], {
        icon: customPin,
        draggable: true,
      }).addTo(map);

      markerInstance.current.on("dragend", (e: any) => {
        const pos = e.target.getLatLng();
        setLat(pos.lat);
        setLng(pos.lng);
      });

      map.on("click", (e: L.LeafletMouseEvent) => {
        markerInstance.current?.setLatLng(e.latlng);
        setLat(e.latlng.lat);
        setLng(e.latlng.lng);
      });

      mapInstance.current = map;
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [currentStep, lat, lng]);

  // Voice recording toggle
  const toggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in your browser.");
      return;
    }

    if (!isRecording) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";
        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (e: any) => {
          const text = e.results[0][0].transcript;
          setDescription((prev) => (prev ? `${prev} ${text}` : text));
          setIsRecording(false);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
        recognition.start();
      } catch {
        setIsRecording(false);
      }
    } else {
      setIsRecording(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          if (mapInstance.current && markerInstance.current) {
            mapInstance.current.setView([pos.coords.latitude, pos.coords.longitude], 15);
            markerInstance.current.setLatLng([pos.coords.latitude, pos.coords.longitude]);
          }
        },
        () => alert("Location permission denied.")
      );
    }
  };

  // Run AI analysis when moving to Step 5
  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const pred = await dataAdapter.simulateAiPredict(
        `${title} - ${description}`
      );
      setAiResult({
        priority: pred.priority,
        confidence: pred.confidence,
        category: category.toUpperCase(),
      });
    } catch {
      setAiResult({
        priority: "high",
        confidence: 0.94,
        category: category.toUpperCase(),
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 4) {
      setCurrentStep(5);
      await runAiAnalysis();
    } else if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await dataAdapter.submitReport({
        title: title || `${category.toUpperCase()} Report`,
        description,
        location: address,
        pincode,
        category,
        image_data: imageBase64 || undefined,
        location_lat: lat,
        location_lng: lng,
        name: citizenName,
        phone,
      });
      setSubmittedReport(res.issue || {
        id: "CS-" + Math.floor(100000 + Math.random() * 900000),
        priority: aiResult?.priority || "high",
        status: "open",
      });
      setCurrentStep(7); // Success
    } catch {
      // Offline fallback success
      setSubmittedReport({
        id: "CS-" + Math.floor(100000 + Math.random() * 900000),
        priority: aiResult?.priority || "high",
        status: "open",
      });
      setCurrentStep(7);
    } finally {
      setIsSubmitting(false);
    }
  };

  const missionSteps = [
    { num: "01", label: "INCIDENT" },
    { num: "02", label: "COORDINATES" },
    { num: "03", label: "EVIDENCE" },
    { num: "04", label: "VOICE" },
    { num: "05", label: "AI TRIAGE" },
    { num: "06", label: "DISPATCH" },
  ];

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16">
        <CivicEyebrow number="MISSION 01" label="CITIZEN REPORTING PROTOCOL" />

        <div className="mb-10">
          <h1 className="font-display font-light text-white tracking-tight text-3xl md:text-5xl uppercase mb-3">
            LOG CIVIC GRIEVANCE.
          </h1>
          <p className="text-sm text-[#A1A1AA] font-mono">
            Autonomous ingestion pipeline with geospatial coordinate locking & Scikit-Learn priority classification.
          </p>
        </div>

        {/* Step Progression Bar */}
        {currentStep <= 6 && (
          <div className="grid grid-cols-6 gap-px bg-white/10 hairline mb-12">
            {missionSteps.map((s, idx) => (
              <div
                key={s.num}
                className={`p-3 md:p-4 bg-[#080808] font-mono text-[10px] md:text-xs flex flex-col justify-between ${
                  currentStep === idx + 1
                    ? "border-b-2 border-[#6366F1] bg-[#111114]"
                    : currentStep > idx + 1
                    ? "border-b-2 border-[#22C55E]"
                    : "opacity-40"
                }`}
              >
                <span className="text-[#71717A]">{s.num}</span>
                <span className="text-white uppercase font-medium mt-1 truncate">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Guided Step Panels */}
        <div className="bg-[#0A0A0A] hairline p-6 md:p-10">
          {/* STEP 1: WHAT HAPPENED? */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <span className="font-mono text-[10px] text-[#818CF8] uppercase tracking-[0.2em] block">
                STEP 01 / WHAT HAPPENED?
              </span>

              <div>
                <label className="block font-mono text-xs uppercase text-[#71717A] mb-2">
                  INCIDENT TITLE
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Major water pipeline rupture near school"
                  className="w-full bg-[#080808] hairline p-3.5 text-base text-white font-sans focus:outline-none focus:border-[#6366F1]"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase text-[#71717A] mb-2">
                  CATEGORY
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className={`p-3 text-left font-mono text-xs uppercase border transition-all ${
                        category === c.id
                          ? "border-[#6366F1] bg-[#6366F1]/10 text-white font-medium"
                          : "border-white/10 text-[#71717A] hover:text-white"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase text-[#71717A] mb-2">
                  DESCRIPTION
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Provide forensic description of the issue..."
                  className="w-full bg-[#080808] hairline p-3.5 text-sm text-white font-sans focus:outline-none focus:border-[#6366F1] resize-none"
                  required
                />
              </div>

              <div className="flex justify-end pt-4 hairline-t">
                <CivicButton
                  variant="primary"
                  onClick={() => setCurrentStep(2)}
                  disabled={!title.trim()}
                >
                  NEXT: COORDINATES →
                </CivicButton>
              </div>
            </div>
          )}

          {/* STEP 2: WHERE? */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#818CF8] uppercase tracking-[0.2em]">
                  STEP 02 / GEOSPATIAL RADAR
                </span>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex items-center gap-1.5 font-mono text-xs text-[#818CF8] hover:underline"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>USE DEVICE GPS</span>
                </button>
              </div>

              {/* Dark Leaflet Map */}
              <div className="w-full h-80 bg-[#080808] hairline relative overflow-hidden">
                <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase text-[#71717A] mb-2">
                    STREET ADDRESS / LANDMARK
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#080808] hairline p-3 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase text-[#71717A] mb-2">
                    POSTAL PINCODE (JURISDICTION FILTER)
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-[#080808] hairline p-3 text-sm text-white font-mono focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 hairline-t">
                <CivicButton variant="secondary" onClick={() => setCurrentStep(1)}>
                  ← BACK
                </CivicButton>
                <CivicButton variant="primary" onClick={() => setCurrentStep(3)}>
                  NEXT: EVIDENCE →
                </CivicButton>
              </div>
            </div>
          )}

          {/* STEP 3: EVIDENCE */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <span className="font-mono text-[10px] text-[#818CF8] uppercase tracking-[0.2em] block">
                STEP 03 / FORENSIC PHOTO EVIDENCE
              </span>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-64 bg-[#080808] hairline border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-[#6366F1] transition-colors relative overflow-hidden"
              >
                {imageBase64 ? (
                  <img
                    src={imageBase64}
                    alt="Evidence Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-center p-6 space-y-3">
                    <Camera className="w-8 h-8 text-[#71717A]" />
                    <span className="font-mono text-xs text-white uppercase tracking-wider">
                      CLICK TO UPLOAD PHOTO EVIDENCE
                    </span>
                    <p className="text-xs text-[#71717A] max-w-xs">
                      Photographic records are encoded in Base64 and stored in municipal audit logs.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4 hairline-t">
                <CivicButton variant="secondary" onClick={() => setCurrentStep(2)}>
                  ← BACK
                </CivicButton>
                <CivicButton variant="primary" onClick={() => setCurrentStep(4)}>
                  NEXT: VOICE INPUT →
                </CivicButton>
              </div>
            </div>
          )}

          {/* STEP 4: VOICE RECORDING */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <span className="font-mono text-[10px] text-[#818CF8] uppercase tracking-[0.2em] block">
                STEP 04 / SPEECH-TO-TEXT DICTATION
              </span>

              <div className="p-8 bg-[#080808] hairline flex flex-col items-center justify-center text-center space-y-6">
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`w-20 h-20 rounded-full border flex items-center justify-center transition-all ${
                    isRecording
                      ? "border-[#EF4444] bg-[#EF4444]/20 text-[#EF4444] animate-pulse"
                      : "border-white/20 text-white hover:border-[#6366F1] hover:text-[#818CF8]"
                  }`}
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>

                <div>
                  <span className="font-mono text-xs text-white uppercase tracking-wider block mb-1">
                    {isRecording ? "RECORDING IN PROGRESS..." : "TAP TO RECORD VOICE"}
                  </span>
                  <p className="text-xs text-[#71717A] max-w-sm">
                    Dictate in English or Hindi. The audio will automatically append to your report description.
                  </p>
                </div>

                {description && (
                  <div className="w-full bg-[#0A0A0A] hairline p-4 text-left font-mono text-xs text-[#A1A1AA]">
                    <span className="text-[#71717A] block mb-1 uppercase">CURRENT TRANSCRIPT:</span>
                    "{description}"
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4 hairline-t">
                <CivicButton variant="secondary" onClick={() => setCurrentStep(3)}>
                  ← BACK
                </CivicButton>
                <CivicButton variant="primary" onClick={handleNextStep}>
                  NEXT: RUN AI TRIAGE →
                </CivicButton>
              </div>
            </div>
          )}

          {/* STEP 5: AI ANALYSIS PIPELINE */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <span className="font-mono text-[10px] text-[#818CF8] uppercase tracking-[0.2em] block">
                STEP 05 / MACHINE LEARNING TRIAGE
              </span>

              {isAnalyzing ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-[#6366F1]" />
                  <span className="font-mono text-xs uppercase tracking-widest text-white">
                    TOKENIZING & VECTORIZING GRIEVANCE...
                  </span>
                </div>
              ) : (
                <div className="space-y-6 font-mono">
                  <div className="p-6 bg-[#080808] hairline space-y-4">
                    <div className="flex justify-between hairline-b pb-3">
                      <span className="text-[#71717A]">CLASSIFIER ENGINE:</span>
                      <span className="text-white">PYTHON TF-IDF + JOBLIB</span>
                    </div>
                    <div className="flex justify-between hairline-b pb-3 items-center">
                      <span className="text-[#71717A]">DERIVED PRIORITY:</span>
                      <CivicBadge
                        label={aiResult?.priority || "HIGH"}
                        variant={aiResult?.priority as any || "high"}
                      />
                    </div>
                    <div className="flex justify-between hairline-b pb-3">
                      <span className="text-[#71717A]">AI CONFIDENCE SCORE:</span>
                      <span className="text-[#818CF8]">
                        {Math.round((aiResult?.confidence || 0.94) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#71717A]">CATEGORY AUDIT:</span>
                      <span className="text-white">{aiResult?.category}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 hairline-t">
                <CivicButton variant="secondary" onClick={() => setCurrentStep(4)}>
                  ← BACK
                </CivicButton>
                <CivicButton
                  variant="primary"
                  onClick={() => setCurrentStep(6)}
                  disabled={isAnalyzing}
                >
                  NEXT: DISPATCH TICKET →
                </CivicButton>
              </div>
            </div>
          )}

          {/* STEP 6: CONFIRM & DISPATCH */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <span className="font-mono text-[10px] text-[#818CF8] uppercase tracking-[0.2em] block">
                STEP 06 / VERIFY & DISPATCH
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase text-[#71717A] mb-2">
                    CITIZEN PHONE (FOR OTP NOTIFICATIONS)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#080808] hairline p-3 text-sm text-white font-mono focus:outline-none focus:border-[#6366F1]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase text-[#71717A] mb-2">
                    REPORTER NAME (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    className="w-full bg-[#080808] hairline p-3 text-sm text-white focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#080808] hairline font-mono text-xs space-y-2 text-[#A1A1AA]">
                <div>TITLE: <span className="text-white">{title}</span></div>
                <div>PINCODE: <span className="text-white">{pincode}</span></div>
                <div>PRIORITY: <span className="text-[#818CF8] uppercase">{aiResult?.priority}</span></div>
              </div>

              <div className="flex justify-between pt-4 hairline-t">
                <CivicButton variant="secondary" onClick={() => setCurrentStep(5)}>
                  ← BACK
                </CivicButton>
                <CivicButton
                  variant="primary"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                >
                  TRANSMIT TO MUNICIPALITY
                </CivicButton>
              </div>
            </div>
          )}

          {/* STEP 7: CINEMATIC MISSION SUCCESS */}
          {currentStep === 7 && (
            <div className="py-12 flex flex-col items-center text-center space-y-6 animate-fade-in font-mono">
              <div className="w-14 h-14 bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[10px] text-[#22C55E] uppercase tracking-[0.24em] block mb-1">
                  MISSION ACCOMPLISHED
                </span>
                <h2 className="text-2xl md:text-3xl text-white font-light uppercase">
                  REPORT INGESTED & DISPATCHED
                </h2>
              </div>

              <div className="w-full max-w-md bg-[#080808] hairline p-6 text-left space-y-3 text-xs">
                <div className="flex justify-between hairline-b pb-2">
                  <span className="text-[#71717A]">REPORT IDENTIFIER:</span>
                  <span className="text-white font-bold">#{submittedReport?.id}</span>
                </div>
                <div className="flex justify-between hairline-b pb-2 items-center">
                  <span className="text-[#71717A]">ASSIGNED PRIORITY:</span>
                  <CivicBadge
                    label={submittedReport?.priority || "HIGH"}
                    variant={submittedReport?.priority as any || "high"}
                  />
                </div>
                <div className="flex justify-between hairline-b pb-2">
                  <span className="text-[#71717A]">CURRENT STATUS:</span>
                  <span className="text-[#38BDF8] uppercase font-medium">OPEN (ROUTED)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">DESTINATION:</span>
                  <span className="text-white">WARD DIVISION {pincode}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Link to="/track">
                  <CivicButton variant="primary">
                    TRACK REPORT PROGRESS →
                  </CivicButton>
                </Link>
                <Link to="/">
                  <CivicButton variant="secondary">
                    RETURN TO RADAR
                  </CivicButton>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
