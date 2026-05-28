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
            await axios.put(`${API_URL}/admin/employees/my-profile`, profileForm, {
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
            lessons: 'lessons',
            vaccinations: 'vaccinations',
            diseases: 'diseases',
            suppliers: 'suppliers',
            supplies: 'supplies'
        };
        return map[activeTab];
    };

    const handleAdd = () => {
        setEditingItem(null);

        switch (activeTab) {
            case 'employees':
                setFormData({ Фамилия: '', Имя: '', Отчество: '', Дата_рождения: '', Адрес: '', Телефон: '', Email: '', ID_Должности: '', ID_Филиала: '', Роль: 'employee', password: '' });
                break;
            case 'children':
                setFormData({ Фамилия: '', Имя: '', Отчество: '', 'Дата рождения': '', Пол: '' });
                break;
            case 'parents':
                setFormData({ Фамилия: '', Имя: '', Отчество: '', ID_Степени: '', Адрес: '', Телефон: '', Паспортные_данные: '', Email: '', password: '' });
                break;
            case 'groups':
                setFormData({ Название_Группы: '', ID_Категории: '' });
                break;
            case 'lessons':
                setFormData({ Название: '', Стоимость: '' });
                break;
            case 'vaccinations':
                setFormData({ ID_Ребенка: '', ID_Прививки: '', Дата_проведения: '', Статус: 'Сделана', Медицинское_учреждение: '' });
                break;
            case 'diseases':
                setFormData({ Название_заболевания: '', Код_МКБ: '' });
                break;
            case 'suppliers':
                setFormData({ Название_компании: '', Контактное_лицо: '', Телефон: '', Адрес: '' });
                break;
            case 'supplies':
                setFormData({ Дата_поставки: '', ID_Филиала: '', ID_Поставщика: '' });
                break;
            default:
                setFormData({});
        }
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
            await axios.delete(`${API_URL}/admin/${getEntityApi()}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${API_URL}/admin/${getEntityApi()}`, { headers });

            const setters = {
                children: setChildren,
                parents: setParents,
                employees: setEmployees,
                groups: setGroups,
                lessons: setLessons,
                vaccinations: setVaccinations,
                diseases: setDiseases,
                suppliers: setSuppliers,
                supplies: setSupplies
            };

            if (setters[activeTab]) setters[activeTab](res.data);
        } catch (err) {
            alert('Ошибка удаления: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const api = getEntityApi();

            if (editingItem) {
                await axios.put(`${API_URL}/admin/${api}/${editingItem.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_URL}/admin/${api}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            setModalOpen(false);

            const headers = { Authorization: `Bearer ${token}` };
            const res = await axios.get(`${API_URL}/admin/${api}`, { headers });

            const setters = {
                children: setChildren,
                parents: setParents,
                employees: setEmployees,
                groups: setGroups,
                lessons: setLessons,
                vaccinations: setVaccinations,
                diseases: setDiseases,
                suppliers: setSuppliers,
                supplies: setSupplies
            };

            if (setters[activeTab]) setters[activeTab](res.data);

            alert(editingItem ? 'Обновлено!' : 'Добавлено!');
        } catch (err) {
            alert('Ошибка сохранения: ' + (err.response?.data?.message || err.message));
        }
    };

    const fetchReport = async (type) => {
        setReportLoading(true);
        setSelectedReportType(type);
        try {
            const token = localStorage.getItem('token');
            let url = `${API_URL}/reports/${type}`;
            if (reportStartDate && reportEndDate) {
                url += `?start_date=${reportStartDate}&end_date=${reportEndDate}`;
            }
            const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
            if (res.data && res.data.length > 0) {
                setReportData(res.data);
            } else {
                setReportData([]);
                alert('Нет данных за выбранный период');
            }
        } catch (err) {
            console.error('Report error:', err);
            const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
            alert('Ошибка загрузки отчёта: ' + errorMsg);
            setReportData([]);
        } finally {
            setReportLoading(false);
        }
    };

    if (loading) return <div className="admin-loading">Загрузка...</div>;
    if (error) return <div className="admin-loading" style={{ color: 'red' }}>Ошибка: {error}</div>;

    // Рендер таблицы
    const renderTable = () => {
        let tableData = [];
        let columns = [];

        if (activeTab === 'children') {
            tableData = children;
            columns = ['Фамилия', 'Имя', 'Отчество', 'Дата рождения', 'Пол'];
        } else if (activeTab === 'parents') {
            tableData = parents;
            columns = ['Фамилия', 'Имя', 'Отчество', 'Степень_родства', 'Адрес', 'Телефон', 'Паспортные данные', 'Email'];
        } else if (activeTab === 'employees') {
            tableData = employees;
            columns = ['Фамилия', 'Имя', 'Отчество', 'Дата рождения', 'Должность', 'Филиал', 'Телефон', 'Email', 'Роль'];
        } else if (activeTab === 'groups') {
            tableData = groups;
            columns = ['Название группы', 'Возраст'];
        } else if (activeTab === 'lessons') {
            tableData = lessons;
            columns = ['Название', 'Стоимость'];
        } else if (activeTab === 'vaccinations') {
            tableData = vaccinations;
            columns = ['Ребёнок', 'Прививка', 'Дата проведения', 'Статус', 'Учреждение'];
        } else if (activeTab === 'diseases') {
            tableData = diseases;
            columns = ['Название заболевания', 'Код МКБ'];
        } else if (activeTab === 'suppliers') {
            tableData = suppliers;
            columns = ['Название', 'Контактное лицо', 'Телефон', 'Адрес'];
        } else if (activeTab === 'supplies') {
            tableData = supplies;
            columns = ['Дата поставки', 'Поставщик', 'Филиал'];
        } else {
            return null;
        }

        return (
            <div className="data-table">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>
                        {activeTab === 'children' && '👶 Дети'}
                        {activeTab === 'parents' && '👨‍👩‍👧 Родители'}
                        {activeTab === 'employees' && '👩‍🏫 Сотрудники'}
                        {activeTab === 'groups' && '👥 Группы'}
                        {activeTab === 'lessons' && '📚 Занятия'}
                        {activeTab === 'vaccinations' && '💉 Прививки'}
                        {activeTab === 'diseases' && '🏥 Заболевания'}
                        {activeTab === 'suppliers' && '📦 Поставщики'}
                        {activeTab === 'supplies' && '🚚 Поставки'}
                    </h2>
                    <button className="add-btn" onClick={handleAdd}>+ Добавить</button>
                </div>

                {tableData.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        Нет данных. Нажмите "+ Добавить" чтобы создать первую запись.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f5f5f5' }}>
                                    {columns.map(col => (
                                        <th key={col} style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                                            {col}
                                        </th>
                                    ))}
                                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                        {columns.map(col => (
                                            <td key={col} style={{ padding: '10px' }}>
                                                {item[col] || '—'}
                                            </td>
                                        ))}
                                        <td style={{ padding: '10px', textAlign: 'center' }}>
                                            <button onClick={() => handleEdit(item)} style={{ marginRight: '8px', cursor: 'pointer', background: '#4CAF50', border: 'none', borderRadius: '4px', padding: '4px 8px', color: 'white' }}>✏️</button>
                                            <button onClick={() => handleDelete(item.id)} style={{ cursor: 'pointer', background: '#f44336', border: 'none', borderRadius: '4px', padding: '4px 8px', color: 'white' }}>🗑️</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };

    // Рендер формы для модалки
    const renderModalFields = () => {
        // ДЕТИ
        if (activeTab === 'children') {
            return (
                <>
                    <input type="text" placeholder="Фамилия" value={formData.Фамилия || ''} onChange={e => setFormData({ ...formData, Фамилия: e.target.value })} style={inputStyle} />
                    <input type="text" placeholder="Имя" value={formData.Имя || ''} onChange={e => setFormData({ ...formData, Имя: e.target.value })} style={inputStyle} />
                    <input type="text" placeholder="Отчество" value={formData.Отчество || ''} onChange={e => setFormData({ ...formData, Отчество: e.target.value })} style={inputStyle} />
                    <input type="date" placeholder="Дата рождения" value={formData["Дата рождения"] || ''} onChange={e => setFormData({ ...formData, "Дата рождения": e.target.value })} style={inputStyle} />
                    <select value={formData.Пол || ''} onChange={e => setFormData({ ...formData, Пол: e.target.value })} style={inputStyle}>
                        <option value="">Выберите пол</option>
                        <option value="М">Мужской</option>
                        <option value="Ж">Женский</option>
                    </select>
                </>
            );
        }

        // РОДИТЕЛИ
        if (activeTab === 'parents') {
            return (
                <>
                    <input type="text" placeholder="Фамилия" value={formData.Фамилия || ''} onChange={e => setFormData({ ...formData, Фамилия: e.target.value })} style={inputStyle} />
                    <input type="text" placeholder="Имя" value={formData.Имя || ''} onChange={e => setFormData({ ...formData, Имя: e.target.value })} style={inputStyle} />
                    <input type="text" placeholder="Отчество" value={formData.Отчество || ''} onChange={e => setFormData({ ...formData, Отчество: e.target.value })} style={inputStyle} />
                    <select value={formData.ID_Степени || ''} onChange={e => setFormData({ ...formData, ID_Степени: e.target.value })} style={inputStyle}>
                        <option value="">Выберите степень родства</option>
                        {stepenOptions.map(s => (<option key={s.id} value={s.id}>{s.Степени_родства}</option>))}
                    </select>
                    <input type="text" placeholder="Адрес" value={formData.Адрес || ''} onChange={e => setFormData({ ...formData, Адрес: e.target.value })} style={inputStyle} />
                    <input type="tel" placeholder="Телефон" value={formData.Телефон || ''} onChange={e => setFormData({ ...formData, Телефон: e.target.value })} style={inputStyle} />
                    <input type="text" placeholder="Паспортные данные" value={formData.Паспортные_данные || formData["Паспортные данные"] || ''} onChange={e => setFormData({ ...formData, Паспортные_данные: e.target.value })} style={inputStyle} />
                    <input type="email" placeholder="Email" value={formData.Email || ''} onChange={e => setFormData({ ...formData, Email: e.target.value })} style={inputStyle} />
                    <input type="password" placeholder="Пароль (оставьте пустым, чтобы не менять)" value={formData.password || ''} onChange={e => setFormData({ ...formData, password: e.target.value })} style={inputStyle} />
                </>
            );
        }

        // СОТРУДНИКИ
        if (activeTab === 'employees') {
            return (
                <>
                    <input type="text" placeholder="Фамилия" value={formData.Фамилия || ''} onChange={e => setFormData({ ...formData, Фамилия: e.target.value })} style={inputStyle} />
                    <input type="text" placeholder="Имя" value={formData.Имя || ''} onChange={e => setFormData({ ...formData, Имя: e.target.value })} style={inputStyle} />
                    <input type="text" placeholder="Отчество" value={formData.Отчество || ''} onChange={e => setFormData({ ...formData, Отчество: e.target.value })} style={inputStyle} />
                    <input type="date" placeholder="Дата рождения" value={formData.Дата_рождения || ''} onChange={e => setFormData({ ...formData, Дата_рождения: e.target.value })} style={inputStyle} />
                    <input type="text" placeholder="Адрес" value={formData.Адрес || ''} onChange={e => setFormData({ ...formData, Адрес: e.target.value })} style={inputStyle} />
                    <input type="tel" placeholder="Телефон" value={formData.Телефон || ''} onChange={e => setFormData({ ...formData, Телефон: e.target.value })} style={inputStyle} />
                    <input type="email" placeholder="Email" value={formData.Email || ''} onChange={e => setFormData({ ...formData, Email: e.target.value })} style={inputStyle} />
                    <select value={formData.ID_Должности || ''} onChange={e => setFormData({ ...formData, ID_Должности: e.target.value })} style={inputStyle}>
                        <option value="">Выберите должность</option>
                        {positionOptions.map(p => (<option key={p.id} value={p.id}>{p.Название_должности}</option>))}
                    </select>
                    <select value={formData.ID_Филиала || ''} onChange={e => setFormData({ ...formData, ID_Филиала: e.target.value })} style={inputStyle}>
                        <option value="">Выберите филиал</option>
                        {branchOptions.map(b => (<option key={b.id} value={b.id}>{b.Название_филиала}</option>))}
                    </select>
                    <select value={formData.Роль || 'employee'} onChange={e => setFormData({ ...formData, Роль: e.target.value })} style={inputStyle}>
                        <option value="employee">Сотрудник</option>
                        <option value="admin">Администратор</option>
                    </select>
                    <input type="password" placeholder="Пароль (оставьте пустым, чтобы не менять)" value={formData.password || ''} onChange={e => setFormData({ ...formData, password: e.target.value })} style={inputStyle} />
                </>
            );
        }

        // ГРУППЫ
        if (activeTab === 'groups') {
            return (
                <>
                    <input type="text" placeholder="Название группы" value={formData.Название_Группы || ''} onChange={e => setFormData({ ...formData, Название_Группы: e.target.value })} style={inputStyle} />
                    <select value={formData.ID_Категории || ''} onChange={e => setFormData({ ...formData, ID_Категории: e.target.value })} style={inputStyle}>
                        <option value="">Выберите возраст</option>
                        {ageCategoryOptions.map(a => (<option key={a.id} value={a.id}>{a.Возраст}</option>))}
                    </select>
                </>
            );
        }

        // ЗАНЯТИЯ
        if (activeTab === 'lessons') {
            return (
                <>
                    <input type="text" placeholder="Название занятия" value={formData.Название || ''} onChange={e => setFormData({ ...formData, Название: e.target.value })} style={inputStyle} />
                    <input type="number" placeholder="Стоимость" value={formData.Стоимость || ''} onChange={e => setFormData({ ...formData, Стоимость: e.target.value })} style={inputStyle} />
                </>
            );
        }

        // ПРИВИВКИ
        if (activeTab === 'vaccinations') {
            return (
                <>
                    <select value={formData.ID_Ребенка || ''} onChange={e => setFormData({ ...formData, ID_Ребенка: e.target.value })} style={inputStyle}>
                        <option value="">Выберите ребёнка</option>
                        {children.map(child => (<option key={child.id} value={child.id}>{child.Фамилия} {child.Имя}</option>))}
                    </select>
                    <select value={formData.ID_Прививки || ''} onChange={e => setFormData({ ...formData, ID_Прививки: e.target.value })} style={inputStyle}>
                        <option value="">Выберите прививку</option>
                        {vaccinesList.map(v => (<option key={v.id} value={v.id}>{v.Название_прививки}</option>))}
                    </select>
                    <input type="date" placeholder="Дата проведения" value={formData.Дата_проведения || ''} onChange={e => setFormData({ ...formData, Дата_проведения: e.target.value })} style={inputStyle} />
                    <select value={formData.Статус || 'Сделана'} onChange={e => setFormData({ ...formData, Статус: e.target.value })} style={inputStyle}>
                        <option value="Сделана">Сделана</option>
                        <option value="Запланирована">Запланирована</option>
                        <option value="Просрочена">Просрочена</option>
                    </select>
                    <input type="text" placeholder="Медицинское учреждение" value={formData.Медицинское_учреждение || ''} onChange={e => setFormData({ ...formData, Медицинское_учреждение: e.target.value })} style={inputStyle} />
                </>
            );
        }

        // ЗАБОЛЕВАНИЯ
        if (activeTab === 'diseases') {
            return (
                <>
                    <input type="text" placeholder="Название заболевания" value={formData.Название_заболевания || ''} onChange={e => setFormData({ ...formData, Название_заболевания: e.target.value })} style={inputStyle} />
                    <input type="text" placeholder="Код МКБ" value={formData.Код_МКБ || ''} onChange={e => setFormData({ ...formData, Код_МКБ: e.target.value })} style={inputStyle} />
                </>
            );
        }

        // ПОСТАВЩИКИ
        if (activeTab === 'suppliers') {
            return (
                <>
                    <input type="text" placeholder="Название компании" value={formData.Название_компании || ''} onChange={e => setFormData({ ...formData, Название_компании: e.target.value })} style={inputStyle} />
                    <input type="text" placeholder="Контактное лицо" value={formData.Контактное_лицо || ''} onChange={e => setFormData({ ...formData, Контактное_лицо: e.target.value })} style={inputStyle} />
                    <input type="tel" placeholder="Телефон" value={formData.Телефон || ''} onChange={e => setFormData({ ...formData, Телефон: e.target.value })} style={inputStyle} />
                    <input type="text" placeholder="Адрес" value={formData.Адрес || ''} onChange={e => setFormData({ ...formData, Адрес: e.target.value })} style={inputStyle} />
                </>
            );
        }

        // ПОСТАВКИ
        if (activeTab === 'supplies') {
            return (
                <>
                    <input type="date" placeholder="Дата поставки" value={formData.Дата_поставки || ''} onChange={e => setFormData({ ...formData, Дата_поставки: e.target.value })} style={inputStyle} />
                    <select value={formData.ID_Филиала || ''} onChange={e => setFormData({ ...formData, ID_Филиала: e.target.value })} style={inputStyle}>
                        <option value="">Выберите филиал</option>
                        {branchOptions.map(b => (<option key={b.id} value={b.id}>{b.Название_филиала}</option>))}
                    </select>
                    <select value={formData.ID_Поставщика || ''} onChange={e => setFormData({ ...formData, ID_Поставщика: e.target.value })} style={inputStyle}>
                        <option value="">Выберите поставщика</option>
                        {suppliers.map(s => (<option key={s.id} value={s.id}>{s.Название_компании || s.Название}</option>))}
                    </select>
                </>
            );
        }

        // СТАНДАРТНЫЕ ПОЛЯ
        return Object.keys(formData)
            .filter(k => !['id', 'ID_Сотрудника', 'ID_Ребенка', 'Id_Родителя', 'ID_Группы', 'ID_Занятия', 'password'].includes(k))
            .map(key => (<input key={key} type="text" placeholder={key} value={formData[key] || ''} onChange={e => setFormData({ ...formData, [key]: e.target.value })} style={inputStyle} />));
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <div className="sidebar-logo">
                    <img src="/logo.png" alt="Солнышко" />
                    <span>Солнышко</span>
                </div>
                <nav className="sidebar-nav">
                    <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}><img src="/images/icons/profile.png" alt="Профиль" className="nav-icon" /> Профиль</button>
                    <button className={activeTab === 'children' ? 'active' : ''} onClick={() => setActiveTab('children')}><img src="/images/icons/children.png" alt="Дети" className="nav-icon" /> Дети</button>
                    <button className={activeTab === 'parents' ? 'active' : ''} onClick={() => setActiveTab('parents')}><img src="/images/icons/parents.png" alt="Родители" className="nav-icon" /> Родители</button>
                    <button className={activeTab === 'employees' ? 'active' : ''} onClick={() => setActiveTab('employees')}><img src="/images/icons/employees.png" alt="Сотрудники" className="nav-icon" /> Сотрудники</button>
                    <button className={activeTab === 'groups' ? 'active' : ''} onClick={() => setActiveTab('groups')}><img src="/images/icons/groups.png" alt="Группы" className="nav-icon" /> Группы</button>
                    <button className={activeTab === 'lessons' ? 'active' : ''} onClick={() => setActiveTab('lessons')}><img src="/images/icons/lessons.png" alt="Занятия" className="nav-icon" /> Занятия</button>

                    <button className={activeTab === 'vaccinations' || activeTab === 'diseases' ? 'active' : ''} onClick={() => setActiveTab('medical')}><img src="/images/icons/medical.png" alt="Медицина" className="nav-icon" /> Медицинский учёт</button>
                    {activeTab === 'medical' && (<div style={{ paddingLeft: '48px', display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}><button onClick={() => setActiveTab('vaccinations')}>💉 Прививки</button><button onClick={() => setActiveTab('diseases')}>🏥 Заболевания</button></div>)}

                    <button className={activeTab === 'suppliers' || activeTab === 'supplies' ? 'active' : ''} onClick={() => setActiveTab('supply')}><img src="/images/icons/suppliers.png" alt="Поставщики" className="nav-icon" /> Поставки</button>
                    {activeTab === 'supply' && (<div style={{ paddingLeft: '48px', display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '5px' }}><button onClick={() => setActiveTab('suppliers')}>📦 Поставщики</button><button onClick={() => setActiveTab('supplies')}>🚚 Поставки</button></div>)}

                    <button className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}><img src="/images/icons/reports.png" alt="Отчёты" className="nav-icon" /> Отчёты</button>
                </nav>
                <button onClick={logout} className="logout-btn"><img src="/images/icons/logout.png" alt="Выйти" className="nav-icon" /> Выйти</button>
            </aside>

            <main className="admin-main">
                {/* ПРОФИЛЬ */}
                {activeTab === 'profile' && profile && (
                    <div className="profile-section">
                        <div className="profile-header">
                            <div className="profile-avatar">
                                <img src="/images/admin/avatar-placeholder.png" alt="Аватар" />
                            </div>
                            <div className="profile-info">
                                {editingProfile ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <input value={profileForm.Фамилия || ''} onChange={e => setProfileForm({ ...profileForm, Фамилия: e.target.value })} placeholder="Фамилия" style={inputStyle} />
                                        <input value={profileForm.Имя || ''} onChange={e => setProfileForm({ ...profileForm, Имя: e.target.value })} placeholder="Имя" style={inputStyle} />
                                        <input value={profileForm.Отчество || ''} onChange={e => setProfileForm({ ...profileForm, Отчество: e.target.value })} placeholder="Отчество" style={inputStyle} />
                                        <input type="date" value={profileForm.Дата_рождения || ''} onChange={e => setProfileForm({ ...profileForm, Дата_рождения: e.target.value })} placeholder="Дата рождения" style={inputStyle} />
                                        <input value={profileForm.Адрес || ''} onChange={e => setProfileForm({ ...profileForm, Адрес: e.target.value })} placeholder="Адрес" style={inputStyle} />
                                        <input value={profileForm.Телефон || ''} onChange={e => setProfileForm({ ...profileForm, Телефон: e.target.value })} placeholder="Телефон" style={inputStyle} />
                                        <input type="email" value={profileForm.Email || ''} onChange={e => setProfileForm({ ...profileForm, Email: e.target.value })} placeholder="Email" style={inputStyle} />
                                        <input type="password" value={profileForm.password || ''} onChange={e => setProfileForm({ ...profileForm, password: e.target.value })} placeholder="Новый пароль" style={inputStyle} />
                                        <div>
                                            <button onClick={handleProfileSave} style={{ marginRight: '10px', padding: '8px 16px', background: '#2c5f2d', color: 'white', border: 'none', borderRadius: '8px' }}>Сохранить</button>
                                            <button onClick={() => setEditingProfile(false)} style={{ padding: '8px 16px', background: '#ccc', border: 'none', borderRadius: '8px' }}>Отмена</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h2>{profile.Фамилия} {profile.Имя} {profile.Отчество}</h2>
                                        <p>🎂 {profile.Дата_рождения ? new Date(profile.Дата_рождения).toLocaleDateString() : '—'}</p>
                                        <p>👤 {profile.Должность}</p>
                                        <p>🏢 {profile.Филиал}</p>
                                        <p>📍 {profile.Адрес || '—'}</p>
                                        <p>📞 {profile.Телефон}</p>
                                        <p>✉️ {profile.Email || '—'}</p>
                                        <button onClick={() => setEditingProfile(true)} style={{ marginTop: '15px', background: '#fbc80b', border: 'none', padding: '8px 20px', borderRadius: '30px', cursor: 'pointer' }}>✏️ Редактировать профиль</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {/* ТАБЛИЦЫ */}
                {(activeTab === 'children' || activeTab === 'parents' || activeTab === 'employees' || activeTab === 'groups' || activeTab === 'lessons' || activeTab === 'vaccinations' || activeTab === 'diseases' || activeTab === 'suppliers' || activeTab === 'supplies') && renderTable()}

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

                {/* ОТЧЁТЫ */}
                {activeTab === 'reports' && (
                    <div>
                        <h2>📊 Отчёты и аналитика</h2>
                        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
                            <h3>Фильтры по дате</h3>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <input type="date" value={reportStartDate} onChange={e => setReportStartDate(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
                                <span>—</span>
                                <input type="date" value={reportEndDate} onChange={e => setReportEndDate(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }} />
                                <button onClick={() => { setReportStartDate(''); setReportEndDate(''); }} style={{ padding: '8px 16px', background: '#666', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Очистить</button>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                            <button onClick={() => fetchReport('attendance')} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', border: 'none', color: 'white' }}><div style={{ fontSize: '40px', marginBottom: '10px' }}>📋</div><div style={{ fontWeight: 'bold', fontSize: '18px' }}>Посещаемость детей</div><div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.9 }}>Отчёт по посещениям</div></button>
                            <button onClick={() => fetchReport('employee-workload')} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '24px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', border: 'none', color: 'white' }}><div style={{ fontSize: '40px', marginBottom: '10px' }}>👩‍🏫</div><div style={{ fontWeight: 'bold', fontSize: '18px' }}>Занятость сотрудников</div><div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.9 }}>Нагрузка и график</div></button>
                            <button onClick={() => fetchReport('supplies')} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '24px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', border: 'none', color: 'white' }}><div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div><div style={{ fontWeight: 'bold', fontSize: '18px' }}>Поставки товаров</div><div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.9 }}>Учёт поставок</div></button>
                            <button onClick={() => fetchReport('vaccinations')} style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', padding: '24px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', border: 'none', color: 'white' }}><div style={{ fontSize: '40px', marginBottom: '10px' }}>💉</div><div style={{ fontWeight: 'bold', fontSize: '18px' }}>Прививки детей</div><div style={{ fontSize: '12px', marginTop: '8px', opacity: 0.9 }}>Вакцинация</div></button>
                        </div>
                        {reportLoading && <div style={{ textAlign: 'center', padding: '40px' }}>⏳ Загрузка отчёта...</div>}
                        {reportData.length > 0 && !reportLoading && (
                            <div style={{ marginTop: '30px', background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <h3 style={{ margin: 0 }}>📈 Результаты: {selectedReportType === 'attendance' && 'Посещаемость'}{selectedReportType === 'employee-workload' && 'Занятость сотрудников'}{selectedReportType === 'supplies' && 'Поставки'}{selectedReportType === 'vaccinations' && 'Прививки'}</h3>
                                    <button onClick={() => setReportData([])} style={{ padding: '6px 12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>✕ Закрыть</button>
                                </div>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead><tr style={{ background: '#f5f5f5' }}>{Object.keys(reportData[0]).map(k => (<th key={k} style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>{k}</th>))}</tr></thead>
                                        <tbody>{reportData.map((row, i) => (<tr key={i} style={{ borderBottom: '1px solid #eee' }}>{Object.values(row).map((v, j) => (<td key={j} style={{ padding: '10px' }}>{v !== null && v !== undefined ? String(v) : '—'}</td>))}</tr>))}</tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* МОДАЛЬНОЕ ОКНО */}
            {modalOpen && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '16px', padding: '24px', width: '450px', maxWidth: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
                        <h3 style={{ marginTop: 0 }}>{editingItem ? '✏️ Редактировать' : '➕ Добавить'}</h3>
                        {renderModalFields()}
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button onClick={handleSave} style={{ padding: '10px 20px', borderRadius: '8px', background: '#2c5f2d', color: 'white', border: 'none', cursor: 'pointer' }}>Сохранить</button>
                            <button onClick={() => setModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', background: '#ccc', border: 'none', cursor: 'pointer' }}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}