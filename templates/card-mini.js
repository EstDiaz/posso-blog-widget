export default (data) => `
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
