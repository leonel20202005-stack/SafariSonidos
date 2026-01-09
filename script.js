// ===========================================================
// 1. IMPORTAR FIREBASE Y HERRAMIENTAS
// ===========================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===========================================================
// 2. CONFIGURACIÓN E INICIALIZACIÓN
// ===========================================================
const firebaseConfig = {
    apiKey: "AIzaSyC-E0E2f41wRB3WOG2QjrPlfhOkGn1UjQc",
    authDomain: "safarisonidos.firebaseapp.com",
    projectId: "safarisonidos",
    storageBucket: "safarisonidos.firebasestorage.app",
    messagingSenderId: "539812546780",
    appId: "1:539812546780:web:453c1e20074f9bfac70c19"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dbFirestore = getFirestore(app); // Base de datos en la nube
const provider = new GoogleAuthProvider();

// ===========================================================
// 3. BASE DE DATOS DE ANIMALES (CONTENIDO)
// ===========================================================

const GITHUB_URL = 'https://raw.githubusercontent.com/leonel20202005-stack/audiosJuego/main/';
const NUM_ANIMALES_POR_NIVEL = 5; 

const db = {
    granja: [
        { nombre: "Vaca",    sonido: "Muuu",     emoji: "🐄", archivo: "vaca.mp3" }, 
        { nombre: "Cerdo",   sonido: "Oink",     emoji: "🐷", archivo: "cerdo.mp3" },
        { nombre: "Gallo",   sonido: "Kikirikí", emoji: "🐓", archivo: "gallo.mp3" }, 
        { nombre: "Oveja",   sonido: "Beeee",    emoji: "🐑", archivo: "oveja.mp3" },
        { nombre: "Pato",    sonido: "Cuac",     emoji: "🦆", archivo: "pato.mp3" },
        { nombre: "Caballo", sonido: "Hiiiii",   emoji: "🐴", archivo: "caballo.mp3" }, 
        { nombre: "Pavo",    sonido: "Glu Glu",  emoji: "🦃", archivo: "pavo.mp3" },
        { nombre: "Conejo",  sonido: "Sniff",    emoji: "🐇", archivo: "conejo.mp3" }, 
        { nombre: "Cabra",   sonido: "Meeeh",    emoji: "🐐", archivo: "cabra.mp3" },
        { nombre: "Ganso",   sonido: "Honk",     emoji: "🦢", archivo: "ganso.mp3" },
        { nombre: "Burro",   sonido: "Hiaaw",    emoji: "🫏", archivo: "burro.mp3" }, 
        { nombre: "Ratón",   sonido: "Squeak",   emoji: "🐁", archivo: "raton.mp3" },
        { nombre: "Gallina", sonido: "Cluck",    emoji: "🐔", archivo: "gallina.mp3" }, 
        { nombre: "Abeja",   sonido: "Bzzzz",    emoji: "🐝", archivo: "abeja.mp3" },
        { nombre: "Hámster", sonido: "Chirp",    emoji: "🐹", archivo: "hamster.mp3" }
    ],
    mar: [
        { nombre: "Ballena Azul", sonido: "Uuuuh", emoji: "🐋", archivo: "ballenaazul.mp3"}, 
        { nombre: "Delfín", sonido: "Click", emoji: "🐬", archivo: "delfin.mp3"},
        { nombre: "Pulpo", sonido: "Blub", emoji: "🐙" },
        { nombre: "Tiburón", sonido: "Chomp", emoji: "🦈" },
        { nombre: "Tortuga Marina", sonido: "Hiss", emoji: "🐢" },
        { nombre: "Langosta", sonido: "Snap", emoji: "🦞" },
        { nombre: "Camarón", sonido: "Sshh", emoji: "🦐" },
        { nombre: "Medusa", sonido: "Jelly", emoji: "🦑" },
        { nombre: "Foca Común", sonido: "Arf Arf", emoji: "🦭" },
        { nombre: "Morsa", sonido: "Roar", emoji: "🦭" },
        { nombre: "Estrella de Mar", sonido: "Shine", emoji: "⭐" },
        { nombre: "Hipocampo", sonido: "Glug", emoji: "🫎" },
        { nombre: "Nutria de Mar", sonido: "Squeal", emoji: "🦦", archivo: "nutria.mp3"},
        { nombre: "Anguila Eléctrica", sonido: "Zap", emoji: "🐍" },
        { nombre: "Calamar", sonido: "Ink", emoji: "🦑" }
    ],
    selva: [
        { nombre: "León", sonido: "Roaar", emoji: "🦁", archivo: "leon.mp3" },
        { nombre: "Mono", sonido: "Uuh-Ah", emoji: "🐵", archivo: "mono.mp3"},
        { nombre: "Elefante", sonido: "Pauuu", emoji: "🐘", archivo: "elefante.mp3" }, 
        { nombre: "Tigre", sonido: "Grrr", emoji: "🐯", archivo: "tigre.mp3" },
        { nombre: "Loro", sonido: "Hola", emoji: "🦜", archivo: "loro.mp3"},
        { nombre: "Cocodrilo", sonido: "Snap", emoji: "🐊", archivo: "cocodrilo.mp3"}, 
        { nombre: "Gorila", sonido: "Ugh", emoji: "🦍" },
        { nombre: "Jirafa", sonido: "Mmm", emoji: "🦒" }, 
        { nombre: "Cebra", sonido: "Bray", emoji: "🦓" },
        { nombre: "Rinoceronte", sonido: "Grunt", emoji: "🦏" },
        { nombre: "Panda", sonido: "Chew", emoji: "🐼" }, 
        { nombre: "Tucán", sonido: "Croak", emoji: "🦜" },
        { nombre: "Perezoso", sonido: "Yawn", emoji: "🦥" }, 
        { nombre: "Chimpancé", sonido: "Hoot", emoji: "🐒" },
        { nombre: "Ocelote", sonido: "Meow", emoji: "🐆" }
    ],
    desierto: [
        { nombre: "Coyote", sonido: "Aullido", emoji: "🐺" }, { nombre: "Serpiente Cascabel", sonido: "Rattle", emoji: "🐍" },
        { nombre: "Camello", sonido: "Grunt", emoji: "🐪" }, { nombre: "Fenec", sonido: "Yelp", emoji: "🦊" },
        { nombre: "Correcaminos", sonido: "Beep", emoji: "🐦" },
        { nombre: "Escorpión", sonido: "Click", emoji: "🦂" }, { nombre: "Búho del Desierto", sonido: "Hoo", emoji: "🦉" },
        { nombre: "Lagarto Monitor", sonido: "Scurry", emoji: "🦎" }, { nombre: "Hiena", sonido: "Risa", emoji: "🦛" },
        { nombre: "Jerbo", sonido: "Chirp", emoji: "🐁" },
        { nombre: "Adax", sonido: "Sigh", emoji: "🐏" }, { nombre: "Dromedario", sonido: "Gurgle", emoji: "🐫" },
        { nombre: "Suricata", sonido: "Watch", emoji: "🦦" }, { nombre: "Tarántula", sonido: "Tap", emoji: "🕷️" },
        { nombre: "Halcon Peregrino", sonido: "Screech", emoji: "🦅" }
    ],
    artico: [
        { nombre: "Oso Polar", sonido: "Growl", emoji: "🐻‍❄️" }, { nombre: "Zorro Ártico", sonido: "Bark", emoji: "🦊" },
        { nombre: "Narval", sonido: "Click", emoji: "🐳" }, { nombre: "Reno / Caribú", sonido: "Snort", emoji: "🦌" },
        { nombre: "Beluga", sonido: "Melon", emoji: "🐋" },
        { nombre: "Búho Nival", sonido: "Hoot", emoji: "🦉" }, { nombre: "Liebre Ártica", sonido: "Thump", emoji: "🐇" },
        { nombre: "Lobo Ártico", sonido: "Howl", emoji: "🐺" }, { nombre: "Pingüino Emperador", sonido: "Squawk", emoji: "🐧" },
        { nombre: "Lince Canadiense", sonido: "Meow", emoji: "🐈" },
        { nombre: "Kodiak", sonido: "Roar", emoji: "🐻" }, { nombre: "Orca", sonido: "Whistle", emoji: "🐋" },
        { nombre: "Alce", sonido: "Bellow", emoji: "🦌" }, { nombre: "Rata almizclera", sonido: "Splash", emoji: "🐭" },
        { nombre: "Marmota Alpina", sonido: "Whistle", emoji: "🐿️" }
    ],
    bosque: [
        { nombre: "Oso Pardo", sonido: "Roar", emoji: "🐻" }, { nombre: "Búho Real", sonido: "Hoot", emoji: "🦉" },
        { nombre: "Venado cola blanca", sonido: "Snort", emoji: "🦌" }, { nombre: "Mapache", sonido: "Chirr", emoji: "🦝" },
        { nombre: "Lobo Gris", sonido: "Howl", emoji: "🐺" },
        { nombre: "Ardilla", sonido: "Chirp", emoji: "🐿️" }, { nombre: "Tejón", sonido: "Hiss", emoji: "🦡" },
        { nombre: "Zorro Rojo", sonido: "Yelp", emoji: "🦊" }, { nombre: "Jabalí", sonido: "Oink", emoji: "🐗" },
        { nombre: "Mofeta", sonido: "Stink", emoji: "🦨" },
        { nombre: "Puercoespín", sonido: "Quill", emoji: "🦔" }, { nombre: "Castor Canadiense", sonido: "Slap", emoji: "🦫" },
        { nombre: "Pájaro Carpintero", sonido: "Tap Tap", emoji: "🐦" }, { nombre: "Comadreja", sonido: "Hiss", emoji: "🪱" },
        { nombre: "Gato Montés", sonido: "Meow", emoji: "🐈" }
    ],
    montana: [
        { nombre: "Cabra Montés", sonido: "Bleat", emoji: "🐐" }, { nombre: "Cóndor Andino", sonido: "Hiss", emoji: "🦅" },
        { nombre: "Leopardo de las Nieves", sonido: "Chuff", emoji: "🐆" }, { nombre: "Puma", sonido: "Scream", emoji: "🐈" },
        { nombre: "Águila Real", sonido: "Screech", emoji: "🦅" },
        { nombre: "Borrego Cimarrón", sonido: "Baaa", emoji: "🐑" }, { nombre: "Oso Grizzly", sonido: "Grunt", emoji: "🐻" },
        { nombre: "Lama", sonido: "Spit", emoji: "🦙" }, { nombre: "Muflón", sonido: "Bleat", emoji: "🐑" },
        { nombre: "Yak", sonido: "Moo", emoji: "🐃" },
        { nombre: "Bisonte", sonido: "Snort", emoji: "🦬" }, { nombre: "Armadillo", sonido: "Click", emoji: "🦔" },
        { nombre: "Chinchilla", sonido: "Squeak", emoji: "🐹" }, { nombre: "Vicúña", sonido: "Snort", emoji: "🦙" },
        { nombre: "Guepardo", sonido: "Chirp", emoji: "🐆" }
    ],
    rio: [
        { nombre: "Nutria de Río", sonido: "Squeal", emoji: "🦦" }, { nombre: "Castor", sonido: "Slap", emoji: "🦫" },
        { nombre: "Pez Gato", sonido: "Meow", emoji: "🐟" }, { nombre: "Caimán", sonido: "Bellow", emoji: "🐊" },
        { nombre: "Libélula", sonido: "Buzz", emoji: "🦟" },
        { nombre: "Rana Arborícola", sonido: "Croak", emoji: "🐸" }, { nombre: "Tortuga de agua dulce", sonido: "Hiss", emoji: "🐢" },
        { nombre: "Garza", sonido: "Squawk", emoji: "🦆" }, { nombre: "Sapo Común", sonido: "Ribbit", emoji: "🐸" },
        { nombre: "Piraña", sonido: "Bite", emoji: "🐟" },
        { nombre: "Pelícano", sonido: "Gulp", emoji: "鹈" }, { nombre: "Lombriz", sonido: "Wiggle", emoji: "🐛" },
        { nombre: "Cangrejo de río", sonido: "Click", emoji: "🦀" }, { nombre: "Hipopótamo", sonido: "Grunt", emoji: "🦛" },
        { nombre: "Tritón", sonido: "Splash", emoji: "🦎" }
    ]
};

const catEmojis = { 
    granja: '🏡', mar: '🌊', selva: '🦁', 
    desierto: '🏜️', artico: '🧊', bosque: '🌳', montana: '⛰️', rio: '🏞️' 
};
const ALL_CATEGORIES = Object.keys(db);

// --- VARIABLES DE ESTADO ---
let perfiles = [];
let perfilActual = null;

let estado = {
    cat: 'granja', 
    nivel: 1, 
    puntos: 0, 
    progreso: ALL_CATEGORIES.reduce((acc, c) => ({ ...acc, [c]: 0 }), {}),
    animalesCompletados: 0, 
    totalAnimalesNivel: NUM_ANIMALES_POR_NIVEL,
    metaPuntosNivel: NUM_ANIMALES_POR_NIVEL * 2 * 10 
};

// ===========================================================
// 4. AUTENTICACIÓN Y NUBE (CORREGIDO Y COMPLETO)
// ===========================================================

window.loginConGoogle = function() {
    // 1. Intentamos el login con Google
    signInWithPopup(auth, provider)
        .then(async (result) => {
            // --- SI LLEGAMOS AQUÍ, GOOGLE FUNCIONÓ ---
            const user = result.user;
            console.log("✅ Login Google exitoso:", user.displayName);

            // 2. Ahora intentamos cargar tus datos del juego
            try {
                await gestionarUsuarioGoogle(user);
                // Si esto pasa sin errores, todo está perfecto
                mostrarNotificacion(`¡Hola, ${user.displayName}!`, "success");
            } catch (errorJuego) {
                // Si falla aquí, es culpa del juego (base de datos o código local), NO de Google
                console.error("❌ Error cargando datos del usuario:", errorJuego);
                mostrarNotificacion("Entraste, pero hubo un error cargando tu perfil", "warning");
            }
        })
        .catch((errorGoogle) => {
            // --- SI LLEGAMOS AQUÍ, GOOGLE FALLÓ (Cerraste la ventana, sin internet, etc) ---
            console.error("❌ Error de conexión con Google:", errorGoogle);
            mostrarNotificacion("Error al conectar con Google", "error");
        });
}

async function gestionarUsuarioGoogle(user) {
    // 1. CARGA DE DATOS (LO IMPORTANTE)
    try {
        const docRef = doc(dbFirestore, "jugadores", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            perfilActual = docSnap.data();
            perfilActual.googleUid = user.uid;
            
            // Actualizar en lista local
            let localIndex = perfiles.findIndex(p => p.googleUid === user.uid);
            if(localIndex >= 0) perfiles[localIndex] = perfilActual;
            else perfiles.push(perfilActual);
        } else {
            const nombreDisplay = user.displayName || "Explorador Google";
            perfilActual = crearPerfilBase(nombreDisplay, user.uid);
            perfiles.push(perfilActual);
            await guardarEnNube(perfilActual);
        }
        
        guardarPerfilesLocales();
        window.cargarPerfiles();

    } catch (errorBD) {
        // Solo si falla la BASE DE DATOS lanzamos el error grave
        throw errorBD; 
    }

    // 2. ARRANQUE DEL JUEGO (LO VISUAL)
    // Si esto falla, no bloqueamos al usuario porque sus datos ya están bien.
    try {
        window.iniciarJuego(true);
    } catch (errorVisual) {
        console.warn("⚠️ El perfil cargó bien, pero hubo un detalle visual al iniciar:", errorVisual);
        // Forzamos que se quite el modal de inicio por si acaso
        document.getElementById('pantalla-inicio').style.display = 'none';
        document.getElementById('juego').style.display = 'flex';
    }
}

function crearPerfilBase(nombre, uid = null) {
    return {
        nombre: nombre,
        googleUid: uid,
        xp: 0,
        bellotas: 0,
        medallas: [],
        progreso: ALL_CATEGORIES.reduce((acc, c) => ({ ...acc, [c]: 0 }), {}),
        catActual: 'granja',
        nivelActual: 1
    };
}
// ===========================================================
// 5. GESTIÓN DE PERFILES Y GUARDADO
// ===========================================================

window.cargarPerfiles = function() {
    detenerSonidoAnterior(); 
    const perfilesJSON = localStorage.getItem('safariSonidosPerfiles');
    perfiles = perfilesJSON ? JSON.parse(perfilesJSON) : [];
    
    const select = document.getElementById('select-perfil');
    const inputNuevo = document.getElementById('input-nombre-nuevo');
    
    // Limpiamos el select
    select.innerHTML = '';
    
    // 1. Opción por defecto (título)
    const optTitulo = document.createElement('option');
    optTitulo.value = "";
    optTitulo.textContent = "--- Elige un explorador ---";
    select.appendChild(optTitulo);
    
    // 2. Opción para CREAR NUEVO (¡ESTO ES LO NUEVO!)
    const optNuevo = document.createElement('option');
    optNuevo.value = "NUEVO";
    optNuevo.textContent = "➕ CREAR NUEVO JUGADOR...";
    optNuevo.style.fontWeight = "bold";
    optNuevo.style.color = "#FF6F61";
    select.appendChild(optNuevo);

    // 3. Listar los perfiles existentes
    perfiles.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.nombre; 
        const esGoogle = p.googleUid ? " (Nube)" : "";
        
        // --- CAMBIO AQUÍ ---
        // 1. Calculamos el nombre del rango basado en la XP que ya tiene guardada
        const nombreRango = calcularNivelXP(p.xp || 0);

        // 2. Lo mostramos en el texto (ej: "ERICK - Novato")
        opt.textContent = `${p.nombre}${esGoogle} - ${nombreRango}`;
        // -------------------

        if(p.googleUid) opt.setAttribute('data-uid', p.googleUid);
        select.appendChild(opt);
    });
    
    // Resetear
    perfilActual = null;
    select.selectedIndex = 0; 
    
    // Por defecto ocultamos el input y el botón de borrar
    inputNuevo.style.display = 'none';
    inputNuevo.value = '';
    document.getElementById('btn-eliminar-perfil').style.display = 'none';
    
    // Si NO hay perfiles, forzamos que se muestre el input directamente
    if (perfiles.length === 0) {
        inputNuevo.style.display = 'block';
        select.style.display = 'none'; // Ocultamos el select si está vacío
    } else {
        select.style.display = 'block';
    }
}

