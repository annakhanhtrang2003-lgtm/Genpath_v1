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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

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
    `w-full px-4 py-3.5 rounded-2xl border-2 text-base font-medium transition-colors outline-none ${
      errors[key]
        ? 'border-momo-error bg-red-50'
        : 'border-gray-200 bg-white focus:border-momo'
    }`;

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center px-6 py-12 bg-gradient-to-b from-momo-soft via-white to-white font-sans antialiased">
        <motion.div
          className="flex flex-col items-center max-w-md w-full"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Logo */}
          <motion.h2
            className="text-2xl md:text-3xl font-extrabold text-momo tracking-tight"
            variants={fadeUp}
          >
            StudentPath 🎓
          </motion.h2>

          {/* Header */}
          <motion.div className="text-center mt-6 mb-2" variants={fadeUp}>
            <span className="text-5xl" role="img" aria-label="pen">✏️</span>
          </motion.div>
          <motion.h1
            className="text-2xl md:text-3xl font-extrabold text-[#1A1A1A] text-center tracking-tight"
            variants={fadeUp}
          >
            Trước khi bắt đầu...
          </motion.h1>
          <motion.p
            className="text-base font-medium text-gray-600 text-center mt-2 mb-8"
            variants={fadeUp}
          >
            Cho mình biết thêm về bạn nhé!
          </motion.p>

          {/* Form card */}
          <motion.form
            onSubmit={handleSubmit}
            className="w-full bg-white rounded-2xl shadow-[0_4px_20px_rgba(165,0,100,0.08)] border-2 border-momo-soft p-6 md:p-8 space-y-6"
            variants={fadeUp}
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Tên của bạn
              </label>
              <input
                type="text"
                placeholder="VD: Minh Anh"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: false })); }}
                className={fieldClass('name')}
              />
              {errors.name && <p className="text-xs font-medium text-momo-error mt-1.5">Vui lòng nhập tên</p>}
            </div>

            {/* Major */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
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
              {errors.major && <p className="text-xs font-medium text-momo-error mt-1.5">Vui lòng chọn ngành học</p>}
            </div>

            {/* Current Year */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2.5">
                Bạn đang ở năm mấy?
              </label>
              <div className="flex flex-wrap gap-2">
                {YEARS.map((y) => (
                  <motion.button
                    key={y.value}
                    type="button"
                    onClick={() => { setCurrentYear(y.value); setErrors((p) => ({ ...p, currentYear: false })); }}
                    className={`px-4 py-2.5 rounded-full text-sm font-semibold border-2 transition-all cursor-pointer ${
                      currentYear === y.value
                        ? 'border-momo bg-momo-soft text-momo'
                        : errors.currentYear
                          ? 'border-red-300 bg-red-50 text-gray-500'
                          : 'border-gray-200 bg-[#F8F8F8] text-gray-600 hover:border-gray-300'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {y.label}
                  </motion.button>
                ))}
              </div>
              {errors.currentYear && <p className="text-xs font-medium text-momo-error mt-1.5">Vui lòng chọn năm học</p>}
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Năm ra trường dự kiến
              </label>
              <div className="flex flex-wrap gap-2">
                {GRAD_YEARS.map((g) => (
                  <motion.button
                    key={g}
                    type="button"
                    onClick={() => { setGradYear(g); setErrors((p) => ({ ...p, gradYear: false })); }}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold border-2 transition-all cursor-pointer ${
                      gradYear === g
                        ? 'border-momo bg-momo-soft text-momo'
                        : errors.gradYear
                          ? 'border-red-300 bg-red-50 text-gray-500'
                          : 'border-gray-200 bg-[#F8F8F8] text-gray-600 hover:border-gray-300'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {g}
                  </motion.button>
                ))}
              </div>
              {errors.gradYear && <p className="text-xs font-medium text-momo-error mt-1.5">Vui lòng chọn năm ra trường</p>}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="w-full bg-momo hover:bg-momo-light text-white font-bold text-lg py-4 rounded-full shadow-[0_0_24px_rgba(216,45,139,0.3)] hover:shadow-[0_0_32px_rgba(216,45,139,0.4)] transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Tiếp tục"
            >
              Tiếp tục &rarr;
            </motion.button>
          </motion.form>

          {/* Step indicator */}
          <motion.div className="flex items-center gap-2 mt-8" variants={fadeUp}>
            <span className="w-8 h-2 rounded-full bg-momo" />
            <span className="w-8 h-2 rounded-full bg-gray-200" />
            <span className="w-8 h-2 rounded-full bg-gray-200" />
            <span className="w-8 h-2 rounded-full bg-gray-200" />
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
