// app/page.tsx หรือ pages/index.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white">
        <h1 className="text-2xl font-bold text-blue-600">MyApp</h1>
        <div className="space-x-6">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-600">
            About
          </Link>
          <Link href="/FRONT/login" className="hover:text-blue-600">
            Login
          </Link>
          <Link
            href="/FRONT/register"
            className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center bg-gradient-to-r from-blue-100 to-purple-100">
        <h2 className="text-4xl font-bold mb-4">Welcome to RaiRang</h2>
        <p className="text-lg mb-6">
          Your simple and modern web application starter
        </p>
        <div className="space-x-4">
          <Link
            href="/FRONT/login"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            href="/FRONT/register"
            className="border border-blue-600 text-blue-600 px-5 py-2 rounded-lg hover:bg-blue-50"
          >
            Register
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-8 grid md:grid-cols-3 gap-6">
        <div className="p-6 shadow-lg rounded-xl bg-white hover:shadow-xl">
          <h3 className="text-xl font-semibold mb-2">Fast</h3>
          <p className="text-gray-600">
            Experience blazing fast performance with Next.js.
          </p>
        </div>
        <div className="p-6 shadow-lg rounded-xl bg-white hover:shadow-xl">
          <h3 className="text-xl font-semibold mb-2">Secure</h3>
          <p className="text-gray-600">
            Login & Register system secured with modern standards.
          </p>
        </div>
        <div className="p-6 shadow-lg rounded-xl bg-white hover:shadow-xl">
          <h3 className="text-xl font-semibold mb-2">Scalable</h3>
          <p className="text-gray-600">
            Easily extend and scale your project in the future.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 bg-gray-100">
        <p className="text-gray-600">© 2025 MyApp. All rights reserved.</p>
      </footer>
    </div>
  );
}
