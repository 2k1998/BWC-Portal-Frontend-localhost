import { callApi as apiServiceCallApi } from './apiService';

export const carFinanceApi = {
    getSummary: (startDate, endDate, token) => 
        apiServiceCallApi(`/car-finances/summary?start_date=${startDate}&end_date=${endDate}`, 'GET', null, token),
    
    addIncome: (incomeData, token) => 
        apiServiceCallApi('/car-finances/income', 'POST', incomeData, token),
    
    addExpense: (expenseData, token) => 
        apiServiceCallApi('/car-finances/expense', 'POST', expenseData, token),
    
    getTransactions: (params, token) => {
        const queryString = new URLSearchParams(params).toString();
        return apiServiceCallApi(`/car-finances/transactions?${queryString}`, 'GET', null, token);
    },
    
    deleteIncome: (incomeId, token) => 
        apiServiceCallApi(`/car-finances/income/${incomeId}`, 'DELETE', null, token),
    
    deleteExpense: (expenseId, token) => 
        apiServiceCallApi(`/car-finances/expense/${expenseId}`, 'DELETE', null, token),
    
    updateIncome: (incomeId, incomeData, token) => 
        apiServiceCallApi(`/car-finances/income/${incomeId}`, 'PUT', incomeData, token),
    
    updateExpense: (expenseId, expenseData, token) => 
        apiServiceCallApi(`/car-finances/expense/${expenseId}`, 'PUT', expenseData, token),
};

