-- SQL para crear la tabla 'rce_data' (Registro de Compras Electrónico)
-- Basado en el archivo Excel proporcionado
-- Ejecutar en el SQL Editor de Supabase

-- 1. Crear la tabla principal para los comprobantes del RCE
CREATE TABLE public.rce_data (
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
    anio TEXT,
    nro_cp_inicial TEXT,
    nro_cp_final TEXT,
    
    -- Identificación del Proveedor
    tipo_doc_identidad TEXT,
    nro_doc_identidad TEXT,
    proveedor_razon_social TEXT,
    
    -- Montos e Impuestos (Guardados como NUMERIC para precisión monetaria)
    bi_gravado_dg NUMERIC(15, 2) DEFAULT 0.00,
    igv_ipm_dg NUMERIC(15, 2) DEFAULT 0.00,
    bi_gravado_dgng NUMERIC(15, 2) DEFAULT 0.00,
    igv_ipm_dgng NUMERIC(15, 2) DEFAULT 0.00,
    bi_gravado_dng NUMERIC(15, 2) DEFAULT 0.00,
    igv_ipm_dng NUMERIC(15, 2) DEFAULT 0.00,
    valor_adq_ng NUMERIC(15, 2) DEFAULT 0.00,
    isc NUMERIC(15, 2) DEFAULT 0.00,
    icbper NUMERIC(15, 2) DEFAULT 0.00,
    otros_tributos_cargos NUMERIC(15, 2) DEFAULT 0.00,
    total_cp NUMERIC(15, 2) DEFAULT 0.00,
    
    -- Moneda y Tipo de Cambio
    moneda TEXT,
    tipo_cambio NUMERIC(10, 3),
    
    -- Referencias a Comprobantes Modificados
    fecha_emision_doc_modificado TEXT,
    tipo_cp_modificado TEXT,
    serie_cp_modificado TEXT,
    cod_dam_dsi TEXT,
    nro_cp_modificado TEXT,
    
    -- Otros campos 
    clasif_bss_sss TEXT,
    id_proyecto_operadores_participes TEXT,
    porc_part NUMERIC(5, 2),
    imb NUMERIC(15, 2),
    car_orig TEXT,
    
    -- Metadatos
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Índices para mejorar la búsqueda por declarante y periodo
CREATE INDEX idx_rce_ruc_periodo ON public.rce_data(ruc, periodo);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE public.rce_data ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas de acceso público (igual que en RVIE para la simulación web)
CREATE POLICY "Permitir accesos a RCE"
ON public.rce_data
FOR ALL
USING (true);

-- 5. Insertar registros de prueba (Extraídos del Excel proporcionado)
INSERT INTO public.rce_data 
(ruc, razon_social, periodo, fecha_emision, tipo_cp_doc, serie_cdp, anio, nro_cp_inicial, tipo_doc_identidad, nro_doc_identidad, proveedor_razon_social, bi_gravado_dg, igv_ipm_dg, total_cp, moneda)
VALUES 
('20889977664', 'EMPRESA DEMO MYPE S.A.C.', '202512', '08/12/2025', '01', 'FE01', '0', '100', '6', '20533799745', 'MULTISERVICIOS HEFREM E.I.R.L.',   1500.00, 270.00, 1770.00, 'PEN'),
('20889977664', 'EMPRESA DEMO MYPE S.A.C.', '202512', '10/12/2025', '01', 'E001', '0', '478', '6', '20110423170', 'TECNOLOGIA Y PROYECTOS S.A.C. (TECPROSA)', 1650.00, 297.00, 1947.00, 'PEN'),
('20889977664', 'EMPRESA DEMO MYPE S.A.C.', '202512', '11/12/2025', '01', 'FA02', '0', '1420', '6', '20502807057', 'VALCO TRADE S.A.C.',              2410.00, 433.80, 2843.80, 'PEN'),
('20889977664', 'EMPRESA DEMO MYPE S.A.C.', '202512', '13/12/2025', '01', 'FE01', '0', '2000', '6', '20506285403', 'JC SOLUTIONS SYSTEMS S.R.L.',     8445.00, 1520.10, 9965.10, 'PEN');
