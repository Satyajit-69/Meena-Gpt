import React, { useState } from "react";
import { Lock, User, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/useAuth.js";
import { useNavigate } from "react-router-dom";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");   // ⬅️ changed from username
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== cPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await register(name, email, password);  // ⬅️ email sent here

    if (res.success) navigate("/");
    else alert(res.message);
  };

  return (  
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-800 p-10 grid md:grid-cols-2 gap-10 items-center">
        
        <div className="flex justify-center items-center">
          <img
             src="signup.svg"
             alt="Register Illustration"
            className="w-[90%] rounded-2xl drop-shadow-2xl object-cover"
          />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>

          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-12 py-3 text-white"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-12 py-3 text-white"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-12 py-3 text-white"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={cPassword}
              onChange={(e) => setCPassword(e.target.value)}
              required
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-12 py-3 text-white"
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showConfirm ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-xs text-center text-slate-400">
            Already have an account?{" "}
            <a href="/login" className="text-blue-400 hover:underline">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
