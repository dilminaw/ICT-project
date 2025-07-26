// File: src/pages/RegisterPage.jsx
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Create Your Account</h2>

        <input type="text" placeholder="Full Name" className="w-full border border-gray-300 p-3 rounded mb-4" />
        <input type="email" placeholder="Email" className="w-full border border-gray-300 p-3 rounded mb-4" />
        <input type="tel" placeholder="Phone Number" className="w-full border border-gray-300 p-3 rounded mb-4" />
        <input type="password" placeholder="Password" className="w-full border border-gray-300 p-3 rounded mb-6" />

        <button className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 rounded transition">
          Register
        </button>
      </div>
    </div>
  );
}