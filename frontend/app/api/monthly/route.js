// import axios from 'axios';

// const API_URL = 'http://localhost:8000/api'; // Replace with your Django backend URL

// export async function GET(req) {
//     const { searchParams } = new URL(req.url);
//     const email = searchParams.get('email');

//     try {
//         const response = await axios.get(`${API_URL}/monthly/`, {
//             params: { email },
//         });
//         return new Response(JSON.stringify(response.data), {
//             status: 200,
//             headers: { 'Content-Type': 'application/json' },
//         });
//     } catch (error) {
//         return new Response(JSON.stringify({ message: error.message }), {
//             status: error.response?.status || 500,
//             headers: { 'Content-Type': 'application/json' },
//         });
//     }
// }

// export async function POST(req) {
//     try {
//         const body = await req.json();
//         const response = await axios.post(`${API_URL}/monthly/`, body);
//         return new Response(JSON.stringify(response.data), {
//             status: 201,
//             headers: { 'Content-Type': 'application/json' },
//         });
//     } catch (error) {
//         return new Response(JSON.stringify({ message: error.message }), {
//             status: error.response?.status || 500,
//             headers: { 'Content-Type': 'application/json' },
//         });
//     }
// }

// export async function DELETE(req) {
//     const { searchParams } = new URL(req.url);
//     const monthlyId = searchParams.get('monthlyId');

//     try {
//         await axios.delete(`${API_URL}/monthly/${monthlyId}`);
//         return new Response(null, {
//             status: 204,
//         });
//     } catch (error) {
//         return new Response(JSON.stringify({ message: error.message }), {
//             status: error.response?.status || 500,
//             headers: { 'Content-Type': 'application/json' },
//         });
//     }
// }