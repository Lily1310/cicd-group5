// document.addEventListener('DOMContentLoaded', async () => {
//     const ordersContainer = document.getElementById('orders-container');
//     const userId = parseInt(localStorage.getItem("userId"), 10); // Get userId from localStorage
//     const monthFilter = document.getElementById('month-filter');

//     if (!userId) {
//         alert('Please log in to view your order history.');
//         return;
//     }

//     let orders = [];

//     try {
//         // Fetch order history for the logged-in user
//         const response = await fetch(`/orderHistory/${userId}`);
//         orders = await response.json();

//         if (orders.length === 0) {
//             ordersContainer.innerHTML = '<p>No orders found.</p>';
//             return;
//         }

//         // Group orders by month and year (e.g., "December 2024")
//         const groupedOrders = orders.reduce((acc, order) => {
//             const orderDate = new Date(order.createdAt);
//             const monthYear = `${orderDate.toLocaleString('default', { month: 'long' })} ${orderDate.getFullYear()}`;

//             if (!acc[monthYear]) {
//                 acc[monthYear] = [];
//             }
//             acc[monthYear].push(order);
//             return acc;
//         }, {});

//         // Function to render orders for the selected month
//         function renderOrders(groupedOrders) {
//             ordersContainer.innerHTML = ''; // Clear previous orders

//             if (Object.keys(groupedOrders).length === 0) {
//                 ordersContainer.innerHTML = '<p>There are no orders for this month.</p>';
//                 return;
//             }

//             // Loop through grouped orders and generate HTML
//             for (const [monthYear, ordersInMonth] of Object.entries(groupedOrders)) {
//                 const orderDiv = document.createElement('div');
//                 orderDiv.classList.add('order-group');
//                 orderDiv.innerHTML = `
//                     <h2 class="order-date">${monthYear}</h2>
//                     <div class="order-items">
//                         ${ordersInMonth.map(order => {
//                             return `
//                                 <div class="order-item">
//                                     <ul>
//                                         ${order.products.map(product => {
//                                             const productName = product.productName;
//                                             const productPrice = product.productPrice;
//                                             const productDescription = product.productDescription;
//                                             const quantity = product.quantity;

//                                             return `
//                                                 <li class="product">
//                                                     <strong>${productName}</strong> - ${productDescription}<br>
//                                                     Price: $${productPrice}<br>
//                                                     Quantity: ${quantity}
//                                                 </li>
//                                             `;
//                                         }).join('')}
//                                     </ul>
//                                 </div>
//                             `;
//                         }).join('')}
//                     </div>
//                 `;
//                 ordersContainer.appendChild(orderDiv);
//             }
//         }

//         // Initially render all orders
//         renderOrders(groupedOrders);

//         // Filter orders based on selected month
//         monthFilter.addEventListener('change', () => {
//             const selectedMonth = parseInt(monthFilter.value, 10);

//             // If "Select Month" (empty value) is selected, render all orders
//             if (selectedMonth === '' || selectedMonth === -1) {
//                 renderOrders(groupedOrders); // Render all orders without filtering
//                 return;
//             }

//             // Filter orders by the selected month
//             const filteredOrders = Object.entries(groupedOrders).reduce((acc, [monthYear, ordersInMonth]) => {
//                 const [month, year] = monthYear.split(' ');
//                 const orderMonth = new Date(`${month} 1, ${year}`).getMonth();

//                 if (orderMonth === selectedMonth) {
//                     acc[monthYear] = ordersInMonth;
//                 }

//                 return acc;
//             }, {});

//             // Render filtered orders
//             renderOrders(filteredOrders);
//         });

//     } catch (error) {
//         console.error('Error fetching order history:', error);
//         alert('Failed to load order history. Please try again later.');
//     }
// });


document.addEventListener('DOMContentLoaded', async () => {
    const ordersContainer = document.getElementById('orders-container');
    const userId = parseInt(localStorage.getItem("userId"), 10); // Get userId from localStorage
    const monthFilter = document.getElementById('month-filter');

    if (!userId) {
        alert('Please log in to view your order history.');
        return;
    }

    let orders = [];

    try {
        // Fetch order history for the logged-in user
        const response = await fetch(`/orderHistory/${userId}`);
        orders = await response.json();

        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p>No orders found.</p>';
            return;
        }

        // Group orders by month and year (e.g., "December 2024")
        const groupedOrders = orders.reduce((acc, order) => {
            const orderDate = new Date(order.createdAt);
            const monthYear = `${orderDate.toLocaleString('default', { month: 'long' })} ${orderDate.getFullYear()}`;

            if (!acc[monthYear]) {
                acc[monthYear] = [];
            }
            acc[monthYear].push(order);
            return acc;
        }, {});

        // Function to render orders for the selected month
        function renderOrders(groupedOrders) {
            ordersContainer.innerHTML = ''; // Clear previous orders

            if (Object.keys(groupedOrders).length === 0) {
                ordersContainer.innerHTML = '<p>There are no orders for this month.</p>';
                return;
            }

            // Loop through grouped orders and generate HTML
            for (const [monthYear, ordersInMonth] of Object.entries(groupedOrders)) {
                const orderDiv = document.createElement('div');
                orderDiv.classList.add('order-group');
                orderDiv.innerHTML = `
                    <h2 class="order-date">${monthYear}</h2>
                    <div class="order-items">
                        ${ordersInMonth.map(order => {
                            return `
                                <div class="order-item">
                                    <ul>
                                        ${order.products.map(product => {
                                            const productName = product.productName;
                                            const productPrice = product.productPrice;
                                            const productDescription = product.productDescription;
                                            const quantity = product.quantity;

                                            // Format the order date (e.g., "12 Dec 2024")
                                            const orderDate = new Date(order.createdAt);
                                            const formattedDate = orderDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

                                            return `
                                                <li class="product">
                                                    <strong>${productName}</strong> - ${productDescription}<br>
                                                    Price: $${productPrice}<br>
                                                    Quantity: ${quantity}<br>
                                                    Ordered Date: ${formattedDate}
                                                </li>
                                            `;
                                        }).join('')}
                                    </ul>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
                ordersContainer.appendChild(orderDiv);
            }
        }

        // Initially render all orders
        renderOrders(groupedOrders);

        // Filter orders based on selected month
        monthFilter.addEventListener('change', () => {
            const selectedMonth = parseInt(monthFilter.value, 10);

            // If "Select Month" (empty value) is selected, render all orders
            if (selectedMonth === '' || selectedMonth === -1) {
                renderOrders(groupedOrders); // Render all orders without filtering
                return;
            }

            // Filter orders by the selected month
            const filteredOrders = Object.entries(groupedOrders).reduce((acc, [monthYear, ordersInMonth]) => {
                const [month, year] = monthYear.split(' ');
                const orderMonth = new Date(`${month} 1, ${year}`).getMonth();

                if (orderMonth === selectedMonth) {
                    acc[monthYear] = ordersInMonth;
                }

                return acc;
            }, {});

            // Render filtered orders
            renderOrders(filteredOrders);
        });

    } catch (error) {
        console.error('Error fetching order history:', error);
        alert('Failed to load order history. Please try again later.');
    }
});
