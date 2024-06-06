import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Db from './pages/Db';
import View from './pages/View';
import DetailsPage from './pages/DetailsPage';
import Management from './pages/Managment';
import Register from './pages/Register';
import LogIn from './pages/LogIn';
import Prize from './pages/Prize';
import Visualization from '../src/pages/Visualization.js';
import CombinedChart from './pages/CombinedChart .js';
import Top from './pages/Top';
import './css/App.css';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                <Route path="/db" element={<Db />} />
                <Route path="/view" element={<View />} />
                <Route path="/details/:id" element={<DetailsPage />} />
                <Route path='/LogIn' element={<LogIn />} />
                <Route path='/Register' element={<Register />} />
                <Route path="/mangment" element={<Management />} />
                <Route path='/Prize' element={<Prize />} />
                <Route path="/comprehensive" element={<Visualization />} />
                <Route path="/charts" element={<CombinedChart />} />
                <Route path="/top" element={<Top />} />
            </Routes>
        </Router>
    );
}

export default App;
