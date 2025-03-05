import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Replace with your Django backend URL

export async function GET(req) {
    try {
        const response = await axios.get(`${API_URL}/budgets/`);
        console.log(response.data);
        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {
            status: error.response?.status || 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const response = await axios.post(`${API_URL}/budgets/`, body);
        return new Response(JSON.stringify(response.data), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), {
            status: error.response?.status || 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}