document.addEventListener('DOMContentLoaded', function () {
    // La lógica de cambio de pestaña se puede agregar aquí
    console.log('SUNAT Interface Loaded');

    // Implementación simple de pestañas para demostración
    const mainTabs = document.querySelectorAll('.tab-btn');
    mainTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            mainTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    const subTabs = document.querySelectorAll('.sub-tab-btn');
    subTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            subTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    const tertiaryTabs = document.querySelectorAll('.tertiary-tab-btn');
    tertiaryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tertiaryTabs.forEach(t => t.classList.remove('active-tertiary'));
            tab.classList.add('active-tertiary');
        });
    });

    // Reloj en tiempo real
    function updateClock() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        // La imagen muestra HH:mm, pero los usuarios a menudo prefieren segundos o al menos una actualización precisa de HH:mm
        // La imagen muestra: 15/02/2026 18:38
        const timeString = `${day}/${month}/${year} ${hours}:${minutes}`;
        document.getElementById('clock').textContent = timeString;
    }

    setInterval(updateClock, 1000);
    updateClock(); // Ejecutar inmediatamente

    // Data Integration (CSVs)
    const csvData = `Ruc,Razon Social,Periodo,CAR SUNAT,Fecha de emisión,Fecha Vcto/Pago,Tipo CP/Doc.,Serie del CDP,Nro CP o Doc. Nro Inicial (Rango),Nro Final (Rango),Tipo Doc Identidad,Nro Doc Identidad,Apellidos Nombres/ Razón Social,Valor Facturado Exportación,BI Gravada,Dscto BI,IGV / IPM,Dscto IGV / IPM,Mto Exonerado,Mto Inafecto,ISC,BI Grav IVAP,IVAP,ICBPER,Otros Tributos,Total CP,Moneda,Tipo Cambio,Fecha Emisión Doc Modificado,Tipo CP Modificado,Serie CP Modificado,Nro CP Modificado,ID Proyecto Operadores Atribución,Tipo de Nota,Est. Comp,Valor FOB Embarcado,Valor OP Gratuitas,Tipo Operación,DAM / CP,CLU
20123456789,EMPRESA EJEMPLO S.R.L.,202512,2012345678901F0030000023501,01/12/2025,01/12/2025,01,F003,23501,,6,20601765544,EMPRESA DE SERVICIOS ZAM S.A.C.,0,370.17,0,66.63,0,0,0,0,0,0,0,0,436.8,PEN,1.000,,,,,,,1,0,0,0101,,
20123456789,EMPRESA EJEMPLO S.R.L.,202512,2012345678901F0030000023502,01/12/2025,01/12/2025,01,F003,23502,,6,20455651655,SCE INDUSTRIAL E.I.R.L.,0,56.36,0,10.14,0,0,0,0,0,0,0,0,66.5,PEN,1.000,,,,,,,1,0,0,0101,,
20123456789,EMPRESA EJEMPLO S.R.L.,202512,2012345678901F0030000023503,01/12/2025,01/12/2025,01,F003,23503,,6,20601765544,EMPRESA DE SERVICIOS ZAM S.A.C.,0,110.17,0,19.83,0,0,0,0,0,0,0,0,130,PEN,1.000,,,,,,,1,0,0,0101,,
20123456789,EMPRESA EJEMPLO S.R.L.,202512,2012345678901F0040000028355,01/12/2025,01/12/2025,01,F004,28355,,6,20612465330,M & C PROYECTOS OBRAS Y SERVICIOS GENERALES S.R.L.,0,30.93,0,5.57,0,0,0,0,0,0,0,0,36.5,PEN,1.000,,,,,,,1,0,0,0101,,
20123456789,EMPRESA EJEMPLO S.R.L.,202512,2012345678901F0040000028356,01/12/2025,01/12/2025,01,F004,28356,,6,20478111712,LR CONSTRUCCIONES GENERALES S.A.C. - LR CONGER S.A.C.,0,116.1,0,20.9,0,0,0,0,0,0,0,0,137,PEN,1.000,,,,,,,1,0,0,0101,,`;

    function parseCSV(csv) {
        const lines = csv.trim().split('\n');
        const headers = lines[0].split(',');
        const rows = lines.slice(1).map(line => line.split(','));
        return { headers, rows };
    }

    const { headers, rows } = parseCSV(csvData);

    function renderTable(dataRows) {
        const tbody = document.querySelector('.results-table tbody');
        tbody.innerHTML = '';

        // Initialize totals
        let totals = {
            valExp: 0, biGrav: 0, dsctoBi: 0, igv: 0, dsctoIgv: 0,
            mtoExo: 0, mtoIna: 0, isc: 0, biIvap: 0, ivap: 0,
            icbper: 0, otros: 0, total: 0
        };

        dataRows.forEach(row => {
            // Map CSV columns to Table columns (Indices based on CSV header)
            // 0: Ruc, 1: Razon Social, 2: Periodo, 3: CAR, 4: F. Emision, 5: F. Vcto, 6: Tipo CP, 7: Serie, 8: Nro Ini, 9: Nro Fin, 
            // 10: Tipo Doc Id, 11: Nro Doc Id, 12: Razon Social Adq, 13: Val Exp, 14: BI Grav, 15: Dscto BI, 16: IGV, 17: Dscto IGV, 
            // 18: Mto Exo, 19: Mto Ina, 20: ISC, 21: BI Ivap, 22: IVAP, 23: ICBPER, 24: Otros, 25: Total CP, 26: Moneda, 27: TC, ...

            // Unpack row data
            const [
                ruc, razonSocial, periodo, car, fEmision, fVcto, tipoCp, serie, nroIni, nroFin,
                tipoDocId, nroDocId, adqRazon, valExp, biGrav, dsctoBi, igv, dsctoIgv,
                mtoExo, mtoIna, isc, biIvap, ivap, icbper, otros, totalCp, moneda, tc,
                fRef, tipoRef, serieRef, nroRef, idProy, tipoNota, estComp, fob, opGrat, tipoOp, dam, clu
            ] = row;

            // Accumulate totals
            totals.valExp += parseFloat(valExp) || 0;
            totals.biGrav += parseFloat(biGrav) || 0;
            totals.dsctoBi += parseFloat(dsctoBi) || 0;
            totals.igv += parseFloat(igv) || 0;
            totals.dsctoIgv += parseFloat(dsctoIgv) || 0;
            totals.mtoExo += parseFloat(mtoExo) || 0;
            totals.mtoIna += parseFloat(mtoIna) || 0;
            totals.isc += parseFloat(isc) || 0;
            totals.biIvap += parseFloat(biIvap) || 0;
            totals.ivap += parseFloat(ivap) || 0;
            totals.icbper += parseFloat(icbper) || 0;
            totals.otros += parseFloat(otros) || 0;
            totals.total += parseFloat(totalCp) || 0;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="checkbox"></td>
                <td></td>
                <td><i class="fas fa-sync-alt"></i></td>
                <td>${fEmision}</td>
                <td>${fVcto}</td>
                <td>${tipoCp}</td>
                <td>${serie}</td>
                <td>${nroIni}</td>
                <td>${nroFin || ''}</td>
                
                <!-- Adquiriente -->
                <td>${tipoDocId}</td>
                <td>${nroDocId}</td>
                <td>${adqRazon}</td>

                <!-- Montos -->
                <td>${parseFloat(valExp).toFixed(2)}</td>
                <td>${parseFloat(biGrav).toFixed(2)}</td>
                <td>${parseFloat(dsctoBi).toFixed(2)}</td>
                <td>${parseFloat(igv).toFixed(2)}</td>
                <td>${parseFloat(dsctoIgv).toFixed(2)}</td>
                <td>${parseFloat(mtoExo).toFixed(2)}</td>
                <td>${parseFloat(mtoIna).toFixed(2)}</td>
                <td>${parseFloat(isc).toFixed(2)}</td>
                <td>${parseFloat(biIvap).toFixed(2)}</td>

                <!-- Totales/Moneda -->
                <td>${parseFloat(ivap).toFixed(2)}</td>
                <td>${parseFloat(icbper).toFixed(2)}</td>
                <td>${parseFloat(otros).toFixed(2)}</td>
                <td>${parseFloat(totalCp).toFixed(2)}</td>
                <td>${moneda}</td>
                <td>${Number(tc).toFixed(3)}</td>

                <!-- Referencias (Empty in sample, mostly) -->
                <td><i class="far fa-edit"></i></td>
                <td>${fRef || ''}</td>
                <td>${tipoRef || ''}</td>
                <td>${serieRef || ''}</td>
                <td>${nroRef || ''}</td>

                <!-- Otros -->
                <td>${idProy || ''}</td>
                <td>${tipoNota || ''}</td>
                <td>${estComp || '1'}</td>
                <td>ACTIVO</td>
                <td>${fob || '0.00'}</td>
                <td>${opGrat || '0.00'}</td>
                <td>${tipoOp || '0101'}</td>
                <td>${dam || ''}</td>
                <td>${clu || ''}</td>
                <td>${car || ''}</td>
            `;
            tbody.appendChild(tr);
        });

        // Update Totals Footer
        document.getElementById('total-val-exp').textContent = totals.valExp.toFixed(2);
        document.getElementById('total-bi-grav').textContent = totals.biGrav.toFixed(2);
        document.getElementById('total-dscto-bi').textContent = totals.dsctoBi.toFixed(2);
        document.getElementById('total-igv').textContent = totals.igv.toFixed(2);
        document.getElementById('total-dscto-igv').textContent = totals.dsctoIgv.toFixed(2);
        document.getElementById('total-mto-exo').textContent = totals.mtoExo.toFixed(2);
        document.getElementById('total-mto-ina').textContent = totals.mtoIna.toFixed(2);
        document.getElementById('total-isc').textContent = totals.isc.toFixed(2);
        document.getElementById('total-bi-ivap').textContent = totals.biIvap.toFixed(2);
        document.getElementById('total-ivap').textContent = totals.ivap.toFixed(2);
        document.getElementById('total-icbper').textContent = totals.icbper.toFixed(2);
        document.getElementById('total-otros').textContent = totals.otros.toFixed(2);
        document.getElementById('total-total-cp').textContent = totals.total.toFixed(2);
    }

    renderTable(rows);

    // Dropdown Logic
    const selects = ['periodo', 'mes'];

    selects.forEach(id => {
        const selectBox = document.getElementById(`${id}-select`);
        const optionsBox = document.getElementById(`${id}-options`);
        const span = selectBox.querySelector('span');

        selectBox.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other dropdowns
            selects.forEach(otherId => {
                if (otherId !== id) {
                    document.getElementById(`${otherId}-options`).classList.remove('show');
                }
            });
            optionsBox.classList.toggle('show');
        });

        optionsBox.querySelectorAll('.option-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                span.textContent = item.textContent;
                optionsBox.classList.remove('show');
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        selects.forEach(id => {
            document.getElementById(`${id}-options`).classList.remove('show');
        });
    });
});
