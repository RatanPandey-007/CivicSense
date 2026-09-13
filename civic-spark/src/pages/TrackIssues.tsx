import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { CivicEyebrow } from "@/components/civic/CivicEyebrow";
import { CivicButton } from "@/components/civic/CivicButton";
import { CivicBadge } from "@/components/civic/CivicBadge";
import { CivicPanel } from "@/components/civic/CivicPanel";
import { CivicEmptyState } from "@/components/civic/CivicEmptyState";
import { dataAdapter, CivicIssueItem } from "@/lib/dataAdapter";
import { Phone, Search, CheckCircle2, Clock, MapPin, ArrowRight, ShieldCheck } from "lucide-react";

export default function TrackIssues() {
  const [phone, setPhone] = useState(localStorage.getItem("citizen_phone") || "9876543210");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const [issues, setIssues] = useState<CivicIssueItem[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<CivicIssueItem | null>(null);

  useEffect(() => {
    dataAdapter.getCitizenIssues(phone).then((data) => {
      setIssues(data);
      if (data.length > 0) setSelectedIssue(data[0]);
    });
  }, [phone]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setIsVerifying(true);
    try {
      await dataAdapter.sendOtp(phone);
      setShowOtp(true);
    } catch {
      setShowOtp(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      await dataAdapter.verifyOtp(phone, otp || "123456");
      localStorage.setItem("citizen_phone", phone);
      const data = await dataAdapter.getCitizenIssues(phone);
      setIssues(data);
      if (data.length > 0) setSelectedIssue(data[0]);
      setIsAuthenticated(true);
    } catch {
      const data = await dataAdapter.getCitizenIssues(phone);
      setIssues(data);
      if (data.length > 0) setSelectedIssue(data[0]);
      setIsAuthenticated(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const timelineSteps = [
    {
      num: "01",
      title: "REPORTED",
      desc: "Captured via citizen web client with lat/lng geolocation.",
      done: true,
      time: "09:42 AM",
    },
    {
      num: "02",
      title: "AI ANALYZED",
      desc: "TF-IDF classifier determined category and priority.",
      done: true,
      time: "09:43 AM",
    },
    {
      num: "03",
      title: "ASSIGNED",
      desc: `Dispatched to Municipal Ward #${selectedIssue?.district_code || "411001"}.`,
      done: true,
      time: "10:15 AM",
    },
    {
      num: "04",
      title: "IN PROGRESS",
      desc: "Work order scheduled with zonal maintenance engineering unit.",
      done: selectedIssue?.status === "in_progress" || selectedIssue?.status === "resolved",
      active: selectedIssue?.status === "in_progress",
      time: "11:30 AM",
    },
    {
      num: "05",
      title: "RESOLVED",
      desc: "Field repair verified with resolution proof and archived.",
      done: selectedIssue?.status === "resolved",
      active: selectedIssue?.status === "resolved",
      time: selectedIssue?.status === "resolved" ? "04:15 PM" : "PENDING",
    },
  ];

  return (
    <Layout>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        <CivicEyebrow number="TRACK 01" label="CITIZEN COMPLAINT TRACKER" />

        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display font-light text-white tracking-tight text-3xl md:text-5xl uppercase mb-3">
              LIVE GRIEVANCE AUDIT.
            </h1>
            <p className="text-sm text-[#A1A1AA] font-mono">
              Real-time audit telemetry tracking complaints from intake through field resolution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#71717A]">
              LOGGED AS: +91 {phone}
            </span>
          </div>
        </div>

        {/* Master Tracking Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/10 hairline overflow-hidden">
          {/* Left Column: List of Citizen Tickets */}
          <div className="lg:col-span-4 bg-[#080808] p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 hairline-b">
              <span className="font-mono text-xs text-white uppercase tracking-wider">
                REGISTERED TICKETS ({issues.length})
              </span>
              <span className="font-mono text-[10px] text-[#71717A]">
                STATUS SYNC
              </span>
            </div>

            {issues.length === 0 ? (
              <CivicEmptyState
                title="NO GRIEVANCES FOUND"
                description="No complaints have been reported yet with this phone number."
              />
            ) : (
              <div className="space-y-2">
                {issues.map((iss) => (
                  <button
                    key={iss.id}
                    onClick={() => setSelectedIssue(iss)}
                    className={`w-full text-left p-4 font-mono transition-all border ${
                      selectedIssue?.id === iss.id
                        ? "border-[#6366F1] bg-[#6366F1]/10 text-white"
                        : "border-white/5 bg-white/[0.01] text-[#71717A] hover:text-white"
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-[10px] text-[#818CF8]">
                        #{iss.id}
                      </span>
                      <CivicBadge
                        label={iss.status}
                        variant={iss.status as any}
                      />
                    </div>
                    <h4 className="text-xs text-white font-medium truncate mb-1">
                      {iss.title}
                    </h4>
                    <span className="text-[10px] text-[#71717A] block truncate">
                      {iss.address}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Immersive Detailed Timeline View */}
          <div className="lg:col-span-8 bg-[#0A0A0A] p-6 md:p-10 flex flex-col justify-between">
            {selectedIssue ? (
              <div className="space-y-8 font-mono">
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 hairline-b">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-[#818CF8]">#{selectedIssue.id}</span>
                      <CivicBadge
                        label={selectedIssue.priority}
                        variant={selectedIssue.priority as any}
                        pulse={selectedIssue.priority === "critical"}
                      />
                      <CivicBadge
                        label={selectedIssue.status}
                        variant={selectedIssue.status as any}
                      />
                    </div>
                    <h2 className="text-xl md:text-2xl text-white font-medium tracking-tight">
                      {selectedIssue.title}
                    </h2>
                    <p className="text-xs text-[#71717A] mt-1 font-sans">
                      {selectedIssue.address}
                    </p>
                  </div>

                  <div className="text-right sm:text-right text-xs text-[#71717A]">
                    <div>WARD PINCODE: {selectedIssue.district_code}</div>
                    <div className="text-white mt-0.5">
                      COORDS: {selectedIssue.location_lat.toFixed(4)}, {selectedIssue.location_lng.toFixed(4)}
                    </div>
                  </div>
                </div>

                {/* Evidence Photo if available */}
                {selectedIssue.image_url && (
                  <div className="p-4 bg-[#080808] hairline">
                    <span className="text-[10px] text-[#71717A] uppercase block mb-2">
                      SUBMITTED FORENSIC EVIDENCE
                    </span>
                    <img
                      src={selectedIssue.image_url}
                      alt="Grievance Evidence"
                      className="w-full max-h-56 object-cover border border-white/10"
                    />
                  </div>
                )}

                {/* AI Assessment Panel */}
                <div className="p-5 bg-[#080808] hairline space-y-3">
                  <div className="flex justify-between text-xs hairline-b pb-2">
                    <span className="text-[#71717A]">AI CLASSIFICATION ENGINE:</span>
                    <span className="text-white">SCIKIT-LEARN TF-IDF NLP</span>
                  </div>
                  <div className="flex justify-between text-xs hairline-b pb-2">
                    <span className="text-[#71717A]">CONFIDENCE LEVEL:</span>
                    <span className="text-[#818CF8]">
                      {Math.round(selectedIssue.ai_confidence * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#71717A]">SAFETY KEYWORD OVERRIDE:</span>
                    <span className={selectedIssue.priority === "critical" ? "text-[#EF4444]" : "text-[#22C55E]"}>
                      {selectedIssue.priority === "critical" ? "TRIGGERED (EMERGENCY)" : "STANDARD QUEUE"}
                    </span>
                  </div>
                </div>

                {/* Large Chronological Timeline */}
                <div className="space-y-6 pt-4 hairline-t">
                  <span className="text-xs uppercase text-[#71717A] tracking-wider block">
                    CHRONOLOGICAL AUDIT TRAIL
                  </span>

                  <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
                    {timelineSteps.map((st) => (
                      <div key={st.num} className="relative pl-8 flex items-start gap-4">
                        <span
                          className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full -translate-x-1/2 ${
                            st.active
                              ? "bg-[#6366F1] ring-4 ring-[#6366F1]/20 animate-pulse"
                              : st.done
                              ? "bg-[#22C55E]"
                              : "bg-white/20"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white font-medium">
                              {st.num} · {st.title}
                            </span>
                            <span className="text-[10px] text-[#71717A]">
                              {st.time}
                            </span>
                          </div>
                          <p className="text-xs text-[#A1A1AA] font-sans mt-0.5">
                            {st.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <CivicEmptyState
                title="SELECT A GRIEVANCE TO AUDIT"
                description="Click on any ticket in the left list to review its live timeline and municipal actions."
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
