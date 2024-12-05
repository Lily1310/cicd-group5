const prisma = require('./prismaClient');

module.exports.getOrderHistory = async function getOrderHistory(userId) {
    try {
        const orders = await prisma.order.findMany({
            where: {
                personId: userId,  // Using personId (userId) to fetch the orders
            },
            include: {
                orderItems: {
                    include: {
                        product: true,  // Include product details for each order item
                    }
                }
            },
        });

        // Format the order data to include sessionId, createdAt, and product details
        const formattedOrders = orders.map(order => ({
            sessionId: order.sessionId,
            createdAt: order.createdAt,
            products: order.orderItems.map(item => ({
                productName: item.product.name,
                productPrice: item.product.unitPrice,
                productDescription: item.product.description,
                quantity: item.quantity,
            }))
        }));

        // Return the formatted orders data
        return formattedOrders;
    } catch (error) {
        console.error('Error fetching order history:', error);
        throw error; 
    }
}