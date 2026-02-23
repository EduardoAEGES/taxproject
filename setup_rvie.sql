-- SQL para crear la tabla 'rvie_data' basándose en la estructura del Excel proporcionado
-- Ejecutar en el SQL Editor de Supabase

-- 1. Crear la tabla principal para los comprobantes del RVIE
CREATE TABLE public.rvie_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Identificación de la Empresa Declarante
    ruc TEXT NOT NULL,
    razon_social TEXT,
    periodo TEXT NOT NULL,
    
    -- Identificación del Comprobante
    car_sunat TEXT,
    fecha_emision TEXT,
    fecha_vcto_pago TEXT,
    tipo_cp_doc TEXT,
    serie_cdp TEXT,
    nro_cp_inicial TEXT,
    nro_cp_final TEXT,
    
    -- Identificación del Adquiriente / Cliente
    tipo_doc_identidad TEXT,
    nro_doc_identidad TEXT,
    adquiriente_razon_social TEXT,
    
    -- Montos e Impuestos (Guardados como NUMERIC para precisión monetaria)
    valor_facturado_exportacion NUMERIC(15, 2) DEFAULT 0.00,
    bi_gravada NUMERIC(15, 2) DEFAULT 0.00,
    dscto_bi NUMERIC(15, 2) DEFAULT 0.00,
    igv_ipm NUMERIC(15, 2) DEFAULT 0.00,
    dscto_igv_ipm NUMERIC(15, 2) DEFAULT 0.00,
    mto_exonerado NUMERIC(15, 2) DEFAULT 0.00,
    mto_inafecto NUMERIC(15, 2) DEFAULT 0.00,
    isc NUMERIC(15, 2) DEFAULT 0.00,
    bi_grav_ivap NUMERIC(15, 2) DEFAULT 0.00,
    ivap NUMERIC(15, 2) DEFAULT 0.00,
    icbper NUMERIC(15, 2) DEFAULT 0.00,
    otros_tributos NUMERIC(15, 2) DEFAULT 0.00,
    total_cp NUMERIC(15, 2) DEFAULT 0.00,
    
    -- Moneda y Tipo de Cambio
    moneda TEXT,
    tipo_cambio NUMERIC(10, 3),
    
    -- Referencias a Comprobantes Modificados (Notas de Crédito/Débito)
    fecha_emision_doc_modificado TEXT,
    tipo_cp_modificado TEXT,
    serie_cp_modificado TEXT,
    nro_cp_modificado TEXT,
    
    -- Otros campos adicionales
    id_proyecto_operadores_atribucion TEXT,
    clu TEXT,
    
    -- Metadatos
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Índices para mejorar la velocidad al buscar facturas por RUC y Periodo
CREATE INDEX idx_rvie_ruc_periodo ON public.rvie_data(ruc, periodo);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE public.rvie_data ENABLE ROW LEVEL SECURITY;

-- 4. Crear política de lectura pública (asumiendo que los simuladores corren en el cliente)
-- Opcionalmente, aquí puedes restringir que solo lea si el RUC coincide con el usuario logueado
CREATE POLICY "Permitir lectura publica RVIE"
ON public.rvie_data
FOR SELECT
USING (true);

-- 5. Crear política de inserción/edición (agregado por si necesitas cargar más datos desde el simulador)
CREATE POLICY "Permitir insertar RVIE"
ON public.rvie_data
FOR ALL
USING (true);

-- 6. Insertar registros de prueba (Los mismos del archivo proporcionado)
INSERT INTO public.rvie_data 
(ruc, razon_social, periodo, car_sunat, fecha_emision, tipo_cp_doc, serie_cdp, nro_cp_inicial, tipo_doc_identidad, nro_doc_identidad, adquiriente_razon_social, valor_facturado_exportacion, bi_gravada, dscto_bi, igv_ipm, total_cp, moneda)
VALUES 
('20889977664', 'EMPRESA DEMO MYPE S.A.C.', '202512', null, '10/12/2025', '01', 'E001', '215', '6', '20605893547', 'COLLANA CONSULTING EIRL', 0.00, 14500.00, 0.00, 2610.00, 17110.00, 'PEN'),
('20889977664', 'EMPRESA DEMO MYPE S.A.C.', '202512', null, '14/12/2025', '01', 'E001', '216', '6', '20515108794', 'COLOMBINA DEL PERU S.A.C.', 0.00, 2480.00, 0.00, 446.40, 2926.40, 'PEN'),
('20889977664', 'EMPRESA DEMO MYPE S.A.C.', '202512', null, '16/12/2025', '01', 'E001', '217', '6', '20512175946', 'IMPRESIONES GRAFICAS EMMANUEL SOCIEDAD A', 0.00, 8600.00, 0.00, 1548.00, 10148.00, 'PEN'),
('20889977664', 'EMPRESA DEMO MYPE S.A.C.', '202512', null, '20/12/2025', '01', 'E001', '218', '6', '20600767306', 'NUBE CREATIVA E.I.R.L.', 0.00, 4991.00, 0.00, 898.38, 5889.38, 'PEN'),
('20889977664', 'EMPRESA DEMO MYPE S.A.C.', '202512', null, '23/12/2025', '01', 'E001', '219', '6', '20600433882', 'MULTISERVICIOS SULY E.I.R.L.', 0.00, 28513.64, 0.00, 5132.45, 33646.09, 'USD');
