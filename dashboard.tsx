import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 bg-white p-6">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <hr className="mb-6 border-gray-300" />
        <p>Dashboard content goes here.</p>
      </main>
    </div>
  );
}