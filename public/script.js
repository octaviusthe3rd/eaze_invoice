// Gets data from input fields in the UI
document.addEventListener('DOMContentLoaded', () => {
    const invoiceForm = document.getElementById('invoiceForm');
    const addItemButton = document.getElementById('addItem');
    const itemsDiv = document.getElementById('items');
    const previewButton = document.createElement('button');
    previewButton.type = 'button';
    previewButton.textContent = 'Preview Invoice';
    previewButton.classList.add('btn', 'btn-secondary');
    previewButton.style.marginLeft = '10px';

    // Event listener to add new items to the invoice
    addItemButton.addEventListener('click', () => {
        const newItem = document.createElement('div');
        newItem.classList.add('item');
        newItem.innerHTML = `
            <div class="form-group">
                <label>Item Name</label>
                <input type="text" name="name" required>
            </div>
            <div class="form-group">
                <label>Unit Cost</label>
                <input type="number" name="unit_cost" required>
            </div>
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" name="quantity" required>
            </div>
        `;
        itemsDiv.appendChild(newItem);
    });

    // Logic for preview modal creation
    const createPreviewModal = () => {
        const modal = document.createElement('div');
        modal.classList.add('preview-modal');
        modal.innerHTML = `
            <div class="preview-modal-content">
                <span class="close-preview">&times;</span>
                <h2>Invoice Preview</h2>
                <div id="previewDetails"></div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeButton = modal.querySelector('.close-preview');
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        return modal;
    };

    const previewModal = createPreviewModal();

    previewButton.addEventListener('click', () => {
        const formData = new FormData(invoiceForm);
        const previewDetailsDiv = document.getElementById('previewDetails');
        previewDetailsDiv.innerHTML = '';

        // Invoice details formatted according as to endpoint parameters
        const detailsHTML = `
            <div class="preview-section">
                <h3>Invoice Details</h3>
                <p><strong>Date:</strong> ${formData.get('date')}</p>
                <p><strong>From:</strong> ${formData.get('from')}</p>
                <p><strong>To:</strong> ${formData.get('to')}</p>
                <p><strong>Due Date:</strong> ${formData.get('due_date')}</p>
                <p><strong>Tax Rate:</strong> ${formData.get('tax')}%</p>
            </div>
            <div class="preview-section">
                <h3>Items</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Unit Cost</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody id="previewItems"></tbody>
                </table>
            </div>
        `;
        previewDetailsDiv.innerHTML = detailsHTML;

        // Adds items to the preview modal
        const itemRows = document.querySelectorAll('.item');
        const previewItemsBody = document.getElementById('previewItems');
        let subtotal = 0;

        itemRows.forEach(item => {
            const name = item.querySelector('[name="name"]').value;
            const unitCost = parseFloat(item.querySelector('[name="unit_cost"]').value);
            const quantity = parseInt(item.querySelector('[name="quantity"]').value);
            const total = unitCost * quantity;
            subtotal += total;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${name}</td>
                <td>$${unitCost.toFixed(2)}</td>
                <td>${quantity}</td>
                <td>$${total.toFixed(2)}</td>
            `;
            previewItemsBody.appendChild(row);
        });

        // Logic for tax and subTotal calculation
        const taxRate = parseFloat(formData.get('tax'));
        const taxAmount = subtotal * (taxRate / 100);
        const total = subtotal + taxAmount;

        const summaryHTML = `
            <div class="preview-section">
                <h3>Summary</h3>
                <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
                <p><strong>Tax (${taxRate}%):</strong> $${taxAmount.toFixed(2)}</p>
                <p><strong>Total:</strong> $${total.toFixed(2)}</p>
            </div>
        `;
        previewDetailsDiv.innerHTML += summaryHTML;

        previewModal.style.display = 'block';
    });

    // Adds the preview button next to Generate Invoice button
    const formActions = document.querySelector('.form-actions');
    formActions.appendChild(previewButton);

    // Listener for submit button
    invoiceForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Logic to create a request as required
        // It sends the request to the server to generate the invoice
        const formData = new FormData(invoiceForm);
        const items = [...document.querySelectorAll('.item')].map(item => ({
            name: item.querySelector('[name="name"]').value,
            unit_cost: item.querySelector('[name="unit_cost"]').value,
            quantity: item.querySelector('[name="quantity"]').value
        }));

        const data = {
            date: formData.get('date'),
            from: formData.get('from'),
            to: formData.get('to'),
            logo: formData.get('logo'),
            due_date: formData.get('due_date'),
            tax: formData.get('tax'),
            amount_paid: formData.get('amount_paid'),
            locale: formData.get('locale'),
            items
        };

        // Logic to send the request to the server
        try {
            const response = await fetch('/api/invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            // Logic to get thhe returned pdf and download it
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'invoice.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Error generating invoice:', error.message);
        }
    });
});