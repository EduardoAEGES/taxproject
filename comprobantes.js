document.addEventListener('DOMContentLoaded', () => {
    // Mock Database of RUCs (Fallback)
    const rucDatabase = {
        '20100055237': 'UNIVERSIDAD PRIVADA TELESUP S.A.C.',
        '20131312955': 'SUNAT',
        '20600123456': 'CERTUS S.A.C.',
        '20456789012': 'FABRINSUR GROUP S.R.L.',
        '20100152356': 'CLARO PERU S.A.',
        '20255938525': 'TELEFONICA DEL PERU S.A.A.',
        '20543210987': 'EMPRESA DE TRANSPORTE EJEMPLO S.A.',
        '20123456789': 'COMERCIALIZADORA GENERAL S.A.C.',
        '20614713993': 'ALTAGRACIA PERU S.A.C.'
    };

    const rucInput = document.getElementById('ruc-input');
    const razonSocialDisplay = document.getElementById('razon-social-display');

    if (rucInput && razonSocialDisplay) {
        rucInput.addEventListener('input', (e) => {
            const ruc = e.target.value;

            // Allow only numbers
            e.target.value = ruc.replace(/\D/g, '');

            // Clear previous result if RUC is not 11 digits
            if (e.target.value.length !== 11) {
                razonSocialDisplay.textContent = '';
                razonSocialDisplay.style.backgroundColor = '#e0e0e0'; // Grey when empty
                razonSocialDisplay.style.border = 'none';
            } else {
                const currentRuc = e.target.value;

                // Show "loading" state
                razonSocialDisplay.textContent = 'Consultando RUC...';
                razonSocialDisplay.style.backgroundColor = '#fff';
                razonSocialDisplay.style.color = '#666';
                razonSocialDisplay.style.border = '1px solid #ccc';
                razonSocialDisplay.style.padding = '0 5px';
                razonSocialDisplay.style.display = 'flex';
                razonSocialDisplay.style.alignItems = 'center';

                // STRATEGY: Cascade Lookup
                // 1. Try Local Backend (Best for local dev)
                // 2. If fail, Try Direct Public API (Might work if CORS allows)
                // 3. If fail, Use Local Database (Guaranteed fallback)

                fetch(`http://localhost:5000/consultar-ruc?ruc=${currentRuc}`)
                    .then(response => {
                        if (!response.ok) throw new Error('Backend unresponsive');
                        return response.json();
                    })
                    .then(data => {
                        if (data && data.nombre) {
                            displayResult(data.nombre);
                        } else {
                            throw new Error('Backend returned no name');
                        }
                    })
                    .catch(backendError => {
                        console.log('Backend failed, trying direct API...', backendError);

                        // 2. Direct API Attempt
                        fetch(`https://api.apis.net.pe/v1/ruc?numero=${currentRuc}`)
                            .then(response => {
                                if (!response.ok) throw new Error('Direct API unavailable');
                                return response.json();
                            })
                            .then(data => {
                                if (data && data.nombre) {
                                    displayResult((data.nombre));
                                } else {
                                    throw new Error('Direct API no data');
                                }
                            })
                            .catch(apiError => {
                                console.log('Direct API failed, using Mock DB...', apiError);

                                // 3. Local Mock Database Fallback
                                if (rucDatabase[currentRuc]) {
                                    displayResult(rucDatabase[currentRuc]);
                                } else {
                                    displayResult('CONTRIBUYENTE GENERICO (Modo Demo)');
                                }
                            });
                    });
            }
        });
    }

    function displayResult(nombre) {
        const razonSocialDisplay = document.getElementById('razon-social-display');
        razonSocialDisplay.textContent = nombre;
        razonSocialDisplay.style.backgroundColor = '#fff'; // White background for result
        razonSocialDisplay.style.border = '1px solid #7f9db9';
        razonSocialDisplay.style.padding = '0 5px';
        razonSocialDisplay.style.display = 'flex';
        razonSocialDisplay.style.alignItems = 'center';
        razonSocialDisplay.style.color = '#000';
        razonSocialDisplay.style.fontWeight = 'bold';
    }

    // Navigation to Emitir Factura
    const btnContinuar = document.querySelector('.btn-continuar');
    if (btnContinuar) {
        btnContinuar.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission

            const ruc = document.getElementById('ruc-input').value;
            const razon = document.getElementById('razon-social-display').textContent;
            const monedaSelect = document.querySelector('.input-select');
            const moneda = monedaSelect ? monedaSelect.value : 'SOLES';

            if (ruc.length === 11) {
                // Navigate to next page with params
                window.location.href = `emitir_factura.html?ruc=${encodeURIComponent(ruc)}&razon=${encodeURIComponent(razon)}&moneda=${encodeURIComponent(moneda)}`;
            } else {
                alert('Por favor ingrese un RUC válido de 11 dígitos.');
            }
        });
    }
});