function guardarPerfiles() {
    guardarPerfilesLocales(); 
    if(perfilActual && perfilActual.googleUid) {
        guardarEnNube(perfilActual);
    }
}

function guardarPerfilesLocales() {
    localStorage.setItem('safariSonidosPerfiles', JSON.stringify(perfiles));
}

async function guardarEnNube(perfil) {
    try {
        await setDoc(doc(dbFirestore, "jugadores", perfil.googleUid), perfil);
        console.log("Datos sincronizados con la nube ☁️");
    } catch (e) {
        console.error("Error guardando en nube: ", e);
    }
}

window.seleccionarPerfil = function() {
    const select = document.getElementById('select-perfil');
    const inputNuevo = document.getElementById('input-nombre-nuevo');
    const btnBorrar = document.getElementById('btn-eliminar-perfil');
    
    const valorSeleccionado = select.value;
    
    // CASO A: Eligió "CREAR NUEVO..."
    if (valorSeleccionado === "NUEVO") {
        perfilActual = null;
        inputNuevo.value = ''; // Limpiamos por si acaso
        inputNuevo.style.display = 'block'; 
        inputNuevo.focus(); 
        btnBorrar.style.display = 'none';
        return;
    }

    // CASO B: Eligió un perfil existente
    if (valorSeleccionado && valorSeleccionado !== "") {
        inputNuevo.style.display = 'none'; 
        inputNuevo.value = ''; // <--- ¡AGREGA ESTO! BORRA EL NOMBRE "MAR"
        btnBorrar.style.display = 'block'; 

        const selectedOption = select.options[select.selectedIndex];
        const uid = selectedOption.getAttribute('data-uid');

        if(uid) {
            perfilActual = perfiles.find(p => p.googleUid === uid);
        } else {
            perfilActual = perfiles.find(p => p.nombre === valorSeleccionado && !p.googleUid);
        }

    // CASO C: Volvió a "--- Elige un explorador ---"
    } else {
        perfilActual = null;
        inputNuevo.value = ''; // <--- ¡AGREGA ESTO TAMBIÉN!
        inputNuevo.style.display = 'none';
        btnBorrar.style.display = 'none';
    }
}

