import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import {
  Phone,
  CheckCircle,
  Clock,
  Send,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface Issue {
  id: string;
  title: string;
  address: string;
  status: string;
  created_at: string;
  ai_category: string;
}

export default function TrackIssues() {
  const { toast } = useToast();
  const { t } = useLanguage();

  // Auth State
  const [citizenPhone, setCitizenPhone] = useState<string | null>(
    localStorage.getItem("citizen_phone"),
  );

  // Login Flow State
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Dashboard Data State
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserIssues = async (phone: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/issues/citizen/${encodeURIComponent(phone)}`,
        );
        if (!response.ok) throw new Error("Failed to fetch issues");
        const data = await response.json();
        setIssues(data);
      } catch (err: unknown) {
        console.error(err);
        toast({
          title: "Error Loading Tracking Data",
          description: err instanceof Error ? err.message : String(err),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (citizenPhone) {
      fetchUserIssues(citizenPhone);
    }
  }, [citizenPhone, toast]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
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
        body: JSON.stringify({ phone: phoneNumber }),
      });
      if (!response.ok) throw new Error("Failed to send OTP");
      setShowOtpInput(true);
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code.",
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

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpValue || otpValue.length < 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      return;
    }
    setIsVerifyingOtp(true);
    try {
      const verifyRes = await fetch("http://localhost:5000/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber, otp: otpValue }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || "Invalid OTP");

      // Successfully authenticated
      localStorage.setItem("citizen_phone", phoneNumber);
      setCitizenPhone(phoneNumber);
      toast({
        title: "Verified",
        description: "Successfully logged into your profile.",
      });
    } catch (err: unknown) {
      toast({
        title: "Verification Failed",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("citizen_phone");
    setCitizenPhone(null);
    setPhoneNumber("");
    setOtpValue("");
    setShowOtpInput(false);
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase().replace("_", " ");
    switch (s) {
      case "resolved":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </span>
        );
      case "in progress":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Clock className="w-3.5 h-3.5" /> In Progress
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <Layout>
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <span className="badge-primary mb-4 inline-block">
            Citizen Dashboard
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Track Your Issues
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Log in with your phone number to check the live status of the civic
            issues you have reported.
          </p>
        </div>
      </section>

      <section className="section-padding min-h-[50vh]">
        <div className="container-custom max-w-3xl">
          {!citizenPhone ? (
            // Login Block
            <div className="card-elevated p-6 md:p-8 max-w-md mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Phone className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">Secure Access</h2>
              </div>

              {!showOtpInput ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full btn-gradient"
                    disabled={isSendingOtp}
                  >
                    {isSendingOtp ? "Sending..." : "Send OTP"}
                  </Button>
                </form>
              ) : (
                <form
                  onSubmit={handleVerifyOtp}
                  className="space-y-4 animate-fade-in"
                >
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter 6-Digit OTP</Label>
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
                      className="tracking-[0.5em] text-center text-lg font-bold"
                    />
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Sent to {phoneNumber}.{" "}
                      <button
                        type="button"
                        onClick={() => setShowOtpInput(false)}
                        className="text-primary hover:underline"
                      >
                        Change number
                      </button>
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full btn-gradient"
                    disabled={isVerifyingOtp}
                  >
                    {isVerifyingOtp ? "Verifying..." : "Verify & Login"}
                  </Button>
                </form>
              )}
            </div>
          ) : (
            // Profile Dashboard Block
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 pb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" /> Profile:{" "}
                    <span className="tracking-wide text-muted-foreground">
                      {citizenPhone}
                    </span>
                  </h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Your Reported Issues</h3>

                {isLoading ? (
                  <div className="py-12 text-center text-muted-foreground">
                    Loading your reports...
                  </div>
                ) : issues.length === 0 ? (
                  <div className="card-elevated p-8 text-center bg-muted/20">
                    <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      No issues found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't reported any civic issues with this phone
                      number yet.
                    </p>
                    <Button asChild className="btn-gradient">
                      <Link to="/report-issue">Report an Issue Now</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {issues.map((issue) => (
                      <div
                        key={issue.id}
                        className="card-elevated p-5 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">
                              Issue ID: {issue.id.substring(0, 8).toUpperCase()}
                              ...
                            </div>
                            <h4 className="font-bold text-lg text-foreground">
                              {issue.title}
                            </h4>
                          </div>
                          <div>{getStatusBadge(issue.status || "open")}</div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground bg-background rounded-md p-3 border border-border/30">
                          <div>
                            <span className="block text-xs uppercase tracking-wider opacity-70 mb-0.5">
                              Category
                            </span>
                            <span className="capitalize">
                              {issue.ai_category || "Unclassified"}
                            </span>
                          </div>
                          <div>
                            <span className="block text-xs uppercase tracking-wider opacity-70 mb-0.5">
                              Date Reported
                            </span>
                            <span>
                              {new Date(issue.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="sm:col-span-2 mt-2 pt-2 border-t border-border/30">
                            <span className="block text-xs uppercase tracking-wider opacity-70 mb-0.5">
                              Address
                            </span>
                            <span>{issue.address}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
