-- Ejecutar este script en el SQL Editor de Supabase
-- Generaremos 6 comprobantes de venta cada mes (enero a diciembre de 2025)
-- usando RUCs aleatorios de la base de datos "buecont".

DO $$
DECLARE
    mes INT;
    dia INT;
    i INT;
    periodo_str TEXT;
    fecha_emision_str TEXT;
    random_cliente RECORD;
    monto_base NUMERIC;
    monto_igv NUMERIC;
    monto_total NUMERIC;
    nro_comprobante INT := 1000;
BEGIN
    -- Eliminar las operaciones anteriores para evitar duplicados si se corre varias veces (Opcional)
    -- DELETE FROM public.rvie_data WHERE ruc = '20123456789' AND periodo LIKE '2025%';

    -- Bucle para cada mes del 2025
    FOR mes IN 1..12 LOOP
        -- Formateando periodo YYYYMM
        periodo_str := '2025' || LPAD(mes::TEXT, 2, '0');
        
        -- Generar 6 ventas por mes
        FOR i IN 1..6 LOOP
            -- Seleccionar un RUC aleatorio de la tabla "buecont"
            SELECT ruc, nombre_razon INTO random_cliente 
            FROM public.buecont 
            ORDER BY random() 
            LIMIT 1;

            -- Generar fecha de emisión aleatoria dentro del mes
            dia := floor(random() * 28 + 1)::INT;
            fecha_emision_str := '2025-' || LPAD(mes::TEXT, 2, '0') || '-' || LPAD(dia::TEXT, 2, '0');

            -- Generar montos aleatorios
            monto_base := ROUND((random() * 5000 + 100)::NUMERIC, 2);
            monto_igv := ROUND((monto_base * 0.18)::NUMERIC, 2);
            monto_total := monto_base + monto_igv;
            
            nro_comprobante := nro_comprobante + 1;

            -- Inserción en la tabla rvie_data
            INSERT INTO public.rvie_data (
                -- Datos empresa declarante
                ruc, razon_social, periodo, 
                -- Datos comprobante
                car_sunat, fecha_emision, fecha_vcto_pago, tipo_cp_doc, serie_cdp, nro_cp_inicial, 
                -- Datos cliente (de buecont)
                tipo_doc_identidad, nro_doc_identidad, adquiriente_razon_social,
                -- Montos
                bi_gravado_dg, igv_doc_dg, total_cp, 
                estado_comprobante, moneda
            ) VALUES (
                '20123456789', 'EMPRESA USUARIA DE PRUEBA S.A.C.', periodo_str,
                '123456789012345678901234567890' || i, -- CAR Inventado
                fecha_emision_str, 
                NULL, -- sin vcto
                '01', -- Tipo = Factura
                'F001', -- Serie
                nro_comprobante::TEXT, -- Número secuencial
                '6', -- 6 = RUC
                random_cliente.ruc, 
                random_cliente.nombre_razon,
                monto_base, monto_igv, monto_total,
                '1', -- Estado activo
                'PEN' -- Soles
            );
        END LOOP;
    END LOOP;
END $$;
