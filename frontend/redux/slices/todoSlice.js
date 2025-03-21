import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'sonner';

// **Fetch All Tasks**
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (email) => {
    if (!email) throw new Error('User email is required');

    try {
        const response = await axios.get('http://127.0.0.1:8000/api/tasks/', {
            params: { email },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
});

// **Add Task**
export const addTasks = createAsyncThunk(
    'tasks/addTasks',
    async ({ date, title, status, description, email }, { dispatch }) => {
        try {
            // Format the date to YYYY-MM-DD
            const formattedDate = moment(date).format('YYYY-MM-DD');

            const response = await axios.post('http://127.0.0.1:8000/api/tasks/', {
                date: formattedDate, // Use the formatted date
                title,
                created_at: moment().toISOString(), // Keep created_at as ISO format
                status,
                description,
                created_by: email,
            });

            if (response.data) {
                toast.success('New Task Added');
                dispatch(fetchTasks(email)); // Ensure UI updates immediately
                return response.data;
            }
        } catch (error) {
            console.error('Error adding task:', error);
            toast.error('Failed to add task. Please try again.');
            throw error;
        }
    }
);

// **Update Task Status**
export const updateTask = createAsyncThunk(
    'tasks/updateTask',
    async ({ id, status, email }, { dispatch }) => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/tasks/${id}/`, {
                status,
            });

            if (response.data) {
                toast.success('Task status updated');
                dispatch(fetchTasks(email)); // Refresh task list
                return { id, status };
            }
        } catch (error) {
            console.error('Error updating task status:', error);
            toast.error('Failed to update task. Please try again.');
            throw error;
        }
    }
);

// **Delete Task**
export const deleteTasks = createAsyncThunk(
    'tasks/deleteTasks',
    async ({ taskId, email }, { dispatch }) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}/`);
            toast.success('Task Deleted');
            dispatch(fetchTasks(email)); // Refresh task list
            return taskId;
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task. Please try again.');
            throw error;
        }
    }
);;


const todoSlice = createSlice({
    name: 'tasks',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // **Fetch Tasks**
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // **Add Task**
            .addCase(addTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(addTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.list.unshift(action.payload); // Add new task to UI immediately
            })
            .addCase(addTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // **Update Task**
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const { id, status } = action.payload;
                const task = state.list.find((task) => task.id === id);
                if (task) {
                    task.status = status;
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // **Delete Task**
            .addCase(deleteTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter((task) => task.id !== action.payload); // Remove deleted task from UI
            })
            .addCase(deleteTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
export default todoSlice.reducer;
