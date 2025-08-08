// src/components/PaymentWidget.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { paymentApi } from '../api/PaymentAPI';
import '../styles/PaymentWidget.css';
import CarFinanceWidget from './CarFinanceWidget';

const PaymentWidget = () => {
    const { accessToken, isAdmin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState({
        upcomingPayments: [],
        overduePayments: [],
        totalPending: 0,
        totalPaid: 0,
        currentMonthCommissions: 0,
        employeeSummaries: []
    });

    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                setLoading(true);
                
                // Fetch payments
                const payments = await paymentApi.getPayments(accessToken, {
                    limit: 100,
                    status_filter: 'pending'
                });
                
                // Fetch dashboard summary
                const summary = await paymentApi.getDashboardSummary(accessToken) || {};
                
                // Process payments
                const now = new Date();
                const upcoming = [];
                const overdue = [];
                let totalPending = 0;
                
                payments.forEach(payment => {
                    const dueDate = new Date(payment.due_date);
                    if (payment.status === 'pending') {
                        totalPending += parseFloat(payment.amount);
                        if (dueDate < now) {
                            overdue.push(payment);
                        } else {
                            upcoming.push(payment);
                        }
                    }
                });
                
                // Sort by due date
                upcoming.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
                overdue.sort((a, b) => new Date(b.due_date) - new Date(a.due_date));
                
                setPaymentData({
                    upcomingPayments: upcoming.slice(0, 5),
                    overduePayments: overdue.slice(0, 5),
                    totalPending: totalPending,
                    totalPaid: summary.total_paid_this_month || 0,
                    currentMonthCommissions: summary.current_month_commissions || 0,
                    employeeSummaries: summary.employee_summaries || []
                });
            } catch (error) {
                console.error('Error fetching payment data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (accessToken) {
            fetchPaymentData();
        }
    }, [accessToken]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('el-GR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('el-GR');
    };


    const handlePaymentClick = (paymentId) => {
        // Navigate to payment detail or open modal
        window.location.href = `/payments/${paymentId}`;
    };

    if (loading) {
        return (
            <div className="payment-widget loading">
                <div className="widget-header">
                    <h2>Payment Overview</h2>
                </div>
                <div className="loading-spinner">Loading...</div>
            </div>
        );
    }

    return (
        <div className="payment-widget">
            <div className="widget-header">
                <h2>Payment Overview</h2>
                <button 
                    className="view-all-btn"
                    onClick={() => window.location.href = '/payments'}
                >
                    View All
                </button>
            </div>

            {/* Summary Cards */}
            <div className="payment-summary-cards">
                <div className="summary-card">
                    <div className="summary-label">Pending Payments</div>
                    <div className="summary-value pending">{formatCurrency(paymentData.totalPending)}</div>
                </div>
                <div className="summary-card">
                    <div className="summary-label">Paid This Month</div>
                    <div className="summary-value paid">{formatCurrency(paymentData.totalPaid)}</div>
                </div>
                <div className="summary-card">
                    <div className="summary-label">Current Commissions</div>
                    <div className="summary-value commission">{formatCurrency(paymentData.currentMonthCommissions)}</div>
                </div>
            </div>

            {/* Overdue Payments Alert */}
            {paymentData.overduePayments.length > 0 && (
                <div className="overdue-alert">
                    <h3>⚠️ Overdue Payments</h3>
                    <div className="payment-list">
                        {paymentData.overduePayments.map(payment => (
                            <div 
                                key={payment.id} 
                                className="payment-item overdue"
                                onClick={() => handlePaymentClick(payment.id)}
                            >
                                <div className="payment-info">
                                    <div className="payment-title">{payment.title}</div>
                                    <div className="payment-employee">
                                        {payment.employee_name || payment.company_name || 'N/A'}
                                    </div>
                                </div>
                                <div className="payment-details">
                                    <div className="payment-amount">{formatCurrency(payment.amount)}</div>
                                    <div className="payment-date overdue">
                                        Overdue: {formatDate(payment.due_date)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upcoming Payments */}
            <div className="upcoming-payments">
                <h3>Upcoming Payments</h3>
                {paymentData.upcomingPayments.length === 0 ? (
                    <div className="no-payments">No upcoming payments</div>
                ) : (
                    <div className="payment-list">
                        {paymentData.upcomingPayments.map(payment => (
                            <div 
                                key={payment.id} 
                                className="payment-item"
                                onClick={() => handlePaymentClick(payment.id)}
                            >
                                <div className="payment-info">
                                    <div className="payment-title">{payment.title}</div>
                                    <div className="payment-employee">
                                        {payment.employee_name || payment.company_name || 'N/A'}
                                    </div>
                                </div>
                                <div className="payment-details">
                                    <div className="payment-amount">{formatCurrency(payment.amount)}</div>
                                    <div className="payment-date">
                                        Due: {formatDate(payment.due_date)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Employee Commission Summary */}
            {paymentData.employeeSummaries.length > 0 && (
                <div className="employee-commissions">
                    <h3>Employee Commissions (This Month)</h3>
                    <div className="commission-list">
                        {paymentData.employeeSummaries.map(employee => (
                            <div key={employee.employee_id} className="commission-item">
                                <div className="commission-employee">
                                    {employee.employee_name}
                                </div>
                                <div className="commission-details">
                                    <span className="commission-sales">
                                        Sales: {formatCurrency(employee.current_month_sales)}
                                    </span>
                                    <span className="commission-amount">
                                        Commission: {formatCurrency(employee.current_month_commission)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Car Finance Widget - Admin Only */}
            {isAdmin && (
                <div className="dashboard-car-finance-section">
                    <CarFinanceWidget 
                        accessToken={accessToken}
                        paymentApi={paymentApi}
                    />
                </div>
            )}
        </div>
    );
};

export default PaymentWidget;