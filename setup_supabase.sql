-- SQL para crear la tabla 'usuarios' y sus políticas de acceso
-- Ejecutar en el SQL Editor de Supabase

-- 1. Crear la tabla 'usuarios'
CREATE TABLE public.usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ruc TEXT NOT NULL,
    usuario TEXT NOT NULL,
    clave TEXT NOT NULL,
    denominacion TEXT NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Asegurarse de que la búsqueda sea rápida indexando las columnas que vamos a consultar
CREATE INDEX idx_usuarios_login ON public.usuarios(ruc, usuario, clave);

-- 3. Habilitar la Seguridad a Nivel de Fila (RLS - Row Level Security)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- 4. Crear una política para permitir la lectura de los datos
CREATE POLICY "Permitir lectura a autenticación anónima" 
ON public.usuarios 
FOR SELECT 
USING (true);

-- 5. Crear una política para permitir la inserción
CREATE POLICY "Permitir insertar a autenticación anónima" 
ON public.usuarios 
FOR INSERT 
WITH CHECK (true);

-- 6. Insertar un usuario de prueba (puedes cambiar los datos como desees)
INSERT INTO public.usuarios (ruc, usuario, clave, denominacion) 
VALUES ('20123456789', 'ADMIN', '12345', 'EMPRESA EJEMPLO S.A.C.');
