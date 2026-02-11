import React, { useEffect, useState } from 'react';
import { supabase } from '@payroll-system/shared';

interface Salary {
  id: string;
  amount: number;
  Currency?: string;
  currency?: string;
  status?: string;
  pay_date?: string;
  employees: { full_name: string } | null;
}

interface Employee {
  id: string;
  full_name: string;
  job_title: string;
}

export function App() {
  const [view, setView] = useState<'list' | 'add'>('list');
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const [newPayment, setNewPayment] = useState({
    employee_id: '',
    amount: '',
    currency: 'USD',
    pay_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, []);

  async function fetchSalaries() {
    setLoading(true);
    const { data } = await supabase.from('salaries').select('*, employees(full_name)').order('pay_date', { ascending: false });
    setSalaries(data || []);
    setLoading(false);
  }

  async function fetchEmployees() {
    const { data } = await supabase.from('employees').select('id, full_name, job_title');
    setEmployees(data || []);
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    if (!newPayment.employee_id || !newPayment.amount) return alert('Please fill in all fields');

    setLoading(true);

    const { error } = await supabase.from('salaries').insert({
      employee_id: newPayment.employee_id,
      amount: parseFloat(newPayment.amount),
      currency: newPayment.currency,
      status: 'Paid',
      pay_date: newPayment.pay_date
    });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('✅ Payment Successful!');
      setView('list');
      setNewPayment({ ...newPayment, amount: '' });
      fetchSalaries();
    }
    setLoading(false);
  }

  return (
    <div style={{
      border: '2px dashed #61dafb',
      padding: '20px',
      borderRadius: '8px',
      background: '#f0f9ff',
      fontFamily: 'Arial, sans-serif'
    }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ margin: 0 }}>Salaries Manager</h2>
          <span style={{ background: '#61dafb', color: '#000', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>React</span>
        </div>

        {view === 'list' ? (
          <button
            onClick={() => setView('add')}
            style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Make Payment
          </button>
        ) : (
          <button
            onClick={() => setView('list')}
            style={{ background: 'transparent', border: '1px solid #666', color: '#666', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
          >
            &larr; Back to History
          </button>
        )}
      </div>

      {view === 'list' && (
        <>
          {loading && <div>Loading records...</div>}

          {!loading && salaries.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
              <thead>
                <tr style={{ background: '#e1f5fe', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Employee</th>
                  <th style={{ padding: '10px' }}>Amount</th>
                  <th style={{ padding: '10px' }}>Date</th>
                  <th style={{ padding: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.employees?.full_name || 'Unknown'}</td>
                    <td style={{ padding: '10px', color: '#2e7d32' }}>
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: s.currency || s.Currency || 'USD' }).format(s.amount)}
                    </td>
                    <td style={{ padding: '10px', color: '#666' }}>{s.pay_date || s.pay_date || '-'}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ background: '#c8e6c9', color: '#2e7d32', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>
                        {s.status || 'Paid'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && salaries.length === 0 && <div>No payments found.</div>}
        </>
      )}

      {view === 'add' && (
        <div style={{ maxWidth: '400px', margin: '0 auto', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>Process New Salary</h3>

          <form onSubmit={handlePayment}>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Select Employee</label>
              <select
                required
                style={{ width: '100%', padding: '8px' }}
                value={newPayment.employee_id}
                onChange={e => setNewPayment({...newPayment, employee_id: e.target.value})}
              >
                <option value="">-- Choose Employee --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.job_title})</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Amount</label>
              <div style={{ display: 'flex', gap: '5px' }}>
                <input
                  type="number"
                  placeholder="5000"
                  required
                  style={{ flex: 1, padding: '8px' }}
                  value={newPayment.amount}
                  onChange={e => setNewPayment({...newPayment, amount: e.target.value})}
                />
                <select
                  style={{ padding: '8px' }}
                  value={newPayment.currency}
                  onChange={e => setNewPayment({...newPayment, currency: e.target.value})}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="MAD">MAD</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Payment Date</label>
              <input
                type="date"
                required
                style={{ width: '100%', padding: '8px' }}
                value={newPayment.pay_date}
                onChange={e => setNewPayment({...newPayment, pay_date: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', background: '#61dafb', color: '#000', border: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {loading ? 'Processing...' : 'Confirm Payment'}
            </button>

          </form>
        </div>
      )}
    </div>
  );
}

export default App;
