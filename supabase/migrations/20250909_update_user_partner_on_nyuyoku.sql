-- Update user_partner experience and happiness when nyuyoku_log is inserted
-- This trigger function will be called after each nyuyoku_log insert

-- Function to update user_partner exp and happiness
CREATE OR REPLACE FUNCTION update_user_partner_on_nyuyoku()
RETURNS TRIGGER AS $$
DECLARE
    bath_duration_minutes INTEGER;
    exp_gain BIGINT;
    current_happiness INTEGER;
    new_happiness INTEGER;
BEGIN
    -- Calculate bath duration in minutes
    bath_duration_minutes := GREATEST(1, ROUND(NEW.total_ms / 60000.0));
    
    -- Calculate experience gain based on bath duration
    -- Formula: base 100 exp + (duration in minutes * 10)
    exp_gain := 100 + (bath_duration_minutes * 10);
    
    -- Get current happiness
    SELECT happiness INTO current_happiness 
    FROM user_partner 
    WHERE user_id = NEW.user_id;
    
    -- Calculate new happiness (current + 25, max 100)
    new_happiness := LEAST(100, COALESCE(current_happiness, 75) + 25);
    
    -- Update user_partner with new exp and happiness
    UPDATE user_partner 
    SET 
        exp = COALESCE(exp, 0) + exp_gain,
        happiness = new_happiness
    WHERE user_id = NEW.user_id;
    
    -- Log the update for debugging
    RAISE NOTICE 'Updated user_partner for user %: +% exp (% minutes), happiness: % -> %', 
        NEW.user_id, exp_gain, bath_duration_minutes, current_happiness, new_happiness;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires after nyuyoku_log insert
DROP TRIGGER IF EXISTS trigger_update_user_partner_on_nyuyoku ON nyuyoku_log;
CREATE TRIGGER trigger_update_user_partner_on_nyuyoku
    AFTER INSERT ON nyuyoku_log
    FOR EACH ROW
    EXECUTE FUNCTION update_user_partner_on_nyuyoku();

-- Add comment for documentation
COMMENT ON FUNCTION update_user_partner_on_nyuyoku() IS 
'Updates user_partner exp and happiness when a new nyuyoku_log entry is created. 
Experience gain: 100 base + (bath_duration_minutes * 10).
Happiness: +25 per bath session, capped at 100.';
