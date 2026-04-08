import { useNavigate } from 'react-router-dom';

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-gradient-to-b from-purple-50 via-white to-white">
      {/* Cat icon */}
      <div className="text-7xl mb-6">&#128049;</div>

      {/* Headline */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center leading-tight mb-4">
        Kham pha ban than
        <br />
        <span className="text-purple-600">qua Coi Giua</span>
      </h1>

      {/* Subtext */}
      <p className="text-lg text-gray-500 text-center mb-10 max-w-md">
        24 cau hoi &middot; 7 giong meo &middot; 1 lo trinh rieng cho ban
      </p>

      {/* CTA */}
      <button
        onClick={() => navigate('/input')}
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg px-10 py-4 rounded-full shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 transition-all active:scale-95 cursor-pointer"
      >
        Bat dau hanh trinh &rarr;
      </button>

      {/* Footer note */}
      <p className="mt-12 text-sm text-gray-400">
        GenPath &mdash; Tim duong di, theo cach cua ban
      </p>
    </div>
  );
}
