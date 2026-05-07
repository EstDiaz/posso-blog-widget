(() => {
  // templates/card-mini.js
  var card_mini_default = (data) => `
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
`;

  // templates/card-list.js
  var card_list_default = (data) => `
    <div class="col span_12_of_12 no-padding flex-item lw-card-mb">
        <a href="${data.link}" class="lw-card card-list">
            <div class="row-section row-title-box">
                <span class="lw-badge learnworlds-overline-text">As\xED fue</span>
                <h3 class="learnworlds-heading3 learnworlds-element learnworlds-heading3-large lw-title">${data.title}</h3>
            </div>
            <div class="row-section row-info-box">
                <p class="learnworlds-main-text learnworlds-main-text-normal lw-description">${data.description}</p>
                <div class="lw-date">
                    <span class="lw-day learnworlds-main-text learnworlds-main-text-huge">${data.day}</span>
                    <span class="lw-month-year learnworlds-main-text learnworlds-main-text-normal bold">${data.month} ${data.year}</span>
                </div>
            </div>
            <div class="row-section row-image-box" style="background-image: url('${data.image || "https://via.placeholder.com/400x300"}')">
                <div class="js-learnworlds-overlay"></div>
            </div>
        </a>
    </div>
`;

  // templates/card-color.js
  var card_color_default = (data) => `
    <div class="col lw-b-1px-fadeout80 span_4_of_12 span_4_of_12-tl span_4_of_12-tp span_6_of_12-sl span_12_of_12-sp mb-2rem no-padding flex-item learnworlds-align-left lw-body-bg lw-blog-card js-blog-card">
        <a href="${data.link}" class="lw-blog-card-txt text-dec-none card-color">
            <div class="lw-tags">
                ${data.categories.map((cat) => `
                    <div class="lw-tag lw-brand-bg learnworlds-main-text learnworlds-element learnworlds-main-text-tiny tt-none">${cat}</div>
                `).join("")}
            </div>
            <div class="learnworlds-image pos-rel learnworlds-bg-default stretched-bg learnworlds-framed-image learnworlds-element no-margin-bottom rectangle learnworlds-frame-size-full" style="background-image: url('${data.image || "https://via.placeholder.com/400x300"}');"></div>
            <div class="lw-padding-small learnworlds-element">
                <div class="learnworlds-overline-text learnworlds-element">
                    por <span>${data.author || "Equipo POSSO"}</span> | ${data.day} ${data.month}, ${data.year}
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
`;

  // templates/card-dark.js
  var card_dark_default = (data) => `
    <div class="col lw-b-1px-fadeout80 span_4_of_12 span_4_of_12-tl span_4_of_12-tp span_6_of_12-sl span_12_of_12-sp mb-2rem no-padding flex-item learnworlds-align-left lw-body-bg lw-blog-card js-blog-card">
        <a href="${data.link}" class="lw-blog-card-txt text-dec-none card-dark">
            <div class="lw-tags">
                ${data.categories.map((cat) => `
                    <div class="lw-tag lw-brand-bg learnworlds-main-text learnworlds-element learnworlds-main-text-tiny tt-none">${cat}</div>
                `).join("")}
            </div>
            <div class="learnworlds-image pos-rel learnworlds-bg-default stretched-bg learnworlds-framed-image learnworlds-element no-margin-bottom rectangle learnworlds-frame-size-full" style="background-image: url('${data.image || "https://via.placeholder.com/400x300"}');"></div>
            <div class="lw-padding-small learnworlds-element">
                <div class="learnworlds-overline-text learnworlds-element">
                    por <span>${data.author || "Equipo POSSO"}</span> | ${data.day} ${data.month}, ${data.year}
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
`;

  // templates/debug.js
  var debug_default = (data) => `<pre style="font-size:10px; color:white; background:black; padding:10px; overflow:auto;">${JSON.stringify(data, null, 2)}</pre>`;

  // styles/base.css
  var base_default = ":root {\n    --black: #333333;\n    --blog-color: #abc1e8;\n    --blog-color-bg: #d4dff3;\n    --brand-color: var(--salmon-200);\n    --radius: 16px;\n    --radius-int: 14px;\n\n    --salmon-100: #FBE6DF;\n    --salmon-150: #F9D4C8;\n    --salmon-200: #F7C8B9;\n    --salmon-300: #F4B8A6;\n    --salmon-400: #DB8874;\n    --ash-700:  #2A2A2A;\n    --ash-900:  #212121;\n    --ash-1000: #171717;\n}\n\n.lw-card {\n    text-decoration: none !important;\n    color: inherit;\n    transition: all 0.25s ease;\n    display: flex;\n}\n\n.lw-day,\n.lw-month-year,\n.lw-badge {\n    text-decoration: none !important;\n}\n\n.lw-day {\n    margin-right: 8px;\n}\n\n.lw-event-wrapper .col {\n    display: flex;\n}";

  // styles/card-mini.css
  var card_mini_default2 = ".card-mini { width: 100%; height: 100%; border-radius: var(--radius); flex-direction: column; position: relative; border: 2px solid var(--black); background: transparent; }\n.card-mini .lw-badge { position: absolute; top: -14px; left: 20px; background: var(--black); color: var(--blog-color-bg); padding: 4px 12px; border-radius: var(--radius); font-size: 14px; z-index: 2; }\n.card-mini .lw-header { border-radius: var(--radius-int) var(--radius-int) 0 0; color: var(--black); display: flex; align-items: baseline; padding: 32px 24px 16px; min-height: 100px; }\n.card-mini .lw-body { flex-grow: 1; background: var(--black); color: var(--blog-color-bg); padding: 24px; text-align: left; border-radius: 0 0 var(--radius-int) var(--radius-int); }\n.card-mini:hover .lw-header { background: var(--black); color: var(--blog-color-bg); }\n.card-mini:hover .lw-body { background: transparent; color: var(--black) !important; }\n.beige-cards .card-mini .lw-badge, .beige-cards .card-mini:hover .lw-header, .beige-cards .card-mini .lw-body { color: var(--soft-beige); }\n";

  // styles/card-list.css
  var card_list_default2 = ".card-list { width: 100%; min-height: 220px; border: 2px solid var(--black); border-radius: var(--radius); flex-direction: row; }\n.card-list .row-section { flex: 1; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; gap: 32px; text-align: left; }\n.card-list .row-title-box { background-color: var(--black); border-radius: var(--radius-int) 0 0 var(--radius-int); flex: 0 0 35%; position: relative; color: var(--blog-color-bg) !important; }\n.card-list:hover .row-title-box { background-color: var(--blog-color); color: var(--black) !important; }\n.card-list .row-info-box { background-color: var(--blog-color); flex: 0 0 40%; }\n.card-list:hover .row-info-box { background-color: var(--black); color: var(--blog-color-bg); }\n.card-list .row-image-box { flex: 0 0 25%; background-size: cover; background-position: center; position: relative; border-radius: 0 var(--radius-int) var(--radius-int) 0; }\n.card-list .js-learnworlds-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--blog-color); mix-blend-mode: multiply; pointer-events: none; }\n@media (max-width: 991px) {\n    .card-list { flex-direction: column; }\n    .card-list .row-section { flex: none; width: 100%; }\n    .card-list .row-title-box { border-radius: var(--radius-int) var(--radius-int) 0 0; }\n    .card-list .row-image-box { height: 200px; border-radius: 0 0 var(--radius-int) var(--radius-int); }\n}\n";

  // styles/card-color.css
  var card_color_default2 = ".card-color {\n    padding: 16px;\n}\n\n.lw-blog-card .card-color {\n    color: var(--ash-700);\n    background: var(--salmon-150);\n}\n.lw-blog-card:hover .card-color {\n    background: var(--salmon-200);\n    \n}\n\n.lw-blog-card .card-color .lw-tags {\n    display: flex;\n    gap: 8px;\n    justify-content: flex-end;\n    flex-wrap: wrap;\n    overflow: hidden;\n}\n\n.lw-blog-card .card-color .lw-tag {\n    font-size: 12px;\n    border-radius: 9999px;\n    padding: 8px 16px;\n    white-space: nowrap;\n    line-height: 1;\n    background: var(--ash-700);\n    color: var(--salmon-200);\n}\n\n.lw-blog-card .card-color .learnworlds-image {\n    width: calc(100% - 32px);\n    margin: 8px auto;\n    border-radius: 8px;\n}\n\n.dark-cards .lw-blog-card {\n    background: var(--blog-color);\n}";

  // styles/card-dark.css
  var card_dark_default2 = ".lw-blog-card .card-dark { background: var(--ash-700); color: var(--salmon-200); padding: 16px; border-radius: 16px; }\n.lw-blog-card:hover .card-dark { background: var(--salmon-200); color: var(--ash-700) !important; }\n.lw-blog-card .card-dark .lw-tags { display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; overflow: hidden; }\n.lw-blog-card .card-dark .lw-tag { font-size: 12px; border-radius: 24px; padding: 8px 16px; white-space: nowrap; line-height: 1; background: var(--salmon-200); color: var(--ash-700); }\n.lw-blog-card:hover .card-dark .lw-tag { background: var(--ash-700); color: var(--brand-color); }\n.lw-blog-card .card-dark .learnworlds-image { width: calc(100% - 32px); margin: 8px auto; border-radius: 8px; }\n";

  // lw-rss-engine.js
  (async function() {
    const config = document.currentScript.dataset;
    const RSS_URL = "https://mrmarcel.learnworlds.com/rss.xml";
    console.log("> RSS Engine: Starting...");
    const isSameOrigin = window.location.hostname === "mrmarcel.learnworlds.com";
    const fetchMetaImage = async (url) => {
      try {
        const targetUrl = isSameOrigin ? url : "https://corsproxy.io/?" + encodeURIComponent(url);
        const response = await fetch(targetUrl);
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");
        const ogImage = doc.querySelector('meta[property="og:image"]');
        return ogImage ? ogImage.getAttribute("content") : null;
      } catch (e) {
        console.warn(`> RSS Engine: Could not fetch meta image for ${url}`);
        return null;
      }
    };
    const templates = {
      "card-mini": card_mini_default,
      "card-list": card_list_default,
      "card-color": card_color_default,
      "card-dark": card_dark_default,
      "debug": debug_default
    };
    const injectStyles = () => {
      const styleId = "lw-events-styles";
      if (document.getElementById(styleId)) return;
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = base_default + card_mini_default2 + card_list_default2 + card_color_default2 + card_dark_default2;
      document.head.appendChild(style);
    };
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
      const rawCategoryParam = config.category || "";
      const categoryList = rawCategoryParam.split(",").map((s) => s.trim()).filter(Boolean);
      const includeTags = categoryList.filter((s) => !s.startsWith("-")).map((s) => s.toLowerCase());
      const excludeTags = categoryList.filter((s) => s.startsWith("-")).map((s) => s.substring(1).toLowerCase());
      const filtered = items.filter((item) => {
        const itemLink = item.querySelector("link").textContent;
        const itemCategories = Array.from(item.querySelectorAll("category")).map((c) => c.textContent.toLowerCase());
        const pubDate = new Date(item.querySelector("pubDate").textContent);
        const itemSlug = itemLink.split("/").filter(Boolean).pop();
        if (config.remove && itemSlug === config.remove.trim()) return false;
        if (config.filter === "future" && pubDate < /* @__PURE__ */ new Date()) return false;
        if (config.filter === "past" && pubDate >= /* @__PURE__ */ new Date()) return false;
        const hasExcludedTag = excludeTags.some((tag) => itemCategories.includes(tag));
        if (hasExcludedTag) return false;
        if (includeTags.length > 0) {
          const hasIncludedTag = includeTags.some((tag) => itemCategories.includes(tag));
          if (!hasIncludedTag) return false;
        }
        return true;
      });
      const processedItems = filtered.slice(0, parseInt(config.limit) || 3).map((item) => {
        const dateObj = new Date(item.querySelector("pubDate").textContent);
        const descHtml = item.querySelector("description").textContent;
        return {
          title: item.querySelector("title").textContent,
          link: item.querySelector("link").textContent,
          description: descHtml.replace(/<[^>]*>?/gm, "").substring(0, 180),
          day: dateObj.getDate(),
          month: dateObj.toLocaleDateString("es-ES", { month: "long" }),
          year: dateObj.getFullYear(),
          categories: Array.from(item.querySelectorAll("category")).map((c) => c.textContent),
          image: (descHtml.match(/src="([^"]+)"/) || [])[1] || null
        };
      });
      const needsImages = config.template !== "card-mini";
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
      processedItems.forEach((itemData) => {
        const templateFn = templates[config.template] || templates["card-mini"];
        container.innerHTML += templateFn(itemData);
      });
    } catch (error) {
      console.error("> RSS Engine Error:", error);
    }
  })();
})();
