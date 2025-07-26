export default function AccountPage() {
  return (
    <div className="min-h-screen p-8 bg-white">
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
      <div className="bg-gray-100 p-4 rounded mb-4">👤 Profile</div>
      <div className="bg-gray-100 p-4 rounded mb-4">⚙️ Settings</div>
      <button className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
}