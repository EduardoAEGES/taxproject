/**
 * auth.js
 * Configuración de Supabase y funciones de autenticación
 */

// NOTA: Reemplazar estas constantes con las reales de Supabase proporcionadas por el usuario.
const SUPABASE_URL = 'https://elcoiyuywslcfstdcfiy.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_zei6qE5TdlQ49WbHZ_eU-w_Tj6scxQs';

// Si las credenciales son inválidas o no están configuradas, las funciones fallarán graciosamente en local.
let supabaseClient = null;

if (typeof window.supabase !== 'undefined' && SUPABASE_URL !== 'URL_DE_SUPABASE') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/**
 * Función central para iniciar sesión verificando contra la tabla 'usuarios'
 * Asume una tabla pública en Supabase llamada 'usuarios' con columnas: ruc, usuario, clave
 */
async function loginConSupabase(ruc, usuario, clave) {
    // Si no hay cliente de Supabase (por falta de credenciales), 
    // retornar éxito solo si el usuario ingresa datos de prueba por defecto.
    if (!supabaseClient) {
        console.warn("Supabase no está configurado. Usando autenticación de prueba.");
        if (ruc === '20123456789' && usuario === 'ADMIN' && clave === '123') {
            sessionStorage.setItem('sunat_auth', JSON.stringify({ ruc, usuario }));
            return true;
        }
        return false;
    }

    try {
        const { data, error } = await supabaseClient
            .from('usuarios')
            .select('*')
            .eq('ruc', ruc)
            .eq('usuario', usuario)
            .eq('clave', clave)
            .single();

        if (error || !data) {
            console.error("Credenciales inválidas", error);
            return false;
        }

        // Guardar sesión
        sessionStorage.setItem('sunat_auth', JSON.stringify(data));
        return true;
    } catch (e) {
        console.error("Error en login:", e);
        return false;
    }
}

/**
 * Función para verificar si hay una sesión activa.
 * Debe incluirse en la cabecera de las páginas protegidas.
 */
function checkAuth() {
    const authData = sessionStorage.getItem('sunat_auth');
    if (!authData) {
        // Redirigir a login si no hay sesión
        // Guarda la URL actual para volver después del login
        sessionStorage.setItem('loginReferrer', window.location.pathname);
        window.location.href = 'login.html';
    }
}

/**
 * Cierra la sesión
 */
function logout() {
    sessionStorage.removeItem('sunat_auth');
    window.location.href = 'login.html';
}

/**
 * Registra un nuevo usuario en la base de datos
 */
async function registrarUsuario(ruc, usuario, clave, denominacion) {
    if (!supabaseClient) {
        console.error("Supabase no está configurado.");
        return { success: false, error: "Conexión a base de datos no configurada." };
    }

    try {
        const { data, error } = await supabaseClient
            .from('usuarios')
            .insert([
                { ruc, usuario, clave, denominacion }
            ]);

        if (error) {
            console.error("Error al registrar", error);
            // Mostrar si es un error por duplicación u otra restricción
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (e) {
        console.error("Error catched:", e);
        return { success: false, error: e.message };
    }
}

// Verifica en qué página estamos
const isLoginPage = window.location.pathname.includes('login.html') || window.location.pathname.endsWith('login');
const isIndexPage = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';

// Solo requerir autenticación para otras páginas (los simuladores)
if (!isLoginPage && !isIndexPage) {
    checkAuth();
}

// Adjuntar evento salir a botones de salir si existen
document.addEventListener('DOMContentLoaded', () => {
    const btnSalir = document.querySelector('.btn-salir');
    if (btnSalir) {
        btnSalir.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Autocompletar nombre de empresa si hay un lugar para ello en simuladores
    const userSession = sessionStorage.getItem('sunat_auth');
    if (userSession) {
        try {
            const userData = JSON.parse(userSession);
            // Si estemos en el header azul de los simuladores, lo reemplazamos
            const nameDisplays = document.querySelectorAll('.user-info-right span:first-child');
            if (nameDisplays.length > 0 && userData.denominacion) {
                // Mantener la flecha si existe
                nameDisplays.forEach(el => {
                    const hasCaret = el.innerHTML.includes('fa-caret-down');
                    el.innerHTML = `Bienvenido, ${userData.denominacion} ${hasCaret ? '<i class="fas fa-caret-down"></i>' : ''}`;
                });
            }
        } catch (e) { }
    }
});
