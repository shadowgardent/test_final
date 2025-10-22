"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Failed to register");
        return;
      }

      setSuccess("✅ Registered successfully!");
      setTimeout(() => router.push("/FRONT/login"), 1000);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-emerald-700">
          📝 Register
        </h1>

        {error && (
          <div className="text-sm text-red-600 bg-red-100 p-2 rounded-md text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm text-green-700 bg-green-100 p-2 rounded-md text-center">
            {success}
          </div>
        )}

        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          required
          value={form.name}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          required
          value={form.email}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          required
          value={form.password}
        />

        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 transition text-white font-semibold py-3 rounded-lg disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <a
            href="/FRONT/login"
            className="text-emerald-600 hover:underline font-medium"
          >
            Login here
          </a>
        </p>
      </form>
    </main>
  );
}