window.eliminarPerfil = function() {
    if (!perfilActual) return;
    if (confirm(`¿Borrar a ${perfilActual.nombre}?`)) {
        if(perfilActual.googleUid) {
            perfiles = perfiles.filter(p => p.googleUid !== perfilActual.googleUid);
        } else {
            perfiles = perfiles.filter(p => p.nombre !== perfilActual.nombre);
        }
        perfilActual = null;
        guardarPerfilesLocales();
        window.cargarPerfiles();
    }
}

function actualizarPerfil() {
    if (perfilActual) {
        perfilActual.puntos = estado.puntos;
        perfilActual.progreso = estado.progreso;
        perfilActual.catActual = estado.cat;
        perfilActual.nivelActual = estado.nivel;
        guardarPerfiles();
    }
}

// ===========================================================
// 6. FUNCIONES PRINCIPALES DEL JUEGO (MODIFICADO)
// ===========================================================

// --- NUEVA FUNCIÓN: Verifica si hay que lanzar advertencia ---
window.verificarInicio = function() {
    const inputNuevo = document.getElementById('input-nombre-nuevo');
    const nombreNuevo = inputNuevo.value.trim().toUpperCase();

    // 1. Si ya eligió un perfil de la lista, pasa directo
    if (perfilActual) {
        window.iniciarJuego();
        return;
    }

    // 2. Si no escribió nada y no eligió nada
    if (!nombreNuevo) {
        mostrarNotificacion("¡Escribe tu nombre o elige un explorador!", "warning");
        return;
    }

    // 3. Si el nombre ya existe en la lista local
    if (perfiles.some(p => p.nombre.toUpperCase() === nombreNuevo)) {
        mostrarNotificacion(`El nombre "${nombreNuevo}" ya existe. Elígelo de la lista.`, "error");
        return;
    }

    // 4. SI ES NUEVO Y SIN GOOGLE -> Advertencia
    window.abrirConfirmacion(
        `⚠️ ¿Jugar como "${nombreNuevo}" sin cuenta? Si borras datos del PC, perderás el avance.`,
        () => {
            // Si dice que SÍ, creamos el perfil y entramos forzando el inicio
            window.crearPerfilYJugar(nombreNuevo);
        }
    );
}

