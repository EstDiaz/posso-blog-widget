(async function() {
    const config = document.currentScript.dataset;
    const RSS_URL = "https://mrmarcel.learnworlds.com/rss.xml";
    const PROXY_URL = "https://api.allorigins.win/get?url=" + encodeURIComponent(RSS_URL);

    /**
     * REPOSITORIO DE PLANTILLAS
     * Cada función recibe un objeto 'data' y devuelve un string HTML.
     */
    const templates = {
        'card-mini': (data) => `
            <a href="${data.link}" class="lw-card card-mini">
                <div class="lw-badge">Evento</div>
                <div class="lw-header">
                    <span class="lw-day">${data.day}</span>
                    <span class="lw-month-year">${data.month}<br>${data.year}</span>
                </div>
                <div class="lw-body">
                    <h3 class="lw-title">${data.title}</h3>
                </div>
            </a>
        `,
        // Aquí añadiremos 'card-full', 'list-item', etc.
        'debug': (data) => `<pre>${JSON.stringify(data, null, 2)}</pre>`
    };

    /**
     * INYECCIÓN DE ESTILOS
     * Mantenemos los estilos base y específicos de cada plantilla.
     */
    const injectStyles = () => {
        const styleId = 'lw-events-styles';
        if (document.getElementById(styleId)) return;

        const css = `
            :root {
                --lw-dark: #222222;
                --lw-accent: #F4E8E0;
                --lw-radius: 24px;
            }
            .lw-event-wrapper {
                display: flex;
                gap: 20px;
                flex-wrap: wrap;
                font-family: inherit;
            }
            
            /* Estilos Plantilla: card-mini */
            .card-mini {
                width: 300px;
                height: 200px;
                border-radius: var(--lw-radius);
                overflow: hidden;
                display: flex;
                flex-direction: column;
                position: relative;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid var(--lw-dark);
                text-decoration: none;
                color: inherit;
            }
            .card-mini .lw-badge {
                position: absolute;
                top: 0; left: 20px;
                background: var(--lw-dark);
                color: white;
                padding: 4px 12px;
                border-radius: 0 0 10px 10px;
                font-size: 11px;
                text-transform: uppercase;
                z-index: 2;
            }
            .card-mini .lw-header {
                background: var(--lw-accent);
                color: var(--lw-dark);
                flex: 1;
                display: flex;
                align-items: center;
                padding: 0 25px;
                transition: 0.3s;
            }
            .card-mini .lw-body {
                background: var(--lw-dark);
                color: white;
                padding: 15px 25px;
                min-height: 85px;
                display: flex;
                align-items: center;
                transition: 0.3s;
            }
            .card-mini .lw-day { font-size: 48px; font-weight: bold; margin-right: 12px; line-height: 1; }
            .card-mini .lw-month-year { font-size: 16px; line-height: 1.1; text-transform: capitalize; }
            .card-mini .lw-title { margin: 0; font-size: 16px; font-weight: 500; line-height: 1.3; }

            /* Hovers para card-mini */
            .card-mini:hover .lw-header { background: var(--lw-dark); color: white; }
            .card-mini:hover .lw-body { background: var(--lw-accent); color: var(--lw-dark); }
        `;
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = css;
        document.head.appendChild(style);
    };

    /**
     * PROCESADOR DE DATOS
     */
    try {
        injectStyles();
        const response = await fetch(PROXY_URL);
        const json = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(json.contents, "text/xml");
        const items = Array.from(xml.querySelectorAll("item"));

        const filtered = items.filter(item => {
            const categories = Array.from(item.querySelectorAll("category")).map(c => c.textContent.toLowerCase());
            const pubDate = new Date(item.querySelector("pubDate").textContent);
            const matchCategory = categories.includes(config.category.toLowerCase());
            
            if (config.filter === 'future') return matchCategory && pubDate >= new Date();
            if (config.filter === 'past') return matchCategory && pubDate < new Date();
            return matchCategory;
        });

        const container = document.querySelector(config.container);
        if (!container) return;
        container.classList.add('lw-event-wrapper');
        container.innerHTML = "";

        filtered.slice(0, parseInt(config.limit) || 3).forEach(item => {
            const dateObj = new Date(item.querySelector("pubDate").textContent);
            
            // Objeto de datos normalizado para las plantillas
            const itemData = {
                title: item.querySelector("title").textContent,
                link: item.querySelector("link").textContent,
                description: item.querySelector("description").textContent.replace(/<[^>]*>?/gm, '').substring(0, 150),
                day: dateObj.getDate(),
                month: dateObj.toLocaleDateString('es-ES', { month: 'long' }),
                year: dateObj.getFullYear(),
                fullDate: dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }),
                image: (item.querySelector("description").textContent.match(/src="([^"]+)"/) || [])[1] || ""
            };

            // Ejecutar la plantilla seleccionada
            const templateFn = templates[config.template] || templates['card-mini'];
            container.innerHTML += templateFn(itemData);
        });

    } catch (error) {
        console.error("> RSS Engine Error:", error);
    }
})();