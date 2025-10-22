"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Login failed");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      router.push("/FRONT/dashboard");
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-indigo-700">
          🔑 Login
        </h1>

        {error && (
          <div className="text-sm text-red-600 bg-red-100 p-2 rounded-md text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
          value={form.email}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
          value={form.password}
        />

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold py-3 rounded-lg disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-gray-600 text-center">
          Don’t have an account?{" "}
          <a
            href="/FRONT/register"
            className="text-indigo-600 hover:underline font-medium"
          >
            Register here
          </a>
        </p>
      </form>
    </main>
  );
}
