-- SCRIPTS PARA GENERAR 120 VENTAS EN RVIE (10 x MES en 2025)

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
    -- Borraremos los datos anteriores de prueba del 2025 para que no se dupliquen al insertar los nuevos 120
    DELETE FROM public.rvie_data WHERE ruc = '20123456789' AND periodo LIKE '2025%';

    FOR mes IN 1..12 LOOP
        periodo_str := '2025' || LPAD(mes::TEXT, 2, '0');
        
        -- 10 ventas por mes para cumplir los 120 registros en total
        FOR i IN 1..10 LOOP
            SELECT ruc, nombre_razon INTO random_cliente 
            FROM public.buecont 
            ORDER BY random() 
            LIMIT 1;

            dia := floor(random() * 28 + 1)::INT;
            fecha_emision_str := '2025-' || LPAD(mes::TEXT, 2, '0') || '-' || LPAD(dia::TEXT, 2, '0');

            monto_base := ROUND((random() * 5000 + 100)::NUMERIC, 2);
            monto_igv := ROUND((monto_base * 0.18)::NUMERIC, 2);
            monto_total := monto_base + monto_igv;
            
            nro_comprobante := nro_comprobante + 1;

            INSERT INTO public.rvie_data (
                ruc, razon_social, periodo, car_sunat, fecha_emision, tipo_cp_doc, 
                serie_cdp, nro_cp_inicial, tipo_doc_identidad, nro_doc_identidad, 
                adquiriente_razon_social, bi_gravada, igv_ipm, total_cp, 
                moneda
            ) VALUES (
                '20123456789', 'EMPRESA EJEMPLO S.A.C.', periodo_str,
                '123456789012345678901234567890' || i, 
                fecha_emision_str, 
                '01', 'F001', nro_comprobante::TEXT, 
                '6', random_cliente.ruc, random_cliente.nombre_razon,
                monto_base, monto_igv, monto_total,
                'PEN'
            );
        END LOOP;
    END LOOP;
END $$;
