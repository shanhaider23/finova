import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '@/utils/dbConfig';
import { Expenses, Budgets } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';
import moment from 'moment';
import { toast } from 'sonner';

// **Fetch expenses from database**
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (email) => {
    const results = await db
      .select({
        id: Expenses.id,
        name: Expenses.name,
        amount: Expenses.amount,
        category: Expenses.category,
        createdAt: Expenses.createdAt,
        budgetId: Expenses.budgetId,
      })
      .from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, email))
      .orderBy(desc(Expenses.id));

    return results;
  }
);

// **Add New Expense**
export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async ({ name, amount, budgetId, category, email }, { dispatch }) => {
    try {
      // Insert into database and return the new expense
      const [newExpense] = await db
        .insert(Expenses)
        .values({
          name,
          amount,
          budgetId,
          createdAt: moment().format('DD/MM/YYYY'),
          category,
        })
        .returning({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          category: Expenses.category,
          createdAt: Expenses.createdAt,
          budgetId: Expenses.budgetId,
        });

      if (newExpense) {
        toast.success('New Expense Added');

        // 🔹 Return the new expense so Redux state updates instantly
        return newExpense;
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense. Please try again.');
      throw error;
    }
  }
);

// **Delete Expense**
export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async ({ expenseId, email }, { dispatch }) => {
    try {
      await db.delete(Expenses).where(eq(Expenses.id, expenseId)).returning();
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
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.list.unshift(action.payload);
        }
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((expense) => expense.id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default expenseSlice.reducer;


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import moment from 'moment';
// import { toast } from 'sonner';

// // **Fetch expenses from database**
// export const fetchExpenses = createAsyncThunk(
//   'expenses/fetchExpenses',
//   async (email) => {
//     try {
//       const response = await axios.get('/api/expenses', {
//         params: { email },
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching expenses:', error);
//       throw error;
//     }
//   }
// );

// // **Add New Expense**
// export const addExpense = createAsyncThunk(
//   'expenses/addExpense',
//   async ({ name, amount, budgetId, category, email }, { dispatch }) => {
//     try {
//       const response = await axios.post('/api/expenses', {
//         name,
//         amount,
//         budgetId,
//         createdAt: moment().format('DD/MM/YYYY'),
//         category,
//       });

//       if (response.data) {
//         toast.success('New Expense Added');
//         return response.data; // 🔹 Return the new expense so Redux state updates instantly
//       }
//     } catch (error) {
//       console.error('Error adding expense:', error);
//       toast.error('Failed to add expense. Please try again.');
//       throw error;
//     }
//   }
// );

// // **Delete Expense**
// export const deleteExpense = createAsyncThunk(
//   'expenses/deleteExpense',
//   async ({ expenseId, email }, { dispatch }) => {
//     try {
//       await axios.delete(`/api/expenses`, {
//         params: { expenseId },
//       });
//       toast.success('Expense Deleted');

//       // Refresh expenses after deletion
//       dispatch(fetchExpenses(email));

//       return expenseId; // Return deleted expense ID to update state
//     } catch (error) {
//       console.error('Error deleting expense:', error);
//       toast.error('Failed to delete expense. Please try again.');
//       throw error;
//     }
//   }
// );

// const expenseSlice = createSlice({
//   name: 'expenses',
//   initialState: {
//     list: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchExpenses.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchExpenses.fulfilled, (state, action) => {
//         state.loading = false;
//         state.list = action.payload;
//       })
//       .addCase(fetchExpenses.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })
//       .addCase(addExpense.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(addExpense.fulfilled, (state, action) => {
//         state.loading = false;
//         if (action.payload) {
//           state.list.unshift(action.payload);
//         }
//       })
//       .addCase(addExpense.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       })
//       .addCase(deleteExpense.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(deleteExpense.fulfilled, (state, action) => {
//         state.loading = false;
//         state.list = state.list.filter((expense) => expense.id !== action.payload);
//       })
//       .addCase(deleteExpense.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default expenseSlice.reducer;