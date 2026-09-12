import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Camera, MapPin, FileText, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { useLanguage } from "@/contexts/LanguageContext";

import "leaflet/dist/leaflet.css";
// Fix missing marker icons in leaflet React
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const issueCategories = [
  { value: "waste", label: "Waste Management" },
  { value: "pothole", label: "Potholes / Road Damage" },
  { value: "lighting", label: "Street Lighting" },
  { value: "traffic", label: "Traffic Issues" },
  { value: "water", label: "Water Supply" },
  { value: "sewage", label: "Sewage / Drainage" },
  { value: "encroachment", label: "Encroachment" },
  { value: "other", label: "Other" },
];

import { useEffect, useRef } from "react";

const LeafletMap = ({
  lat,
  lng,
  onLocationChange,
}: {
  lat: number;
  lng: number;
  onLocationChange: (pos: { lat: number; lng: number }) => void;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerInstance = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([lat, lng], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapInstance.current);

      markerInstance.current = L.marker([lat, lng]).addTo(mapInstance.current);

      mapInstance.current.on("click", (e: L.LeafletMouseEvent) => {
        if (markerInstance.current) {
          markerInstance.current.setLatLng(e.latlng);
        }
        onLocationChange({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []); // Run once on mount

  return (
    <div ref={mapRef} style={{ height: "100%", width: "100%", zIndex: 0 }} />
  );
};

const ReportIssue = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    location: "",
    pincode: "",
    name: "",
    phone: "",
    aadhar: "",
    email: "",
    lat: 26.8467, // Default to UP
    lng: 80.9462,
  });
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { language } = useLanguage();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      toast({
        title: "Camera Access Denied",
        description:
          "Please allow camera permissions or use a device with a camera.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const base64String = canvas.toDataURL("image/jpeg", 0.8);
        setImageBase64(base64String);
        setImagePreview(base64String);
        stopCamera();
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageBase64(base64String);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleSendOtp = async () => {
    if (!formData.phone || formData.phone.length < 10) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    setIsSendingOtp(true);
    try {
      const response = await fetch("http://localhost:5000/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone }),
      });
      if (!response.ok) throw new Error("Failed to send OTP");
      setShowOtpInput(true);
      toast({
        title: "OTP Sent",
        description:
          "Please check your phone for the OTP (Refer to backend console for demo).",
      });
    } catch (err: unknown) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpValue || otpValue.length < 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return false;
    }
    setIsVerifyingOtp(true);
    try {
      const verifyRes = await fetch("http://localhost:5000/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone, otp: otpValue }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "Invalid OTP");

      setIsOtpVerified(true);
      return true;
    } catch (err: unknown) {
      toast({
        title: "Verification Failed",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
      return false;
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!showOtpInput) {
      await handleSendOtp();
      return;
    }

    if (!isOtpVerified) {
      const verified = await handleVerifyOtp();
      if (!verified) return; // Stop if OTP verification fails
    }

    setIsSubmitting(true);

    try {
      // 1. Get or create a basic user record for the reporter
      // (For now, since this form is public, we'll auto-generate a reporter_id if they aren't logged in,
      // but Supabase RLS policies might block this if not configured for public insert on users/issues.
      // We'll try to insert the issue directly assuming the public policy allows it or auth is bypassed for now.)

      // Get current auth session token
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 2. Submit to our Node.js backend to handle AI processing and DB insertion
      const response = await fetch("http://localhost:5000/api/issues", {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          pincode: formData.pincode,
          category: formData.category,
          image_data: imageBase64, // Send Base64 image
          location_lat: formData.lat,
          location_lng: formData.lng,
          name: formData.name,
          phone: formData.phone,
          aadhar: formData.aadhar,
        }),
      });

      if (!response.ok) {
        let errMsg = "Failed to submit issue to the server";
        try {
          const errData = await response.json();
          if (errData.error) errMsg = errData.error;
        } catch (e) {
          // Ignore json parse error
        }
        throw new Error(errMsg);
      }

      const result = await response.json();
      const issueRef = result.issue.id;

      toast({
        title: "Issue Reported Successfully!",
        description: `Your issue ID is #${issueRef}. You'll receive updates soon.`,
      });

      setStep(4); // Show success
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          title: "Submission Failed",
          description:
            err.message ||
            "Something went wrong while saving your report. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Submission Failed",
          description:
            "Something went wrong while saving your report. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <span className="badge-primary mb-4 inline-block">
            {t("report.title")}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t("report.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("report.subtitle")}
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="border-b border-border">
        <div className="container-custom py-6 px-4 md:px-8">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step > s
                      ? "bg-success text-success-foreground"
                      : step === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                <span
                  className={`hidden sm:inline font-medium ${
                    step >= s ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s === 1
                    ? t("report.step1")
                    : s === 2
                      ? t("report.step2")
                      : t("report.step3")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding">
        <div className="container-custom max-w-2xl">
          {step === 4 ? (
            // Success State
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Issue Reported Successfully!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your issue ID is{" "}
                <span className="font-semibold text-primary">
                  #CPI-2024-001234
                </span>
              </p>
              <p className="text-muted-foreground mb-8">
                You'll receive updates via SMS and email. Average resolution
                time: 4-5 days.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button className="btn-gradient" asChild>
                  <Link to="/">Back to Home</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep(1);
                    setFormData({
                      category: "",
                      title: "",
                      description: "",
                      location: "",
                      pincode: "",
                      name: "",
                      phone: "",
                      aadhar: "",
                      email: "",
                      lat: 26.8467,
                      lng: 80.9462,
                    });
                    setImageBase64(null);
                    setImagePreview(null);
                    setShowOtpInput(false);
                    setOtpValue("");
                    setIsOtpVerified(false);
                  }}
                >
                  Report Another Issue
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card-elevated p-6 md:p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold">{t("report.step1")}</h2>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Issue Category *</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring"
                      required
                    >
                      <option value="">Select a category</option>
                      {issueCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Large pothole near main market"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the issue in detail..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Take a Photo (Optional)</Label>

                    {isCameraActive ? (
                      <div className="relative rounded-lg overflow-hidden border border-border bg-black h-64 flex flex-col items-center justify-center">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-10">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={stopCamera}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            className="btn-gradient"
                            size="sm"
                            onClick={takePhoto}
                          >
                            Snap Photo
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="relative border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group"
                        onClick={startCamera}
                      >
                        {imagePreview ? (
                          <div className="flex flex-col items-center">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-h-32 rounded-md mb-2"
                            />
                            <p className="text-sm text-primary">
                              Tap to retake photo
                            </p>
                          </div>
                        ) : (
                          <>
                            <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-2 group-hover:text-primary transition-colors" />
                            <p className="text-muted-foreground text-sm">
                              Tap to open camera and take a photo
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Will request camera permissions
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    className="btn-gradient w-full"
                    onClick={() => setStep(2)}
                  >
                    {t("action.next")}
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold">{t("report.step2")}</h2>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Address / Landmark *</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., Near SBI Bank, MG Road"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="e.g., 273001"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Pin Location on Map *</Label>
                    <div className="h-[300px] rounded-lg overflow-hidden border border-border relative z-0">
                      <LeafletMap
                        lat={formData.lat}
                        lng={formData.lng}
                        onLocationChange={(pos) =>
                          setFormData((p) => ({
                            ...p,
                            lat: pos.lat,
                            lng: pos.lng,
                          }))
                        }
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Click on the map to drop a pin at the exact issue
                      location.
                    </p>
                  </div>

                  <div className="p-4 bg-muted rounded-lg z-10 relative">
                    <p className="text-sm text-muted-foreground">
                      <strong>Tip:</strong> Accurate location helps authorities
                      find and fix the issue faster.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep(1)}
                    >
                      {t("action.back")}
                    </Button>
                    <Button
                      type="button"
                      className="btn-gradient flex-1"
                      onClick={() => setStep(3)}
                    >
                      {t("action.next")}
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Send className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold">{t("report.step3")}</h2>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      disabled={showOtpInput}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadhar">Aadhar Number *</Label>
                    <Input
                      id="aadhar"
                      name="aadhar"
                      type="text"
                      value={formData.aadhar}
                      onChange={handleChange}
                      placeholder="e.g., 1234 5678 9012"
                      pattern="[0-9]{12}|\d{4}\s\d{4}\s\d{4}"
                      title="Please enter a valid 12-digit Aadhar number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm text-foreground">
                      By submitting, you agree to our Terms of Service and
                      Privacy Policy. Your information will only be used to
                      track and update you on this issue.
                    </p>
                  </div>

                  {showOtpInput && (
                    <div className="space-y-2 p-4 bg-muted/50 rounded-lg border border-border animate-fade-in relative mt-4">
                      <Label htmlFor="otp">Enter 6-Digit OTP *</Label>
                      <Input
                        id="otp"
                        type="text"
                        maxLength={6}
                        value={otpValue}
                        onChange={(e) =>
                          setOtpValue(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="123456"
                        required
                        className="tracking-[0.5em] text-center text-lg font-bold w-full max-w-[200px]"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Sent to {formData.phone}.{" "}
                        <button
                          type="button"
                          onClick={() => setShowOtpInput(false)}
                          className="text-primary hover:underline"
                        >
                          Change number
                        </button>
                      </p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep(2)}
                    >
                      {t("action.back")}
                    </Button>
                    <Button
                      type="submit"
                      className="btn-gradient flex-1"
                      disabled={isSubmitting || isSendingOtp || isVerifyingOtp}
                    >
                      {isSubmitting || isVerifyingOtp || isSendingOtp
                        ? "Processing..."
                        : showOtpInput
                          ? "Verify OTP & Submit"
                          : "Send OTP to Submit"}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ReportIssue;
