-- Fix profile table replica identity issue by recreating the table

-- 1. バックアップテーブル作成（重複除去）
CREATE TEMP TABLE profile_backup AS 
SELECT DISTINCT ON (id) id, name, created_at 
FROM public.profile 
ORDER BY id, created_at;

-- 2. リアルタイム購読から削除（エラーを無視）
DO $$ 
BEGIN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.profile;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Profile table was not in publication, continuing...';
END $$;

-- 3. profileテーブルを完全削除
DROP TABLE public.profile CASCADE;

-- 4. 正しい構造でテーブルを再作成
CREATE TABLE public.profile (
    id uuid PRIMARY KEY,
    name text DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT profile_id_fkey FOREIGN KEY (id) 
        REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- 5. バックアップデータを戻す
INSERT INTO public.profile (id, name, created_at)
SELECT id, name, created_at FROM profile_backup;

-- 6. RLS有効化
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

-- 7. ポリシー復元
CREATE POLICY "allow ALL when id=uid" ON public.profile 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- 8. 権限復元
GRANT ALL ON TABLE public.profile TO anon;
GRANT ALL ON TABLE public.profile TO authenticated;
GRANT ALL ON TABLE public.profile TO service_role;

-- 9. リアルタイム購読追加
ALTER PUBLICATION supabase_realtime ADD TABLE public.profile;