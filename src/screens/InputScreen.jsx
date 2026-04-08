import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/gameStore';

const MAJORS = ['Marketing', 'CNTT', 'Kinh te', 'Thiet ke', 'Y duoc', 'Luat', 'Khac'];
const YEARS = [
  { value: 1, label: 'Nam 1' },
  { value: 2, label: 'Nam 2' },
  { value: 3, label: 'Nam 3' },
  { value: 4, label: 'Nam 4' },
  { value: 5, label: 'Da ra truong' },
];
const GRAD_YEARS = ['2025', '2026', '2027', '2028+'];

export default function InputScreen() {
  const navigate = useNavigate();
  const setUserContext = useGameStore((s) => s.setUserContext);

  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [currentYear, setCurrentYear] = useState(null);
  const [gradYear, setGradYear] = useState('');
  const [errors, setErrors] = useState({});

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};
    if (!name.trim()) newErrors.name = true;
    if (!major) newErrors.major = true;
    if (!currentYear) newErrors.currentYear = true;
    if (!gradYear) newErrors.gradYear = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setUserContext({
      name: name.trim(),
      major,
      current_year: currentYear <= 4 ? currentYear : null,
      graduation_year: gradYear === '2028+' ? 2028 : parseInt(gradYear, 10),
    });

    navigate('/quiz');
  }

  const fieldClass = (key) =>
    `w-full px-4 py-3 rounded-xl border-2 text-base transition-colors outline-none ${
      errors[key]
        ? 'border-red-400 bg-red-50'
        : 'border-gray-200 bg-white focus:border-purple-400'
    }`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-purple-50 via-white to-white">
      {/* Header */}
      <div className="text-4xl mb-4">&#9997;&#65039;</div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-2">
        Truoc khi bat dau...
      </h1>
      <p className="text-gray-500 text-center mb-8 max-w-sm">
        Cho minh biet them ve ban nhe!
      </p>

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-3xl shadow-lg shadow-purple-100 border border-gray-100 p-8 space-y-6"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Ten cua ban
          </label>
          <input
            type="text"
            placeholder="VD: Minh Anh"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: false })); }}
            className={fieldClass('name')}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">Vui long nhap ten</p>}
        </div>

        {/* Major */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Nganh hoc
          </label>
          <select
            value={major}
            onChange={(e) => { setMajor(e.target.value); setErrors((p) => ({ ...p, major: false })); }}
            className={fieldClass('major')}
          >
            <option value="">-- Chon nganh --</option>
            {MAJORS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {errors.major && <p className="text-xs text-red-500 mt-1">Vui long chon nganh hoc</p>}
        </div>

        {/* Current Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ban dang o nam may?
          </label>
          <div className="flex flex-wrap gap-2">
            {YEARS.map((y) => (
              <button
                key={y.value}
                type="button"
                onClick={() => { setCurrentYear(y.value); setErrors((p) => ({ ...p, currentYear: false })); }}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all cursor-pointer ${
                  currentYear === y.value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : errors.currentYear
                      ? 'border-red-300 bg-red-50 text-gray-600'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                }`}
              >
                {y.label}
              </button>
            ))}
          </div>
          {errors.currentYear && <p className="text-xs text-red-500 mt-1">Vui long chon nam hoc</p>}
        </div>

        {/* Graduation Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Nam ra truong du kien
          </label>
          <select
            value={gradYear}
            onChange={(e) => { setGradYear(e.target.value); setErrors((p) => ({ ...p, gradYear: false })); }}
            className={fieldClass('gradYear')}
          >
            <option value="">-- Chon nam --</option>
            {GRAD_YEARS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          {errors.gradYear && <p className="text-xs text-red-500 mt-1">Vui long chon nam ra truong</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg py-3.5 rounded-full shadow-md shadow-purple-200 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
        >
          Tiep tuc &rarr;
        </button>
      </form>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mt-8">
        <span className="w-8 h-1.5 rounded-full bg-purple-500" />
        <span className="w-8 h-1.5 rounded-full bg-gray-200" />
        <span className="w-8 h-1.5 rounded-full bg-gray-200" />
        <span className="w-8 h-1.5 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}
