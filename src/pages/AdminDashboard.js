import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './styles/AdminDashboard.css';

const API_URL = 'http://localhost:5000/api';

export default function AdminDashboard() {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState(null);
    const [profileForm, setProfileForm] = useState({});
    const [editingProfile, setEditingProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Для выпадающих списков
    const [stepenOptions, setStepenOptions] = useState([]);
    const [positionOptions, setPositionOptions] = useState([]);
    const [branchOptions, setBranchOptions] = useState([]);
    const [ageCategoryOptions, setAgeCategoryOptions] = useState([]);

    // Основные таблицы
    const [employees, setEmployees] = useState([]);
    const [children, setChildren] = useState([]);
    const [parents, setParents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [lessons, setLessons] = useState([]);

    // Медицинский учёт
    const [vaccinations, setVaccinations] = useState([]);
    const [diseases, setDiseases] = useState([]);
    const [vaccinesList, setVaccinesList] = useState([]);

    // Поставщики и поставки
    const [suppliers, setSuppliers] = useState([]);
    const [supplies, setSupplies] = useState([]);

    // Общее состояние для модалок
    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    // Отчёты
    const [reportData, setReportData] = useState([]);
    const [reportLoading, setReportLoading] = useState(false);
    const [reportStartDate, setReportStartDate] = useState('');
    const [reportEndDate, setReportEndDate] = useState('');
    const [selectedReportType, setSelectedReportType] = useState('');

    const inputStyle = {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '14px',
        boxSizing: 'border-box'
    };

    // Загрузка данных
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const profileRes = await axios.get(`${API_URL}/admin/employees/my-profile`, { headers });
                setProfile(profileRes.data);
                setProfileForm(profileRes.data || {});

                const [empRes, childRes, parentRes, groupRes, lessonRes, vaccRes, diseaseRes, supplierRes, supplyRes, stepenRes, positionRes, branchRes, ageRes, vaccinesListRes] = await Promise.all([
                    axios.get(`${API_URL}/admin/employees`, { headers }).catch(() => ({ data: [] })),
                    axios.get(`${API_URL}/admin/children`, { headers }).catch(() => ({ data: [] })),
                    axios.get(`${API_URL}/admin/parents`, { headers }).catch(() => ({ data: [] })),
                    axios.get(`${API_URL}/admin/groups`, { headers }).catch(() => ({ data: [] })),
                    axios.get(`${API_URL}/admin/lessons`, { headers }).catch(() => ({ data: [] })),
                    axios.get(`${API_URL}/admin/vaccinations`, { headers }).catch(() => ({ data: [] })),
                    axios.get(`${API_URL}/admin/diseases`, { headers }).catch(() => ({ data: [] })),
                    axios.get(`${API_URL}/admin/suppliers`, { headers }).catch(() => ({ data: [] })),
                    axios.get(`${API_URL}/admin/supplies`, { headers }).catch(() => ({ data: [] })),
                    axios.get(`${API_URL}/admin/steps`, { headers }).catch(() => ({ data: [] })),
                    axios.get(`${API_URL}/admin/positions`, { headers }).catch(() => ({ data: [] })),
                    axios.get(`${API_URL}/admin/branches`, { headers }).catch(() => ({ data: [] })),
                    axios.get(`${API_URL}/admin/age-categories`, { headers }).catch(() => ({ data: [] })),
                    axios.get(`${API_URL}/admin/vaccines-list`, { headers }).catch(() => ({ data: [] }))
                ]);

                setEmployees(empRes.data || []);
                setChildren(childRes.data || []);
                setParents(parentRes.data || []);
                setGroups(groupRes.data || []);
                setLessons(lessonRes.data || []);
                setVaccinations(vaccRes.data || []);
                setDiseases(diseaseRes.data || []);
                setSuppliers(supplierRes.data || []);
                setSupplies(supplyRes.data || []);
                setStepenOptions(stepenRes.data || []);
                setPositionOptions(positionRes.data || []);
                setBranchOptions(branchRes.data || []);
                setAgeCategoryOptions(ageRes.data || []);
                setVaccinesList(vaccinesListRes.data || []);

            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleProfileSave = async () => {
        try {
            const token = localStorage.getItem('token');
<<<<<<<<< Temporary merge branch 1
            await axios.put('/api/employees/my-profile', profileForm, {
=========
            await axios.put(`${API_URL}/admin/employees/my-profile`, profileForm, {
>>>>>>>>> Temporary merge branch 2
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(profileForm);
            setEditingProfile(false);
            alert('Профиль обновлён');
        } catch (err) {
            alert('Ошибка сохранения: ' + (err.response?.data?.message || err.message));
        }
    };

    const getEntityApi = () => {
        const map = {
            children: 'children',
            parents: 'parents',
            employees: 'employees',
            groups: 'groups',
            lessons: 'lessons'
        };
        return map[activeTab];
    };

    const handleAdd = () => {
        setEditingItem(null);
<<<<<<<<< Temporary merge branch 1
        setFormData({});
=========
        switch (activeTab) {
            case 'employees':
                setFormData({ Фамилия: '', Имя: '', Телефон: '' });
                break;
            case 'children':
                setFormData({ Фамилия: '', Имя: '', 'Дата рождения': '', Пол: '' });
                break;
            case 'parents':
                setFormData({ Фамилия: '', Имя: '', Телефон: '' });
                break;
            case 'groups':
                setFormData({ Название_Группы: '', ID_Категории: '' });
                break;
            case 'lessons':
                setFormData({ Название: '', Стоимость: '' });
                break;
            default:
                setFormData({});
        }
>>>>>>>>> Temporary merge branch 2
        setModalOpen(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData(item);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить?')) return;
        try {
            const token = localStorage.getItem('token');
<<<<<<<<< Temporary merge branch 1
            await axios.delete(`/api/admin/${getEntityApi()}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`/api/admin/${getEntityApi()}`, { headers });
=========
            await axios.delete(`${API_URL}/admin/${getEntityApi()}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${API_URL}/admin/${getEntityApi()}`, { headers });
>>>>>>>>> Temporary merge branch 2
            const setter = {
                children: setChildren,
                parents: setParents,
                employees: setEmployees,
                groups: setGroups,
                lessons: setLessons
            }[activeTab];
            if (setter) setter(res.data);
        } catch (err) {
            alert('Ошибка удаления');
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const api = getEntityApi();
            if (editingItem) {
<<<<<<<<< Temporary merge branch 1
                await axios.put(`/api/admin/${api}/${editingItem.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`/api/admin/${api}`, formData, {
=========
                await axios.put(`${API_URL}/admin/${api}/${editingItem.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_URL}/admin/${api}`, formData, {
>>>>>>>>> Temporary merge branch 2
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            setModalOpen(false);
            const headers = { Authorization: `Bearer ${token}` };
<<<<<<<<< Temporary merge branch 1
            const res = await axios.get(`/api/admin/${api}`, { headers });
=========
            const res = await axios.get(`${API_URL}/admin/${api}`, { headers });
>>>>>>>>> Temporary merge branch 2
            const setter = {
                children: setChildren,
                parents: setParents,
                employees: setEmployees,
                groups: setGroups,
                lessons: setLessons
            }[activeTab];
            if (setter) setter(res.data);
        } catch (err) {
            alert('Ошибка сохранения: ' + (err.response?.data?.message || err.message));
        }
    };

    const fetchReport = async (type) => {
        setReportLoading(true);
        try {
            const token = localStorage.getItem('token');
<<<<<<<<< Temporary merge branch 1
            let url = `/api/reports/${type}`;
=========
            let url = `${API_URL}/reports/${type}`;
>>>>>>>>> Temporary merge branch 2
            if (reportStartDate && reportEndDate) {
                url += `?start_date=${reportStartDate}&end_date=${reportEndDate}`;
            }
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReportData(res.data);
        } catch (err) {
            alert('Ошибка загрузки отчёта');
        } finally {
            setReportLoading(false);
        }
    };

    if (loading) return <div className="admin-loading">Загрузка...</div>;
    if (error) return <div className="admin-loading" style={{ color: 'red' }}>Ошибка: {error}</div>;

    const renderTable = () => {
<<<<<<<<< Temporary merge branch 1
        let data = [], columns = [];
        if (activeTab === 'children') {
            data = children;
            columns = ['Фамилия', 'Имя', 'Дата рождения'];
        } else if (activeTab === 'parents') {
            data = parents;
            columns = ['Фамилия', 'Имя', 'Телефон'];
        } else if (activeTab === 'employees') {
            data = employees;
            columns = ['Фамилия', 'Имя', 'Телефон'];
        } else if (activeTab === 'groups') {
            data = groups;
            columns = ['Название_Группы', 'ID_Категории'];
        } else if (activeTab === 'lessons') {
            data = lessons;
=========
        let tableData = [];
        let columns = [];
        if (activeTab === 'children') {
            tableData = children;
            columns = ['Фамилия', 'Имя', 'Дата рождения'];
        } else if (activeTab === 'parents') {
            tableData = parents;
            columns = ['Фамилия', 'Имя', 'Телефон'];
        } else if (activeTab === 'employees') {
            tableData = employees;
            columns = ['Фамилия', 'Имя', 'Телефон'];
        } else if (activeTab === 'groups') {
            tableData = groups;
            columns = ['Название_Группы', 'ID_Категории'];
        } else if (activeTab === 'lessons') {
            tableData = lessons;
>>>>>>>>> Temporary merge branch 2
            columns = ['Название', 'Стоимость'];
        }
        return (
            <div className="data-table">
                <h2>
                    {activeTab === 'children' && 'Дети'}
                    {activeTab === 'parents' && 'Родители'}
                    {activeTab === 'employees' && 'Сотрудники'}
                    {activeTab === 'groups' && 'Группы'}
                    {activeTab === 'lessons' && 'Занятия'}
                </h2>
                <button className="add-btn" onClick={handleAdd}>+ Добавить</button>
<<<<<<<<< Temporary merge branch 1
                <table>
                    <thead>
                        <tr>
                            {columns.map(col => <th key={col}>{col}</th>)}
=========
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            {columns.map(col => <th key={col} style={{ padding: '8px', textAlign: 'left' }}>{col}</th>)}
>>>>>>>>> Temporary merge branch 2
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
<<<<<<<<< Temporary merge branch 1
                        {data.map((item, idx) => (
                            <tr key={idx}>
                                {columns.map(col => <td key={col}>{item[col]}</td>)}
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(item)}>✏️</button>
                                    <button className="delete-btn" onClick={() => handleDelete(item.id)}>🗑️</button>
=========
                        {tableData.map((item) => (
                            <tr key={item.id}>
                                {columns.map(col => (
                                    <td key={col} style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                                        {item[col]}
                                    </td>
                                ))}
                                <td style={{ padding: '8px' }}>
                                    <button className="edit-btn" onClick={() => handleEdit(item)} style={{ marginRight: '5px', cursor: 'pointer' }}>✏️</button>
                                    <button className="delete-btn" onClick={() => handleDelete(item.id)} style={{ cursor: 'pointer' }}>🗑️</button>
>>>>>>>>> Temporary merge branch 2
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="sidebar-logo">
                    <img src="/logo.png" alt="Солнышко" />
                    <span>Солнышко</span>
                </div>
                <nav className="sidebar-nav">
                    <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
                        <img src="/images/icons/profile.png" alt="Профиль" className="nav-icon" /> Профиль
                    </button>
                    <button className={activeTab === 'children' ? 'active' : ''} onClick={() => setActiveTab('children')}>
                        <img src="/images/icons/children.png" alt="Дети" className="nav-icon" /> Дети
                    </button>
                    <button className={activeTab === 'parents' ? 'active' : ''} onClick={() => setActiveTab('parents')}>
                        <img src="/images/icons/parents.png" alt="Родители" className="nav-icon" /> Родители
                    </button>
                    <button className={activeTab === 'employees' ? 'active' : ''} onClick={() => setActiveTab('employees')}>
                        <img src="/images/icons/employees.png" alt="Сотрудники" className="nav-icon" /> Сотрудники
                    </button>
                    <button className={activeTab === 'groups' ? 'active' : ''} onClick={() => setActiveTab('groups')}>
                        <img src="/images/icons/groups.png" alt="Группы" className="nav-icon" /> Группы
                    </button>
                    <button className={activeTab === 'lessons' ? 'active' : ''} onClick={() => setActiveTab('lessons')}>
                        <img src="/images/icons/lessons.png" alt="Занятия" className="nav-icon" /> Занятия
                    </button>
                    <button className={activeTab === 'medical' ? 'active' : ''} onClick={() => setActiveTab('medical')}>
                        <img src="/images/icons/medical.png" alt="Медицина" className="nav-icon" /> Медицинский учёт
                    </button>
                    <button className={activeTab === 'suppliers' ? 'active' : ''} onClick={() => setActiveTab('suppliers')}>
                        <img src="/images/icons/suppliers.png" alt="Поставщики" className="nav-icon" /> Поставщики
                    </button>
                    <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>
                        <img src="/images/icons/reports.png" alt="Отчёты" className="nav-icon" /> Отчёты
                    </button>
                </nav>
                <button onClick={logout} className="logout-btn">
                    <img src="/images/icons/logout.png" alt="Выйти" className="nav-icon" /> Выйти
                </button>
            </aside>

            <main className="admin-main">
                {activeTab === 'profile' && profile && (
                    <div className="profile-section">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                <img src="/images/admin/avatar-placeholder.png" alt="Аватар" />
                            </div>
                            <div className="profile-info">
                                {editingProfile ? (
<<<<<<<<< Temporary merge branch 1
                                    <>
=========
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
>>>>>>>>> Temporary merge branch 2
                                        <input
                                            value={profileForm.Фамилия || ''}
                                            onChange={e => setProfileForm({ ...profileForm, Фамилия: e.target.value })}
                                            placeholder="Фамилия"
<<<<<<<<< Temporary merge branch 1
=========
                                            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
>>>>>>>>> Temporary merge branch 2
                                        />
                                        <input
                                            value={profileForm.Имя || ''}
                                            onChange={e => setProfileForm({ ...profileForm, Имя: e.target.value })}
                                            placeholder="Имя"
<<<<<<<<< Temporary merge branch 1
=========
                                            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
>>>>>>>>> Temporary merge branch 2
                                        />
                                        <input
                                            value={profileForm.Отчество || ''}
                                            onChange={e => setProfileForm({ ...profileForm, Отчество: e.target.value })}
                                            placeholder="Отчество"
<<<<<<<<< Temporary merge branch 1
=========
                                            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
>>>>>>>>> Temporary merge branch 2
                                        />
                                        <input
                                            value={profileForm.Телефон || ''}
                                            onChange={e => setProfileForm({ ...profileForm, Телефон: e.target.value })}
                                            placeholder="Телефон"
<<<<<<<<< Temporary merge branch 1
                                        />
                                        <button onClick={handleProfileSave}>Сохранить</button>
                                        <button onClick={() => setEditingProfile(false)}>Отмена</button>
                                    </>
=========
                                            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
                                        />
                                        <div>
                                            <button onClick={handleProfileSave} style={{ marginRight: '10px', padding: '8px 16px', background: '#2c5f2d', color: 'white', border: 'none', borderRadius: '8px' }}>Сохранить</button>
                                            <button onClick={() => setEditingProfile(false)} style={{ padding: '8px 16px', background: '#ccc', border: 'none', borderRadius: '8px' }}>Отмена</button>
                                        </div>
                                    </div>
>>>>>>>>> Temporary merge branch 2
                                ) : (
                                    <>
                                        <h2>{profile.Фамилия} {profile.Имя} {profile.Отчество}</h2>
                                        <p>👤 {profile.Должность}</p>
                                        <p>📞 {profile.Телефон}</p>
                                        <p>🏢 {profile.Филиал}</p>
<<<<<<<<< Temporary merge branch 1
                                        <button onClick={() => setEditingProfile(true)}>✏️ Редактировать профиль</button>
=========
                                        <button onClick={() => setEditingProfile(true)} style={{ marginTop: '15px', background: '#fbc80b', border: 'none', padding: '8px 20px', borderRadius: '30px', cursor: 'pointer' }}>✏️ Редактировать профиль</button>
>>>>>>>>> Temporary merge branch 2
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* МЕДИЦИНСКИЙ УЧЁТ - ГЛАВНАЯ */}
                {activeTab === 'medical' && (
                    <div><h2>🏥 Медицинский учёт</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                            <div style={{ padding: '20px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}><h3>💉 Прививки</h3><p style={{ fontSize: '32px', fontWeight: 'bold' }}>{vaccinations.length}</p><button onClick={() => setActiveTab('vaccinations')} style={{ marginTop: '10px', padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Управлять →</button></div>
                            <div style={{ padding: '20px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}><h3>🏥 Заболевания</h3><p style={{ fontSize: '32px', fontWeight: 'bold' }}>{diseases.length}</p><button onClick={() => setActiveTab('diseases')} style={{ marginTop: '10px', padding: '8px 16px', background: '#FF9800', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Управлять →</button></div>
                        </div>
                    </div>
                )}

                {/* ПОСТАВКИ - ГЛАВНАЯ */}
                {activeTab === 'supply' && (
                    <div><h2>📦 Управление поставками</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                            <div style={{ padding: '20px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}><h3>📋 Поставщики</h3><p style={{ fontSize: '32px', fontWeight: 'bold' }}>{suppliers.length}</p><button onClick={() => setActiveTab('suppliers')} style={{ marginTop: '10px', padding: '8px 16px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Управлять →</button></div>
                            <div style={{ padding: '20px', background: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}><h3>🚚 Поставки</h3><p style={{ fontSize: '32px', fontWeight: 'bold' }}>{supplies.length}</p><button onClick={() => setActiveTab('supplies')} style={{ marginTop: '10px', padding: '8px 16px', background: '#9C27B0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Управлять →</button></div>
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="reports-section">
                        <h2>Отчёты</h2>
                        <div className="reports-filters">
                            <input
                                type="date"
                                value={reportStartDate}
                                onChange={e => setReportStartDate(e.target.value)}
                                placeholder="Начало"
<<<<<<<<< Temporary merge branch 1
=========
                                style={{ padding: '8px', marginRight: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
>>>>>>>>> Temporary merge branch 2
                            />
                            <input
                                type="date"
                                value={reportEndDate}
                                onChange={e => setReportEndDate(e.target.value)}
                                placeholder="Конец"
<<<<<<<<< Temporary merge branch 1
                            />
                        </div>
                        <div className="reports-grid">
                            <div className="report-card" onClick={() => fetchReport('attendance')}>📋 Посещаемость детей</div>
                            <div className="report-card" onClick={() => fetchReport('employee-workload')}>👩‍🏫 Занятость сотрудников</div>
                            <div className="report-card" onClick={() => fetchReport('supplies')}>📦 Поставки товаров</div>
                            <div className="report-card" onClick={() => fetchReport('vaccinations')}>💉 Прививки детей</div>
                        </div>
                        {reportLoading && <div>Загрузка...</div>}
                        {reportData.length > 0 && (
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        {Object.keys(reportData[0]).map(k => <th key={k}>{k}</th>)}
=========
                                style={{ padding: '8px', marginRight: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                            />
                        </div>
                        <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                            <button className="report-card" onClick={() => fetchReport('attendance')} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '20px', textAlign: 'center', cursor: 'pointer', border: 'none' }}>📋 Посещаемость детей</button>
                            <button className="report-card" onClick={() => fetchReport('employee-workload')} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '20px', textAlign: 'center', cursor: 'pointer', border: 'none' }}>👩‍🏫 Занятость сотрудников</button>
                            <button className="report-card" onClick={() => fetchReport('supplies')} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '20px', textAlign: 'center', cursor: 'pointer', border: 'none' }}>📦 Поставки товаров</button>
                            <button className="report-card" onClick={() => fetchReport('vaccinations')} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '20px', textAlign: 'center', cursor: 'pointer', border: 'none' }}>💉 Прививки детей</button>
                        </div>
                        {reportLoading && <div>Загрузка...</div>}
                        {reportData.length > 0 && (
                            <table className="report-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                                <thead>
                                    <tr>
                                        {Object.keys(reportData[0]).map(k => <th key={k} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>{k}</th>)}
>>>>>>>>> Temporary merge branch 2
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((row, i) => (
                                        <tr key={i}>
<<<<<<<<< Temporary merge branch 1
                                            {Object.values(row).map((v, j) => <td key={j}>{v}</td>)}
=========
                                            {Object.values(row).map((v, j) => <td key={j} style={{ padding: '8px', border: '1px solid #ddd' }}>{String(v)}</td>)}
>>>>>>>>> Temporary merge branch 2
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </main>

            {modalOpen && (
<<<<<<<<< Temporary merge branch 1
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
=========
                <div className="modal-overlay" onClick={() => setModalOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '32px', padding: '30px', width: '450px', maxWidth: '90%' }}>
>>>>>>>>> Temporary merge branch 2
                        <h3>{editingItem ? 'Редактировать' : 'Добавить'}</h3>
                        {Object.keys(formData)
                            .filter(k => !['id', 'ID_Сотрудника', 'ID_Ребенка', 'Id_Родителя', 'ID_Группы', 'ID_Занятия'].includes(k))
                            .map(key => (
                                <input
                                    key={key}
                                    value={formData[key] || ''}
                                    onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                                    placeholder={key}
<<<<<<<<< Temporary merge branch 1
                                />
                            ))}
                        <button onClick={handleSave}>Сохранить</button>
                        <button onClick={() => setModalOpen(false)}>Отмена</button>
=========
                                    style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '30px', fontSize: '14px' }}
                                />
                            ))}
                        <div>
                            <button onClick={handleSave} style={{ marginRight: '10px', padding: '10px 20px', borderRadius: '30px', background: '#2c5f2d', color: 'white', border: 'none', cursor: 'pointer' }}>Сохранить</button>
                            <button onClick={() => setModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '30px', background: '#ccc', border: 'none', cursor: 'pointer' }}>Отмена</button>
                        </div>
>>>>>>>>> Temporary merge branch 2
                    </div>
                </div>
            )}
        </div>
    );
}