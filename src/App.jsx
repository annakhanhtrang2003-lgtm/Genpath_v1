import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import InputScreen from './screens/InputScreen';
import QuizScreen from './screens/QuizScreen';
import ResultScreen from './screens/ResultScreen';
import ForecastScreen from './screens/ForecastScreen';
import RoadmapScreen from './screens/RoadmapScreen';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/input" element={<InputScreen />} />
        <Route path="/quiz" element={<QuizScreen />} />
        <Route path="/result" element={<ResultScreen />} />
        <Route path="/forecast" element={<ForecastScreen />} />
        <Route path="/roadmap" element={<RoadmapScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