// --- NUEVA FUNCIÓN: Crea el perfil tras confirmar la advertencia ---
window.crearPerfilYJugar = function(nombre) {
    perfilActual = crearPerfilBase(nombre); // Crea perfil local (sin UID)
    perfiles.push(perfilActual);
    guardarPerfiles(); // Guarda en localStorage
    
    // Resetea estados visuales
    estado.puntos = 0;
    estado.progreso = perfilActual.progreso;
    estado.cat = 'granja';
    estado.nivel = 1;

    // Inicia el juego saltando la validación (porque ya advertimos)
    window.iniciarJuego(false, true); 
}

// --- FUNCIÓN MODIFICADA: Ahora acepta "validacionSaltada" ---
window.iniciarJuego = function(esLoginGoogle = false, validacionSaltada = false) {
    const inputNuevo = document.getElementById('input-nombre-nuevo');
    const nombreNuevo = inputNuevo.value.trim().toUpperCase();

    // Si NO es Google Y NO hemos saltado validación (viene directo del enter o código viejo)
    if (!esLoginGoogle && !validacionSaltada) {
        // Validación básica de seguridad por si acaso
        if (!perfilActual && !nombreNuevo) {
            return mostrarNotificacion("Selecciona un explorador o usa Google", "warning");
        }
        // Si intenta crear uno nuevo sin pasar por verificarInicio, lo mandamos a verificar
        if (!perfilActual && nombreNuevo) {
            window.verificarInicio();
            return;
        }
    }
    
    // --- DE AQUÍ PARA ABAJO ES IGUAL QUE TU CÓDIGO ORIGINAL ---
    document.getElementById('nombre-jugador').innerText = perfilActual.nombre.toUpperCase();
    if (verificarHistoria()) return;
    
    document.getElementById('modal').style.display = 'none';
    document.getElementById('pantalla-inicio').style.display = 'none';
    document.getElementById('juego').style.display = 'flex';
    
    window.cargarNivel();
}

window.volverAlMenu = function() {
    window.abrirConfirmacion("¿Seguro que quieres salir?", () => {
        document.getElementById('juego').style.display = 'none';
        document.getElementById('pantalla-inicio').style.display = 'flex';
        window.cargarPerfiles();
    });
}

window.cambiarCategoria = function(nuevaCat) {
    const btn = document.getElementById(`cat-${nuevaCat}`);
    if(btn.classList.contains('desbloqueada') && estado.cat !== nuevaCat) {
        estado.cat = nuevaCat;
        estado.nivel = estado.progreso[nuevaCat] < 3 ? estado.progreso[nuevaCat] + 1 : 1; 
        window.cargarNivel();
    }
}

// Función unificada para cargar nivel (Sigue igual que antes)
window.cargarNivel = function() {
    // ... (Tu código de cargarNivel original se mantiene igual, no hace falta tocarlo)
    // Solo asegúrate de que al copiar/pegar no borres el resto de la función cargarNivel 
    // que tenías en tu archivo original. Si prefieres, solo copia las 3 funciones de arriba.
    if (!perfilActual) return;
    
    let puntosNivel = 0;
    estado.animalesCompletados = 0;

    const tablero = document.getElementById('tablero');
    const panel = document.getElementById('panel-opciones');
    tablero.innerHTML = '';
    panel.innerHTML = '';
    
    const inicio = (estado.nivel - 1) * NUM_ANIMALES_POR_NIVEL;
    const animalesNivel = db[estado.cat].slice(inicio, inicio + NUM_ANIMALES_POR_NIVEL);
    
    estado.totalAnimalesNivel = animalesNivel.length;
    estado.metaPuntosNivel = estado.totalAnimalesNivel * 2 * 10; 

    document.getElementById('titulo-nivel').innerText = `${estado.cat.toUpperCase()} - NIVEL ${estado.nivel}`;
    document.getElementById('titulo-nivel-emoji').innerText = catEmojis[estado.cat];

    // Crear Tarjetas
    animalesNivel.forEach((animal, i) => {
        const card = document.createElement('div');
        card.className = 'tarjeta';
        card.id = `card-${i}`;
        const huecos = crearHueco(animal.nombre, 'texto') + crearHueco(animal.sonido, 'sonido');
        card.innerHTML = `<div class="emoji-grande" onclick="window.hablar('${animal.sonido}')">${animal.emoji}</div>${huecos}`;
        tablero.appendChild(card);
    });

    // Crear Fichas
    let opciones = [];
    animalesNivel.forEach(animal => {
        opciones.push({ val: animal.nombre, tipo: 'texto' });
        opciones.push({ val: animal.sonido, tipo: 'sonido' });
    });
    opciones.sort(() => Math.random() - 0.5);

    // CÓDIGO MODIFICADO
opciones.forEach(op => {
    const ficha = document.createElement('div');
    ficha.className = 'ficha';
    ficha.draggable = true;
    ficha.id = 'ficha-' + Math.random().toString(36).substr(2,9);

    if(op.tipo === 'sonido') {
        ficha.innerHTML = `<div class="btn-play-mini" onclick="window.hablar('${op.val}')">🔊</div> ${op.val.toUpperCase()}`;
    } else {
        ficha.innerHTML = op.val.toUpperCase();
        
        // --- NUEVA MEJORA: SONIDO Y EFECTO VISUAL AL HACER CLIC ---
        ficha.onclick = () => {
            // Reproduce el nombre del animal
            window.usarVozRobot(op.val);
            
            // Agrega efecto visual de "clic"
            ficha.classList.add('ficha-activa');
            setTimeout(() => ficha.classList.remove('ficha-activa'), 300);
        };
        ficha.style.cursor = 'pointer';
    }
    
    ficha.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text', op.val);
        e.dataTransfer.setData('id', ficha.id);
    });
    panel.appendChild(ficha);
});
    
    spawnObjetoOculto();
    actualizarStats(0, 0);
    actualizarSidebar();
    actualizarUIUsuario();
    actualizarPerfil();

    // Lógica visual de flechas de nivel
    const btnAnt = document.getElementById('btn-nivel-ant');
    const btnSig = document.getElementById('btn-nivel-sig');
    
    btnAnt.style.visibility = estado.nivel === 1 ? 'hidden' : 'visible';
    btnAnt.style.opacity = '1';

    const maxDesbloqueado = (estado.progreso[estado.cat] || 0) + 1;
    if (estado.nivel === 3 || estado.nivel >= maxDesbloqueado) {
        btnSig.style.visibility = 'hidden'; 
    } else {
        btnSig.style.visibility = 'visible';
        btnSig.style.opacity = '1';
    } 
}

function crearHueco(target, tipo) {
    const etiqueta = tipo === 'texto' ? 'NOMBRE' : 'SONIDO';
    return `<div class="zona-drop" data-target="${target}">${etiqueta}</div>`;
}

// ===========================================================
// 7. ANIMACIONES Y FEEDBACK (NUEVAS FUNCIONES)
// ===========================================================

function mostrarFeedbackFlotante(texto, esPositivo, x, y) {
    const feedback = document.createElement('div');
    feedback.className = `feedback-flotante ${esPositivo ? 'positivo' : 'negativo'}`;
    feedback.innerText = texto;
    feedback.style.left = x + 'px';
    feedback.style.top = y + 'px';
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 1200);
}

function crearConfeti(cantidad, tarjeta) {
    const rect = tarjeta.getBoundingClientRect();
    const colores = ['#FFD700', '#FF6F61', '#FFD166', '#2ECC71', '#6C5CE7'];
    for(let i = 0; i < cantidad; i++) {
        const confeti = document.createElement('div');
        confeti.className = 'confeti';
        confeti.style.left = (rect.left + rect.width / 2) + 'px';
        confeti.style.top = (rect.top + rect.height / 2) + 'px';
        confeti.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
        confeti.style.transform = `translateX(${Math.random() * 200 - 100}px)`;
        document.body.appendChild(confeti);
        setTimeout(() => confeti.remove(), 2000);
    }
}

function crearEstrellitas(tarjeta) {
    const rect = tarjeta.getBoundingClientRect();
    const emojis = ['⭐', '✨', '🌟', '💫'];
    for(let i = 0; i < 5; i++) {
        const estrella = document.createElement('div');
        estrella.className = 'estrellita';
        estrella.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        estrella.style.left = (rect.left + Math.random() * rect.width) + 'px';
        estrella.style.top = (rect.top + Math.random() * rect.height) + 'px';
        document.body.appendChild(estrella);
        setTimeout(() => estrella.remove(), 1500);
    }
}

// ===========================================================
// 8. ARRASTRAR Y SOLTAR (LÓGICA MEJORADA)
// ===========================================================

document.addEventListener('dragover', e => {
    if(e.target.classList.contains('zona-drop')) {
        e.preventDefault();
        e.target.classList.add('hover');
    }
});
document.addEventListener('dragleave', e => {
    if(e.target.classList.contains('zona-drop')) e.target.classList.remove('hover');
});
document.addEventListener('drop', e => {
    if(e.target.classList.contains('zona-drop')) {
        e.preventDefault();
        const zone = e.target;
        zone.classList.remove('hover');
        
        const val = e.dataTransfer.getData('text');
        const id = e.dataTransfer.getData('id');
        const target = zone.getAttribute('data-target');
        
        // Coordenadas para feedback visual
        const x = e.clientX;
        const y = e.clientY;

        // Lógica de acierto
        if(val === target) {
            zone.style.background = '#4A4E69';
            zone.style.color = '#A1FFCE';
            zone.classList.add('acierto');
            zone.innerHTML = `✅ ${val.toUpperCase()}`;
            
            // Feedback positivo
            const mensajesPositivos = ['¡GENIAL! 🌟', '¡PERFECTO! ⭐', '¡MUY BIEN! 🎉', '¡INCREÍBLE! 💫'];
            const mensajeAleatorio = mensajesPositivos[Math.floor(Math.random() * mensajesPositivos.length)];
            mostrarFeedbackFlotante(mensajeAleatorio, true, x, y);
            
            // --- CAMBIO IMPORTANTE: SUMAR PRIMERO ---
            // 1. Sumamos al estado temporal del nivel
            estado.puntos += 10;
            const puntosNivelActual = parseInt(document.getElementById('puntos-nivel').innerText) + 10;
            
            // 2. Sumamos al PERFIL REAL (XP y Bellotas)
            perfilActual.xp = (perfilActual.xp || 0) + 10;
            perfilActual.bellotas = (perfilActual.bellotas || 0) + 2;
            
            // 3. Guardamos
            guardarPerfiles();

            // 4. ¡AHORA SÍ! Refrescamos la pantalla con los datos nuevos
            refrescarTodoEnTiempoReal();
            // ----------------------------------------
            
            const ficha = document.getElementById(id);
            if(ficha) {
                ficha.classList.add('usada');
                setTimeout(() => ficha.remove(), 400);
            }

            // Verificar si el animal está completo
            const parent = zone.parentElement;
            const zonas = parent.querySelectorAll('.zona-drop');
            let completa = true;
            zonas.forEach(z => { if(!z.innerHTML.includes('✅')) completa = false; });

            if(completa) {
                estado.animalesCompletados++;
                // Actualizamos otra vez por si acaso
                refrescarTodoEnTiempoReal();
                
                parent.classList.add('animal-completado');
                mostrarFeedbackFlotante('¡ANIMAL COMPLETO! 🎊', true, x, y - 50);
                crearConfeti(15, parent);
                crearEstrellitas(parent);
                window.usarVozRobot("¡Excelente trabajo!");

                setTimeout(() => {
                    parent.classList.add('completada');
                    setTimeout(() => {
                        parent.style.visibility = 'hidden';
                        if(estado.animalesCompletados === estado.totalAnimalesNivel) {
                            victoria(puntosNivelActual);
                        }
                    }, 700);
                }, 1200);
            } 
        } else {
            // ERROR
            zone.classList.add('error');
            const mensajesAnimo = ['¡CASI! INTENTA OTRA VEZ 💪', '¡NO TE RINDAS! 🚀', '¡INTÉNTALO DE NUEVO! 🎯'];
            const mensajeAleatorio = mensajesAnimo[Math.floor(Math.random() * mensajesAnimo.length)];
            mostrarFeedbackFlotante(mensajeAleatorio, false, x, y);
            setTimeout(() => zone.classList.remove('error'), 500);
        }
    }
});

// ===========================================================
// 9. AUDIO (SISTEMA ROBUSTO V2)
// ===========================================================
let audioActual = null; 
let synth = window.speechSynthesis; // Referencia global al sintetizador
let vozRobotActiva = false; // Semáforo para evitar superposición

// Cargar voces al inicio (Chrome a veces tarda en cargarlas)
let vocesDisponibles = [];
if (synth) {
    vocesDisponibles = synth.getVoices();
    synth.onvoiceschanged = () => {
        vocesDisponibles = synth.getVoices();
        console.log("Voces cargadas:", vocesDisponibles.length);
    };
}

function detenerSonidoAnterior() {
    // 1. Detener MP3
    if (audioActual) {
        try {
            audioActual.pause();
            audioActual.currentTime = 0;
        } catch (e) { console.log("Error pausando audio:", e); }
        audioActual = null;
    }
    // 2. Detener Robot
    if (synth) {
        synth.cancel(); 
    }
    vozRobotActiva = false;
}

window.hablar = function(texto) {
    console.log("Intentando hablar:", texto); // Debug en consola
    detenerSonidoAnterior();
    
    // Buscar si el animal tiene archivo MP3 configurado
    let animalEncontrado = null;
    if (estado && estado.cat && db[estado.cat]) {
        animalEncontrado = db[estado.cat].find(a => a.sonido === texto);
    }

    // --- INTENTO 1: AUDIO MP3 DE GITHUB ---
    if (animalEncontrado && animalEncontrado.archivo) {
        const url = GITHUB_URL + animalEncontrado.archivo;
        console.log("Cargando URL:", url);

        audioActual = new Audio(url);
        
        // Manejo de errores de carga del archivo (404, Red, etc)
        audioActual.onerror = function() {
            console.warn("❌ Falló carga del MP3 (404 o Red). Usando Robot.");
            window.usarVozRobot(texto);
        };

        // Intentar reproducir
        let playPromise = audioActual.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                console.log("✅ Reproduciendo MP3...");
            })
            .catch(error => {
                console.warn("⚠️ Bloqueo de navegador o error de play():", error);
                // Si el navegador bloquea el audio, forzamos el robot
                window.usarVozRobot(texto);
            });
        }
    } else {
        // --- OPCIÓN B: NO HAY ARCHIVO, USAR ROBOT DIRECTO ---
        console.log("No hay archivo asociado, usando Robot directo.");
        window.usarVozRobot(texto);
    }
}

