import Home from './pages/Home';
import StudentPortal from './pages/StudentPortal';
import CreateStudent from './pages/CreateStudent';
import TutorPortal from './pages/TutorPortal';

import Loading from './components/Loading';
import NotFound from './components/NotFound';

import { useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/create" element={<CreateStudent />} />
          <Route path="/student/:studentId" element={<StudentPortal />} />
          <Route path="/tutor/:tutorId" element={<TutorPortal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
};


export default App;

