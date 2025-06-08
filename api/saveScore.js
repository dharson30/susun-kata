// file: api/saveScore.js
import { supabase } from './_lib/supabaseClient.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId, score } = request.body;

  // Ambil skor lama terlebih dahulu
  const { data: oldData } = await supabase
    .from('scores')
    .select('score')
    .eq('user_id', userId)
    .single();

  // Hanya update jika skor baru lebih tinggi
  if (oldData && score <= oldData.score) {
    return response.status(200).json({ message: 'Score is not higher.', existingScore: oldData.score });
  }

  // Lakukan upsert (update atau insert)
  const { data, error } = await supabase
    .from('scores')
    .upsert({ user_id: userId, score: score }, { onConflict: 'user_id' });

  if (error) {
    return response.status(500).json({ message: 'Error saving score', error });
  }

  return response.status(200).json({ message: 'Score saved successfully', data });
}