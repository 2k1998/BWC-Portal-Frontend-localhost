// src/pages/CommissionsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/apiService';  // Import from main apiService
import { paymentApi } from '../api/PaymentAPI';
import '../styles/CommissionsPage.css';

const CommissionsPage = () => {
    const { accessToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [commissionSummary, setCommissionSummary] = useState(null);
    const [commissionRules, setCommissionRules] = useState([]);
    const [showRuleModal, setShowRuleModal] = useState(false);
    const [newRule, setNewRule] = useState({
        employee_id: null,
        sale_type: null,
        base_commission_rate: 10,
        min_sale_amount: 0,
        tier1_threshold: null,
        tier1_bonus_rate: 0,
        tier2_threshold: null,
        tier2_bonus_rate: 0,
        tier3_threshold: null,
        tier3_bonus_rate: 0,
        is_active: true
    });

    useEffect(() => {
        if (accessToken) {
            fetchEmployees();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);

    useEffect(() => {
        if (selectedEmployee) {
            fetchCommissionRules(selectedEmployee);
        }
    }, [selectedEmployee, fetchCommissionRules]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const users = await authApi.listAllUsers(accessToken);
            // Filter for sales employees
            const salesEmployees = users.filter(user => 
                user.role === 'Sales' || user.role === 'Manager'
            );
            setEmployees(salesEmployees);
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCommissionRules = React.useCallback(async (employeeId) => {
        try {
            const rules = await paymentApi.getCommissionRules(accessToken, employeeId);
            setCommissionRules(rules);
        } catch (error) {
            console.error('Error fetching commission rules:', error);
        }
    }, [accessToken]);

    const calculateCommission = async () => {
        if (!selectedEmployee) {
            alert('Please select an employee');
            return;
        }

        try {
            setLoading(true);
            const summary = await paymentApi.calculateCommission(accessToken, {
                employee_id: selectedEmployee,
                year: selectedYear,
                month: selectedMonth,
                recalculate: true
            });
            setCommissionSummary(summary);
        } catch (error) {
            console.error('Error calculating commission:', error);
            alert('Failed to calculate commission: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const createCommissionPayment = async (summaryId) => {
        try {
            await paymentApi.createCommissionPayment(accessToken, summaryId);
            alert('Payment created successfully');
            // Refresh commission summary
            calculateCommission();
        } catch (error) {
            console.error('Error creating payment:', error);
            alert('Failed to create payment: ' + error.message);
        }
    };

    const handleCreateRule = async () => {
        if (!newRule.employee_id) {
            alert('Please select an employee for the rule');
            return;
        }

        try {
            await paymentApi.createCommissionRule(accessToken, newRule);
            alert('Commission rule created successfully');
            setShowRuleModal(false);
            // Reset form
            setNewRule({
                employee_id: null,
                sale_type: null,
                base_commission_rate: 10,
                min_sale_amount: 0,
                tier1_threshold: null,
                tier1_bonus_rate: 0,
                tier2_threshold: null,
                tier2_bonus_rate: 0,
                tier3_threshold: null,
                tier3_bonus_rate: 0,
                is_active: true
            });
            // Refresh rules
            if (selectedEmployee) {
                fetchCommissionRules(selectedEmployee);
            }
        } catch (error) {
            console.error('Error creating rule:', error);
            alert('Failed to create rule: ' + error.message);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('el-GR', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <div className="commissions-page">
            <div className="page-header">
                <h1>Commission Management</h1>
                <button 
                    className="btn-primary"
                    onClick={() => setShowRuleModal(true)}
                >
                    Add Commission Rule
                </button>
            </div>

            {/* Commission Calculator */}
            <div className="commission-calculator">
                <h2>Calculate Monthly Commission</h2>
                <div className="calculator-controls">
                    <div className="form-group">
                        <label>Employee</label>
                        <select 
                            value={selectedEmployee || ''}
                            onChange={(e) => setSelectedEmployee(Number(e.target.value))}
                        >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.first_name} {emp.last_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Year</label>
                        <select 
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                        >
                            {[2023, 2024, 2025].map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Month</label>
                        <select 
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        >
                            {monthNames.map((month, index) => (
                                <option key={index} value={index + 1}>{month}</option>
                            ))}
                        </select>
                    </div>

                    <button 
                        className="btn-calculate"
                        onClick={calculateCommission}
                        disabled={!selectedEmployee}
                    >
                        Calculate Commission
                    </button>
                </div>

                {/* Commission Summary */}
                {commissionSummary && (
                    <div className="commission-summary">
                        <h3>Commission Summary for {monthNames[commissionSummary.month - 1]} {commissionSummary.year}</h3>
                        <div className="summary-grid">
                            <div className="summary-card">
                                <label>Total Sales</label>
                                <div className="value">{formatCurrency(commissionSummary.total_sales_amount)}</div>
                            </div>
                            <div className="summary-card">
                                <label>Closed Deals</label>
                                <div className="value">{commissionSummary.closed_deals_count}</div>
                            </div>
                            <div className="summary-card">
                                <label>Base Commission</label>
                                <div className="value">{formatCurrency(commissionSummary.base_commission)}</div>
                            </div>
                            <div className="summary-card">
                                <label>Tier Bonus</label>
                                <div className="value">{formatCurrency(commissionSummary.tier_bonus)}</div>
                            </div>
                            <div className="summary-card highlight">
                                <label>Total Commission</label>
                                <div className="value">{formatCurrency(commissionSummary.total_commission)}</div>
                            </div>
                            <div className="summary-card">
                                <label>Payment Status</label>
                                <div className={`status ${commissionSummary.payment_status}`}>
                                    {commissionSummary.payment_status}
                                </div>
                            </div>
                        </div>

                        {commissionSummary.payment_status === 'calculated' && (
                            <button 
                                className="btn-create-payment"
                                onClick={() => createCommissionPayment(commissionSummary.id)}
                            >
                                Create Payment
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Commission Rules */}
            {selectedEmployee && (
                <div className="commission-rules">
                    <h2>Commission Rules for Selected Employee</h2>
                    {commissionRules.length === 0 ? (
                        <p>No commission rules found for this employee.</p>
                    ) : (
                        <div className="rules-list">
                            {commissionRules.map(rule => (
                                <div key={rule.id} className="rule-card">
                                    <div className="rule-header">
                                        <span className="rule-type">
                                            {rule.sale_type || 'All Sales'}
                                        </span>
                                        <span className={`rule-status ${rule.is_active ? 'active' : 'inactive'}`}>
                                            {rule.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="rule-details">
                                        <div>Base Rate: {rule.base_commission_rate}%</div>
                                        <div>Min Amount: {formatCurrency(rule.min_sale_amount)}</div>
                                        {rule.tier1_threshold && (
                                            <div>Tier 1: {formatCurrency(rule.tier1_threshold)} (+{rule.tier1_bonus_rate}%)</div>
                                        )}
                                        {rule.tier2_threshold && (
                                            <div>Tier 2: {formatCurrency(rule.tier2_threshold)} (+{rule.tier2_bonus_rate}%)</div>
                                        )}
                                        {rule.tier3_threshold && (
                                            <div>Tier 3: {formatCurrency(rule.tier3_threshold)} (+{rule.tier3_bonus_rate}%)</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Commission Rule Modal */}
            {showRuleModal && (
                <div className="modal-overlay" onClick={() => setShowRuleModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Create Commission Rule</h2>
                        
                        <div className="form-group">
                            <label>Employee *</label>
                            <select 
                                value={newRule.employee_id || ''}
                                onChange={(e) => setNewRule({...newRule, employee_id: Number(e.target.value)})}
                            >
                                <option value="">Select Employee</option>
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.first_name} {emp.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Sale Type</label>
                            <select 
                                value={newRule.sale_type || ''}
                                onChange={(e) => setNewRule({...newRule, sale_type: e.target.value || null})}
                            >
                                <option value="">All Sales</option>
                                <option value="rental">Rental</option>
                                <option value="service">Service</option>
                                <option value="product">Product</option>
                                <option value="subscription">Subscription</option>
                            </select>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Base Commission Rate (%)</label>
                                <input 
                                    type="number"
                                    value={newRule.base_commission_rate}
                                    onChange={(e) => setNewRule({...newRule, base_commission_rate: Number(e.target.value)})}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                />
                            </div>

                            <div className="form-group">
                                <label>Minimum Sale Amount</label>
                                <input 
                                    type="number"
                                    value={newRule.min_sale_amount}
                                    onChange={(e) => setNewRule({...newRule, min_sale_amount: Number(e.target.value)})}
                                    min="0"
                                    step="100"
                                />
                            </div>
                        </div>

                        <h3>Bonus Tiers (Optional)</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Tier 1 Threshold</label>
                                <input 
                                    type="number"
                                    value={newRule.tier1_threshold || ''}
                                    onChange={(e) => setNewRule({...newRule, tier1_threshold: e.target.value ? Number(e.target.value) : null})}
                                    min="0"
                                    step="1000"
                                />
                            </div>
                            <div className="form-group">
                                <label>Tier 1 Bonus (%)</label>
                                <input 
                                    type="number"
                                    value={newRule.tier1_bonus_rate}
                                    onChange={(e) => setNewRule({...newRule, tier1_bonus_rate: Number(e.target.value)})}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Tier 2 Threshold</label>
                                <input 
                                    type="number"
                                    value={newRule.tier2_threshold || ''}
                                    onChange={(e) => setNewRule({...newRule, tier2_threshold: e.target.value ? Number(e.target.value) : null})}
                                    min="0"
                                    step="1000"
                                />
                            </div>
                            <div className="form-group">
                                <label>Tier 2 Bonus (%)</label>
                                <input 
                                    type="number"
                                    value={newRule.tier2_bonus_rate}
                                    onChange={(e) => setNewRule({...newRule, tier2_bonus_rate: Number(e.target.value)})}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Tier 3 Threshold</label>
                                <input 
                                    type="number"
                                    value={newRule.tier3_threshold || ''}
                                    onChange={(e) => setNewRule({...newRule, tier3_threshold: e.target.value ? Number(e.target.value) : null})}
                                    min="0"
                                    step="1000"
                                />
                            </div>
                            <div className="form-group">
                                <label>Tier 3 Bonus (%)</label>
                                <input 
                                    type="number"
                                    value={newRule.tier3_bonus_rate}
                                    onChange={(e) => setNewRule({...newRule, tier3_bonus_rate: Number(e.target.value)})}
                                    min="0"
                                    max="100"
                                    step="0.1"
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button 
                                className="btn-secondary"
                                onClick={() => setShowRuleModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn-primary"
                                onClick={handleCreateRule}
                                disabled={!newRule.employee_id}
                            >
                                Create Rule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommissionsPage;