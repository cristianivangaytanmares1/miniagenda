// ============================================================
// VARIABLES Y ELEMENTOS DEL DOM
// ============================================================

// Obtenemos los elementos HTML que utilizaremos desde JavaScript.
const newTaskInput = document.getElementById("newTaskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("list");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const theme = document.getElementById("themeSwitcher");
const titleBar = document.getElementById("titleBar");

// Array donde se almacenan las tareas de la aplicación.
let tasks = [];

// Objeto utilizado para almacenar la ubicación geográfica
// de la persona usuaria.
let geo = { lat: null, lon: null };


// ============================================================
// BOTÓN DE PANTALLA COMPLETA
// ============================================================

// Comportamiento del botón fullscreen.
//
// Permite entrar y salir del modo de pantalla completa.
fullscreenBtn.addEventListener("click", (e) => {

    // Si actualmente no estamos en pantalla completa...
    if (document.fullscreenElement == null) {

        // Solicita que el documento completo se muestre
        // en pantalla completa.
        document.documentElement.requestFullscreen();

        // Cambia el icono del botón.
        fullscreenBtn.innerHTML = "💨";

    } else {

        // Si ya estamos en pantalla completa,
        // salimos de este modo.
        document.exitFullscreen();

        // Restauramos el icono original.
        fullscreenBtn.innerHTML = "📺";
    }
});


// ============================================================
// CAMBIO DE TEMA
// ============================================================

// Acción del botón de Cambio de Tema (Dark/Light).
//
// Al hacer clic se ejecuta la función setTheme(),
// que cambia entre el tema oscuro y el tema claro.
theme.addEventListener("click", (e) => {
    setTheme();
});


// ============================================================
// AGREGAR UNA NUEVA TAREA
// ============================================================

// Acción del botón Agregar Tarea.
addBtn.addEventListener("click", function (e) {

    // Evita que el formulario recargue la página.
    e.preventDefault();

    // Obtenemos el texto que escribió la persona usuaria.
    const textoDeLaTarea = newTaskInput.value;

    // Generamos un identificador único utilizando
    // la fecha/hora actual en milisegundos.
    const idDeLaTarea = Date.now();

    // Creamos el objeto que representa la nueva tarea.
    const newTask = {
        id: idDeLaTarea,
        texto: textoDeLaTarea,
        "completado": false,

        // Guardamos también la ubicación geográfica
        // disponible en ese momento.
        "ubicacion": {
            "lat": geo.lat,
            "lon": geo.lon
        }
    }

    // Registramos la tarea en el array de tareas.
    tasks.push(newTask)

    // Mostramos la nueva tarea en la interfaz.
    agregarTarea(newTask);

    // Actualizamos el localStorage del navegador.
    //
    // JSON.stringify() convierte el array de JavaScript
    // en texto para poder almacenarlo.
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Limpiamos el campo de texto después de agregar
    // la tarea.
    newTaskInput.value = "";
});


// ============================================================
// MOSTRAR UNA TAREA EN LA INTERFAZ
// ============================================================

// Función encargada de crear visualmente una tarea
// dentro de la lista.
const agregarTarea = (task) => {

    // Mostramos la tarea en la consola del navegador.
    console.log(task)

    // Creamos un nuevo elemento <li>.
    const nuevoLi = document.createElement("li");

    // Le asignamos como atributo data-id
    // el identificador único de la tarea.
    nuevoLi.setAttribute("data-id", task.id)

    // Construimos el contenido HTML de la tarea.
    nuevoLi.innerHTML =
        `
        <input type="checkbox" onclick="marcarTarea(this)" ${task.completado ? 'checked' : ''}>
        <p>${task.texto}</p>
        <button class="button" title="Copiar tarea"
    onclick="copiarTarea(this)">📋</button>

<button class="button" title="Compartir tarea"
    onclick="compartirTarea(this)">✉️</button>

<button class="button" title="Eliminar tarea"
    onclick="eliminarTarea(this)">🗑️</button>
        `;

    // Agregamos el elemento creado al comienzo de la lista.
    // prepend() coloca la tarea antes de las demás.
    list.prepend(nuevoLi);
}


// ============================================================
// ELIMINAR UNA TAREA
// ============================================================

// Función utilizada para eliminar una tarea.
const eliminarTarea = (e) => {

    // Eliminamos visualmente el elemento <li>
    // de la página.
    e.parentElement.remove();

    // Eliminamos del array la tarea cuyo ID
    // coincide con el elemento seleccionado.
    tasks = tasks.filter(task => task.id != e.parentElement.dataset.id);

    // Actualizamos nuevamente el localStorage.
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ============================================================
// MARCAR UNA TAREA COMO COMPLETADA
// ============================================================

// Función que se ejecuta cuando se marca/desmarca
// el checkbox de una tarea.
const marcarTarea = (e) => {

    // Mostramos el elemento en la consola.
    console.log(e);

    // Recorremos todas las tareas y modificamos
    // solamente la tarea seleccionada.
    tasks = tasks.map(
        task => task.id != e.parentElement.dataset.id
            ? task
            : {
                ...task,
                "completado": !task.completado
            }
    );

    // Guardamos el nuevo estado de las tareas
    // en el localStorage.
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ============================================================
// COPIAR UNA TAREA
// ============================================================

// Método para copiar la tarea en el portapapeles.
async function copiarTarea(boton) {

    const tarea = boton.parentElement.querySelector('p');

    if (!tarea) return;

    const texto = tarea.textContent.trim();

    try {

        await navigator.clipboard.writeText(texto);

        mostrarAviso('¡Tarea copiada correctamente!');

    } catch (error) {

        // Método alternativo para copiar el texto
        const campo = document.createElement('textarea');

        campo.value = texto;

        document.body.appendChild(campo);

        campo.select();

        const copiado = document.execCommand('copy');

        document.body.removeChild(campo);

        if (copiado) {
            mostrarAviso('¡Tarea copiada correctamente!');
        } else {
            mostrarAviso('No se pudo copiar la tarea');
        }

    }
}
function mostrarAviso(mensaje) {

    let aviso = document.getElementById('mensaje-aviso');

    if (!aviso) {

        aviso = document.createElement('div');

        aviso.id = 'mensaje-aviso';

        document.body.appendChild(aviso);

    }

    aviso.textContent = mensaje;

    aviso.style.position = 'fixed';
    aviso.style.bottom = '25px';
    aviso.style.right = '25px';
    aviso.style.background = '#222';
    aviso.style.color = '#fff';
    aviso.style.padding = '12px 20px';
    aviso.style.borderRadius = '8px';
    aviso.style.zIndex = '9999';
    aviso.style.fontSize = '14px';

    aviso.style.display = 'block';

    setTimeout(() => {

        aviso.style.display = 'none';

    }, 2500);

}


// ============================================================
// COMPARTIR UNA TAREA
// ============================================================

// Método para compartir la tarea utilizando
// la API de compartir del dispositivo.
const compartirTarea = (e) => {

    // Comprobamos si el navegador dispone de la Web Share API.
    if (!("share" in navigator)) {

        // Si no está disponible, mostramos un mensaje
        // en la consola.
        console.log("😭 Share API no soportada en este navegador.");

        return;
    }

    // Obtenemos el texto de la tarea.
    const text = e.parentElement.children[1].innerText;

    // Utilizamos la API de compartir del navegador.
    navigator.share({
        title: 'Te comparto una tarea de mi lista',
        text: text,

        // Compartimos también la URL actual
        // de la aplicación.
        //
        // El comentario original indica que esta URL
        // podría mejorarse si existiera una página
        // individual para cada tarea.
        url: document.URL
    })

    // Si el contenido fue compartido correctamente...
    .then(
        () => console.log('😊 Compartido!')
    )

    // Si ocurre un error al compartir...
    .catch(
        error => console.error('😭 Error al compartir:', error)
    );
}


// ============================================================
// OBTENER LA UBICACIÓN DE LA PERSONA USUARIA
// ============================================================

// Método para obtener la ubicación de la persona usuaria.
const recuperarUbicacion = () => {

    // Comprobamos si el navegador soporta Geolocation API.
    if ('geolocation' in navigator) {

        // Solicitamos la ubicación actual.
        navigator.geolocation.getCurrentPosition(

            // Función ejecutada cuando se obtiene
            // correctamente la ubicación.
            function (location) {

                // Guardamos la latitud.
                geo.lat = location.coords.latitude;

                // Guardamos la longitud.
                geo.lon = location.coords.longitude;
            },

            // Función ejecutada cuando no se puede
            // obtener la ubicación.
            function (err) {

                // Mostramos el error en la consola.
                console.warn(err);

                // Dejamos la ubicación vacía.
                geo.lat = null;
                geo.lon = null;
            }
        );

    } else {

        // Si el navegador no soporta geolocalización,
        // retornamos null.
        return null;
    }

}


// ============================================================
// REGISTRAR EL SERVICE WORKER
// ============================================================

// Método para registrar el service worker.
const registerServiceWorker = () => {

    // Comprobamos si el navegador soporta Service Workers.
    if ('serviceWorker' in navigator) {

        // Registramos el archivo serviceWorker.js.
        navigator.serviceWorker.register('serviceWorker.js')

            // Si el registro fue exitoso...
            .then(registration => {
                console.log('😊 Service Worker Registered');
            })

            // Si ocurre algún error...
            .catch(err => {
                console.warn(
                    '😭 Service Worker Failed to Register',
                    err
                );
            });
    }
}


// ============================================================
// CAMBIO DE TEMA CLARO / OSCURO
// ============================================================

// Función encargada de cambiar entre los temas
// claro y oscuro.
function setTheme(val) {

    // Analizamos el valor recibido.
    switch (val) {

        // ----------------------------------------------------
        // TEMA OSCURO
        // ----------------------------------------------------
        case "dark":

            // Quitamos la clase del tema claro.
            document.body.classList.remove("light");

            // Agregamos la clase del tema oscuro.
            document.body.classList.add("dark");

            // Cambiamos el icono del botón.
            theme.innerHTML = "🌞";

            // Cambiamos el color de la barra de estado
            // del dispositivo.
            document.querySelector(
                "meta[name='theme-color']"
            ).setAttribute('content', "#222")

            break;


        // ----------------------------------------------------
        // TEMA CLARO
        // ----------------------------------------------------
        case "light":

            // Quitamos la clase del tema oscuro.
            document.body.classList.remove("dark");

            // Agregamos la clase del tema claro.
            document.body.classList.add("light");

            // Cambiamos el icono del botón.
            theme.innerHTML = "🌙";

            // Cambiamos el color de la barra de estado.
            document.querySelector(
                "meta[name='theme-color']"
            ).setAttribute('content', "#eee")

            break;


        // ----------------------------------------------------
        // CAMBIO AUTOMÁTICO
        // ----------------------------------------------------
        default:

            // Si el documento actualmente tiene el tema oscuro,
            // cambiamos al tema claro.
            //
            // Si no tiene el tema oscuro, cambiamos al oscuro.
            document.body.classList.contains("dark")
                ? setTheme("light")
                : setTheme("dark");

            break
    }
}


// ============================================================
// ESTADO DE CONEXIÓN A INTERNET
// ============================================================

// Método para escuchar el estado de la conexión
// a internet (online/offline).
function handleStateChange() {

    const indicador = document.getElementById(
        "title-bar-status-indicator"
    );

    if (!indicador) {
        console.error("No se encontró el indicador de conexión");
        return;
    }

    const conectado = navigator.onLine;

    if (conectado) {

        indicador.textContent = "En línea";
        indicador.classList.remove("offline");
        indicador.classList.add("online");
        indicador.title = "El navegador detecta conexión de red";

    } else {

        indicador.textContent = "Sin conexión";
        indicador.classList.remove("online");
        indicador.classList.add("offline");
        indicador.title = "El navegador detecta que no hay conexión de red";
    }

    console.log("Estado de conexión:", conectado);
}


// ============================================================
// FUNCIÓN DEBOUNCE
// ============================================================

// Método para evitar repintar la interfaz demasiado seguido.
//
// Debounce permite esperar un determinado tiempo antes
// de ejecutar una función nuevamente.
const debounce = (func, wait) => {

    // Variable donde almacenaremos el temporizador.
    let timeout;

    // Retornamos una nueva función.
    return function executedFunction(...args) {

        // Función que se ejecutará después del tiempo
        // establecido.
        const later = () => {

            // Limpiamos el temporizador.
            clearTimeout(timeout);

            // Ejecutamos la función original.
            func(...args);
        };

        // Cancelamos un temporizador anterior.
        clearTimeout(timeout);

        // Creamos un nuevo temporizador.
        timeout = setTimeout(later, wait);
    };
};


// ============================================================
// TAREAS DE EJEMPLO
// ============================================================

// Función que devuelve algunas tareas de ejemplo.
//
// Se utilizan cuando todavía no existen tareas
// guardadas en localStorage.
const setExampleTasks = () => {

    return [
        {
            "id": 1654810497705,
            "texto": "Ver video sobre PWA",
            "completado": false,
            "ubicacion": {
                "lat": -33.671937866435044,
                "lon": -65.48830173045123
            }
        },
        {
            "id": 1654810504144,
            "texto": "Disfrutar 😁",
            "completado": true,
            "ubicacion": {
                "lat": -33.671937866435044,
                "lon": -65.48830173045123
            }
        },
       
    ]
}


// ============================================================
// EVENTO LOAD DE LA APLICACIÓN
// ============================================================

// Evento Load de la App.
//
// Se ejecuta cuando la página termina de cargar.
window.addEventListener("load", () => {

    // Actualizamos el indicador de conexión.
    handleStateChange();


    // ========================================================
    // DETECCIÓN DEL TEMA DEL SISTEMA
    // ========================================================

    // Comprobamos si el navegador dispone de matchMedia.
    if (window.matchMedia) {

        // Consultamos si el sistema operativo
        // está utilizando el modo oscuro.
        const colorSchemeQuery = window.matchMedia(
            '(prefers-color-scheme: dark)'
        );

        // Escuchamos cambios en la preferencia
        // de tema del sistema.
        colorSchemeQuery.addEventListener('change', () => {

            // Si el sistema utiliza modo oscuro...
            if (
                window.matchMedia(
                    '(prefers-color-scheme: dark)'
                ).matches
            ) {

                // Aplicamos el tema oscuro.
                setTheme("dark")

            } else {

                // De lo contrario, aplicamos el tema claro.
                setTheme("light")
            }
        });

        // Ejecutamos inicialmente el evento de cambio
        // para establecer el tema correspondiente.
        colorSchemeQuery.dispatchEvent(
            new window.Event('change')
        );

    } else {

        // Si matchMedia no está disponible,
        // utilizamos el tema claro.
        setTheme("light")
    }


    // ========================================================
    // OBTENER UBICACIÓN
    // ========================================================

    // Intentamos recuperar la ubicación de la persona usuaria.
    recuperarUbicacion();


    // ========================================================
    // CARGAR LAS TAREAS
    // ========================================================

    // Si existen tareas almacenadas en localStorage,
    // las recuperamos y convertimos desde JSON.
    //
    // Si no existen, utilizamos las tareas de ejemplo.
    tasks = localStorage.getItem("tasks")
        ? JSON.parse(localStorage.getItem("tasks"))
        : setExampleTasks();


    // Recorremos todas las tareas almacenadas.
    for (let i = 0; i < tasks.length; i++) {

        // Mostramos cada tarea en la interfaz.
        agregarTarea(tasks[i]);
    }


    // ========================================================
    // WINDOW CONTROLS OVERLAY
    // ========================================================

    // Comprobamos si el navegador soporta
    // Window Controls Overlay.
    if ('windowControlsOverlay' in navigator) {

        // Escuchamos los cambios en la geometría
        // de la barra de controles de la ventana.
        navigator.windowControlsOverlay.addEventListener(
            'geometrychange',

            // Utilizamos debounce para evitar actualizaciones
            // demasiado frecuentes.
            debounce(e => {

                // Detectamos si Window Controls Overlay
                // está visible.
                const isOverlayVisible =
                    navigator.windowControlsOverlay.visible;

                // Obtenemos el tamaño y posición
                // del área de la barra de título.
                const titleBarRect = e.titlebarAreaRect;


                // ------------------------------------------------
                // SI EL OVERLAY ESTÁ VISIBLE
                // ------------------------------------------------

                if (isOverlayVisible) {

                    // Cambiamos la clase de la barra de título.
                    titleBar.classList.add("overlay");
                    titleBar.classList.remove("no-overlay");


                    // Si el ancho es mayor a 300 píxeles...
                    if (titleBarRect.width > 300) {

                        // Quitamos el estado mini.
                        titleBar.classList.remove("mini")

                    } else {

                        // Si el ancho es menor o igual a 300,
                        // agregamos el estado mini.
                        titleBar.classList.add("mini");
                    }


                // ------------------------------------------------
                // SI EL OVERLAY NO ESTÁ VISIBLE
                // ------------------------------------------------

                } else {

                    // Quitamos la clase overlay.
                    titleBar.classList.remove("overlay");

                    // Agregamos la clase no-overlay.
                    titleBar.classList.add("no-overlay");

                    // Quitamos el estado mini.
                    titleBar.classList.remove("mini")
                }


                // Mostramos información sobre el estado
                // del overlay en la consola.
                console.log(
                    `The overlay is ${
                        isOverlayVisible ? 'visible' : 'hidden'
                    }, the title bar width is ${
                        titleBarRect.width
                    }px`
                );

            }, 200)
        );


        // Lanzamos manualmente el evento geometrychange
        // para establecer el estado inicial.
        navigator.windowControlsOverlay.dispatchEvent(
            new Event('geometrychange')
        );
    }


    // ========================================================
    // SERVICE WORKER
    // ========================================================

    // Registramos el Service Worker para habilitar
    // las funcionalidades relacionadas con el modo PWA.
    registerServiceWorker();
});


// ============================================================
// EVENTOS DE CONEXIÓN
// ============================================================

// Cuando el navegador detecta que vuelve la conexión,
// actualizamos el indicador.
window.addEventListener("online", handleStateChange);
window.addEventListener("offline", handleStateChange);

window.addEventListener("load", handleStateChange);

// ============================================================
// INSTALACIÓN DE LA APLICACIÓN (PWA)
// ============================================================

let deferredInstallPrompt = null;
const installButton = document.getElementById("installApp");

// El navegador avisa cuando la aplicación puede instalarse.
window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;

    if (installButton) {
        installButton.hidden = false;
    }
});

// Mostrar el diálogo de instalación al presionar el botón.
if (installButton) {
    installButton.addEventListener("click", async () => {
        if (!deferredInstallPrompt) return;

        deferredInstallPrompt.prompt();
        const choice = await deferredInstallPrompt.userChoice;

        console.log("Resultado de instalación:", choice.outcome);

        deferredInstallPrompt = null;
        installButton.hidden = true;
    });
}

// Ocultar el botón cuando ya esté instalada.
window.addEventListener("appinstalled", () => {
    if (installButton) {
        installButton.hidden = true;
    }

    deferredInstallPrompt = null;
    console.log("Aplicación instalada correctamente.");
});
