(async function() {
    const config = document.currentScript.dataset;
    const RSS_URL = "https://mrmarcel.learnworlds.com/rss.xml";
    // Usamos un proxy para evitar bloqueos de CORS (Cross-Origin Resource Sharing)
    const PROXY_URL = "https://api.allorigins.win/get?url=" + encodeURIComponent(RSS_URL);

    try {
        const response = await fetch(PROXY_URL);
        const json = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(json.contents, "text/xml");
        const items = Array.from(xml.querySelectorAll("item"));

        const now = new Date();

        // 1. FILTRADO
        const filtered = items.filter(item => {
            const categories = Array.from(item.querySelectorAll("category")).map(c => c.textContent.toLowerCase());
            const pubDate = new Date(item.querySelector("pubDate").textContent);
            
            const matchCategory = categories.includes(config.category.toLowerCase());
            const isFuture = pubDate >= now;

            if (config.filter === 'future') return matchCategory && isFuture;
            if (config.filter === 'past') return matchCategory && !isFuture;
            return matchCategory;
        });

        // 2. MAQUETACIÓN
        const container = document.querySelector(config.container);
        container.innerHTML = ""; // Limpiar spinner

        filtered.slice(0, parseInt(config.limit)).forEach(item => {
            const title = item.querySelector("title").textContent;
            const link = item.querySelector("link").textContent;
            const description = item.querySelector("description").textContent.replace(/<[^>]*>?/gm, '').substring(0, 100) + "...";
            const dateStr = new Date(item.querySelector("pubDate").textContent).toLocaleDateString('es-ES', {
                day: '2-digit', month: 'long', year: 'numeric'
            });

            // Buscamos si hay una imagen en la descripción (si existiera HTML)
            const imgMatch = item.querySelector("description").textContent.match(/src="([^"]+)"/);
            const image = imgMatch ? imgMatch[1] : "https://mrmarcel.learnworlds.com/path-to-default-image.jpg";

            container.innerHTML += renderTemplate(config.template, {title, link, description, dateStr, image});
        });

    } catch (error) {
        console.error("Error en el motor de eventos:", error);
    }

    function renderTemplate(name, data) {
        const templates = {
            'card-moderna': `
                <div class="event-card">
                    <div class="event-image" style="background-image: url('${data.image}')"></div>
                    <div class="event-content">
                        <span class="event-date">${data.dateStr}</span>
                        <h3>${data.title}</h3>
                        <p>${data.description}</p>
                        <a href="${data.link}" class="event-btn">Ver Actividad</a>
                    </div>
                </div>
            `
        };
        return templates[name] || templates['card-moderna'];
    }
})();