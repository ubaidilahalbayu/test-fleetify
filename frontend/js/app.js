async function renderPage(page) {

    AppState.currentPage = page;

    const app = document.getElementById("app");

    app.replaceChildren();

    const navbar = NavbarComponent();

    app.appendChild(navbar);

    let pageComponent;

    if (page === "home") {
        pageComponent = await HomePage();
    } else {
        pageComponent = await HistoryPage();
    }

    app.appendChild(pageComponent);
}

async function bootstrap() {

    const vehicles = await apiFetch("/vehicles");

    AppState.vehicles = vehicles.data;

    const items = await apiFetch("/master-items");

    AppState.masterItems = items.data;

    renderPage("home");
}

bootstrap();