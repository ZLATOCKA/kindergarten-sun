import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState('employees');
    const [employees, setEmployees] = useState([]);
    const [children, setChildren] = useState([]);
    const [parents, setParents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});

    // === ОТЧЁТЫ ===
    const [reportType, setReportType] = useState('');
    const [reportData, setReportData] = useState([]);
    const [reportLoading, setReportLoading] = useState(false);
    const [reportStartDate, setReportStartDate] = useState('');
    const [reportEndDate, setReportEndDate] = useState('');

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const [empRes, childRes, parentRes, groupRes, lessonRes] = await Promise.all([
                axios.get('/api/admin/employees', { headers }),
                axios.get('/api/admin/children', { headers }),
                axios.get('/api/admin/parents', { headers }),
                axios.get('/api/admin/groups', { headers }),
                axios.get('/api/admin/lessons', { headers }),
            ]);
            setEmployees(empRes.data);
            setChildren(childRes.data);
            setParents(parentRes.data);
            setGroups(groupRes.data);
            setLessons(lessonRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const fetchReport = async () => {
        if (!reportType) return;
        setReportLoading(true);
        try {
            const token = localStorage.getItem('token');
            let url = `/api/reports/${reportType}`;
            if (reportStartDate && reportEndDate) {
                url += `?start_date=${reportStartDate}&end_date=${reportEndDate}`;
            }
            const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
            setReportData(res.data);
        } catch (err) {
            console.error(err);
            alert('Ошибка загрузки отчёта');
        } finally {
            setReportLoading(false);
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
            alert(err.response?.data?.message || 'Ошибка сохранения');
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

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #ddd', paddingBottom: '8px', flexWrap: 'wrap' }}>
                {['employees', 'children', 'parents', 'groups', 'lessons', 'reports'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{ padding: '8px 16px', background: activeTab === tab ? '#2c5f2d' : 'transparent', color: activeTab === tab ? 'white' : 'black', border: 'none', borderRadius: '20px' }}
                    >
                        {tab === 'employees' && 'Сотрудники'}
                        {tab === 'children' && 'Дети'}
                        {tab === 'parents' && 'Родители'}
                        {tab === 'groups' && 'Группы'}
                        {tab === 'lessons' && 'Занятия'}
                        {tab === 'reports' && 'Отчёты'}
                    </button>
                ))}
            </div>

            {activeTab === 'employees' && renderTable('employees', employees, [{ key: 'Фамилия', label: 'Фамилия' }, { key: 'Имя', label: 'Имя' }, { key: 'Телефон', label: 'Телефон' }])}
            {activeTab === 'children' && renderTable('children', children, [{ key: 'Фамилия', label: 'Фамилия' }, { key: 'Имя', label: 'Имя' }, { key: 'Дата рождения', label: 'Дата рождения' }])}
            {activeTab === 'parents' && renderTable('parents', parents, [{ key: 'Фамилия', label: 'Фамилия' }, { key: 'Имя', label: 'Имя' }, { key: 'Телефон', label: 'Телефон' }])}
            {activeTab === 'groups' && renderTable('groups', groups, [{ key: 'Название_Группы', label: 'Название' }, { key: 'ID_Категории', label: 'Категория' }])}
            {activeTab === 'lessons' && renderTable('lessons', lessons, [{ key: 'Название', label: 'Название' }, { key: 'Стоимость', label: 'Стоимость' }])}

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