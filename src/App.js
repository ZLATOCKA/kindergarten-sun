import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Gallery from './pages/Gallery';
import Contacts from './pages/Contacts';
import Employees from './pages/Employees';
import LoginPage from './pages/LoginPage';
import ParentDashboard from './pages/ParentDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ReportsPage from './pages/ReportsPage';

function App() {
    const { user, loading } = useAuth();
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>«агрузка...</div>;
    }

    // ≈сли пользователь не авторизован, показываем публичные страницы с Header и Footer
    if (!user) {
        return (
            <BrowserRouter>
                <Header />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/programs" element={<Programs />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="/employees" element={<Employees />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>
        );
    }

    // ≈сли пользователь авторизован, показываем его дашборд без Header/Footer (или с ними, как хочешь)
    let DashboardComponent;
    if (user.role === 'parent') DashboardComponent = ParentDashboard;
    else if (user.role === 'employee') DashboardComponent = EmployeeDashboard;
    else if (user.role === 'admin') DashboardComponent = AdminDashboard;
    else DashboardComponent = Home;

    return (
        <BrowserRouter>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<DashboardComponent />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/login" element={<Navigate to="/" />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    );
}

export default App;