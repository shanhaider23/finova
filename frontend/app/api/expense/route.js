import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'sonner';

// **Fetch budgets from database**
export const fetchBudgets = createAsyncThunk('budgets/fetchBudgets', async (email) => {
    try {
        const response = await axios.get('/api/budgets', {
            params: { email },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching budgets:', error);
        throw error;
    }
});

// **Create Budget**
export const createBudget = createAsyncThunk(
    'budgets/createBudget',
    async ({ name, amount, currency, email, emojiIcon }) => {
        try {
            const response = await axios.post('/api/budgets', {
                name,
                amount,
                currency,
                createdBy: email,
                icon: emojiIcon,
            });

            if (response.data) {
                toast.success('New Budget Created');
                return response.data; // 🔹 Return the new budget to update Redux state instantly
            }
        } catch (error) {
            console.error('Error creating budget:', error);
            toast.error('Failed to create budget. Please try again.');
            throw error;
        }
    }
);

// **Edit Budget**
export const editBudget = createAsyncThunk(
    'budgets/editBudget',
    async ({ budgetId, name, amount, emojiIcon }) => {
        try {
            const response = await axios.put(`/api/budgets/${budgetId}`, {
                name,
                amount,
                icon: emojiIcon,
            });

            if (response.data) {
                toast.success('Budget Updated');
                return response.data; // 🔹 Return updated budget to update Redux state instantly
            }
        } catch (error) {
            console.error('Error editing budget:', error);
            toast.error('Failed to edit budget. Please try again.');
            throw error;
        }
    }
);

// **Delete Budget**
export const deleteBudget = createAsyncThunk(
    'budgets/deleteBudget',
    async ({ paramsId, email }) => {
        try {
            const response = await axios.delete(`/api/budgets/${paramsId}`, {
                data: { email },
            });

            if (response.data) {
                toast.success('Budget Deleted');
                return paramsId;
            } else {
                throw new Error('Failed to delete budget');
            }
        } catch (error) {
            console.error('Error deleting budget:', error);
            toast.error('Failed to delete budget. Please try again.');
            throw error;
        }
    }
);

const budgetSlice = createSlice({
    name: 'budgets',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // **Fetch Budgets**
            .addCase(fetchBudgets.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBudgets.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchBudgets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // **Create Budget (Instant State Update)**
            .addCase(createBudget.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBudget.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload) {
                    state.list.unshift(action.payload); // ✅ Add new budget instantly
                }
            })
            .addCase(createBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // **Edit Budget (Update State)**
            .addCase(editBudget.pending, (state) => {
                state.loading = true;
            })
            .addCase(editBudget.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload) {
                    state.list = state.list.map((budget) =>
                        budget.id === action.payload.id ? action.payload : budget
                    ); // ✅ Update the edited budget instantly
                }
            })
            .addCase(editBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // **Delete Budget (Remove from State)**
            .addCase(deleteBudget.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBudget.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter((budget) => budget.id !== action.payload); // ✅ Remove deleted budget instantly
            })
            .addCase(deleteBudget.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default budgetSlice.reducer;