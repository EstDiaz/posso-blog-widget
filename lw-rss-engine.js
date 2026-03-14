(async function () {
    const config = document.currentScript.dataset;
    const RSS_URL = "https://mrmarcel.learnworlds.com/rss.xml";

    console.log("> RSS Engine Running");
    console.log("> Configuración detectada:", config);

    // Detectamos si estamos en el mismo dominio para evitar el proxy
    const isSameOrigin = window.location.hostname === "mrmarcel.learnworlds.com";

    /**
     * REPOSITORIO DE PLANTILLAS
     */
    const templates = {
        'card-mini': (data) => `
            <div class="col span_4_of_12 lw-card-mb span_4_of_12-tl span_6_of_12-tp span_6_of_12-sl span_12_of_12-sp no-padding flex-item">
                <a href="${data.link}" class="lw-card card-mini">
                    <div class="lw-badge learnworlds-overline-text">Actividad</div>
                    <div class="lw-header">
                        <span class="lw-day learnworlds-main-text learnworlds-main-text-huge">${data.day}</span>
                        <span class="lw-month-year learnworlds-main-text learnworlds-main-text-large">${data.month} ${data.year}</span>
                    </div>
                    <div class="lw-body">
                        <h3 class="learnworlds-heading3 learnworlds-heading3-small">${data.title}</h3>
                    </div>
                </a>
            </div>
        `,
        'debug': (data) => `<pre style="font-size:10px; color:white; background:black; padding:10px; overflow:auto;">${JSON.stringify(data, null, 2)}</pre>`
    };

    /**
     * INYECCIÓN DE ESTILOS
     */
    const injectStyles = () => {
        const styleId = 'lw-events-styles';
        if (document.getElementById(styleId)) return;

        const css = `
            :root {
                --black: #333333;
				--soft-beige: #fdf3ef;
                --radius: 16px;
                --radius-int: 14px;
            }
            
            /* El contenedor usa el grid de LearnWorlds, solo añadimos gap si es necesario */
            .lw-event-wrapper.lw-cols {
                margin-top: 20px;
            }
            
            .card-mini {
                width: 100%; /* El ancho lo controla el div .col superior */
                height: 100%;
                border-radius: var(--radius);
                display: flex;
                flex-direction: column;
                position: relative;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid var(--black);
                text-decoration: none !important;
                color: inherit;
                background: transparent;
            }
            .card-mini .lw-badge {
                position: absolute;
                top: -14px; left: 20px;
                background: var(--black);
                color: var(--soft-beige);
                padding: 4px 12px;
                border-radius: var(--radius);
                font-size: 14px;
                z-index: 2;
            }
            .card-mini .lw-header {
                color: var(--black);
                background: transparent;
                display: flex;
                align-items: baseline;
                transition: 0.3s;
                padding: 32px 24px 16px;
                border-radius: var(--radius-int) var(--radius-int) 0 0;
                min-height: 100px;
            }
            .card-mini .lw-body {
                flex-grow: 1;
                background: var(--black);
                color: var(--soft-beige);
                padding: 24px;
                display: flex;
                align-items: start;
                transition: 0.3s;
                text-align: left;
                border-radius: 0 0 var(--radius-int) var(--radius-int);
            }
            .card-mini .lw-day { 
				text-decoration: none !important;
                margin: 0 16px 0 0;
                line-height: 1;
			}
            .card-mini .lw-month-year {
				text-decoration: none !important;
                line-height: 1.2;
            }
            .card-mini .lw-title { 
                font-weight: bold;
                margin: 0;
			}

            .card-mini:hover .lw-header { background: var(--black); color: var(--soft-beige); }
            .card-mini:hover .lw-body { background: transparent; color: var(--black); }

            /* Ajuste para que las columnas tengan padding interno coherente con el grid */
            .lw-event-wrapper .col {
                padding: 10px !important;
                display: flex;
            }
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
        console.log("> RSS Engine: Iniciando carga...");
        injectStyles();

        let xmlText = "";

        if (isSameOrigin) {
            console.log("> RSS Engine: Same-origin detectado, cargando directamente.");
            const response = await fetch("/rss.xml");
            xmlText = await response.text();
        } else {
            console.log("> RSS Engine: Cross-origin detectado, usando proxy.");
            const PROXY_URL = "https://corsproxy.io/?" + encodeURIComponent(RSS_URL);
            const response = await fetch(PROXY_URL);
            xmlText = await response.text();
        }

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");
        const items = Array.from(xml.querySelectorAll("item"));

        if (items.length === 0) throw new Error("No se encontraron items en el RSS");

        const filtered = items.filter(item => {
            const categories = Array.from(item.querySelectorAll("category")).map(c => c.textContent.toLowerCase());
            const pubDate = new Date(item.querySelector("pubDate").textContent);
            const matchCategory = categories.includes(config.category.toLowerCase());

            // Lógica de exclusión por slug (data-remove) con limpieza de espacios
            const itemSlug = itemLink.split('/').filter(Boolean).pop();
            const slugToRemove = config.remove ? config.remove.trim() : null;
            
            if (slugToRemove && itemSlug === slugToRemove) {
                console.log(`> RSS Engine: Excluyendo post actual (${itemSlug})`);
                return false;
            }
            
            if (config.filter === 'future') return matchCategory && pubDate >= new Date();
            if (config.filter === 'past') return matchCategory && pubDate < new Date();
            return matchCategory;
        });

        const container = document.querySelector(config.container);
        if (!container) return;
        
        // Aplicamos las clases nativas de grid de LearnWorlds al contenedor
        container.className = "lw-event-wrapper lw-cols multiple-rows multiple-rows-tl multiple-rows-tp multiple-rows-sl multiple-rows-sp align-items-stretch j-c-f-s";
        container.innerHTML = "";

        filtered.slice(0, parseInt(config.limit) || 3).forEach(item => {
            const dateObj = new Date(item.querySelector("pubDate").textContent);

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

            const templateFn = templates[config.template] || templates['card-mini'];
            container.innerHTML += templateFn(itemData);
        });

    } catch (error) {
        console.error("> RSS Engine Error:", error);
        const container = document.querySelector(config.container);
        if (container) container.innerHTML = "<!-- Error cargando eventos RSS -->";
    }
})();