// --- VERSIÓN MEJORADA: VOZ MÁS SUAVE ---
window.usarVozRobot = function(texto) {
    if (!window.speechSynthesis) return; // Si el navegador no tiene voz, salimos

    // 1. Cancelamos cualquier sonido anterior para que no se atropelle
    window.speechSynthesis.cancel();

    // 2. Creamos el mensaje
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-ES'; // Español

    // 3. AJUSTES PARA VOZ MÁS "AMIGABLE" E INFANTIL
    mensaje.rate = 0.9;  // Un poquito más lento (normal es 1)
    mensaje.pitch = 1.1; // Un poquito más agudo (lo hace sonar más joven/dulce)
    mensaje.volume = 1;

    // 4. Buscar una voz femenina o de Google (suelen ser mejores)
    const voces = window.speechSynthesis.getVoices();
    const vozSuave = voces.find(v => 
        (v.name.includes("Google") && v.lang.includes("es")) || // Voz de Google suele ser muy buena
        (v.name.includes("Sabina") || v.name.includes("Helena")) || // Voces de Windows suaves
        (v.lang.includes("es") && v.name.includes("Female")) // Genérico femenino
    );

    if (vozSuave) mensaje.voice = vozSuave;

    // 5. ¡HABLAR!
    window.speechSynthesis.speak(mensaje);
}
// ===========================================================
// 10. UI HELPERS
// ===========================================================

function actualizarStats(puntosNivel, animalesListos) {
    const totalFichasNivel = estado.totalAnimalesNivel * 2;
    const fichasCompletadas = puntosNivel / 10;
    const porcentaje = totalFichasNivel > 0 ? Math.round((fichasCompletadas / totalFichasNivel) * 100) : 0;
    
    // --- CORRECCIÓN AQUÍ ---
    // Ahora mostramos la XP del perfil en lugar de los puntos temporales
    if (perfilActual) {
        document.getElementById('puntuacion-total-lateral').innerText = perfilActual.xp || 0;
    }
    // -----------------------

    document.getElementById('puntos-nivel').innerText = puntosNivel;
    document.getElementById('meta-nivel').innerText = estado.metaPuntosNivel;
    document.getElementById('listos-nivel').innerText = `${animalesListos}/${estado.totalAnimalesNivel}`;
    
    document.getElementById('progreso-bar').style.width = `${porcentaje}%`;
    document.getElementById('progreso-porcentaje').innerText = `${porcentaje}%`;
    
    actualizarPerfil();
}

function actualizarSidebar() {
    ALL_CATEGORIES.forEach((c, i) => {
        const btn = document.getElementById(`cat-${c}`);
        const stars = document.getElementById(`star-${c}`);
        btn.classList.remove('activa');
        if(estado.cat === c) btn.classList.add('activa');

        let s = '';
        for(let k=0; k<3; k++) {
            s += k < estado.progreso[c] ? '<span class="estrella ganada">★</span>' : '<span class="estrella">☆</span>';
        }
        stars.innerHTML = s;

        if(i > 0) {
            const prev = ALL_CATEGORIES[i-1];
            if(estado.progreso[prev] >= 3) {
                btn.classList.add('desbloqueada');
                let spanText = btn.querySelector('span').innerText;
                if(spanText.includes('🔒')) btn.querySelector('span').innerText = spanText.replace(' 🔒','');
            } else if (!btn.classList.contains('desbloqueada')) {
                if(!btn.querySelector('span').innerText.includes('🔒')) btn.querySelector('span').innerText += ' 🔒';
            }
        }
    });
    actualizarPerfil();
}

function actualizarUIUsuario() {
    if(!perfilActual) return;
    
    let iconoAvatar = '🤠'; 
    if (perfilActual.avatarEquipado) {
        const item = catalogoAvatares.find(a => a.id === perfilActual.avatarEquipado);
        if(item) iconoAvatar = item.icon;
    } else {
        perfilActual.avatares = ['base'];
        perfilActual.avatarEquipado = 'base';
    }

    const avatarCircle = document.querySelector('.avatar-circle');
    if(avatarCircle) avatarCircle.innerText = iconoAvatar;

    document.getElementById('nombre-jugador').innerText = perfilActual.nombre;
    document.getElementById('rango-jugador').innerText = calcularNivelXP(perfilActual.xp || 0);
    document.getElementById('sidebar-xp').innerText = perfilActual.xp || 0;
    document.getElementById('sidebar-bellotas').innerText = perfilActual.bellotas || 0;
}

function calcularNivelXP(xp) {
    if (xp < 500) return "Novato";
    if (xp < 1500) return "Explorador";
    if (xp < 3000) return "Aventurero";
    return "Maestro";
}

function victoria(puntosNivel) {
    if(estado.nivel > (estado.progreso[estado.cat] || 0)) {
        estado.progreso[estado.cat] = estado.nivel;
    }
    const esCategoriaCompleta = estado.nivel === 3;

    let mensajeExtra = "";
    if (esCategoriaCompleta) {
        const peluchePremio = catalogoPeluches.find(p => p.cat === estado.cat && p.tipo === 'recompensa');
        if (peluchePremio) {
            if(!perfilActual.peluches) perfilActual.peluches = [];
            if (!perfilActual.peluches.includes(peluchePremio.id)) {
                perfilActual.peluches.push(peluchePremio.id);
                mensajeExtra = `<br><br>✨ ¡PREMIO DESBLOQUEADO! ✨<br>Ganaste el peluche: <b>${peluchePremio.icon} ${peluchePremio.nombre}</b>`;
                guardarPerfiles();
            }
        }
    }
    
    document.getElementById('modal-titulo').innerText = esCategoriaCompleta ? "¡CATEGORÍA COMPLETA! 🏆" : "¡NIVEL SUPERADO! ✨";
    document.getElementById('modal-puntos').innerText = `¡Sumaste ${puntosNivel} PUNTOS!`;
    document.getElementById('modal').style.display = 'flex';
    actualizarPerfil();
}

window.siguiente = function() {
    document.getElementById('modal').style.display = 'none';
    if(estado.nivel < 3) {
        estado.nivel++;
        window.cargarNivel();
    } else {
        const idx = ALL_CATEGORIES.indexOf(estado.cat);
        if(idx < ALL_CATEGORIES.length - 1) {
            estado.cat = ALL_CATEGORIES[idx+1];
            estado.nivel = 1;
            window.cargarNivel();
        } else {
            alert("¡JUEGO COMPLETADO! 🥇");
            window.volverAlMenu();
        }
    }
}

// ===========================================================
// 11. FUNCIONES EXTRA: OBJETO OCULTO Y RANKING
// ===========================================================

function spawnObjetoOculto() {
    const old = document.querySelector('.objeto-oculto');
    if(old) old.remove();

    const area = document.getElementById('area-juego');
    const bellota = document.createElement('div');
    bellota.className = 'objeto-oculto';
    bellota.innerText = '🌰';
    
    bellota.style.top = Math.floor(Math.random() * 80 + 10) + '%';
    bellota.style.left = Math.floor(Math.random() * 80 + 10) + '%';
    
    bellota.onclick = function() {
        this.remove();
        perfilActual.bellotas = (perfilActual.bellotas || 0) + 10;
        perfilActual.xp = (perfilActual.xp || 0) + 20;
        actualizarUIUsuario(); 
        guardarPerfiles();
        mostrarNotificacion("¡Bellota de la suerte! +10 🌰", "success");
    };
    area.appendChild(bellota);
}

