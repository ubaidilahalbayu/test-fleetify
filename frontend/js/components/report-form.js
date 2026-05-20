async function ReportFormComponent() {

    const wrapper = document.createElement("div");

    wrapper.className = "card";

    const body = document.createElement("div");

    body.className = "card-body";

    const title = document.createElement("h5");

    title.textContent = "Create Maintenance Report";

    body.appendChild(title);

    const vehicleGroup = document.createElement("div");

    vehicleGroup.className = "mb-3";

    const vehicleLabel = document.createElement("label");

    vehicleLabel.textContent = "Vehicle";

    vehicleLabel.className = "form-label";

    const vehicleSelect = document.createElement("select");

    vehicleSelect.className = "form-select";

    AppState.vehicles.forEach(vehicle => {

        const option = document.createElement("option");

        option.value = vehicle.ID;

        option.textContent = `${vehicle.LicensePlate} - ${vehicle.Model}`;

        vehicleSelect.appendChild(option);
    });

    vehicleGroup.appendChild(vehicleLabel);

    vehicleGroup.appendChild(vehicleSelect);

    body.appendChild(vehicleGroup);

    const odometerGroup = document.createElement("div");

    odometerGroup.className = "mb-3";

    const odometerLabel = document.createElement("label");

    odometerLabel.textContent = "Odometer";

    odometerLabel.className = "form-label";

    const odometerInput = document.createElement("input");

    odometerInput.type = "number";

    odometerInput.className = "form-control";

    odometerInput.placeholder = "Input odometer";

    odometerGroup.appendChild(odometerLabel);

    odometerGroup.appendChild(odometerInput);

    body.appendChild(odometerGroup);

    const complaintGroup = document.createElement("div");

    complaintGroup.className = "mb-3";

    const complaintLabel = document.createElement("label");

    complaintLabel.textContent = "Complaint";

    complaintLabel.className = "form-label";

    const complaintInput = document.createElement("textarea");

    complaintInput.className = "form-control";

    complaintInput.rows = 3;

    complaintInput.placeholder = "Input complaint";

    complaintGroup.appendChild(complaintLabel);

    complaintGroup.appendChild(complaintInput);

    body.appendChild(complaintGroup);

    const photoGroup = document.createElement("div");

    photoGroup.className = "mb-3";

    const photoLabel = document.createElement("label");

    photoLabel.textContent = "Initial Photo";

    photoLabel.className = "form-label";

    const photoInput = document.createElement("input");

    photoInput.type = "file";

    photoInput.accept = "image/*";

    // buka kamera hp
    photoInput.capture = "environment";

    photoInput.className = "form-control";

    const previewImage = document.createElement("img");

    previewImage.className = "img-fluid rounded mt-3 d-none";

    previewImage.style.maxHeight = "250px";

    let selectedPhoto = null;

    photoInput.onchange = (e) => {

        const file = e.target.files[0];

        if (!file) {
            return;
        }

        selectedPhoto = file;

        const reader = new FileReader();

        reader.onload = function(event) {

            previewImage.src = event.target.result;

            previewImage.classList.remove("d-none");
        };

        reader.readAsDataURL(file);
    };

    photoGroup.appendChild(photoLabel);

    photoGroup.appendChild(photoInput);

    photoGroup.appendChild(previewImage);

    body.appendChild(photoGroup);

    const itemTitle = document.createElement("h6");

    itemTitle.textContent = "Items";

    itemTitle.className = "mt-4";

    body.appendChild(itemTitle);

    const itemContainer = document.createElement("div");

    itemContainer.className = "mb-3";

    itemContainer.appendChild(ItemRowComponent());

    body.appendChild(itemContainer);

    const addItemBtn = document.createElement("button");

    addItemBtn.type = "button";

    addItemBtn.className = "btn btn-secondary mb-3";

    addItemBtn.textContent = "Add Item";

    addItemBtn.onclick = () => {

        const itemRow = ItemRowComponent();

        itemContainer.appendChild(itemRow);
    };

    body.appendChild(addItemBtn);

    const buttonWrapper = document.createElement("div");

    buttonWrapper.className = "d-flex gap-2 mt-3";

    const submitBtn = document.createElement("button");

    submitBtn.className = "btn btn-primary";

    submitBtn.textContent = "Submit";

    submitBtn.onclick = async () => {

        if (!selectedPhoto) {

            alert("Photo required");

            return;
        }

        const items = getReportItems();

        const formData = new FormData();

        formData.append(
            "vehicle_id",
            vehicleSelect.value
        );

        formData.append(
            "odometer",
            odometerInput.value
        );

        formData.append(
            "complaint",
            complaintInput.value
        );

        formData.append(
            "photo",
            selectedPhoto
        );

        formData.append(
            "items",
            JSON.stringify(items)
        );

        try {

            const response = await apiFetch(
                "/reports",
                {
                    method: "POST",
                    body: formData
                }
            );

            alert(response.message);

            renderPage("history");

        } catch (error) {

            console.error(error);

            alert("Failed create report");
        }
    };

    const clearBtn = document.createElement("button");

    clearBtn.className = "btn btn-danger";

    clearBtn.textContent = "Clear";

    clearBtn.onclick = () => {

        odometerInput.value = "";

        complaintInput.value = "";

        photoInput.value = "";

        previewImage.src = "";

        previewImage.classList.add("d-none");

        selectedPhoto = null;

        itemContainer.replaceChildren();

        itemContainer.appendChild(ItemRowComponent());
    };

    buttonWrapper.appendChild(submitBtn);

    buttonWrapper.appendChild(clearBtn);

    body.appendChild(buttonWrapper);

    wrapper.appendChild(body);

    return wrapper;
}

function getReportItems() {

    const rows = document.querySelectorAll(".item-row");

    const items = [];

    rows.forEach(row => {

        const itemSelect = row.querySelector(".item-select");

        const qtyInput = row.querySelector(".qty-input");

        items.push({
            item_id: Number(itemSelect.value),
            quantity: Number(qtyInput.value)
        });
    });

    return items;
}