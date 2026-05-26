import React, { useState } from 'react';
import axios from 'axios';

export default function ReportsPage() {
    const [reportType, setReportType] = useState('attendance');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchReport = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            let url = '';
            if (reportType === 'attendance') url = `/api/reports/attendance?start_date=${startDate}&end_date=${endDate}&group_id=1`;
            if (reportType === 'supplies') url = `/api/reports/supplies?start_date=${startDate}&end_date=${endDate}`;
            const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
            setData(res.data);
        } catch (err) {
            console.error(err);
            alert('Ошибка загрузки отчёта');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Отчёты</h1>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button onClick={() => setReportType('attendance')} style={{ padding: '8px 16px', background: reportType === 'attendance' ? '#2c5f2d' : '#ddd', color: reportType === 'attendance' ? 'white' : 'black', border: 'none', borderRadius: '20px' }}>
                    Посещаемость
                </button>
                <button onClick={() => setReportType('supplies')} style={{ padding: '8px 16px', background: reportType === 'supplies' ? '#2c5f2d' : '#ddd', color: reportType === 'supplies' ? 'white' : 'black', border: 'none', borderRadius: '20px' }}>
                    Поставки
                </button>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '8px' }} />
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '8px' }} />
                <button onClick={fetchReport} style={{ padding: '8px 16px', background: '#fbc80b', border: 'none', borderRadius: '20px' }}>Сформировать</button>
            </div>
            {loading && <div>Загрузка...</div>}
            {!loading && data.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            {Object.keys(data[0]).map(key => <th key={key} style={{ padding: '8px', textAlign: 'left' }}>{key}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => (
                            <tr key={idx}>
                                {Object.values(row).map((val, i) => <td key={i} style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{val}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}