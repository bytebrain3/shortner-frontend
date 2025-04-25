"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance"
import { ArrowRight, Link as LinkIcon, Play, Pause } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [activeTab, setActiveTab] = useState("login");

  const login = async ({ email, username, password }) => {
    try {
      const res = await axiosInstance.post("/login", {
        email,
        username,
        password,
      });

      console.log("Login successful:", res.data);
      return res.data;
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed");
      return {
        message: "Login failed",
        error: err,
      };
    }
  };

  const signup = async ({ email, username, password }) => {
    try {
      const res = await axiosInstance.post("/signup", {
        email,
        username,
        password,
      });

      console.log("Signup successful:", res.data);
      alert("Signup successful!");
      return res.data;
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed");
      return {
        message: "Signup failed",
        error: err,
      };
    }
  };

  const toggleVideo = () => {
    const video = document.getElementById("background-video");
    if (video && video.paused) {
      video.play();
      setIsVideoPlaying(true);
    } else if (video) {
      video.pause();
      setIsVideoPlaying(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-black/20 z-0">
        <video
          id="background-video"
          autoPlay
          muted
          loop
          playsInline
          className="absolute min-w-full min-h-full object-cover"
        >
          <source src="video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        {/* Video Controls */}
        <button
          onClick={toggleVideo}
          className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md p-3 rounded-full z-10 text-white hover:bg-white/20 transition-colors"
          aria-label={
            isVideoPlaying ? "Pause background video" : "Play background video"
          }
        >
          {isVideoPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="mb-6 inline-flex items-center justify-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
            <LinkIcon className="mr-2 h-4 w-4" />
            <span>URL Shortener • Simple • Fast • Secure</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-md">
            Transform Long URLs into{" "}
            <span className="text-primary">Short Links</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-white/80">
            Create shortened URLs that are easy to share, remember, and track
            with detailed analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4 py-4">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const email = formData.get("email");
                        const username = formData.get("username");
                        const password = formData.get("password");

                        await login({ email, username, password });
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle>Login to your account</DialogTitle>
                        <DialogDescription>
                          Enter your credentials to access your shortened URLs
                          and analytics.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            placeholder="email"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            placeholder="username"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password">Password</Label>
                          <Input
                            id="login-password"
                            name="password"
                            type="password"
                            required
                          />
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <a href="#" className="text-primary hover:underline">
                            Forgot password?
                          </a>
                        </div>
                      </div>
                      <DialogFooter className="pt-4">
                        <Button type="submit" className="w-full">
                          Login
                        </Button>
                      </DialogFooter>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4 py-4">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const email = formData.get("email");
                        const username = formData.get("username");
                        const password = formData.get("password");
                        const confirmPassword = formData.get("confirmPassword");

                        if (password !== confirmPassword) {
                          alert("Passwords do not match");
                          return;
                        }

                        await signup({ email, username, password });
                      }}
                    >
                      <DialogHeader>
                        <DialogTitle>Create an account</DialogTitle>
                        <DialogDescription>
                          Sign up to start creating and managing shortened URLs.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-username">Username</Label>
                          <Input
                            id="signup-username"
                            name="username"
                            placeholder="yourname"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <Input
                            id="signup-email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <Input
                            id="signup-password"
                            name="password"
                            type="password"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="signup-confirm">
                            Confirm Password
                          </Label>
                          <Input
                            id="signup-confirm"
                            name="confirmPassword"
                            type="password"
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter className="pt-4">
                        <Button type="submit" className="w-full">
                          Create Account
                        </Button>
                      </DialogFooter>
                    </form>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center justify-center gap-8 text-white/70">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white">10M+</span>
              <span className="text-sm">Links Created</span>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white">5M+</span>
              <span className="text-sm">Monthly Clicks</span>
            </div>
            <div className="h-12 w-px bg-white/20"></div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-white">100K+</span>
              <span className="text-sm">Happy Users</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
