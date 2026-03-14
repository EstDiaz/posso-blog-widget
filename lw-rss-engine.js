(async function() {
    const config = document.currentScript.dataset;
    const RSS_URL = "https://mrmarcel.learnworlds.com/rss.xml";
    const PROXY_URL = "https://api.allorigins.win/get?url=" + encodeURIComponent(RSS_URL);

    console.log("> RSS Engine Running");
    console.log("> Configuración detectada:", config);

    try {
        const response = await fetch(PROXY_URL);
        const json = await response.json();
        
        const parser = new DOMParser();
        const xml = parser.parseFromString(json.contents, "text/xml");
        const items = Array.from(xml.querySelectorAll("item"));
        
        console.log(`> Items totales encontrados en RSS: ${items.length}`);

        const now = new Date();

        // 1. FILTRADO
        const filtered = items.filter(item => {
            // Buscamos en todas las etiquetas <category> del item
            const categories = Array.from(item.querySelectorAll("category")).map(c => c.textContent.toLowerCase());
            const pubDate = new Date(item.querySelector("pubDate").textContent);
            
            const matchCategory = categories.includes(config.category.toLowerCase());
            
            // Debug de fechas para entender por qué filtra
            let passFilter = true;
            if (config.filter === 'future') passFilter = pubDate >= now;
            if (config.filter === 'past') passFilter = pubDate < now;

            return matchCategory && passFilter;
        });

        console.log(`> Items después de filtrar por '${config.category}' y '${config.filter}': ${filtered.length}`);

        // 2. RENDERIZADO
        const container = document.querySelector(config.container);
        
        if (!container) {
            console.error(`> Error: No se encontró el contenedor ${config.container}`);
            return;
        }

        if (filtered.length === 0) {
            container.innerHTML = "<p>No se encontraron eventos con los criterios seleccionados.</p>";
            return;
        }

        container.innerHTML = ""; // Limpiar el contenedor

        filtered.slice(0, parseInt(config.limit) || 3).forEach((item, index) => {
            const title = item.querySelector("title").textContent;
            const link = item.querySelector("link").textContent;
            const description = item.querySelector("description").textContent.replace(/<[^>]*>?/gm, '').substring(0, 120) + "...";
            const dateStr = new Date(item.querySelector("pubDate").textContent).toLocaleDateString('es-ES', {
                day: '2-digit', month: 'long', year: 'numeric'
            });

            // Fallback de imagen
            const imgMatch = item.querySelector("description").textContent.match(/src="([^"]+)"/);
            const image = imgMatch ? imgMatch[1] : "https://via.placeholder.com/400x250?text=MrMarcel+Event";

            console.log(`> Renderizando item ${index + 1}: ${title}`);

            container.innerHTML += `
                <div class="event-card" style="border: 1px solid #ccc; margin-bottom: 10px; padding: 10px;">
                    <img src="${image}" style="width:100%; max-width:200px; height:auto;">
                    <h3>${title}</h3>
                    <p><small>${dateStr}</small></p>
                    <p>${description}</p>
                    <a href="${link}">Ver más</a>
                </div>
            `;
        });

    } catch (error) {
        console.error("> Error crítico en el motor:", error);
    }
})();