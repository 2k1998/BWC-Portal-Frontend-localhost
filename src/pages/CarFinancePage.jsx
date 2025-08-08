// src/pages/CarFinancePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { carFinanceApi } from '../api/carFinanceAPI'; // <-- Add this import
import './CarFinancePage.css';

const CarFinancePage = () => {
    const { user, accessToken } = useAuth();
    
    // State Management
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    
    const [financeData, setFinanceData] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        netProfit: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        rentalTransactions: [],
        serviceRecords: [],
        carStatistics: {
            totalCars: 0,
            activeCars: 0,
            inServiceCars: 0,
            availableCars: 0
        }
    });

    const [newIncome, setNewIncome] = useState({
        rental_id: '',
        car_id: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        customer_name: ''
    });

    const [newExpense, setNewExpense] = useState({
        car_id: '',
        service_type: 'maintenance',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        vendor: '',
        mileage: ''
    });

    const [showIncomeModal, setShowIncomeModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);

    // Check permissions
    useEffect(() => {
        if (!user || (user.role !== 'admin' && !user.permissions?.includes('view_car_finances'))) {
            window.location.href = '/dashboard';
        }
    }, [user]);

    // Fetch data
    const fetchFinanceData = React.useCallback(async () => {
        try {
            setLoading(true);

            // Fetch summary from API
            const summary = await carFinanceApi.getSummary(
                dateRange.start,
                dateRange.end,
                accessToken
            );

            // Fetch transactions from API
            const transactions = await carFinanceApi.getTransactions(
                { start_date: dateRange.start, end_date: dateRange.end },
                accessToken
            );

            setFinanceData({
                totalIncome: summary.total_income,
                totalExpenses: summary.total_expenses,
                netProfit: summary.net_profit,
                monthlyIncome: summary.monthly_income,
                monthlyExpenses: summary.monthly_expenses,
                rentalTransactions: transactions.rentals || [],
                serviceRecords: transactions.expenses || [],
                carStatistics: {
                    totalCars: summary.total_cars,
                    activeCars: summary.active_cars,
                    inServiceCars: summary.in_service_cars,
                    availableCars: summary.available_cars
                }
            });

        } catch (error) {
            console.error('Error fetching finance data:', error);
        } finally {
            setLoading(false);
        }
    }, [accessToken, dateRange]);

    useEffect(() => {
        if (accessToken) {
            fetchFinanceData();
        }
    }, [accessToken, dateRange, fetchFinanceData]);

    const handleAddIncome = () => {
        try {
            console.log('Adding income:', newIncome);
            setShowIncomeModal(false);
            setNewIncome({
                rental_id: '',
                car_id: '',
                amount: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                customer_name: ''
            });
            fetchFinanceData();
        } catch (error) {
            console.error('Error adding income:', error);
        }
    };

    const handleAddExpense = () => {
        try {
            console.log('Adding expense:', newExpense);
            setShowExpenseModal(false);
            setNewExpense({
                car_id: '',
                service_type: 'maintenance',
                amount: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                vendor: '',
                mileage: ''
            });
            fetchFinanceData();
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="car-finance-page loading">
                <div className="loading-content">
                    <div className="spinner"></div>
                    <p>Loading car finance data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="car-finance-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1>🚗 Car Fleet Financial Management</h1>
                    <p>Manage income and expenses for your car rental fleet</p>
                </div>
                <div className="header-actions">
                    <button className="btn-primary" onClick={() => setShowIncomeModal(true)}>
                        + Add Income
                    </button>
                    <button className="btn-danger" onClick={() => setShowExpenseModal(true)}>
                        + Add Expense
                    </button>
                </div>
            </div>

            {/* Date Range Filter */}
            <div className="filters-section">
                <div className="date-range">
                    <label>From:</label>
                    <input 
                        type="date" 
                        value={dateRange.start}
                        onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    />
                    <label>To:</label>
                    <input 
                        type="date" 
                        value={dateRange.end}
                        onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    />
                    <button className="btn-filter" onClick={fetchFinanceData}>
                        Apply Filter
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">
                <div className="summary-card income-card">
                    <div className="card-icon">💰</div>
                    <div className="card-body">
                        <h3>Total Income</h3>
                        <p className="amount">{formatCurrency(financeData.totalIncome)}</p>
                        <span className="subtitle">From rentals</span>
                    </div>
                </div>
                
                <div className="summary-card expense-card">
                    <div className="card-icon">💸</div>
                    <div className="card-body">
                        <h3>Total Expenses</h3>
                        <p className="amount">{formatCurrency(financeData.totalExpenses)}</p>
                        <span className="subtitle">Services & Maintenance</span>
                    </div>
                </div>
                
                <div className={`summary-card ${financeData.netProfit >= 0 ? 'profit-card' : 'loss-card'}`}>
                    <div className="card-icon">{financeData.netProfit >= 0 ? '📈' : '📉'}</div>
                    <div className="card-body">
                        <h3>Net {financeData.netProfit >= 0 ? 'Profit' : 'Loss'}</h3>
                        <p className="amount">{formatCurrency(Math.abs(financeData.netProfit))}</p>
                        <span className="subtitle">
                            {financeData.totalIncome > 0 
                                ? `${((financeData.netProfit / financeData.totalIncome) * 100).toFixed(1)}% margin`
                                : 'No income yet'}
                        </span>
                    </div>
                </div>
                
                <div className="summary-card stats-card">
                    <div className="card-icon">🚙</div>
                    <div className="card-body">
                        <h3>Fleet Status</h3>
                        <p className="amount">{financeData.carStatistics.totalCars} Cars</p>
                        <span className="subtitle">{financeData.carStatistics.availableCars} available</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs-container">
                <div className="tabs">
                    <button 
                        className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button 
                        className={`tab ${activeTab === 'income' ? 'active' : ''}`}
                        onClick={() => setActiveTab('income')}
                    >
                        Income Records
                    </button>
                    <button 
                        className={`tab ${activeTab === 'expenses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('expenses')}
                    >
                        Service Expenses
                    </button>
                    <button 
                        className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reports')}
                    >
                        Reports
                    </button>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'overview' && (
                        <div className="overview-content">
                            <div className="chart-section">
                                <h3>Monthly Comparison</h3>
                                <div className="simple-chart">
                                    <div className="chart-bar">
                                        <div className="bar-label">Income</div>
                                        <div className="bar-track">
                                            <div 
                                                className="bar-fill income-fill" 
                                                style={{width: `${Math.max(financeData.monthlyIncome, financeData.monthlyExpenses) > 0 ? (financeData.monthlyIncome / Math.max(financeData.monthlyIncome, financeData.monthlyExpenses)) * 100 : 0}%`}}
                                            >
                                                {formatCurrency(financeData.monthlyIncome)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="chart-bar">
                                        <div className="bar-label">Expenses</div>
                                        <div className="bar-track">
                                            <div 
                                                className="bar-fill expense-fill" 
                                                style={{width: `${Math.max(financeData.monthlyIncome, financeData.monthlyExpenses) > 0 ? (financeData.monthlyExpenses / Math.max(financeData.monthlyIncome, financeData.monthlyExpenses)) * 100 : 0}%`}}
                                            >
                                                {formatCurrency(financeData.monthlyExpenses)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="recent-activity">
                                <h3>Recent Activity</h3>
                                <div className="activity-list">
                                    {financeData.serviceRecords.slice(0, 5).map(record => (
                                        <div key={record.id} className="activity-item expense">
                                            <div className="activity-icon">🔧</div>
                                            <div className="activity-details">
                                                <p className="activity-title">{record.type} - Car #{record.car_id}</p>
                                                <p className="activity-meta">{record.vendor} • {formatDate(record.date)}</p>
                                            </div>
                                            <div className="activity-amount negative">
                                                -{formatCurrency(record.amount)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'income' && (
                        <div className="income-content">
                            <table className="finance-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Rental ID</th>
                                        <th>Customer</th>
                                        <th>Car</th>
                                        <th>Days</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {financeData.rentalTransactions.map(rental => (
                                        <tr key={rental.id}>
                                            <td>{formatDate(rental.created_at)}</td>
                                            <td>#{rental.id}</td>
                                            <td>{rental.customer_name} {rental.customer_surname}</td>
                                            <td>Car #{rental.car_id}</td>
                                            <td>{rental.rental_days}</td>
                                            <td className="amount-cell income">{formatCurrency(rental.rental_days * 50)}</td>
                                            <td>
                                                <span className={`status ${rental.is_locked ? 'completed' : 'active'}`}>
                                                    {rental.is_locked ? 'Completed' : 'Active'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'expenses' && (
                        <div className="expenses-content">
                            <table className="finance-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Car</th>
                                        <th>Service Type</th>
                                        <th>Vendor</th>
                                        <th>Amount</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {financeData.serviceRecords.map(expense => (
                                        <tr key={expense.id}>
                                            <td>{formatDate(expense.date)}</td>
                                            <td>Car #{expense.car_id}</td>
                                            <td>
                                                <span className={`service-type ${expense.type}`}>
                                                    {expense.type}
                                                </span>
                                            </td>
                                            <td>{expense.vendor}</td>
                                            <td className="amount-cell expense">{formatCurrency(expense.amount)}</td>
                                            <td>
                                                <button className="btn-icon">✏️</button>
                                                <button className="btn-icon">🗑️</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="reports-content">
                            <div className="report-cards">
                                <div className="report-card">
                                    <h3>Service Cost Breakdown</h3>
                                    <div className="breakdown-list">
                                        <div className="breakdown-item">
                                            <span>Maintenance</span>
                                            <span>{formatCurrency(250)}</span>
                                        </div>
                                        <div className="breakdown-item">
                                            <span>Repairs</span>
                                            <span>{formatCurrency(450)}</span>
                                        </div>
                                        <div className="breakdown-item">
                                            <span>Fuel</span>
                                            <span>{formatCurrency(80)}</span>
                                        </div>
                                        <div className="breakdown-item">
                                            <span>Insurance</span>
                                            <span>{formatCurrency(1200)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="report-card">
                                    <h3>Top Performing Cars</h3>
                                    <div className="performance-list">
                                        <div className="performance-item">
                                            <span>Car #1 - Toyota Camry</span>
                                            <span className="positive">{formatCurrency(2500)}</span>
                                        </div>
                                        <div className="performance-item">
                                            <span>Car #2 - Honda Accord</span>
                                            <span className="positive">{formatCurrency(2100)}</span>
                                        </div>
                                        <div className="performance-item">
                                            <span>Car #3 - Nissan Altima</span>
                                            <span className="positive">{formatCurrency(1800)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="export-section">
                                <h3>Export Reports</h3>
                                <div className="export-buttons">
                                    <button className="btn-export">📊 Export to Excel</button>
                                    <button className="btn-export">📄 Export to PDF</button>
                                    <button className="btn-export">📈 Generate Monthly Report</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Income Modal */}
            {showIncomeModal && (
                <div className="modal-overlay" onClick={() => setShowIncomeModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add Rental Income</h2>
                            <button className="close-btn" onClick={() => setShowIncomeModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Customer Name *</label>
                                <input 
                                    type="text" 
                                    value={newIncome.customer_name}
                                    onChange={(e) => setNewIncome({...newIncome, customer_name: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Car *</label>
                                <select 
                                    value={newIncome.car_id}
                                    onChange={(e) => setNewIncome({...newIncome, car_id: e.target.value})}
                                >
                                    <option value="">Select a car</option>
                                    <option value="1">Car #1 - Toyota Camry</option>
                                    <option value="2">Car #2 - Honda Accord</option>
                                    <option value="3">Car #3 - Nissan Altima</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Amount (EUR) *</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={newIncome.amount}
                                    onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Date *</label>
                                <input 
                                    type="date" 
                                    value={newIncome.date}
                                    onChange={(e) => setNewIncome({...newIncome, date: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    value={newIncome.description}
                                    onChange={(e) => setNewIncome({...newIncome, description: e.target.value})}
                                    rows="3"
                                />
                            </div>
                            <div className="modal-actions">
                                <button className="btn-cancel" onClick={() => setShowIncomeModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn-primary" onClick={handleAddIncome}>
                                    Add Income
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Expense Modal */}
            {showExpenseModal && (
                <div className="modal-overlay" onClick={() => setShowExpenseModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add Service Expense</h2>
                            <button className="close-btn" onClick={() => setShowExpenseModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Car *</label>
                                <select 
                                    value={newExpense.car_id}
                                    onChange={(e) => setNewExpense({...newExpense, car_id: e.target.value})}
                                >
                                    <option value="">Select a car</option>
                                    <option value="1">Car #1 - Toyota Camry</option>
                                    <option value="2">Car #2 - Honda Accord</option>
                                    <option value="3">Car #3 - Nissan Altima</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Service Type *</label>
                                <select 
                                    value={newExpense.service_type}
                                    onChange={(e) => setNewExpense({...newExpense, service_type: e.target.value})}
                                >
                                    <option value="maintenance">Maintenance</option>
                                    <option value="repair">Repair</option>
                                    <option value="fuel">Fuel</option>
                                    <option value="insurance">Insurance</option>
                                    <option value="cleaning">Cleaning</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Vendor *</label>
                                <input 
                                    type="text" 
                                    value={newExpense.vendor}
                                    onChange={(e) => setNewExpense({...newExpense, vendor: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Amount (EUR) *</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={newExpense.amount}
                                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Date *</label>
                                <input 
                                    type="date" 
                                    value={newExpense.date}
                                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Mileage</label>
                                <input 
                                    type="number" 
                                    value={newExpense.mileage}
                                    onChange={(e) => setNewExpense({...newExpense, mileage: e.target.value})}
                                    placeholder="Current mileage"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    value={newExpense.description}
                                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                                    rows="3"
                                />
                            </div>
                            <div className="modal-actions">
                                <button className="btn-cancel" onClick={() => setShowExpenseModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn-danger" onClick={handleAddExpense}>
                                    Add Expense
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarFinancePage;