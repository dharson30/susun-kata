import { supabase } from './_lib/supabaseClient.js';

export default async function handler(request, response) {
  // Hanya izinkan metode GET
  if (request.method !== 'GET') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Ambil 10 data teratas dari tabel 'scores'
    // Urutkan berdasarkan 'score' secara menurun (descending)
    const { data, error } = await supabase
      .from('scores')
      .select('user_id, score')
      .order('score', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    // Kirim data sebagai response JSON
    return response.status(200).json(data);

  } catch (error) {
    return response.status(500).json({ message: 'Error fetching leaderboard data', error: error.message });
  }
}