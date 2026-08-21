"use client";

import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { type JSX, type SVGProps, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";
import type { JwtPayload } from "@supabase/supabase-js";

export default function Auth({ authType }: { authType: string }) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  // I added this
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [claims, setClaims] = useState<JwtPayload | null>(null);
  const [, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { signUpUser, signInUser, signOut } = UserAuth();

  const handleLogin = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await signInUser(email, password);

      if (result.sucesses) {
        navigate("/dashboard");
        setEmail("");
        setPassword("");
        return;
      }

      setError("Invalid email or password");
    } catch (err) {
      console.error(err);
      setError("Error logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await signUpUser(email, password);

      if (result.sucesses) {
        setEmail("");
        setPassword("");
        navigate("/dashboard");
      } else {
        console.error(result.error);
      }
    } catch (err) {
      console.error(err);
      setError("Error signing up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getClaims().then(({ data }) => {
      if (data && data.claims) {
        setClaims(data.claims);
      } else {
        setClaims(null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      supabase.auth.getClaims().then(({ data }) => {
        if (data && data.claims) {
          setClaims(data.claims);
        }
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setEmail("");
    setPassword("");
    setLoading(true);
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    setClaims(null);
  };

  if (claims) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <h1>Welcome!</h1>
        <div className="mt-2">
          <Button onClick={() => navigate("/dashboard")}>Dashboard</Button>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="mx-auto w-full max-w-xs space-y-6">
        <div className="space-y-2 text-center">
          <Logo className="mx-auto h-16 w-16" />
          <h1 className="text-balance font-semibold text-3xl">
            {" "}
            {authType === "signin" ? "Welcome back" : "Welcome"}
          </h1>
          <p className="text-pretty text-muted-foreground">
            {authType === "signin"
              ? "Sign into your account"
              : "Sign up for an account"}
          </p>
        </div>

        <form
          onSubmit={authType === "signin" ? handleLogin : handleSignUp}
          className="space-y-4"
        >
          <Button
            className="w-full justify-center gap-2 hover:cursor-pointer"
            variant="outline"
          >
            <GoogleIcon className="h-4 w-4" />
            {authType === "signin"
              ? "Sign in with Google"
              : "Sign up with Google"}
          </Button>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-muted-foreground text-sm">
              {authType === "signin"
                ? "or sign in with email"
                : "or sign up with email"}
            </span>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-2.5">
                <Input
                  className="peer ps-9"
                  id="email"
                  placeholder="email@chronos.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  <Mail
                    aria-hidden="true"
                    size={16}
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a className="text-primary text-sm hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative mt-2.5">
                <Input
                  className="ps-9 pe-9"
                  id="password"
                  placeholder="Enter your password"
                  type={isVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  <Lock
                    aria-hidden="true"
                    size={16}
                  />
                </div>
                <button
                  aria-controls="password"
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  aria-pressed={isVisible}
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={toggleVisibility}
                  type="button"
                >
                  {isVisible ? (
                    <EyeOff
                      aria-hidden="true"
                      size={16}
                    />
                  ) : (
                    <Eye
                      aria-hidden="true"
                      size={16}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          <Button
            className="w-full hover:cursor-pointer"
            disabled={loading}
            type="submit"
          >
            {authType === "signin" ? "Sign in" : "Sign up"}
            <ArrowRight className="h-4 w-4 relative top-[1px]" />
          </Button>

          {authType === "signin" ? (
            <div className="text-center text-sm">
              No account?{" "}
              <a
                className="font-medium text-primary hover:underline hover:cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Create an account
              </a>
            </div>
          ) : authType === "signup" ? (
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a
                className="font-medium text-primary hover:underline hover:cursor-pointer"
                onClick={() => navigate("/signin")}
              >
                Sign in
              </a>
            </div>
          ) : null}
        </form>

        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
}

const GoogleIcon = (
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
  </svg>
);

const Logo = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg
    fill="currentColor"
    height="48"
    viewBox="0 0 40 48"
    width="40"
    {...props}
  >
    <clipPath id="a">
      <path d="m0 0h40v48h-40z" />
    </clipPath>
    <g clipPath="url(#a)">
      <path d="m25.0887 5.05386-3.933-1.05386-3.3145 12.3696-2.9923-11.16736-3.9331 1.05386 3.233 12.0655-8.05262-8.0526-2.87919 2.8792 8.83271 8.8328-10.99975-2.9474-1.05385625 3.933 12.01860625 3.2204c-.1376-.5935-.2104-1.2119-.2104-1.8473 0-4.4976 3.646-8.1436 8.1437-8.1436 4.4976 0 8.1436 3.646 8.1436 8.1436 0 .6313-.0719 1.2459-.2078 1.8359l10.9227 2.9267 1.0538-3.933-12.0664-3.2332 11.0005-2.9476-1.0539-3.933-12.0659 3.233 8.0526-8.0526-2.8792-2.87916-8.7102 8.71026z" />
      <path d="m27.8723 26.2214c-.3372 1.4256-1.0491 2.7063-2.0259 3.7324l7.913 7.9131 2.8792-2.8792z" />
      <path d="m25.7665 30.0366c-.9886 1.0097-2.2379 1.7632-3.6389 2.1515l2.8794 10.746 3.933-1.0539z" />
      <path d="m21.9807 32.2274c-.65.1671-1.3313.2559-2.0334.2559-.7522 0-1.4806-.102-2.1721-.2929l-2.882 10.7558 3.933 1.0538z" />
      <path d="m17.6361 32.1507c-1.3796-.4076-2.6067-1.1707-3.5751-2.1833l-7.9325 7.9325 2.87919 2.8792z" />
      <path d="m13.9956 29.8973c-.9518-1.019-1.6451-2.2826-1.9751-3.6862l-10.95836 2.9363 1.05385 3.933z" />
    </g>
  </svg>
);
