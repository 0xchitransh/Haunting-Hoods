-- 1. Create the new table for fresh entries
CREATE TABLE IF NOT EXISTS public.whitelist_claims_v2 (
    uid text PRIMARY KEY,
    twitter_handle text,
    discord_user text,
    wallet_address text NOT NULL,
    quote_tweet_link text,
    campaign_id text NOT NULL,
    claim_number integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE public.whitelist_claims_v2 ENABLE ROW LEVEL SECURITY;

-- 2. Update the RPC function to insert into the new table
CREATE OR REPLACE FUNCTION public.claim_whitelist_spot(
    p_uid text,
    p_twitter_handle text,
    p_discord_user text,
    p_wallet_address text,
    p_quote_tweet_link text,
    p_campaign_id text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_campaign record;
    v_claim_number integer;
BEGIN
    -- Check if campaign is active and lock the row
    SELECT * INTO v_campaign 
    FROM public.whitelist_campaigns 
    WHERE id = p_campaign_id 
    FOR UPDATE;

    IF NOT FOUND OR NOT v_campaign.active THEN
        RAISE EXCEPTION 'CAMPAIGN_INACTIVE';
    END IF;

    -- Check if sold out
    IF v_campaign.claimedcount >= v_campaign.slotstotal THEN
        RAISE EXCEPTION 'SOLD_OUT';
    END IF;

    -- Calculate new claim number
    v_claim_number := v_campaign.claimedcount + 1;

    -- Increment claimedcount
    UPDATE public.whitelist_campaigns 
    SET claimedcount = v_claim_number 
    WHERE id = p_campaign_id;

    -- Insert into the NEW table
    INSERT INTO public.whitelist_claims_v2 (
        uid, 
        twitter_handle, 
        discord_user, 
        wallet_address, 
        quote_tweet_link, 
        campaign_id, 
        claim_number
    ) VALUES (
        p_uid, 
        p_twitter_handle, 
        p_discord_user, 
        p_wallet_address, 
        p_quote_tweet_link, 
        p_campaign_id, 
        v_claim_number
    );

    RETURN json_build_object(
        'claimNumber', v_claim_number,
        'slotsTotal', v_campaign.slotstotal,
        'campaignId', p_campaign_id
    );
END;
$$;
