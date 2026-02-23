-- Ejecuta este comando en el SQL Editor de Supabase después de haber importado los datos

UPDATE public.buecont
SET nombre_razon = REPLACE(nombre_razon, '', 'Ñ')
WHERE nombre_razon LIKE '%%';
