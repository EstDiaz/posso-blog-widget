(async function () {
    const config = document.currentScript.dataset;
    const RSS_URL = "https://mrmarcel.learnworlds.com/rss.xml";

    console.log("> RSS Engine Running");
    console.log("> Configuración detectada:", config);

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
        'card-list': (data) => `
            <div class="col span_12_of_12 no-padding flex-item lw-card-mb">
                <a href="${data.link}" class="lw-card card-list">
                    <div class="row-section row-title-box">
                        <span class="lw-badge learnworlds-overline-text">Así fue</span>
                        <h3 class="learnworlds-heading3 learnworlds-element learnworlds-heading3-large lw-title">${data.title}</h3>
                    </div>
                    <div class="row-section row-info-box">
                        <p class="learnworlds-main-text learnworlds-main-text-normal lw-description">${data.description}</p>
                        <div class="lw-date">
                            <span class="lw-day learnworlds-main-text learnworlds-main-text-huge">${data.day}</span> 
                            <span class="lw-month-year learnworlds-main-text learnworlds-main-text-normal bold">${data.month} ${data.year}</span>
                        </div>
                    </div>
                    <div class="row-section row-image-box" style="background-image: url('${data.image || 'https://via.placeholder.com/400x300'}')">
                        <div class="js-learnworlds-overlay"></div>
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
                --blog-blue: #abc1e8;
                --blog-blue-dark: #6986B9;
                --blog-blue-bg: #d4dff3;
                --radius: 16px;
                --radius-int: 14px;
            }
            
            .lw-event-wrapper.lw-cols {
                margin-top: 20px;
            }
            
            /* ESTILOS COMUNES */
            .lw-card {
                text-decoration: none !important;
                color: inherit;
                transition: all 0.3s ease;
                display: flex;
            }
            .lw-day {
                text-decoration: none !important;
                margin-right: 8px;
            }
            .lw-month-year {
                text-decoration: none !important;
            }

            /* PLANTILLA: CARD-MINI */
            .card-mini {
                width: 100%;
                height: 100%;
                border-radius: var(--radius);
                flex-direction: column;
                position: relative;
                border: 2px solid var(--black);
                background: transparent;
            }
            .card-mini .lw-badge {
                position: absolute;
                top: -14px; left: 20px;
                background: var(--black);
                color: var(--blog-blue-bg);
                padding: 4px 12px;
                border-radius: var(--radius);
                font-size: 14px;
                z-index: 2;
            }
            .card-mini .lw-header {
                color: var(--black);
                display: flex;
                text-decoration: none !important;
                align-items: baseline;
                padding: 32px 24px 16px;
                min-height: 100px;
            }
            .card-mini .lw-header .lw-day,
            .card-mini .lw-header .lw-month-year {
                text-decoration: none !important;
            }
            .card-mini .lw-body {
                flex-grow: 1;
                background: var(--black);
                color: var(--blog-blue-bg);
                padding: 24px;
                text-align: left;
                border-radius: 0 0 var(--radius-int) var(--radius-int);
            }
            .card-mini:hover .lw-header { background: var(--black); color: var(--blog-blue-bg); }
            .card-mini:hover .lw-body { background: transparent; color: var(--black); }

            /* PLANTILLA: card-list */
            .card-list {
                width: 100%;
                min-height: 220px;
                border: 2px solid var(--black);
                border-radius: var(--radius);
                flex-direction: row;
            }
            .card-list:hover {
                cursor: pointer;
            }
            .card-list .row-section {
                flex: 1;
                padding: 24px;
                display: flex;
                flex-direction: column;
                justify-content: space-between; /* Elementos a los extremos */
                gap: 32px; /* Espacio mínimo garantizado */
				text-align: left;
            }
            .card-list .row-title-box {
                background-color: var(--black);
                border-radius: var(--radius-int) 0 0 var(--radius-int);
                flex: 0 0 35%;
                position: relative;
                text-decoration: none !important;
                color: var(--blog-blue-bg) !important;
            }
            .card-list:hover .row-title-box {
                background-color: var(--blog-blue);
                color: var(--black) !important;
            }
            .card-list .row-info-box {
                background-color: var(--blog-blue);
                flex: 0 0 40%;
            }
            .card-list:hover .row-info-box {
                background-color: var(--black);
                color: var(--blog-blue-bg);
            }
            .card-list .row-image-box {
                flex: 0 0 25%;
                background-size: cover;
                background-position: center;
                padding: 0;
                position: relative;
            }
            /* Overlay de tintado */
            .card-list .js-learnworlds-overlay {
                position: absolute;
                top: 0; left: 0; width: 100%; height: 100%;
                background-color: var(--blog-blue);
                mix-blend-mode: multiply;
                pointer-events: none;
            }
            .card-list .lw-badge {
                margin: 0;
                font-weight: normal;
                text-decoration: none !important;
            }
            .card-list .lw-title {
                margin: 0;
                line-height: 1.2;
                font-weight: normal;
            }
            .card-list .lw-description {
                margin: 0;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            .card-list .lw-date {
                margin: 0;
            }

            /* RESPONSIVE card-list */
            @media (max-width: 991px) {
                .card-list { flex-direction: column; }
                .card-list .row-section { flex: none; width: 100%; border-right: none; border-bottom: 2px solid var(--black); }
                .card-list .row-image-box { height: 200px; }
            }

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
            const itemLink = item.querySelector("link").textContent;
            const categories = Array.from(item.querySelectorAll("category")).map(c => c.textContent.toLowerCase());
            const pubDate = new Date(item.querySelector("pubDate").textContent);
            const matchCategory = categories.includes(config.category.toLowerCase());

            const itemSlug = itemLink.split('/').filter(Boolean).pop();
            const slugToRemove = config.remove ? config.remove.trim() : null;
            
            if (slugToRemove && itemSlug === slugToRemove) {
                return false;
            }

            if (config.filter === 'future') return matchCategory && pubDate >= new Date();
            if (config.filter === 'past') return matchCategory && pubDate < new Date();
            return matchCategory;
        });

        const container = document.querySelector(config.container);
        if (!container) return;
        
        container.className = "lw-event-wrapper lw-cols multiple-rows multiple-rows-tl multiple-rows-tp multiple-rows-sl multiple-rows-sp align-items-stretch j-c-f-s";
        container.innerHTML = "";

        filtered.slice(0, parseInt(config.limit) || 3).forEach(item => {
            const dateObj = new Date(item.querySelector("pubDate").textContent);

            const itemData = {
                title: item.querySelector("title").textContent,
                link: item.querySelector("link").textContent,
                description: item.querySelector("description").textContent.replace(/<[^>]*>?/gm, '').substring(0, 180),
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