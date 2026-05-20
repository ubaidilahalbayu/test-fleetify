function ItemRowComponent() {

    const wrapper = document.createElement("div");

    wrapper.className = "row mb-2 item-row";

    const itemCol = document.createElement("div");

    itemCol.className = "col-md-6";

    const itemSelect = document.createElement("select");

    itemSelect.className = "form-select item-select";

    AppState.masterItems.forEach(item => {

        const option = document.createElement("option");

        option.value = item.ID;

        option.textContent = `${item.ItemName} (${item.Type}) - Rp ${item.Price}`;

        itemSelect.appendChild(option);
    });

    itemCol.appendChild(itemSelect);

    const qtyCol = document.createElement("div");

    qtyCol.className = "col-md-3";

    const qtyInput = document.createElement("input");

    qtyInput.type = "number";

    qtyInput.min = "1";

    qtyInput.value = "1";

    qtyInput.className = "form-control qty-input";

    qtyCol.appendChild(qtyInput);

    const actionCol = document.createElement("div");

    actionCol.className = "col-md-3";

    const removeBtn = document.createElement("button");

    removeBtn.type = "button";

    removeBtn.className = "btn btn-danger w-100";

    removeBtn.textContent = "Remove";

    removeBtn.onclick = () => {
        wrapper.remove();
    };

    actionCol.appendChild(removeBtn);

    wrapper.appendChild(itemCol);
    wrapper.appendChild(qtyCol);
    wrapper.appendChild(actionCol);

    return wrapper;
}