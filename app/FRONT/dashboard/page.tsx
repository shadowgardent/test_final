"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiDeleteUser, apiUpdateUser } from "@/app/lib/api";

type StoredUser = {
  _id: string;
  name?: string;
  email?: string;
};

type Status = { type: "success" | "error" | "info"; message: string } | null;

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userInfo =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (!token || !userInfo) {
      router.replace("/FRONT/login");
      setIsChecking(false);
      return;
    }

    try {
      const parsed: StoredUser = JSON.parse(userInfo);
      if (!parsed || !parsed._id) {
        throw new Error("Missing user id");
      }
      setUser(parsed);
      setForm({
        name: parsed.name || "",
        email: parsed.email || "",
        password: "",
      });
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      localStorage.removeItem("user");
      router.replace("/FRONT/login");
    } finally {
      setIsChecking(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/FRONT/login");
  };

  const toggleEdit = () => {
    if (!user) return;
    setStatus(null);
    setIsEditing((prev) => !prev);
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const payload: Record<string, string> = {};
    const nextName = form.name.trim();
    const nextEmail = form.email.trim();

    if (nextName && nextName !== (user.name || "")) {
      payload.name = nextName;
    }
    if (nextEmail && nextEmail !== (user.email || "")) {
      payload.email = nextEmail;
    }
    if (form.password.trim()) {
      payload.password = form.password.trim();
    }

    if (Object.keys(payload).length === 0) {
      setStatus({ type: "info", message: "No changes to update." });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);
    try {
      const response = await apiUpdateUser(user._id, payload);
      const updatedUser = response.user as StoredUser;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setForm({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        password: "",
      });
      setStatus({ type: "success", message: "Profile updated successfully." });
      setIsEditing(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile.";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!user || isDeleting) return;
    const confirmed = window.confirm(
      "Delete your account? This cannot be undone."
    );
    if (!confirmed) return;

    setStatus(null);
    setIsDeleting(true);
    try {
      await apiDeleteUser(user._id);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setStatus({ type: "success", message: "Account deleted successfully." });
      setTimeout(() => {
        setIsDeleting(false);
        router.replace("/");
      }, 800);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete account.";
      setStatus({ type: "error", message });
      setIsDeleting(false);
    }
  };

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500">
        <span className="text-white text-lg font-medium">Loading...</span>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-4">
      <section className="w-full max-w-xl space-y-6 rounded-3xl bg-white/90 p-10 text-center shadow-2xl backdrop-blur-md">
        <h1 className="text-4xl font-bold text-indigo-700">
          Welcome back, {user.name ?? "friend"}
        </h1>
        <p className="text-lg text-gray-700">
          Keep your details up to date below.
        </p>
        <p className="text-base text-gray-600">
          Email: {user.email || "Not provided"}
        </p>

        {status && (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              status.type === "success"
                ? "bg-green-100 text-green-700"
                : status.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {status.message}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={toggleEdit}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            {isEditing ? "Cancel" : "Edit info"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete account"}
          </button>
        </div>

        {isEditing && (
          <form
            onSubmit={handleUpdate}
            className="space-y-4 rounded-2xl bg-white/80 p-6 text-left shadow-inner"
          >
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                readOnly
                className="w-full rounded-lg border border-gray-300 p-3 bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                New password (optional)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Leave blank to keep current password"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 w-full rounded-xl bg-gray-200 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
        >
          Log out
        </button>
      </section>
    </main>
  );
}
