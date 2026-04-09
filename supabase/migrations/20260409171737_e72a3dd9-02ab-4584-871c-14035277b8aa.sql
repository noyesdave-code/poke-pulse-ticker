
-- ==========================================
-- FIX 1: Remove direct UPDATE on wallet tables
-- ==========================================

-- Drop UPDATE policies on all wallet tables
DROP POLICY IF EXISTS "Users can update own wallet" ON public.arena_wallets;
DROP POLICY IF EXISTS "Users can update own wallet" ON public.race_wallets;

-- Check for unified_wallets and ripz_wallets UPDATE policies
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'unified_wallets') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own wallet" ON public.unified_wallets';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ripz_wallets') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can update own wallet" ON public.ripz_wallets';
  END IF;
END $$;

-- Create SECURITY DEFINER function for unified wallet adjustments
CREATE OR REPLACE FUNCTION public.adjust_wallet_balance(
  _amount integer,
  _reason text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _wallet record;
  _new_balance numeric;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO _wallet FROM unified_wallets WHERE user_id = _user_id FOR UPDATE;
  
  IF NOT FOUND THEN
    INSERT INTO unified_wallets (user_id) VALUES (_user_id)
    RETURNING * INTO _wallet;
  END IF;

  _new_balance := _wallet.balance + _amount;
  
  IF _new_balance < 0 THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  UPDATE unified_wallets SET
    balance = _new_balance,
    lifetime_spent = CASE WHEN _amount < 0 AND _reason = 'rip' THEN lifetime_spent + abs(_amount) ELSE lifetime_spent END,
    lifetime_wagered = CASE WHEN _amount < 0 AND _reason = 'wager' THEN lifetime_wagered + abs(_amount) ELSE lifetime_wagered END,
    lifetime_earned = CASE WHEN _amount > 0 THEN lifetime_earned + _amount ELSE lifetime_earned END,
    lifetime_won = CASE WHEN _amount > 0 AND _reason = 'win' THEN lifetime_won + _amount ELSE lifetime_won END,
    lifetime_ripped = CASE WHEN _reason = 'rip' THEN COALESCE(lifetime_ripped, 0) ELSE COALESCE(lifetime_ripped, 0) END,
    updated_at = now()
  WHERE user_id = _user_id;

  RETURN jsonb_build_object('new_balance', _new_balance);
END;
$$;

-- Create SECURITY DEFINER function for arena wallet adjustments
CREATE OR REPLACE FUNCTION public.adjust_arena_wallet(
  _amount integer,
  _reason text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _wallet record;
  _new_balance numeric;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO _wallet FROM arena_wallets WHERE user_id = _user_id FOR UPDATE;
  
  IF NOT FOUND THEN
    INSERT INTO arena_wallets (user_id) VALUES (_user_id)
    RETURNING * INTO _wallet;
  END IF;

  _new_balance := _wallet.balance + _amount;
  
  IF _new_balance < 0 THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  UPDATE arena_wallets SET
    balance = _new_balance,
    lifetime_wagered = CASE WHEN _amount < 0 THEN lifetime_wagered + abs(_amount) ELSE lifetime_wagered END,
    lifetime_earned = CASE WHEN _amount > 0 THEN lifetime_earned + _amount ELSE lifetime_earned END,
    lifetime_won = CASE WHEN _amount > 0 AND _reason = 'win' THEN lifetime_won + _amount ELSE lifetime_won END,
    updated_at = now()
  WHERE user_id = _user_id;

  RETURN jsonb_build_object('new_balance', _new_balance);
END;
$$;

-- Create SECURITY DEFINER function for race wallet adjustments
CREATE OR REPLACE FUNCTION public.adjust_race_wallet(
  _amount integer,
  _reason text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _wallet record;
  _new_balance numeric;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO _wallet FROM race_wallets WHERE user_id = _user_id FOR UPDATE;
  
  IF NOT FOUND THEN
    INSERT INTO race_wallets (user_id) VALUES (_user_id)
    RETURNING * INTO _wallet;
  END IF;

  _new_balance := _wallet.balance + _amount;
  
  IF _new_balance < 0 THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  UPDATE race_wallets SET
    balance = _new_balance,
    lifetime_wagered = CASE WHEN _amount < 0 THEN lifetime_wagered + abs(_amount) ELSE lifetime_wagered END,
    lifetime_earned = CASE WHEN _amount > 0 THEN lifetime_earned + _amount ELSE lifetime_earned END,
    lifetime_won = CASE WHEN _amount > 0 AND _reason = 'win' THEN lifetime_won + _amount ELSE lifetime_won END,
    updated_at = now()
  WHERE user_id = _user_id;

  RETURN jsonb_build_object('new_balance', _new_balance);
END;
$$;

-- Create SECURITY DEFINER function for ripz wallet adjustments
CREATE OR REPLACE FUNCTION public.adjust_ripz_wallet(
  _amount integer,
  _reason text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _wallet record;
  _new_balance numeric;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO _wallet FROM ripz_wallets WHERE user_id = _user_id FOR UPDATE;
  
  IF NOT FOUND THEN
    INSERT INTO ripz_wallets (user_id) VALUES (_user_id)
    RETURNING * INTO _wallet;
  END IF;

  _new_balance := _wallet.balance + _amount;
  
  IF _new_balance < 0 THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  UPDATE ripz_wallets SET
    balance = _new_balance,
    lifetime_spent = CASE WHEN _amount < 0 THEN lifetime_spent + abs(_amount) ELSE lifetime_spent END,
    lifetime_ripped = CASE WHEN _reason = 'rip' THEN lifetime_ripped + 1 ELSE lifetime_ripped END,
    updated_at = now()
  WHERE user_id = _user_id;

  RETURN jsonb_build_object('new_balance', _new_balance);
END;
$$;

-- ==========================================
-- FIX 2: Age verification server-side
-- ==========================================

-- Create SECURITY DEFINER function for age verification
CREATE OR REPLACE FUNCTION public.verify_chat_age(_date_of_birth date)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id uuid := auth.uid();
  _age integer;
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF _date_of_birth IS NULL OR _date_of_birth > CURRENT_DATE THEN
    RAISE EXCEPTION 'Invalid date of birth';
  END IF;

  _age := date_part('year', age(CURRENT_DATE, _date_of_birth));

  IF _age < 18 THEN
    RAISE EXCEPTION 'You must be 18 or older to use chat';
  END IF;

  UPDATE profiles SET
    date_of_birth = _date_of_birth,
    chat_age_verified = true,
    updated_at = now()
  WHERE id = _user_id;

  RETURN jsonb_build_object('verified', true, 'age', _age);
END;
$$;

-- Replace profile UPDATE policy to exclude sensitive fields
-- Drop and recreate with restricted columns
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add a trigger to prevent direct updates to chat_age_verified and date_of_birth
CREATE OR REPLACE FUNCTION public.protect_age_verification_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the update is coming from a regular user (not service role), prevent changing these fields
  IF current_setting('role') != 'service_role' THEN
    NEW.chat_age_verified := OLD.chat_age_verified;
    NEW.date_of_birth := OLD.date_of_birth;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER protect_age_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_age_verification_fields();
