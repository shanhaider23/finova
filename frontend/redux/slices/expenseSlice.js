import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'sonner';

// **Fetch Expenses from Django API**
export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async (email) => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/expenses/', {
      params: { email },
    });
    console.log('Fetched expenses:', response.data); // Debugging line
    return response.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
});

// **Add New Expense**
export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async ({ name, amount, budgetId, category, email }, { dispatch }) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/expenses/', {
        name,
        amount,
        budget: budgetId,
        created_at: moment().toISOString(), // Use ISO 8601 format for created_at
        category,
        created_by: email, // Ensure created_by is included
      });

      if (response.data) {
        toast.success('New Expense Added');
        return response.data; // Return the new expense to update Redux state instantly
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense. Please try again.');
      throw error;
    }
  }
);;

// **Delete Expense**
export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async ({ expenseId, email }, { dispatch }) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/expenses/${expenseId}/`);
      toast.success('Expense Deleted');

      // Refresh expenses after deletion
      dispatch(fetchExpenses(email));

      return expenseId; // Return deleted expense ID to update state
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense. Please try again.');
      throw error;
    }
  }
);

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // **Fetch Expenses**
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // **Add Expense**
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.list.unshift(action.payload); // Add new expense instantly
        }
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // **Delete Expense**
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((expense) => expense.id !== action.payload); // Remove deleted expense instantly
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default expenseSlice.reducer;