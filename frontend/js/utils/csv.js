function exportCSV(reports) {

    let csvContent = "ID,Vehicle,SA,Status,Complaint,Initial Photo,Proof Photo,Items\n";

    reports.forEach(report => {

        // =========================
        // ITEMS
        // =========================

        let itemText = "";

        if (report.Items && report.Items.length > 0) {

            report.Items.forEach((item, index) => {

                itemText += `${item.Item.ItemName} x${item.Quantity}`;

                if (index !== report.Items.length - 1) {
                    itemText += " | ";
                }
            });
        }

        // =========================
        // ESCAPE CSV
        // =========================

        const complaint = escapeCSV(report.Complaint || "");

        const initialPhoto = escapeCSV(report.InitialPhoto || "");

        const proofPhoto = escapeCSV(report.ProofPhoto || "");

        const items = escapeCSV(itemText);

        csvContent +=
            `${report.ID},` +
            `"${report.Vehicle.LicensePlate} - ${report.Vehicle.Model}",` +
            `"${report.User.Username} [${report.User.Role}]",` +
            `"${report.Status}",` +
            `"${complaint}",` +
            `"${window.APP_CONFIG.API_BASE_URL}/${initialPhoto}",` +
            `"${window.APP_CONFIG.API_BASE_URL}/${proofPhoto}",` +
            `"${items}"\n`;
    });

    // =========================
    // CREATE FILE
    // =========================

    const blob = new Blob(
        [csvContent],
        {
            type: "text/csv;charset=utf-8;"
        }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "reports.csv";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}

function escapeCSV(value) {
    return String(value).replace(/"/g, '""').replace(/\n/g, " ");
}