// RANKING CON FIRESTORE
window.mostrarRanking = async function() {
    const lista = document.getElementById('lista-ranking');
    lista.innerHTML = '<li style="text-align:center;">Cargando exploradores del mundo... 🌍</li>';
    document.getElementById('modal-ranking').style.display = 'flex';

    try {
        const q = query(collection(dbFirestore, "jugadores"), orderBy("xp", "desc"), limit(10));
        const querySnapshot = await getDocs(q);

        lista.innerHTML = ''; 
        let contador = 1;

        if (querySnapshot.empty) {
            lista.innerHTML = '<li>Aún no hay exploradores en la nube. ¡Sé el primero!</li>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const p = doc.data();
            const li = document.createElement('li');
            li.style.padding = "10px";
            li.style.borderBottom = "1px solid #eee";
            li.style.fontSize = "1.1em";
            
            let medalla = "";
            if (contador === 1) medalla = "🥇 ";
            if (contador === 2) medalla = "🥈 ";
            if (contador === 3) medalla = "🥉 ";

            li.innerHTML = `${medalla} <b>#${contador} ${p.nombre}</b><br>
                            <span style="color:#6C5CE7; font-size:0.9em; font-weight:bold;">${p.xp || 0} XP</span> | 
                            <span style="color:#FFD166; font-size:0.9em; font-weight:bold;">${p.bellotas || 0} 🌰</span>`;
            lista.appendChild(li);
            contador++;
        });

    } catch (error) {
        console.error("Error al obtener ranking:", error);
        lista.innerHTML = '<li style="color:red; text-align:center;">No pudimos conectar con el Ranking Mundial.<br>Jugando en modo local.</li>';
        
        const sortedLocal = [...perfiles].sort((a,b) => (b.xp || 0) - (a.xp || 0));
        sortedLocal.forEach((p, i) => {
             const li = document.createElement('li');
             li.style.padding = "10px";
             li.innerHTML = `(Local) <b>#${i+1} ${p.nombre}</b>: ${p.xp} XP`;
             lista.appendChild(li);
        });
    }
}

// ===========================================================
// 12. HISTORIA, TIENDA Y SISTEMA DE NOTIFICACIONES
// ===========================================================

window.cerrarHistoria = function() {
    document.getElementById('modal-historia').style.display = 'none';
    perfilActual.vioHistoria = true;
    guardarPerfiles();
    window.iniciarJuego(); 
}

function verificarHistoria() {
    if (!perfilActual.vioHistoria) {
        document.getElementById('pantalla-inicio').style.display = 'none';
        document.getElementById('modal-historia').style.display = 'flex';
        return true; 
    }
    return false;
}

const catalogoAvatares = [
    { id: 'base', icon: '🤠', precio: 0 },
    { id: 'zorro', icon: '🦊', precio: 50 },
    { id: 'robot', icon: '🤖', precio: 100 },
    { id: 'alien', icon: '👽', precio: 150 },
    { id: 'ninja', icon: '🥷', precio: 200 },
    { id: 'princesa', icon: '👸', precio: 250 },
    { id: 'superheroe', icon: '🦸', precio: 300 }
];

const catalogoPeluches = [
    { id: 'peluche_vaca', icon: '🐮', nombre: 'Vaca Muu', precio: 0, tipo: 'recompensa', cat: 'granja' },
    { id: 'peluche_pulpo', icon: '🐙', nombre: 'Pulpo Blot', precio: 0, tipo: 'recompensa', cat: 'mar' },
    { id: 'peluche_leon', icon: '🦁', nombre: 'Rey León', precio: 0, tipo: 'recompensa', cat: 'selva' },
    { id: 'peluche_oso', icon: '🧸', nombre: 'Sr. Oso', precio: 60, tipo: 'venta' },
    { id: 'peluche_unicornio', icon: '🦄', nombre: 'Uni Mágico', precio: 120, tipo: 'venta' },
    { id: 'peluche_dino', icon: '🦖', nombre: 'Dino Rex', precio: 90, tipo: 'venta' },
    { id: 'peluche_pollito', icon: '🐥', nombre: 'Pio Pio', precio: 40, tipo: 'venta' }
];

window.abrirTienda = function() {
    if(!perfilActual.avatares) perfilActual.avatares = ['base'];
    if(!perfilActual.peluches) perfilActual.peluches = [];
    if(!perfilActual.avatarEquipado) perfilActual.avatarEquipado = 'base';

    document.getElementById('tienda-saldo').innerText = perfilActual.bellotas || 0;
    document.getElementById('modal-tienda').style.display = 'flex';
    window.cambiarTabTienda('avatares');
}

window.cambiarTabTienda = function(tab) {
    const gridAv = document.getElementById('grid-avatares');
    const gridPe = document.getElementById('grid-peluches');
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(t => t.classList.remove('activa'));
    if(tab === 'avatares') {
        tabs[0].classList.add('activa');
        gridAv.style.display = 'flex';
        gridPe.style.display = 'none';
        renderizarAvatares();
    } else {
        tabs[1].classList.add('activa');
        gridAv.style.display = 'none';
        gridPe.style.display = 'flex';
        renderizarPeluches();
    }
}

function renderizarAvatares() {
    const grid = document.getElementById('grid-avatares');
    grid.innerHTML = '';
    catalogoAvatares.forEach(item => {
        const tiene = perfilActual.avatares.includes(item.id);
        const equipado = perfilActual.avatarEquipado === item.id;
        
        const div = document.createElement('div');
        div.className = `item-tienda ${tiene ? 'comprado' : 'bloqueado'} ${equipado ? 'equipado' : ''}`;
        
        let label = `<span class="precio-tag">${item.precio} 🌰</span>`;
        if (equipado) label = `<span class="badge-equipado">EQUIPADO</span>`;
        else if (tiene) label = `<span class="precio-tag" style="background:#A1FFCE; color:#006400">Tuyo</span>`;

        div.innerHTML = `<span class="avatar-icon">${item.icon}</span>${label}`;
        div.onclick = () => comprarAvatar(item);
        grid.appendChild(div);
    });
}

function renderizarPeluches() {
    const grid = document.getElementById('grid-peluches');
    grid.innerHTML = '';
    catalogoPeluches.forEach(item => {
        const tiene = perfilActual.peluches.includes(item.id);
        const div = document.createElement('div');
        div.className = `peluche-card ${tiene ? 'comprado' : 'bloqueado'}`;
        
        let badge = item.tipo === 'recompensa' ? '<span class="tag-recompensa">🏆 PREMIO</span>' : '';
        let precio = tiene ? '<span style="color:green; font-weight:bold;">¡Lo tienes!</span>' : (item.tipo === 'recompensa' ? 'Completa el nivel' : item.precio + ' 🌰');

        div.innerHTML = `${badge} <span class="peluche-icon">${item.icon}</span>
                         <div style="font-size:0.8em; font-weight:bold;">${item.nombre}</div>
                         <div style="font-size:0.8em; color:#777;">${precio}</div>`;
        
        if(!tiene && item.tipo === 'venta') {
            div.onclick = () => comprarPeluche(item);
        } else if (!tiene && item.tipo === 'recompensa') {
            div.onclick = () => mostrarNotificacion(`Completa la categoría ${item.cat.toUpperCase()} para ganarlo`, "info");
        }
        grid.appendChild(div);
    });
}

function comprarAvatar(item) {
    if (perfilActual.avatares.includes(item.id)) {
        perfilActual.avatarEquipado = item.id;
        actualizarUIUsuario();
        guardarPerfiles();
        renderizarAvatares();
        return;
    }
    
    if ((perfilActual.bellotas || 0) >= item.precio) {
        // AQUÍ ESTÁ EL CAMBIO: Usamos abrirConfirmacion en vez de confirm
        window.abrirConfirmacion(`¿Comprar Avatar por ${item.precio} 🌰?`, () => {
            perfilActual.bellotas -= item.precio;
            perfilActual.avatares.push(item.id);
            perfilActual.avatarEquipado = item.id;
            guardarPerfiles();
            actualizarUIUsuario();
            renderizarAvatares();
            document.getElementById('tienda-saldo').innerText = perfilActual.bellotas;
            window.mostrarNotificacion("¡Avatar comprado!", "success");
        });
    } else {
        window.mostrarNotificacion("¡No tienes suficientes Bellotas!", "warning");
    }
}

