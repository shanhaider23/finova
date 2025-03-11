import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '@/utils/dbConfig';
import { Monthly } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';
import moment from 'moment';
import { toast } from 'sonner';
import axios from 'axios';

// **Fetch Monthly Data from Database**
export const fetchMonthly = createAsyncThunk(
    'monthly/fetchMonthly',
    async (email) => {
        if (!email) throw new Error('User email is required');
        try {
            // Fetch data from Django backend
            const response = await axios.get('http://127.0.0.1:8000/api/monthly/', {
                params: { email },
            });

            // Combine results
            const results = response.data.map(item => ({
                ...item,
                type: item.type === 'income' ? 'income' : 'expense',
            }));

            return results;
        } catch (error) {
            console.error('Error fetching monthly data:', error);
            throw error;
        }

    }
);


// **Add New Monthly Record**
export const addMonthly = createAsyncThunk(
    'monthly/addMonthly',
    async ({ date, type, category, amount, email, name }, { dispatch }) => {
        if (!email) throw new Error('User email is required');

        try {

            await axios({
                method: 'post',
                url: `http://127.0.0.1:8000/api/monthly/`,
                data: {
                    date: moment(date).format('YYYY-MM-DD') || moment().format('YYYY-MM-DD'),
                    type,
                    category,
                    name,
                    amount,
                    created_by: email,
                }

            });
            toast.success('New Monthly Record Added');
            dispatch(fetchMonthly(email));
        } catch (error) {
            console.error('Error adding monthly record:', error);
            toast.error('Failed to add record. Please try again.');
            throw error;
        }
    }
);


// **Delete Monthly Record**
export const deleteMonthly = createAsyncThunk(
    'monthly/deleteMonthly',
    async ({ monthlyId, email }, { dispatch }) => {
        console.log('monthlyId', monthlyId);
        try {
            await axios.delete(`http://localhost:8000/api/monthly/${monthlyId}/delete/`);

            toast.success('Monthly Record Deleted');
            dispatch(fetchMonthly(email));
            return monthlyId;
        } catch (error) {
            console.error('Error deleting monthly record:', error);
            toast.error('Failed to delete record. Please try again.');
            throw error;
        }
    }
);
export const updateMonthly = createAsyncThunk(
    'monthly/updateMonthly',
    async ({ id, amount, category, name, email }, { dispatch }) => {
        try {
            const response = await axios.put(`http://localhost:8000/api/monthly/${id}/update/`, {
                amount,
                category,
                name,
            });
            toast.success('Monthly Record Updated');
            dispatch(fetchMonthly(email));
            return response.data;
        } catch (error) {
            console.error('Error updating monthly record:', error);
            toast.error('Failed to update record. Please try again.');
            throw error;
        }
    }
);

const monthlySlice = createSlice({
    name: 'monthly',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMonthly.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMonthly.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchMonthly.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addMonthly.pending, (state) => {
                state.loading = true;
            })
            .addCase(addMonthly.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.list.unshift(action.payload);
                }
            })
            .addCase(addMonthly.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(deleteMonthly.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteMonthly.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter((record) => record.id !== action.payload);
            })
            .addCase(deleteMonthly.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateMonthly.fulfilled, (state, action) => {
                state.list = state.list.map((monthly) =>
                    monthly.id === action.payload.id ? { ...monthly, amount: action.payload.amount } : monthly
                );
            });
    },
});

export default monthlySlice.reducer;

