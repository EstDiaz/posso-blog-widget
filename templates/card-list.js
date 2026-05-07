export default (data) => `
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
`;
