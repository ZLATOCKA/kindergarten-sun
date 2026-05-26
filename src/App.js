import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Gallery from './pages/Gallery';
import Contacts from './pages/Contacts';
import Employees from './pages/Employees';
import ParentDashboard from './pages/ParentDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

function App() {
    return (
        <>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/programs" element={<Programs />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/parent-dashboard" element={<ParentDashboard />} />
                    <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}

export default App;