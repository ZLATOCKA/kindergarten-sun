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

    const [employees, setEmployees] = useState([]);
    const [children, setChildren] = useState([]);
    const [parents, setParents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [lessons, setLessons] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    const [reportData, setReportData] = useState([]);
    const [reportLoading, setReportLoading] = useState(false);
    const [reportStartDate, setReportStartDate] = useState('');
    const [reportEndDate, setReportEndDate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const profileRes = await axios.get(`${API_URL}/admin/employees/my-profile`, { headers });
                setProfile(profileRes.data);
                setProfileForm(profileRes.data || {});

                const [empRes, childRes, parentRes, groupRes, lessonRes] = await Promise.all([
                    axios.get(`${API_URL}/admin/employees`, { headers }),
                    axios.get(`${API_URL}/admin/children`, { headers }),
                    axios.get(`${API_URL}/admin/parents`, { headers }),
                    axios.get(`${API_URL}/admin/groups`, { headers }),
                    axios.get(`${API_URL}/admin/lessons`, { headers }),
                ]);
                setEmployees(empRes.data || []);
                setChildren(childRes.data || []);
                setParents(parentRes.data || []);
                setGroups(groupRes.data || []);
                setLessons(lessonRes.data || []);
            } catch (err) {
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
            let url = `/api/reports/${reportType}`;
            if (reportStartDate && reportEndDate) {
                url += `?start_date=${reportStartDate}&end_date=${reportEndDate}`;
            }
            const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
            setReportData(res.data);
        } catch (err) {
            alert('Ошибка сохранения');
        }
    };

    const handleSave = async (entity) => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            if (editingId) {
                await axios.put(`/api/admin/${entity}/${editingId}`, formData, { headers });
            } else {
                await axios.post(`/api/admin/${entity}`, formData, { headers });
            }
            setModalOpen(false);
            fetchData();
        } catch (err) {
            alert('Ошибка сохранения');
        }
    };

    const handleDelete = async (entity, id) => {
        if (window.confirm('Удалить?')) {
            try {
                await axios.delete(`/api/admin/${entity}/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
                fetchData();
            } catch (err) {
                alert('Ошибка удаления');
            }
        }
    };

    const renderTable = (entity, data, columns) => (
        <div>
            <button onClick={() => { setEditingId(null); setFormData({}); setModalOpen(true); }} style={{ padding: '8px 16px', background: '#2c5f2d', color: 'white', borderRadius: '8px', marginBottom: '16px' }}>
                + Добавить
            </button>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                        {columns.map(col => <th key={col.key} style={{ padding: '8px', textAlign: 'left' }}>{col.label}</th>)}
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(row => (
                        <tr key={row.id}>
                            {columns.map(col => <td key={col.key} style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{row[col.key] || ''}</td>)}
                            <td style={{ padding: '8px' }}>
                                <button onClick={() => { setEditingId(row.id); setFormData(row); setModalOpen(true); }} style={{ marginRight: '8px', background: '#fbc80b', border: 'none', padding: '4px 8px', borderRadius: '4px' }}>✏️</button>
                                <button onClick={() => handleDelete(entity, row.id)} style={{ background: '#c0392b', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px' }}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '16px', width: '400px' }}>
                        <h3>{editingId ? 'Редактировать' : 'Добавить'}</h3>
                        {columns.map(col => (
                            <div key={col.key} style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '4px' }}>{col.label}</label>
                                <input
                                    type="text"
                                    value={formData[col.key] || ''}
                                    onChange={e => setFormData({ ...formData, [col.key]: e.target.value })}
                                    style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }}
                                />
                            </div>
                        ))}
                        <button onClick={() => handleSave(entity)} style={{ background: '#2c5f2d', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '8px', marginRight: '8px' }}>Сохранить</button>
                        <button onClick={() => setModalOpen(false)}>Отмена</button>
                    </div>
                </div>
            )}
        </div>
    );

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Загрузка...</div>;

    return (
        <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '24px' }}>Панель администратора</h1>
                <button onClick={logout} style={{ background: '#c0392b', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '8px' }}>Выйти</button>
            </div>

                {(activeTab === 'children' || activeTab === 'parents' || activeTab === 'employees' || activeTab === 'groups' || activeTab === 'lessons') && renderTable()}

                {activeTab === 'medical' && <div className="placeholder">🏥 Медицинский учёт (прививки, заболевания) – в разработке</div>}
                {activeTab === 'suppliers' && <div className="placeholder">📦 Управление поставщиками и поставками – в разработке</div>}

            {activeTab === 'reports' && (
                <div style={{ background: 'white', padding: '20px', borderRadius: '16px' }}>
                    <h2 style={{ marginBottom: '16px' }}>Отчёты</h2>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        <select value={reportType} onChange={e => setReportType(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc' }}>
                            <option value="">Выберите отчёт</option>
                            <option value="attendance">Посещаемость детей</option>
                            <option value="employee-workload">Занятость сотрудников</option>
                            <option value="supplies">Поставки товаров</option>
                            <option value="vaccinations">Прививки детей</option>
                        </select>
                        <input type="date" value={reportStartDate} onChange={e => setReportStartDate(e.target.value)} placeholder="Дата начала" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc' }} />
                        <input type="date" value={reportEndDate} onChange={e => setReportEndDate(e.target.value)} placeholder="Дата окончания" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc' }} />
                        <button onClick={fetchReport} style={{ background: '#2c5f2d', color: 'white', padding: '8px 16px', borderRadius: '8px', border: 'none' }}>Сформировать</button>
                    </div>
                    {reportLoading && <div>Загрузка...</div>}
                    {!reportLoading && reportData.length > 0 && (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f0f0f0' }}>
                                        {Object.keys(reportData[0]).map(key => <th key={key} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>{key}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((row, idx) => (
                                        <tr key={idx}>
                                            {Object.values(row).map((val, j) => <td key={j} style={{ padding: '8px', border: '1px solid #ddd' }}>{val}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {!reportLoading && reportType && reportData.length === 0 && <div>Нет данных для выбранного периода</div>}
                </div>
            )}
        </div>
    );
}