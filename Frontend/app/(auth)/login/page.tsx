import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold gradient-text tracking-tight">NEXUS</h1>
          <p className="mt-1 text-sm text-white/40">Multimodal RAG — your private search engine</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">Sign in to your account</h2>
          <LoginForm />
          <p className="mt-5 text-center text-sm text-white/40">
            No account?{" "}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 transition-colors">
              Register
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <p className="mt-4 text-center text-xs text-white/25 font-mono">
          Demo admin: admin@nexus.local / changeme123
        </p>
      </div>
    </div>
  );
}
