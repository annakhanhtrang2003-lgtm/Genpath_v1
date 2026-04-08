import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import PageTransition from '../components/PageTransition';

const MAJORS = ['Marketing', 'CNTT', 'Kinh tế', 'Thiết kế', 'Y dược', 'Luật', 'Khác'];
const YEARS = [
  { value: 1, label: 'Năm 1' },
  { value: 2, label: 'Năm 2' },
  { value: 3, label: 'Năm 3' },
  { value: 4, label: 'Năm 4' },
  { value: 5, label: 'Đã ra trường' },
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

    navigate('/insight');
  }

  const fieldClass = (key) =>
    `w-full px-4 py-3 rounded-xl border-2 text-base transition-colors outline-none ${
      errors[key]
        ? 'border-momo-error bg-red-50'
        : 'border-gray-200 bg-white focus:border-momo'
    }`;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-momo-soft via-white to-white">
        {/* Logo */}
        <motion.h2
          className="text-[32px] font-bold text-momo mb-6 tracking-tight"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          GenPath 💗
        </motion.h2>

        {/* Header */}
        <div className="text-4xl mb-4">&#9997;&#65039;</div>
        <h1 className="text-[28px] md:text-[32px] font-bold text-[#1A1A1A] text-center mb-2">
          Trước khi bắt đầu...
        </h1>
        <p className="text-[#666666] text-center mb-8 max-w-sm">
          Cho mình biết thêm về bạn nhé!
        </p>

        {/* Card */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-2xl shadow-[0_4px_16px_rgba(165,0,100,0.12)] border border-gray-100 p-8 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
              Tên của bạn
            </label>
            <input
              type="text"
              placeholder="VD: Minh Anh"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: false })); }}
              className={fieldClass('name')}
            />
            {errors.name && <p className="text-xs text-momo-error mt-1">Vui lòng nhập tên</p>}
          </div>

          {/* Major */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
              Ngành học
            </label>
            <select
              value={major}
              onChange={(e) => { setMajor(e.target.value); setErrors((p) => ({ ...p, major: false })); }}
              className={fieldClass('major')}
            >
              <option value="">-- Chọn ngành --</option>
              {MAJORS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errors.major && <p className="text-xs text-momo-error mt-1">Vui lòng chọn ngành học</p>}
          </div>

          {/* Current Year */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
              Bạn đang ở năm mấy?
            </label>
            <div className="flex flex-wrap gap-2">
              {YEARS.map((y) => (
                <motion.button
                  key={y.value}
                  type="button"
                  onClick={() => { setCurrentYear(y.value); setErrors((p) => ({ ...p, currentYear: false })); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all cursor-pointer ${
                    currentYear === y.value
                      ? 'border-momo bg-momo-soft text-momo-dark'
                      : errors.currentYear
                        ? 'border-red-300 bg-red-50 text-[#666666]'
                        : 'border-gray-200 bg-gray-50 text-[#666666] hover:border-gray-300'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {y.label}
                </motion.button>
              ))}
            </div>
            {errors.currentYear && <p className="text-xs text-momo-error mt-1">Vui lòng chọn năm học</p>}
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
              Năm ra trường dự kiến
            </label>
            <select
              value={gradYear}
              onChange={(e) => { setGradYear(e.target.value); setErrors((p) => ({ ...p, gradYear: false })); }}
              className={fieldClass('gradYear')}
            >
              <option value="">-- Chọn năm --</option>
              {GRAD_YEARS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {errors.gradYear && <p className="text-xs text-momo-error mt-1">Vui lòng chọn năm ra trường</p>}
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="w-full bg-momo hover:bg-momo-light text-white font-semibold text-lg py-4 rounded-2xl shadow-[0_4px_16px_rgba(165,0,100,0.12)] hover:shadow-[0_8px_32px_rgba(165,0,100,0.16)] transition-all cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Tiếp tục &rarr;
          </motion.button>
        </motion.form>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mt-8">
          <span className="w-8 h-1.5 rounded-full bg-momo" />
          <span className="w-8 h-1.5 rounded-full bg-gray-200" />
          <span className="w-8 h-1.5 rounded-full bg-gray-200" />
          <span className="w-8 h-1.5 rounded-full bg-gray-200" />
        </div>
      </div>
    </PageTransition>
  );
}
