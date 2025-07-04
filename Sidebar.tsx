import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-6">
      <h2 className="text-xl font-semibold mb-6">ScientiFlow</h2>
      <ul className="space-y-4">
        <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
        <li><Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link></li>
        <li><Link href="/datasets" className="hover:text-gray-300">Datasets</Link></li>
        <li><span className="text-gray-400">Reports</span></li>
        <li><span className="text-gray-400">Settings</span></li>
      </ul>
    </div>
  );
};

export default Sidebar;