(async function () {
    const config = document.currentScript.dataset;
    const RSS_URL = "https://mrmarcel.learnworlds.com/rss.xml";

    console.log("> RSS Engine: Starting...");
    console.log("> Config detected:", config);

    const isSameOrigin = window.location.hostname === "mrmarcel.learnworlds.com";

    /**
     * FETCH IMAGE FROM METADATA (og:image)
     * Used when the RSS feed doesn't provide a direct image URL.
     */
    const fetchMetaImage = async (url) => {
        try {
            const targetUrl = isSameOrigin ? url : "https://corsproxy.io/?" + encodeURIComponent(url);
            const response = await fetch(targetUrl);
            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");
            const ogImage = doc.querySelector('meta[property="og:image"]');
            return ogImage ? ogImage.getAttribute('content') : null;
        } catch (e) {
            console.warn(`> RSS Engine: Could not fetch meta image for ${url}`);
            return null;
        }
    };

    /**
     * TEMPLATE REPOSITORY
     * Logic for rendering different card styles.
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
        'card-blue': (data) => `
            <div class="col lw-b-1px-fadeout80 span_4_of_12 span_4_of_12-tl span_4_of_12-tp span_6_of_12-sl span_12_of_12-sp mb-2rem no-padding flex-item learnworlds-align-left lw-body-bg lw-blog-card js-blog-card">
                <a href="${data.link}" class="lw-blog-card-txt text-dec-none">
                    <div class="learnworlds-image pos-rel learnworlds-bg-default stretched-bg learnworlds-framed-image learnworlds-element no-margin-bottom rectangle learnworlds-frame-size-full" style="background-image: url('${data.image || 'https://via.placeholder.com/400x300'}');">
                        <div class="lw-tags absolute tl">
                            ${data.categories.map(cat => `
                                <div class="lw-tag lw-brand-bg learnworlds-main-text learnworlds-element learnworlds-main-text-tiny tt-none">${cat}</div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="lw-padding-small learnworlds-element">
                        <div class="learnworlds-overline-text learnworlds-element">
                            por <span>${data.author || 'Equipo POSSO'}</span> | ${data.day} ${data.month}, ${data.year}
                        </div>
                        <h3 class="learnworlds-heading3 learnworlds-heading3-small learnworlds-element">
                            ${data.title}
                        </h3>
                        <div class="lw-blog-card-descr learnworlds-main-text learnworlds-element learnworlds-main-text-very-small">
                            ${data.description}
                        </div>
                    </div>
                </a>
            </div>
        `,
        'debug': (data) => `<pre style="font-size:10px; color:white; background:black; padding:10px; overflow:auto;">${JSON.stringify(data, null, 2)}</pre>`
    };

    /**
     * INJECT CSS STYLES
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
            
            .lw-event-wrapper.lw-cols { margin-top: 20px; }
            
            .lw-card { text-decoration: none !important; color: inherit; transition: all 0.3s ease; display: flex; }
            .lw-day, .lw-month-year { text-decoration: none !important; }

            /* CARD-MINI */
            .card-mini { width: 100%; height: 100%; border-radius: var(--radius); flex-direction: column; position: relative; border: 2px solid var(--black); background: transparent; }
            .card-mini .lw-badge { position: absolute; top: -14px; left: 20px; background: var(--black); color: var(--blog-blue-bg); padding: 4px 12px; border-radius: var(--radius); font-size: 14px; z-index: 2; }
            .card-mini .lw-header { color: var(--black); display: flex; align-items: baseline; padding: 32px 24px 16px; min-height: 100px; }
            .card-mini .lw-body { flex-grow: 1; background: var(--black); color: var(--blog-blue-bg); padding: 24px; text-align: left; border-radius: 0 0 var(--radius-int) var(--radius-int); }
            .card-mini:hover .lw-header { background: var(--black); color: var(--blog-blue-bg); }
            .card-mini:hover .lw-body { background: transparent; color: var(--black); }

            /* CARD-LIST */
            .card-list { width: 100%; min-height: 220px; border: 2px solid var(--black); border-radius: var(--radius); flex-direction: row; }
            .card-list .row-section { flex: 1; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; gap: 32px; text-align: left; }
            .card-list .row-title-box { background-color: var(--black); border-radius: var(--radius-int) 0 0 var(--radius-int); flex: 0 0 35%; position: relative; color: var(--blog-blue-bg) !important; }
            .card-list:hover .row-title-box { background-color: var(--blog-blue); color: var(--black) !important; }
            .card-list .row-info-box { background-color: var(--blog-blue); flex: 0 0 40%; }
            .card-list:hover .row-info-box { background-color: var(--black); color: var(--blog-blue-bg); }
            .card-list .row-image-box { flex: 0 0 25%; background-size: cover; background-position: center; position: relative; border-radius: 0 var(--radius-int) var(--radius-int) 0; }
            .card-list .js-learnworlds-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--blog-blue); mix-blend-mode: multiply; pointer-events: none; }

            /* CARD-BLUE SPECIFICS */
            .lw-blog-card .lw-tags { padding: 10px; display: flex; gap: 5px; flex-wrap: wrap; }
            .lw-blog-card .lw-tag { padding: 2px 8px; border-radius: 4px; color: white; background: var(--black); }
            .lw-blog-card-txt { display: block; height: 100%; }
            .lw-blog-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

            @media (max-width: 991px) {
                .card-list { flex-direction: column; }
                .card-list .row-section { flex: none; width: 100%; border-bottom: 2px solid var(--black); }
                .card-list .row-image-box { height: 200px; }
            }
            .lw-event-wrapper .col { padding: 10px !important; display: flex; }
        `;
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = css;
        document.head.appendChild(style);
    };

    /**
     * MAIN FEED PROCESSING
     */
    try {
        console.log("> RSS Engine: Initializing fetch...");
        injectStyles();

        let xmlText = "";
        if (isSameOrigin) {
            console.log("> RSS Engine: Same-origin detected. Fetching directly.");
            const response = await fetch("/rss.xml");
            xmlText = await response.text();
        } else {
            console.log("> RSS Engine: Cross-origin detected. Using proxy.");
            const PROXY_URL = "https://corsproxy.io/?" + encodeURIComponent(RSS_URL);
            const response = await fetch(PROXY_URL);
            xmlText = await response.text();
        }

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");
        const items = Array.from(xml.querySelectorAll("item"));

        if (items.length === 0) throw new Error("No items found in the RSS feed.");

        // Filter items based on category, date, and exclusion slug
        const filtered = items.filter(item => {
            const itemLink = item.querySelector("link").textContent;
            const categories = Array.from(item.querySelectorAll("category")).map(c => c.textContent.toLowerCase());
            const pubDate = new Date(item.querySelector("pubDate").textContent);
            const matchCategory = categories.includes(config.category.toLowerCase());
            const itemSlug = itemLink.split('/').filter(Boolean).pop();
            const slugToRemove = config.remove ? config.remove.trim() : null;
            
            if (slugToRemove && itemSlug === slugToRemove) return false;
            if (config.filter === 'future') return matchCategory && pubDate >= new Date();
            if (config.filter === 'past') return matchCategory && pubDate < new Date();
            return matchCategory;
        });

        // Normalize item data
        const processedItems = filtered.slice(0, parseInt(config.limit) || 3).map(item => {
            const dateObj = new Date(item.querySelector("pubDate").textContent);
            const descHtml = item.querySelector("description").textContent;
            return {
                title: item.querySelector("title").textContent,
                link: item.querySelector("link").textContent,
                description: descHtml.replace(/<[^>]*>?/gm, '').substring(0, 180),
                day: dateObj.getDate(),
                month: dateObj.toLocaleDateString('es-ES', { month: 'long' }),
                year: dateObj.getFullYear(),
                categories: Array.from(item.querySelectorAll("category")).map(c => c.textContent),
                image: (descHtml.match(/src="([^"]+)"/) || [])[1] || null
            };
        });

        // Fetch missing images from page metadata
        await Promise.all(processedItems.map(async (data) => {
            if (!data.image) {
                console.log(`> RSS Engine: Searching meta image for ${data.title}...`);
                data.image = await fetchMetaImage(data.link);
            }
        }));

        const container = document.querySelector(config.container);
        if (!container) return;
        
        container.className = "lw-event-wrapper lw-cols multiple-rows multiple-rows-tl multiple-rows-tp multiple-rows-sl multiple-rows-sp align-items-stretch j-c-f-s";
        container.innerHTML = "";

        processedItems.forEach(itemData => {
            const templateFn = templates[config.template] || templates['card-mini'];
            container.innerHTML += templateFn(itemData);
        });

    } catch (error) {
        console.error("> RSS Engine Error:", error);
        const container = document.querySelector(config.container);
        if (container) container.innerHTML = "<!-- Error loading RSS items -->";
    }
})();