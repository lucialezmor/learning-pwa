//asignar un nombre y versión al cache
const CACHE_NAME = "v1_base_progressivewebapp",
    urlsToCache = [
        "./",
        "https://fonts.googleapis.com/css?family=Raleway:400,700",
        "https://fonts.gstatic.com/s/raleway/v12/1Ptrg8zYS_SKggPNwJYtWqZPAA.woff2",
        "https://use.fontawesome.com/releases/v5.0.7/css/all.css",
        "https://use.fontawesome.com/releases/v5.0.6/webfonts/fa-brands-400.woff2",
        "./style.css",
        "./script.js",
        "./img/demo-logotipo-icono.png",
        "./img/favicon.png",
    ];

//3 eventos:
//self es el metodo para escucharse a sí mismo

//1-install
//durante la fase de instalacion, generalmente se almacena en caché los activos estáticos

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache).then(() => self.skipWaiting());
            })
            .catch((err) => console.log("Falló registro de cache", err))
    );
});

//2-activate
//una vez se instala el switch, se activa y busca los recursos para hacer que funcione sin conexion
self.addEventListener("activate", (e) => {
    const cacheWhitelist = [CACHE_NAME];

    e.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        //Eliminamos lo que ya no se necesita en cache
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            // Le indica al SW activar el cache actual
            .then(() => self.clients.claim())
    );
});

//3-fetch
//cuando el navegador recupera una url, recupera los archivos
self.addEventListener("fetch", (e) => {
    //Responder ya sea con el objeto en caché o continuar y buscar la url real
    e.respondWith(
        caches.match(e.request).then((res) => {
            if (res) {
                //recuperar del cache
                return res;
            }
            //recuperar de la petición a la url
            return fetch(e.request);
        })
    );
});
