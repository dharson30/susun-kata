// file: api/getScore.js
import { supabase } from './_lib/supabaseClient.js';

export default async function handler(request, response) {
  const { userId } = request.query;

  if (!userId) {
    return response.status(400).json({ message: 'User ID is required' });
  }

  const { data, error } = await supabase
    .from('scores')
    .select('score')
    .eq('user_id', userId)
    .single(); // .single() untuk mengambil satu baris data

  if (error && error.code !== 'PGRST116') { // Abaikan error jika tidak ada baris ditemukan
    return response.status(500).json({ message: 'Error fetching score', error });
  }

  const score = data ? data.score : 0;
  return response.status(200).json({ userId, score });
}