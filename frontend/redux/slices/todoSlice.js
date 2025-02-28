import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '@/utils/dbConfig';
import { Tasks } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';
import moment from 'moment';
import { toast } from 'sonner';

// **Fetch All Tasks**
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (email) => {
    if (!email) throw new Error('User email is required');

    const results = await db
        .select({
            id: Tasks.id,
            title: Tasks.title,
            status: Tasks.status,
            date: Tasks.date,
            description: Tasks.description,
            createdAt: Tasks.createdAt,
        })
        .from(Tasks)
        .where(eq(Tasks.createdBy, email))
        .orderBy(desc(Tasks.id));

    console.log('Fetched tasks:', results);
    return [...results];
});

// **Add Task**
export const addTasks = createAsyncThunk('tasks/addTasks', async ({ date, title, status, description, email }, { dispatch }) => {
    try {
        const [newTask] = await db
            .insert(Tasks)
            .values({
                date,
                title,
                createdAt: moment().format('DD/MM/YYYY'),
                status,
                description,
                createdBy: email,
            })
            .returning({
                id: Tasks.id,
                date: Tasks.date,
                title: Tasks.title,
                createdAt: Tasks.createdAt,
                status: Tasks.status,
                description: Tasks.description,
                email: Tasks.createdBy,
            });

        if (newTask) {
            toast.success('New Task Added');
            dispatch(fetchTasks()); // Ensure UI updates immediately
            return newTask;
        }
    } catch (error) {
        console.error('Error adding task:', error);
        toast.error('Failed to add task. Please try again.');
        throw error;
    }
});

// **Update Task Status**
export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, status }, { dispatch }) => {
    try {
        await db.update(Tasks).set({ status }).where(eq(Tasks.id, id));
        toast.success('Task status updated');
        dispatch(fetchTasks()); // Refresh task list
        return { id, status };
    } catch (error) {
        console.error('Error updating task status:', error);
        toast.error('Failed to update task. Please try again.');
        throw error;
    }
});

// **Delete Task**
export const deleteTasks = createAsyncThunk('tasks/deleteTasks', async ({ taskId }, { dispatch }) => {
    try {
        const deletedTask = await db.delete(Tasks).where(eq(Tasks.id, taskId)).returning();
        if (!deletedTask) throw new Error("Task not found");
        toast.success('Task Deleted');
        dispatch(fetchTasks()); // Refresh task list
        return taskId;
    } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task. Please try again.');
        throw error;
    }
});


const todoSlice = createSlice({
    name: 'tasks',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
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
            .addCase(addTasks.fulfilled, (state, action) => {
                state.list.unshift(action.payload); // Add new task to UI immediately
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const { id, status } = action.payload;
                const task = state.list.find((task) => task.id === id);
                if (task) {
                    task.status = status;
                }
            })
            .addCase(deleteTasks.fulfilled, (state, action) => {
                state.list = state.list.filter((task) => task.id !== action.payload);
            });
    },
});

export default todoSlice.reducer;
