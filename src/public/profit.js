// Function to fetch and display recent orders
function populateRecentOrders() {
    fetch(`${apiUrl}/orders/recent`)
      .then((response) => response.json())
      .then((orders) => {
        const tableBody = document.getElementById('recentOrdersTableBody');
        tableBody.innerHTML = ''; // Clear existing rows
  
        orders.forEach((order) => {
          const row = document.createElement('tr');
  
          // Order ID
          const idCell = document.createElement('td');
          idCell.textContent = order.id;
          row.appendChild(idCell);
  
          // Customer Name
          const customerCell = document.createElement('td');
          customerCell.textContent = order.customer.name;
          row.appendChild(customerCell);
  
          // Status
          const statusCell = document.createElement('td');
          statusCell.textContent = order.status.text;
          row.appendChild(statusCell);
  
          // Actions (Change Status button)
          const actionsCell = document.createElement('td');
          const changeButton = document.createElement('button');
          changeButton.textContent = 'Change Status';
          changeButton.onclick = () => openChangeStatusModal(order.id, order.status.id);
          actionsCell.appendChild(changeButton);
          row.appendChild(actionsCell);
  
          tableBody.appendChild(row);
        });
      })
      .catch((error) => console.error('Error fetching recent orders:', error));
  }
  
  // Function to open the change status modal
  function openChangeStatusModal(orderId, currentStatusId) {
    const modal = document.getElementById('changeStatusModal');
    const statusSelect = document.getElementById('statusSelect');
    const saveButton = document.getElementById('saveStatusButton');
  
    // Populate status options
    fetch(`${apiUrl}/statuses`)
      .then((response) => response.json())
      .then((statuses) => {
        statusSelect.innerHTML = ''; // Clear existing options
        statuses.forEach((status) => {
          const option = document.createElement('option');
          option.value = status.id;
          option.textContent = status.text;
          if (status.id === currentStatusId) option.selected = true; // Pre-select current status
          statusSelect.appendChild(option);
        });
      })
      .catch((error) => console.error('Error fetching statuses:', error));
  
    // Save button logic
    saveButton.onclick = () => {
      const newStatusId = +statusSelect.value;
      updateOrderStatus(orderId, newStatusId);
      modal.style.display = 'none'; // Close modal
    };
  
    modal.style.display = 'block'; // Show modal
  }
  
  // Function to update order status
  function updateOrderStatus(orderId, newStatusId) {
    fetch(`${apiUrl}/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ statusId: newStatusId }),
    })
      .then(() => {
        populateRecentOrders(); // Refresh the recent orders table
      })
      .catch((error) => console.error('Error updating order status:', error));
  }
  
  // Event listener for DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    populateRecentOrders();
  });  

// Revenue Over Time (Line Chart)
const ctxRevenue = document.getElementById('revenueChart').getContext('2d');
const revenueChart = new Chart(ctxRevenue, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: 'Revenue ($)',
            data: [10000, 20000, 15000, 30000, 25000, 40000, 35000],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: true
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Revenue Growth' }
        }
    }
});

// Sales by Category (Bar Chart)
const ctxSalesCategory = document.getElementById('salesByCategoryChart').getContext('2d');
const salesByCategoryChart = new Chart(ctxSalesCategory, {
    type: 'bar',
    data: {
        labels: ['Electronics', 'Clothing', 'Home & Garden', 'Beauty', 'Sports'],
        datasets: [{
            label: 'Sales ($)',
            data: [15000, 12000, 8000, 7000, 10000],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Sales by Category' }
        }
    }
});

// Orders by Status (Pie Chart)
const ctxOrdersStatus = document.getElementById('ordersByStatusChart').getContext('2d');
const ordersByStatusChart = new Chart(ctxOrdersStatus, {
    type: 'pie',
    data: {
        labels: ['Completed', 'Pending', 'Cancelled'],
        datasets: [{
            label: 'Orders by Status',
            data: [2000, 1000, 500],
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(255, 99, 132, 0.6)'
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Orders by Status' }
        }
    }
});

// Profit Margin (Doughnut Chart)
const ctxProfitMargin = document.getElementById('profitMarginChart').getContext('2d');
const profitMarginChart = new Chart(ctxProfitMargin, {
    type: 'doughnut',
    data: {
        labels: ['Profit', 'Costs'],
        datasets: [{
            label: 'Profit Margin',
            data: [70, 30], // Replace with real profit margin data
            backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 99, 132, 0.6)'
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Profit Margin' }
        }
    }
});
