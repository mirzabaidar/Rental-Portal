// DOM Elements
const bookButtons = document.querySelectorAll('.book-btn');
const rentalStatus = document.getElementById('rentalStatus');

// Item prices (PKR per day)
const itemPrices = {
    'Car': 5000,
    'Camera': 2000,
    'Guest House': 8000,
    'Flat': 6000
};

// Create Booking Form
function createBookingForm(itemName) {
    // Remove any existing form
    closeBookingForm();

    const form = document.createElement('div');
    form.className = 'booking-form-overlay';
    form.innerHTML = `
        <div class="booking-form-container">
            <h3><i class="fas fa-calendar-plus"></i> Book ${itemName}</h3>
            <form id="quickBookingForm">
                <div class="form-group">
                    <label for="quickDate"><i class="fas fa-calendar"></i> Booking Date:</label>
                    <input type="date" id="quickDate" required>
                </div>
                <div class="form-group">
                    <label for="quickDays"><i class="fas fa-clock"></i> Days to Rent:</label>
                    <input type="number" id="quickDays" min="1" value="1" required>
                </div>
                <div class="form-group">
                    <label for="quickDeposit"><i class="fas fa-money-bill-wave"></i> Deposit Amount (PKR):</label>
                    <input type="number" id="quickDeposit" min="0" value="0" required>
                </div>
                <div class="form-group">
                    <label for="quickTotal"><i class="fas fa-calculator"></i> Total Amount:</label>
                    <input type="text" id="quickTotal" readonly>
                </div>
                <div class="form-buttons">
                    <button type="submit" class="btn-primary">
                        <i class="fas fa-check"></i> Confirm Booking
                    </button>
                    <button type="button" class="btn-secondary" onclick="closeBookingForm()">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(form);
    
    // Initialize date input
    const dateInput = form.querySelector('#quickDate');
    const today = new Date();
    dateInput.min = today.toISOString().split('T')[0];
    dateInput.value = today.toISOString().split('T')[0];
    
    // Add event listeners for total calculation
    const daysInput = form.querySelector('#quickDays');
    const depositInput = form.querySelector('#quickDeposit');
    
    const updateTotal = () => {
        form.querySelector('#quickTotal').value = calculateTotal(itemName, daysInput.value, depositInput.value);
    };
    
    daysInput.addEventListener('input', updateTotal);
    depositInput.addEventListener('input', updateTotal);
    
    // Calculate initial total
    updateTotal();
    
    // Handle form submission
    form.querySelector('#quickBookingForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const date = dateInput.value;
        const days = daysInput.value;
        const deposit = depositInput.value;
        
        if (!date || !days || !deposit) {
            alert('Please fill in all fields');
            return;
        }
        
        // Add to rental status
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${itemName}</td>
            <td>${date}</td>
            <td>${days}</td>
            <td>PKR ${parseInt(deposit).toLocaleString()}</td>
            <td>
                <button class="btn-primary" onclick="returnItem(this)">
                    <i class="fas fa-undo"></i> Return
                </button>
            </td>
        `;
        rentalStatus.appendChild(newRow);
        
        // Update item status
        updateItemStatus(itemName, false);
        
        // Close form and show success message
        closeBookingForm();
        alert('Item booked successfully!');
    });
}

// Close Booking Form
function closeBookingForm() {
    const form = document.querySelector('.booking-form-overlay');
    if (form) {
        form.remove();
    }
}

// Calculate total amount
function calculateTotal(item, days, deposit) {
    if (item && days) {
        const price = itemPrices[item];
        const total = (price * parseInt(days)) + (parseInt(deposit) || 0);
        return `PKR ${total.toLocaleString()}`;
    }
    return '';
}

// Return Item Function
function returnItem(button) {
    const row = button.closest('tr');
    const item = row.cells[0].textContent;
    
    // Remove from rental status
    row.remove();
    
    // Update item status in inventory
    updateItemStatus(item, true);
    
    // Show success message
    alert('Item returned successfully!');
}

// Update Item Status in Inventory
function updateItemStatus(itemName, isAvailable) {
    const inventoryItems = document.querySelectorAll('.inventory-item');
    inventoryItems.forEach(item => {
        const itemTitle = item.querySelector('h3').textContent.trim();
        if (itemTitle === itemName) {
            const statusSpan = item.querySelector('.status');
            const bookBtn = item.querySelector('.book-btn');
            
            if (isAvailable) {
                statusSpan.className = 'status available';
                statusSpan.innerHTML = '<i class="fas fa-check-circle"></i> Available';
                bookBtn.disabled = false;
                bookBtn.style.opacity = '1';
            } else {
                statusSpan.className = 'status';
                statusSpan.innerHTML = '<i class="fas fa-times-circle"></i> Booked';
                bookBtn.disabled = true;
                bookBtn.style.opacity = '0.5';
            }
        }
    });
}

// Book Now Button Handling
bookButtons.forEach(button => {
    button.addEventListener('click', () => {
        const itemName = button.getAttribute('data-item');
        createBookingForm(itemName);
    });
});

// Close booking form when clicking outside
document.addEventListener('click', (e) => {
    const form = document.querySelector('.booking-form-overlay');
    if (form && !form.contains(e.target) && !e.target.classList.contains('book-btn')) {
        closeBookingForm();
    }
});
