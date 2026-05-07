export default (data) => `
    <div class="col lw-b-1px-fadeout80 span_4_of_12 span_4_of_12-tl span_4_of_12-tp span_6_of_12-sl span_12_of_12-sp mb-2rem no-padding flex-item learnworlds-align-left lw-body-bg lw-blog-card js-blog-card">
        <a href="${data.link}" class="lw-blog-card-txt text-dec-none card-color">
            <div class="lw-tags">
                ${data.categories.map(cat => `
                    <div class="lw-tag lw-brand-bg learnworlds-main-text learnworlds-element learnworlds-main-text-tiny tt-none">${cat}</div>
                `).join('')}
            </div>
            <div class="learnworlds-image pos-rel learnworlds-bg-default stretched-bg learnworlds-framed-image learnworlds-element no-margin-bottom rectangle learnworlds-frame-size-full" style="background-image: url('${data.image || 'https://via.placeholder.com/400x300'}');"></div>
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
`;
