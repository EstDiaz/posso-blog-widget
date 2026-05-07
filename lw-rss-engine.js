import cardMini from './templates/card-mini.js';
import cardList from './templates/card-list.js';
import cardColor from './templates/card-color.js';
import cardDark from './templates/card-dark.js';
import debug from './templates/debug.js';

import baseCSS from './styles/base.css';
import cardMiniCSS from './styles/card-mini.css';
import cardListCSS from './styles/card-list.css';
import cardColorCSS from './styles/card-color.css';
import cardDarkCSS from './styles/card-dark.css';

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
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = baseCSS + cardMiniCSS + cardListCSS + cardColorCSS + cardDarkCSS;
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
