import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBudgets } from './budgetSlice';
import { fetchExpenses } from './expenseSlice';

export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchDashboardData',
    async (email, { dispatch }) => {
        await dispatch(fetchBudgets(email));
        await dispatch(fetchExpenses(email));
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDashboardData.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default dashboardSlice.reducer;
