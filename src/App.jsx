import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomeScreen from './screens/HomeScreen';
import InputScreen from './screens/InputScreen';
import InsightScreen from './screens/InsightScreen';
import QuizScreen from './screens/QuizScreen';
import ResultScreen from './screens/ResultScreen';
import ForecastScreen from './screens/ForecastScreen';
import RoadmapScreen from './screens/RoadmapScreen';
import FloatingElements from './components/FloatingElements';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/input" element={<InputScreen />} />
        <Route path="/insight" element={<InsightScreen />} />
        <Route path="/quiz" element={<QuizScreen />} />
        <Route path="/result" element={<ResultScreen />} />
        <Route path="/forecast" element={<ForecastScreen />} />
        <Route path="/roadmap" element={<RoadmapScreen />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <FloatingElements count={7} />
      <div className="relative z-10">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
