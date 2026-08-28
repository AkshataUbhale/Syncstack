import { Button } from "@heroui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";
import {
  CloudUpload,
  Shield,
  Folder,
  Image as ImageIcon,
  ArrowRight,
  Zap,
  Star,
  Trash2,
  Lock,
  Sparkles,
  Layers,
  CheckCircle2,
  Globe2,
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const { userId } = await auth();

  const features = [
    {
      icon: CloudUpload,
      title: "Lightning Uploads",
      desc: "Drag, drop, and upload images with instant client-side validation and optimized buffer streaming.",
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: Folder,
      title: "Hierarchical Folders",
      desc: "Organize media with infinite nested directories, instant breadcrumbs tracking, and folder navigation.",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      icon: Zap,
      title: "Real-Time CDN Delivery",
      desc: "Global edge network transformations and high-performance delivery powered by ImageKit.",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      icon: Star,
      title: "Quick Star Bookmarks",
      desc: "Pin favorite assets with one-click starring and filter high-priority media in seconds.",
      color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    },
    {
      icon: Trash2,
      title: "Safe Two-Tier Trash",
      desc: "Soft-delete to a safety trash bin with restore capabilities, or permanently purge files anytime.",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
    {
      icon: Lock,
      title: "Enterprise Token Security",
      desc: "Private user-isolated storage buckets with encrypted token authentication and route middleware.",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Drop & Upload",
      desc: "Select or drag any image into the interactive upload dropzone.",
    },
    {
      step: "02",
      title: "Edge Storage & CDN",
      desc: "Assets are securely encrypted and cached across global cloud CDN nodes.",
    },
    {
      step: "03",
      title: "Organize & Share",
      desc: "Preview in high-res, copy direct CDN links, or organize into custom folders.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-primary/30 selection:text-white">
      {/* Sticky Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 px-4 md:px-6">
          {/* Radial Glow Backgrounds */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-medium text-zinc-300 shadow-md">
                <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                <span>Next-Gen Cloud Media Storage</span>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span className="text-primary font-semibold">Fast & Free</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-100 leading-[1.15]">
                Store, organize, and stream your{" "}
                <span className="gradient-text-blue">images at scale</span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Syncstack combines enterprise-grade authentication, serverless PostgreSQL storage, and global CDN delivery to give you an ultra-fast private cloud workspace.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                {!userId ? (
                  <>
                    <Link href="/sign-up">
                      <Button
                        size="lg"
                        color="primary"
                        variant="solid"
                        endContent={<ArrowRight className="h-4 w-4" />}
                        className="font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all px-8"
                      >
                        Get Started Free
                      </Button>
                    </Link>
                    <Link href="/sign-in">
                      <Button
                        size="lg"
                        variant="bordered"
                        className="border-zinc-700 text-zinc-200 hover:bg-zinc-900 font-medium px-8"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      color="primary"
                      variant="solid"
                      endContent={<ArrowRight className="h-4 w-4" />}
                      className="font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all px-8"
                    >
                      Go to Your Dashboard
                    </Button>
                  </Link>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 flex items-center justify-center gap-6 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success" /> End-to-End Encrypted
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success" /> Real-Time CDN
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-success" /> No Credit Card Required
                </span>
              </div>
            </div>

            {/* Interactive Preview Mockup Card */}
            <div className="mt-14 relative max-w-4xl mx-auto">
              <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/70 backdrop-blur-2xl shadow-2xl p-4 sm:p-6 transition-all hover:border-zinc-700/80">
                {/* Window Header */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded-md border border-zinc-800">
                    syncstack.app/dashboard
                  </div>
                  <div className="w-12" />
                </div>

                {/* Simulated Explorer Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-5">
                  <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800 text-left flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Folder className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-200 truncate">Designs</p>
                      <p className="text-[10px] text-zinc-500">Folder</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800 text-left flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                      <Folder className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-200 truncate">Screenshots</p>
                      <p className="text-[10px] text-zinc-500">Folder</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800 text-left flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-200 truncate">hero-banner.png</p>
                      <p className="text-[10px] text-zinc-500">1.4 MB • CDN</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800 text-left flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-yellow-400">
                      <Star className="h-5 w-5" fill="currentColor" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-200 truncate">logo-dark.webp</p>
                      <p className="text-[10px] text-zinc-500">Starred</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 md:px-6 bg-zinc-900/30 border-y border-zinc-800/60">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                <Layers className="h-3.5 w-3.5" />
                <span>Feature Suite</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
                Engineered for Speed & Simplicity
              </h2>
              <p className="text-sm sm:text-base text-zinc-400">
                Everything you need to store, organize, and access your media in one powerful cloud workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <Card
                    key={idx}
                    className="border border-zinc-800/80 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-300 shadow-md p-2"
                  >
                    <CardBody className="p-6 space-y-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feat.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-zinc-100">
                        {feat.title}
                      </h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {feat.desc}
                      </p>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-20 px-4 md:px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
                How Syncstack Works
              </h2>
              <p className="text-sm sm:text-base text-zinc-400">
                A seamless 3-step pipeline designed for frictionless media storage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((item, idx) => (
                <div
                  key={idx}
                  className="relative p-6 rounded-3xl border border-zinc-800/80 bg-zinc-900/40 text-left space-y-3"
                >
                  <div className="text-3xl font-black font-mono text-primary/40">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-20 px-4 md:px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-8 sm:p-12 text-center shadow-2xl space-y-6">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight relative z-10">
                Ready to take control of your media?
              </h2>
              <p className="text-zinc-400 max-w-lg mx-auto text-sm sm:text-base relative z-10">
                Join Syncstack today. Free cloud storage with instant CDN access and zero configuration required.
              </p>
              <div className="pt-2 relative z-10 flex justify-center">
                {!userId ? (
                  <Link href="/sign-up">
                    <Button
                      size="lg"
                      color="primary"
                      variant="solid"
                      endContent={<ArrowRight className="h-4 w-4" />}
                      className="font-medium shadow-lg shadow-primary/25 px-8"
                    >
                      Get Started Now
                    </Button>
                  </Link>
                ) : (
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      color="primary"
                      variant="solid"
                      endContent={<ArrowRight className="h-4 w-4" />}
                      className="font-medium shadow-lg shadow-primary/25 px-8"
                    >
                      Open Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-lg bg-primary/10 text-primary">
              <CloudUpload className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm text-zinc-200">Syncstack</span>
            <span className="text-zinc-600">|</span>
            <span>Cloud Media Storage</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </span>
            <span className="text-zinc-600">•</span>
            <p>&copy; {new Date().getFullYear()} Syncstack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
