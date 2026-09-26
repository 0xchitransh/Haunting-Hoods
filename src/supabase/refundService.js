import { supabase, isSupabaseConfigured } from './config';

export const submitRefundAddress = async (walletAddress) => {
	if (!isSupabaseConfigured) {
		console.warn('Supabase not configured. Mock submission successful.');
		return { success: true };
	}

	try {
		const { data, error } = await supabase
			.from('refund_submissions')
			.insert([{ wallet_address: walletAddress }]);

		if (error) throw error;
		return { success: true, data };
	} catch (error) {
		console.error('Error submitting refund address:', error);
		return { success: false, error: error.message };
	}
};
