function NavbarComponent() {

    const nav = document.createElement("nav");

    nav.className = "navbar navbar-expand-lg navbar-dark bg-dark";

    const container = document.createElement("div");

    container.className = "container d-flex justify-content-between align-items-center";

    // =========================
    // LEFT SIDE
    // =========================

    const leftWrapper = document.createElement("div");

    leftWrapper.className = "d-flex align-items-center gap-3";

    const brand = document.createElement("a");

    brand.className = "navbar-brand";

    brand.href = "#";

    brand.textContent = "Fleetify";

    leftWrapper.appendChild(brand);

    const leftMenu = document.createElement("div");

    leftMenu.className = "d-flex gap-2";

    const homeBtn = document.createElement("button");

    homeBtn.textContent = "Home";

    homeBtn.className =
        AppState.currentPage === "home"
            ? "btn btn-light"
            : "btn btn-outline-light";

    homeBtn.onclick = () => {

        if (AppState.currentPage === "home") {
            return;
        }

        renderPage("home");
    };

    const historyBtn = document.createElement("button");

    historyBtn.textContent = "History";

    historyBtn.className =
        AppState.currentPage === "history"
            ? "btn btn-light"
            : "btn btn-outline-light";

    historyBtn.onclick = () => {

        if (AppState.currentPage === "history") {
            return;
        }

        renderPage("history");
    };

    leftMenu.appendChild(homeBtn);

    leftMenu.appendChild(historyBtn);

    leftWrapper.appendChild(leftMenu);

    container.appendChild(leftWrapper);

    // =========================
    // RIGHT SIDE
    // =========================

    const rightMenu = document.createElement("div");

    rightMenu.className = "d-flex align-items-center gap-2";

    const loginLabel = document.createElement("span");

    loginLabel.className = "text-white";

    loginLabel.textContent = "Login As";

    const userSelect = document.createElement("select");

    userSelect.id = "userSelect";

    userSelect.className = "form-select";

    const saOption = document.createElement("option");

    saOption.value = "1";

    saOption.textContent = "Service Advisor";

    const approvalOption = document.createElement("option");

    approvalOption.value = "2";

    approvalOption.textContent = "Manager";

    userSelect.appendChild(saOption);

    userSelect.appendChild(approvalOption);

    userSelect.value = AppState.currentUserId;

    userSelect.onchange = (e) => {

        AppState.currentUserId = Number(e.target.value);

        renderPage(AppState.currentPage);
    };

    rightMenu.appendChild(loginLabel);

    rightMenu.appendChild(userSelect);

    container.appendChild(rightMenu);

    nav.appendChild(container);

    return nav;
}