async function HomePage() {

    const container = document.createElement("div");

    container.className = "container mt-4";

    const form = await ReportFormComponent();

    container.appendChild(form);

    return container;
}