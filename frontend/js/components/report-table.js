function ReportTableComponent(reports) {

    const wrapper = document.createElement("div");

    const table = document.createElement("table");

    table.className = "table table-bordered table-hover";

    const thead = document.createElement("thead");

    thead.className = "table-dark";

    const headRow = document.createElement("tr");

    ["ID", "Vehicle", "SA", "Status", "Action"].forEach(text => {
        const th = document.createElement("th");

        th.textContent = text;

        headRow.appendChild(th);
    });

    thead.appendChild(headRow);

    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    reports.forEach(report => {

        const tr = document.createElement("tr");

        const tdId = document.createElement("td");

        tdId.textContent = report.ID;

        const tdVehicle = document.createElement("td");

        tdVehicle.textContent = `${report.Vehicle.LicensePlate} - ${report.Vehicle.Model}`;

        const tdUser = document.createElement("td");

        tdUser.textContent = `${report.User.Username} [${report.User.Role}]`;


        const tdStatus = document.createElement("td");

        const badge = document.createElement("span");

        badge.className = getStatusBadgeClass(report.Status);

        badge.textContent = report.Status;

        tdStatus.appendChild(badge);

        const tdAction = document.createElement("td");

        const actionWrapper = document.createElement("div");

        actionWrapper.className = "d-flex gap-2 flex-wrap";

        const detailBtn = document.createElement("button");

        detailBtn.className = "btn btn-info btn-sm";

        detailBtn.textContent = "Detail";

        detailBtn.onclick = () => {
            openDetailModal(report);
        };

        actionWrapper.appendChild(detailBtn);

        if (AppState.currentUserId === 2 && report.Status === "PENDING_APPROVAL") 
        {
            const approveBtn = document.createElement("button");

            approveBtn.className = "btn btn-success btn-sm";

            approveBtn.textContent = "Approve";

            approveBtn.onclick = async () => {

                const confirmed = confirm("Approve report?");

                if (!confirmed) {
                    return;
                }

                const response = await apiFetch(
                    `/reports/${report.ID}/approve`,
                    {
                        method: "PUT"
                    }
                );

                alert(response.message);

                renderPage("history");
            };

            actionWrapper.appendChild(approveBtn);
        }

        if (AppState.currentUserId === 1 && report.Status === "APPROVED")
        {
            const completeBtn = document.createElement("button");

            completeBtn.className = "btn btn-primary btn-sm";

            completeBtn.textContent = "Complete";

            completeBtn.onclick = async () => {

                const backdrop = document.createElement("div");

                backdrop.className = "position-fixed top-0 start-0 w-100 h-100 bg-dark";

                backdrop.style.opacity = "0.5";

                backdrop.style.zIndex = "1040";

                const modal = document.createElement("div");

                modal.className = "position-fixed top-50 start-50 translate-middle bg-white rounded shadow p-4";

                modal.style.width = "500px";

                modal.style.zIndex = "1050";

                const title = document.createElement("h5");

                title.textContent = "Complete Report";

                modal.appendChild(title);

                const photoLabel = document.createElement("label");

                photoLabel.className = "form-label mt-3";

                photoLabel.textContent = "Proof Photo";

                modal.appendChild(photoLabel);

                const photoInput = document.createElement("input");

                photoInput.type = "file";

                photoInput.accept = "image/*";

                photoInput.capture = "environment";

                photoInput.className = "form-control";

                modal.appendChild(photoInput);

                const preview = document.createElement("img");

                preview.className = "img-fluid rounded mt-3 d-none";

                preview.style.maxHeight = "300px";

                modal.appendChild(preview);

                let selectedPhoto = null;

                photoInput.onchange = (e) => {

                    const file = e.target.files[0];

                    if (!file) {
                        return;
                    }
                    selectedPhoto = file;

                    const reader = new FileReader();

                    reader.onload = function(event) {

                        preview.src = event.target.result;

                        preview.classList.remove("d-none");
                    };

                    reader.readAsDataURL(file);
                };

                const buttonWrapper = document.createElement("div");

                buttonWrapper.className = "d-flex gap-2 mt-4";

                const submitBtn = document.createElement("button");

                submitBtn.className = "btn btn-primary";

                submitBtn.textContent = "Submit";

                submitBtn.onclick = async () => {

                    if (!selectedPhoto) {

                        alert("Photo required");

                        return;
                    }
                    const formData = new FormData();

                    formData.append("proof_photo", selectedPhoto);
                    const response = await apiFetch(
                        `/reports/${report.ID}/complete`,
                        {
                            method: "PUT",
                            body: formData
                        }
                    );

                    alert(response.message);

                    modal.remove();

                    backdrop.remove();

                    renderPage("history");
                };

                const closeBtn = document.createElement("button");

                closeBtn.className = "btn btn-danger";

                closeBtn.textContent = "Close";

                closeBtn.onclick = () => {

                    modal.remove();

                    backdrop.remove();
                };

                buttonWrapper.appendChild(submitBtn);

                buttonWrapper.appendChild(closeBtn);

                modal.appendChild(buttonWrapper);

                document.body.appendChild(backdrop);

                document.body.appendChild(modal);
            };

            actionWrapper.appendChild(completeBtn);
        }

        tdAction.appendChild(actionWrapper);

        tr.appendChild(tdId);

        tr.appendChild(tdVehicle);

        tr.appendChild(tdUser);

        tr.appendChild(tdStatus);

        tr.appendChild(tdAction);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    wrapper.appendChild(table);

    return wrapper;
}

// =========================
// STATUS BADGE
// =========================

function getStatusBadgeClass(status) {

    switch (status) {

        case "PENDING_APPROVAL":
            return "badge bg-warning text-dark";

        case "APPROVED":
            return "badge bg-primary";

        case "COMPLETED":
            return "badge bg-success";

        default:
            return "badge bg-secondary";
    }
}

// =========================
// DETAIL MODAL
// =========================

function openDetailModal(report) {

    const backdrop = document.createElement("div");

    backdrop.className = "position-fixed top-0 start-0 w-100 h-100 bg-dark";

    backdrop.style.opacity = "0.5";

    backdrop.style.zIndex = "1040";

    const modal = document.createElement("div");

    modal.className = "position-fixed top-50 start-50 translate-middle bg-white rounded shadow p-4";

    modal.style.width = "700px";

    modal.style.maxHeight = "90vh";

    modal.style.overflowY = "auto";

    modal.style.zIndex = "1050";

    const title = document.createElement("h4");

    title.textContent = `Report #${report.ID}`;

    modal.appendChild(title);

    const vehicleText = document.createElement("p");

    const vehicleStrong = document.createElement("strong");

    vehicleStrong.textContent = "Vehicle: ";

    const vehicleValue = document.createTextNode(
                `${report.Vehicle.LicensePlate} - ${report.Vehicle.Model}`
            );

    vehicleText.appendChild(vehicleStrong);

    vehicleText.appendChild(vehicleValue);

    modal.appendChild(vehicleText);

    const userText = document.createElement("p");

    const userStrong = document.createElement("strong");

    userStrong.textContent = "SA: ";

    const userValue = document.createTextNode(
                `${report.User.Username} [${report.User.Role}]`
            );

    userText.appendChild(userStrong);

    userText.appendChild(userValue);

    modal.appendChild(userText);

    const statusText = document.createElement("p");

    const statusStrong = document.createElement("strong");

    statusStrong.textContent = "Status: ";

    const statusValue = document.createTextNode(report.Status);

    statusText.appendChild(statusStrong);

    statusText.appendChild(statusValue);

    modal.appendChild(statusText);

    const complaintText = document.createElement("p");

    const complaintStrong = document.createElement("strong");

    complaintStrong.textContent = "Complaint: ";

    const complaintValue = document.createTextNode(report.Complaint);

    complaintText.appendChild(complaintStrong);

    complaintText.appendChild(complaintValue);

    modal.appendChild(complaintText);

    // INITIAL PHOTO
    if (report.InitialPhoto) {

        const photoTitle = document.createElement("h6");

        photoTitle.textContent = "Initial Photo";

        modal.appendChild(photoTitle);

        const img = document.createElement("img");

        img.src = window.APP_CONFIG.API_BASE_URL + "/" + report.InitialPhoto;

        img.className = "img-fluid rounded mb-3";

        modal.appendChild(img);
    }

    // PROOF PHOTO
    if (report.ProofPhoto) {

        const proofTitle = document.createElement("h6");

        proofTitle.textContent = "Proof Photo";

        modal.appendChild(proofTitle);

        const proofImg = document.createElement("img");

        proofImg.src = window.APP_CONFIG.API_BASE_URL + "/" + report.ProofPhoto;

        proofImg.className = "img-fluid rounded mb-3";

        modal.appendChild(proofImg);
    }

    // ITEMS
    const itemTitle = document.createElement("h5");

    itemTitle.textContent = "Items";

    modal.appendChild(itemTitle);

    const itemTable = document.createElement("table");

    itemTable.className = "table table-bordered";

    const itemHead = document.createElement("thead");

    const itemHeadRow = document.createElement("tr");

    ["Item", "Qty", "Price"].forEach(text => {

        const th = document.createElement("th");

        th.textContent = text;

        itemHeadRow.appendChild(th);
    });

    itemHead.appendChild(itemHeadRow);

    itemTable.appendChild(itemHead);

    const itemBody = document.createElement("tbody");

    if (report.Items) {

        report.Items.forEach(item => {

            const tr = document.createElement("tr");

            const tdItem = document.createElement("td");

            tdItem.textContent = item.Item.ItemName;

            const tdQty = document.createElement("td");

            tdQty.textContent = item.Quantity;

            const tdPrice = document.createElement("td");

            tdPrice.textContent = item.PriceSnapshot;

            tr.appendChild(tdItem);

            tr.appendChild(tdQty);

            tr.appendChild(tdPrice);

            itemBody.appendChild(tr);
        });
    }

    itemTable.appendChild(itemBody);

    modal.appendChild(itemTable);

    const closeBtn = document.createElement("button");

    closeBtn.className = "btn btn-danger mt-3";

    closeBtn.textContent = "Close";

    closeBtn.onclick = () => {

        modal.remove();

        backdrop.remove();
    };

    modal.appendChild(closeBtn);

    document.body.appendChild(backdrop);

    document.body.appendChild(modal);
}