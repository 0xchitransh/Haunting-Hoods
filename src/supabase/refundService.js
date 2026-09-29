import { supabase, isSupabaseConfigured } from './config';

export const submitRefundAddress = async (formData) => {
	if (!isSupabaseConfigured) {
		console.warn('Supabase not configured. Mock submission successful.');
		return { success: true };
	}

	try {
		const { data, error } = await supabase
			.from('loss_verifications')
			.insert([{ 
				x_username: formData.xUsername,
				activity_wallet: formData.activityWallet,
				transaction_hashes: formData.transactionHashes,
				compensation_wallet: formData.compensationWallet
			}]);

		if (error) throw error;
		return { success: true, data };
	} catch (error) {
		console.error('Error submitting refund address:', error);
		return { success: false, error: error.message };
	}
};
