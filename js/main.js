document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#sales-table tbody");
    const addRowButton = document.querySelector("#add-row");
    const removeRowButton = document.querySelector("#remove-row");
    const totalQuantityElement = document.querySelector("#total-quantity");
    const totalSumElement = document.querySelector("#total-sum");

    function updateRowNumbers() {
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach((row, index) => {
            row.querySelector(".row-number").textContent = index + 1;
        });
    }

    function calculateTotal(row) {
        const quantity = parseFloat(row.querySelector(".quantity").value) || 0;
        const price = parseFloat(row.querySelector(".price").value) || 0;
        const totalCell = row.querySelector(".total");
        totalCell.textContent = (quantity * price).toFixed(2);
    }

    function updateOverallTotals() {
        const rows = tableBody.querySelectorAll("tr");
        let totalQuantity = 0;
        let totalSum = 0;

        rows.forEach(row => {
            totalQuantity += parseFloat(row.querySelector(".quantity").value) || 0;
            totalSum += parseFloat(row.querySelector(".total").textContent) || 0;
        });

        totalQuantityElement.textContent = totalQuantity;
        totalSumElement.textContent = totalSum.toFixed(2);
    }

    function saveToLocalStorage() {
        const rowsData = [];
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach(row => {
            rowsData.push({
                clientName: row.querySelector(".client-name").value,
                quantity: row.querySelector(".quantity").value,
                price: row.querySelector(".price").value,
                total: row.querySelector(".total").textContent
            });
        });
        localStorage.setItem("salesTable", JSON.stringify(rowsData));
    }

    function loadFromLocalStorage() {
        const rowsData = JSON.parse(localStorage.getItem("salesTable")) || [];
        tableBody.innerHTML = "";
        rowsData.forEach((data, index) => {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td class="row-number">${index + 1}</td>
                <td><input type="text" class="client-name" value="${data.clientName}"></td>
                <td><input type="number" class="quantity" min="0" value="${data.quantity}"></td>
                <td><input type="number" class="price" min="0" value="${data.price}"></td>
                <td class="total">${data.total}</td>
            `;

            newRow.querySelector(".quantity").addEventListener("input", () => {
                calculateTotal(newRow);
                saveToLocalStorage();
                updateOverallTotals();
            });
            newRow.querySelector(".price").addEventListener("input", () => {
                calculateTotal(newRow);
                saveToLocalStorage();
                updateOverallTotals();
            });
            newRow.querySelector(".client-name").addEventListener("input", saveToLocalStorage);

            tableBody.appendChild(newRow);
        });
        if (rowsData.length === 0) addRow();
        updateRowNumbers();
        updateOverallTotals();
    }

    function addRow() {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td class="row-number"></td>
            <td><input type="text" class="client-name"></td>
            <td><input type="number" class="quantity" min="0" value="0"></td>
            <td><input type="number" class="price" min="0" value="130"></td>
            <td class="total">0</td>
        `;

        newRow.querySelector(".quantity").addEventListener("input", () => {
            calculateTotal(newRow);
            saveToLocalStorage();
            updateOverallTotals();
        });
        newRow.querySelector(".price").addEventListener("input", () => {
            calculateTotal(newRow);
            saveToLocalStorage();
            updateOverallTotals();
        });
        newRow.querySelector(".client-name").addEventListener("input", saveToLocalStorage);

        tableBody.appendChild(newRow);
        updateRowNumbers();
        saveToLocalStorage();
        updateOverallTotals();
    }

    function removeRow() {
        const rows = tableBody.querySelectorAll("tr");
        if (rows.length > 1) {
            tableBody.removeChild(rows[rows.length - 1]);
            updateRowNumbers();
            saveToLocalStorage();
            updateOverallTotals();
        }
    }

    tableBody.querySelector(".quantity").addEventListener("input", (e) => {
        calculateTotal(e.target.closest("tr"));
        saveToLocalStorage();
        updateOverallTotals();
    });
    tableBody.querySelector(".price").addEventListener("input", (e) => {
        calculateTotal(e.target.closest("tr"));
        saveToLocalStorage();
        updateOverallTotals();
    });
    tableBody.querySelector(".client-name").addEventListener("input", saveToLocalStorage);

    addRowButton.addEventListener("click", addRow);
    removeRowButton.addEventListener("click", removeRow);

    loadFromLocalStorage();
});
