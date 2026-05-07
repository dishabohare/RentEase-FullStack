import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage({ mode = "login" }: { mode?: "login" | "signup" }) {
  const [role, setRole] = useState<"tenant" | "owner">("tenant");
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ── Login form state ───────────────────────────────────────────────────────
  const [loginEmail, setLoginEmail]       = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // ── Signup form state ──────────────────────────────────────────────────────
  const [signupName, setSignupName]         = useState("");
  const [signupEmail, setSignupEmail]       = useState("");
  const [signupPhone, setSignupPhone]       = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const { login, register } = useAuth();
  const navigate = useNavigate();

  // ── Redirect helper ────────────────────────────────────────────────────────
  const redirectByRole = (userRole: string) => {
    if (userRole === "OWNER")  navigate("/owner-dashboard");
    else if (userRole === "ADMIN") navigate("/admin");
    else navigate("/tenant-dashboard");
  };

  // ── Login submit ───────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(loginEmail, loginPassword);
      redirectByRole(user.role);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Signup submit ──────────────────────────────────────────────────────────
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await register(
        signupName,
        signupEmail,
        signupPassword,
        role.toUpperCase(),
        signupPhone || undefined
      );
      redirectByRole(user.role);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-hero">
              <Home className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login"
                ? "Sign in to your RentEase account"
                : "Join RentEase — it's free and takes a minute"}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-elevated">
            {/* Role selection */}
            <div className="mb-6">
              <Label className="text-xs text-muted-foreground mb-2 block">I am a</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["tenant", "owner"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                      role === r
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {r === "tenant" ? "🏠 Tenant" : "🔑 Property Owner"}
                  </button>
                ))}
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Tabs defaultValue={mode} className="w-full">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="login" className="flex-1" asChild>
                  <Link to="/login">Login</Link>
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex-1" asChild>
                  <Link to="/signup">Sign Up</Link>
                </TabsTrigger>
              </TabsList>

              {/* ── LOGIN TAB ── */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label>Password</Label>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type={showPw ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-hero hover:opacity-90 h-11"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              {/* ── SIGNUP TAB ── */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Your full name"
                        className="pl-10"
                        required
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        required
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="+91 99999 99999"
                        className="pl-10"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type={showPw ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        required
                        minLength={6}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-hero hover:opacity-90 h-11"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
