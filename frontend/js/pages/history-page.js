async function HistoryPage() {

    const container = document.createElement("div");

    container.className = "container mt-4";

    const response = await apiFetch("/reports");

    AppState.reports = response.data;

    const exportBtn = document.createElement("button");

    exportBtn.className = "btn btn-success mb-3";

    exportBtn.textContent = "Export CSV";

    exportBtn.onclick = () => {
        exportCSV(AppState.reports);
    };

    container.appendChild(exportBtn);

    const table = ReportTableComponent(AppState.reports);

    container.appendChild(table);

    return container;
}