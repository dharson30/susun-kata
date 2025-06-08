// file: api/saveScore.js
import { kv } from '@vercel/kv';

export default async function handler(request, response) {
  // Hanya izinkan metode POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { userId, score } = request.body;

    if (!userId || score === undefined) {
      return response.status(400).json({ message: 'User ID and score are required' });
    }

    // Ambil skor lama untuk perbandingan
    const oldScore = await kv.get(userId) || 0;

    // Hanya simpan jika skor baru lebih tinggi
    if (score > oldScore) {
      await kv.set(userId, score);
      return response.status(200).json({ message: 'Score updated successfully', newScore: score });
    }

    return response.status(200).json({ message: 'Score is not higher than the existing one', existingScore: oldScore });

  } catch (error) {
    return response.status(500).json({ message: 'An error occurred', error: error.message });
  }
}