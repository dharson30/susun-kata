// file: api/getScore.js
import { kv } from '@vercel/kv';

export default async function handler(request, response) {
  try {
    // Ambil userId dari query parameter (contoh: /api/getScore?userId=Budi01)
    const { userId } = request.query;

    if (!userId) {
      return response.status(400).json({ message: 'User ID is required' });
    }

    const score = await kv.get(userId) || 0; // Jika belum ada, skornya 0

    return response.status(200).json({ userId, score });

  } catch (error) {
    return response.status(500).json({ message: 'An error occurred', error: error.message });
  }
}