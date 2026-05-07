import cardMini from './templates/card-mini.js';
import cardList from './templates/card-list.js';
import cardColor from './templates/card-color.js';
import cardDark from './templates/card-dark.js';
import debug from './templates/debug.js';

(async function () {
    const config = document.currentScript.dataset;
    const RSS_URL = "https://mrmarcel.learnworlds.com/rss.xml";

    console.log("> RSS Engine: Starting...");

    const isSameOrigin = window.location.hostname === "mrmarcel.learnworlds.com";

    /**
     * FETCH IMAGE FROM METADATA (og:image)
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
     */
    const templates = {
        'card-mini': cardMini,
        'card-list': cardList,
        'card-color': cardColor,
        'card-dark': cardDark,
        'debug': debug,
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
                --blog-color: #abc1e8;
                --blog-color-dark: #6986B9;
                --blog-color-bg: #d4dff3;
                --brand-color: var(--salmon-200);
                --brand-color-bg: var(--salmon-100);
                --brand-color-dark: var(--salmon-300);
                --radius: 16px;
                --radius-int: 14px;
            }
            .lw-card { text-decoration: none !important; color: inherit; transition: all 0.25s ease; display: flex; }
            .lw-day, .lw-month-year, .lw-badge { text-decoration: none !important; }
            .lw-day { margin-right: 8px; }

            /* CARD-MINI */
            .card-mini { width: 100%; height: 100%; border-radius: var(--radius); flex-direction: column; position: relative; border: 2px solid var(--black); background: transparent; }
            .card-mini .lw-badge { position: absolute; top: -14px; left: 20px; background: var(--black); color: var(--blog-color-bg); padding: 4px 12px; border-radius: var(--radius); font-size: 14px; z-index: 2; }
            .card-mini .lw-header { border-radius: var(--radius-int) var(--radius-int) 0 0 ; color: var(--black); display: flex; align-items: baseline; padding: 32px 24px 16px; min-height: 100px; }
            .card-mini .lw-body { flex-grow: 1; background: var(--black); color: var(--blog-color-bg); padding: 24px; text-align: left; border-radius: 0 0 var(--radius-int) var(--radius-int); }
            .card-mini:hover .lw-header { background: var(--black); color: var(--blog-color-bg); }
            .card-mini:hover .lw-body { background: transparent; color: var(--black) !important; }
            .beige-cards .card-mini .lw-badge,
            .beige-cards .card-mini:hover .lw-header,
            .beige-cards .card-mini .lw-body {
                color: var(--soft-beige)}

            /* CARD-LIST */
            .card-list { width: 100%; min-height: 220px; border: 2px solid var(--black); border-radius: var(--radius); flex-direction: row; }
            .card-list .row-section { flex: 1; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; gap: 32px; text-align: left; }
            .card-list .row-title-box { background-color: var(--black); border-radius: var(--radius-int) 0 0 var(--radius-int); flex: 0 0 35%; position: relative; color: var(--blog-color-bg) !important; }
            .card-list:hover .row-title-box { background-color: var(--blog-color); color: var(--black) !important; }
            .card-list .row-info-box { background-color: var(--blog-color); flex: 0 0 40%; }
            .card-list:hover .row-info-box { background-color: var(--black); color: var(--blog-color-bg); }
            .card-list .row-image-box { flex: 0 0 25%; background-size: cover; background-position: center; position: relative; border-radius: 0 var(--radius-int) var(--radius-int) 0; }
            .card-list .js-learnworlds-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--blog-color); mix-blend-mode: multiply; pointer-events: none; }

            /* CARD-COLOR */
            .card-color { padding: 16px; }
            .lw-blog-card .card-color .lw-tags { display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; overflow: hidden; }
            .lw-blog-card .card-color .lw-tag { font-size: 12px; border-radius: 9999px; padding: 8px 16px; white-space: nowrap; line-height: 1; background: var(--black); color: var(--blog-color-bg); }
            .lw-blog-card:hover .card-color .lw-tag { background: var(--blog-color); color: var(--black); }
            .lw-blog-card .card-color .learnworlds-image { width: calc(100% - 32px); margin: 8px auto; border-radius: 8px; }
            .dark-cards .lw-blog-card { background: var(--blog-color); }

            /* CARD-DARK */

            .lw-blog-card .card-dark {
                background: var(--ash-700);
                color: var(--salmon-200);
                padding: 16px;
                border-radius: 16px;
            }
            .lw-blog-card:hover .card-dark {
                background: var(--salmon-200);
                color: var(--ash-700) !important;
            }
            .lw-blog-card .card-dark .lw-tag {
                font-size: 12px;
                border-radius: 24px;
                padding: 8px 16px;
                white-space: nowrap;
                line-height: 1;
                background: var(--salmon-200);
                color: var(--ash-700);
            }
            .lw-blog-card:hover .card-dark .lw-tag {
                background: var(--ash-700);
                color: var(--brand-color);
            }
            .lw-blog-card .card-dark .lw-tags { display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; overflow: hidden; }
            .lw-blog-card .card-dark .learnworlds-image { width: calc(100% - 32px); margin: 8px auto; border-radius: 8px; }

            @media (max-width: 991px) {
                .card-list { flex-direction: column; }
                .card-list .row-section { flex: none; width: 100%; }
                .card-list .row-title-box { border-radius: var(--radius-int) var(--radius-int) 0 0; }
                .card-list .row-image-box { height: 200px; border-radius: 0 0 var(--radius-int) var(--radius-int); }
            }
            .lw-event-wrapper .col { display: flex; }
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

        if (items.length === 0) throw new Error("No items found.");

        // PREPARE CATEGORY FILTERS
        const rawCategoryParam = config.category || "";
        const categoryList = rawCategoryParam.split(',').map(s => s.trim()).filter(Boolean);
        const includeTags = categoryList.filter(s => !s.startsWith('-')).map(s => s.toLowerCase());
        const excludeTags = categoryList.filter(s => s.startsWith('-')).map(s => s.substring(1).toLowerCase());

        // FILTER ITEMS
        const filtered = items.filter(item => {
            const itemLink = item.querySelector("link").textContent;
            const itemCategories = Array.from(item.querySelectorAll("category")).map(c => c.textContent.toLowerCase());
            const pubDate = new Date(item.querySelector("pubDate").textContent);
            const itemSlug = itemLink.split('/').filter(Boolean).pop();

            // 1. Check Exclusion Slug (data-remove)
            if (config.remove && itemSlug === config.remove.trim()) return false;

            // 2. Date Filter (Optional)
            if (config.filter === 'future' && pubDate < new Date()) return false;
            if (config.filter === 'past' && pubDate >= new Date()) return false;

            // 3. Category Filter Logic
            const hasExcludedTag = excludeTags.some(tag => itemCategories.includes(tag));
            if (hasExcludedTag) return false;

            if (includeTags.length > 0) {
                const hasIncludedTag = includeTags.some(tag => itemCategories.includes(tag));
                if (!hasIncludedTag) return false;
            }

            return true;
        });

        // NORMALIZE DATA
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

        // FETCH IMAGES ONLY IF TEMPLATE NEEDS THEM
        const needsImages = config.template !== 'card-mini';
        if (needsImages) {
            await Promise.all(processedItems.map(async (data) => {
                if (!data.image) {
                    data.image = await fetchMetaImage(data.link);
                }
            }));
        }

        const container = document.querySelector(config.container);
        if (!container) return;

        container.classList.add(
            "lw-event-wrapper",
            "lw-cols",
            "multiple-rows",
            "multiple-rows-tl",
            "multiple-rows-tp",
            "multiple-rows-sl",
            "multiple-rows-sp",
            "align-items-stretch",
            "j-c-f-s"
        );

        container.innerHTML = "";

        processedItems.forEach(itemData => {
            const templateFn = templates[config.template] || templates['card-mini'];
            container.innerHTML += templateFn(itemData);
        });

    } catch (error) {
        console.error("> RSS Engine Error:", error);
    }
})();
