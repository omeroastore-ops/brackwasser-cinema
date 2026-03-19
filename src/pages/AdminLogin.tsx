import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Login fehlgeschlagen.");
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-[420px] rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-black uppercase mb-6">Admin Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-white/70">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-white/70">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none"
              required
            />
          </div>

          {message && (
            <div className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-sm">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-white text-black font-bold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;