function comprarPeluche(item) {
    if ((perfilActual.bellotas || 0) >= item.precio) {
        // AQUÍ ESTÁ EL CAMBIO: Usamos abrirConfirmacion en vez de confirm
        window.abrirConfirmacion(`¿Adoptar a ${item.nombre} por ${item.precio} 🌰?`, () => {
            perfilActual.bellotas -= item.precio;
            perfilActual.peluches.push(item.id);
            guardarPerfiles();
            actualizarUIUsuario();
            renderizarPeluches();
            document.getElementById('tienda-saldo').innerText = perfilActual.bellotas;
            window.mostrarNotificacion(`¡Has adoptado a ${item.nombre}!`, "success");
        });
    } else {
        window.mostrarNotificacion("Necesitas más bellotas", "warning");
    }
}

window.cambiarNivelManual = function(direccion) {
    const nuevoNivel = estado.nivel + direccion;
    if (nuevoNivel < 1 || nuevoNivel > 3) return;
    const maximoDesbloqueado = (estado.progreso[estado.cat] || 0) + 1;
    if (nuevoNivel > maximoDesbloqueado && nuevoNivel <= 3 && (estado.progreso[estado.cat]||0) < 3) {
        mostrarNotificacion("¡Completa el nivel actual para avanzar!", "warning");
        return;
    }
    estado.nivel = nuevoNivel;
    window.cargarNivel();
}

// SISTEMA DE NOTIFICACIONES (TOAST)
window.mostrarNotificacion = function(mensaje, tipo = 'warning') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    
    let icon = '⚠️';
    if(tipo === 'success') icon = '✅';
    if(tipo === 'info') icon = 'ℹ️';
    if(tipo === 'error') icon = '❌';

    toast.innerHTML = `<span style="font-size:1.4em">${icon}</span> <span>${mensaje}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOutUp 0.5s forwards';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ===========================================================
// SISTEMA DE CONFIRMACIÓN PERSONALIZADO (Adiós confirm())
// ===========================================================

window.abrirConfirmacion = function(mensaje, accionSi) {
    // 1. Ponemos el texto
    document.getElementById('texto-confirmacion').innerText = mensaje;
    
    // 2. Preparamos el botón "SÍ" para que haga lo que pedimos
    const btnSi = document.getElementById('btn-confirmar-si');
    
    // Quitamos eventos anteriores para no duplicar compras
    const nuevoBtn = btnSi.cloneNode(true);
    btnSi.parentNode.replaceChild(nuevoBtn, btnSi);
    
    // Le asignamos la nueva acción
    nuevoBtn.onclick = function() {
        accionSi(); // Ejecuta la compra
        window.cerrarConfirmacion(); // Cierra la ventana
    };

    // 3. Mostramos la ventana
    document.getElementById('modal-confirmacion').style.display = 'flex';
}

window.cerrarConfirmacion = function() {
    document.getElementById('modal-confirmacion').style.display = 'none';
}

// Función para forzar la actualización visual de TODO


function refrescarTodoEnTiempoReal() {
    // 1. Actualizamos datos del sidebar (Izquierda) - XP y Bellotas
    actualizarUIUsuario(); 
    
    // 2. Leemos los puntos actuales del nivel para no perderlos
    let ptsNivel = parseInt(document.getElementById('puntos-nivel').innerText) || 0;
    
    // 3. Calculamos cuántos animales llevamos listos
    // (Contamos cuántas tarjetas ya no están visibles porque se completaron)
    let completados = document.querySelectorAll('.tarjeta.completada').length; 
    // O usamos la variable de estado si es más fiable:
    // let completados = estado.animalesCompletados;

    // 4. Actualizamos la barra de arriba
    actualizarStats(ptsNivel, estado.animalesCompletados);
}
// ===========================================================
// 13. SISTEMA DE HISTORIA INTERACTIVA (CORREGIDO FINAL)
// ===========================================================

const GITHUB_IMG_URL = 'https://raw.githubusercontent.com/leonel20202005-stack/audiosJuego/main/';

const historiaData = [
    {
        img: 'foto1.jpg', 
        texto: "Este es Timmy. Iba de viaje en su avión con TODOS sus peluches favoritos."
    },
    {
        img: 'historia2.jpg', 
        texto: "¡Pero OH NO! ¡Hubo un accidente! La puerta se abrió y los peluches cayeron al vacío."
    },
    {
        img: 'historia3.jpg', 
        texto: "Cayeron en una Isla Misteriosa. ¡Ayuda a Timmy a encontrarlos usando los sonidos!"
    }
];

let pasoHistoriaActual = 0;

window.verificarHistoria = function() {
    if (!perfilActual || perfilActual.vioHistoria) return false;

    console.log("🎬 Iniciando historia...");
    
    // 1. Mostrar modal
    document.getElementById('pantalla-inicio').style.display = 'none';
    document.getElementById('modal-historia').style.display = 'flex';
    
    // 2. Resetear y cargar
    pasoHistoriaActual = 0;
    
    // Pequeño delay de seguridad para que el navegador renderice el modal antes de buscar los IDs
    setTimeout(() => {
        window.cargarPasoHistoria();
    }, 50);
    
    return true; 
}

window.cargarPasoHistoria = function() {
    console.log("📖 Cargando paso:", pasoHistoriaActual);
    
    const data = historiaData[pasoHistoriaActual];
    if (!data) return; 

    const img = document.getElementById('comic-img');
    const txt = document.getElementById('comic-texto');
    const btn = document.getElementById('btn-comic-siguiente');

    if(!img || !txt) {
        console.error("❌ Error: No encuentro los elementos del cómic en el HTML");
        return;
    }

    // 1. Texto (inmediato)
    txt.innerText = data.texto;

    // 2. Imagen (Definimos el error ANTES de cargar)
    img.onerror = function() {
        console.warn("⚠️ Imagen no encontrada, usando placeholder.");
        this.src = 'https://via.placeholder.com/600x300?text=Subir+' + data.img;
    };
    
    // Ahora sí cargamos la imagen
    img.src = GITHUB_IMG_URL + data.img;

    // 3. Botón
    if (pasoHistoriaActual === historiaData.length - 1) {
        btn.innerText = "¡A JUGAR! 🚀";
    } else {
        btn.innerText = "CONTINUAR ➡";
    }

    // 4. Audio (con pequeño retraso para asegurar fluidez)
    setTimeout(() => {
        window.usarVozRobot(data.texto);
    }, 500);
}

window.siguientePasoHistoria = function() {
    pasoHistoriaActual++;
    if (pasoHistoriaActual < historiaData.length) {
        window.cargarPasoHistoria();
    } else {
        window.saltarHistoria();
    }
}

window.saltarHistoria = function() {
    if(window.speechSynthesis) window.speechSynthesis.cancel();
    
    document.getElementById('modal-historia').style.display = 'none';
    
    if(perfilActual) {
        perfilActual.vioHistoria = true;
        guardarPerfiles();
    }
    
    document.getElementById('juego').style.display = 'flex';
    window.cargarNivel();
}

window.repetirAudioHistoria = function() {
    const data = historiaData[pasoHistoriaActual];
    if(data) window.usarVozRobot(data.texto);
}