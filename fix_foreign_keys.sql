-- ====================================================================
-- CATCH_LOGS TACKLE_BOX_ID HATA DÜZELTME SCRIPT'İ
-- Supabase SQL Editor'da çalıştırarak yabancı anahtar kısıtlamasını güncelleyin.
-- ====================================================================

-- 1. Eski yabancı anahtar kısıtlamasını kaldır
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'catch_logs_tackle_box_id_fkey' AND table_name = 'catch_logs'
  ) THEN
    ALTER TABLE public.catch_logs DROP CONSTRAINT catch_logs_tackle_box_id_fkey;
  END IF;
END $$;

-- 2. Yeni tackle_sets tablosuna bağlanan yabancı anahtarı ekle
ALTER TABLE public.catch_logs 
  ADD CONSTRAINT catch_logs_tackle_box_id_fkey 
  FOREIGN KEY (tackle_box_id) 
  REFERENCES public.tackle_sets(id) 
  ON DELETE SET NULL;
