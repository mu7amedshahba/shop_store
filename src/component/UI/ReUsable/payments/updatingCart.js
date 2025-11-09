// check with stock
// exist item
//

const handleAddNewItem = (newItem, count, stock, setCount, quantity, setQuantity) => {

    // getItems
    const products = JSON.parse(localStorage.getItem("product")) || [];
    const existItem = products.some((item) => item.id == newItem.id);
    const currentItem = products.findIndex((item) => item.id == newItem.id);

    let updatedProducts = [...products]
    if (currentItem !== -1) {
        return updatedProducts.map((item, index) => {
            index === currentItem ? {
                ...item,
                count: (item.count || 0) + 1,
                quantity: (item.quantity || 0) + 1
            }
                : item
        })
    }
    return [
        ...products,
        {
            ...newItem,
            count: 1,
            quantity: 1
        }
    ]

}






const allowedCount = Math.min(count, stock)







const handleAddItem = async (cartItems, count, stock, setCount, quantity) => {
    try {
        setIsAddingToCart(true);
        const cartItems = JSON.parse(localStorage.getItem("product")) || [];
        setError(null);

        // Validate stock
        if (count > stock) {
            const errorMsg = `Cannot add ${count} items (only ${stock} available)`;
            setError(errorMsg);
            return;
        }

        let updatedCount = count;

        const existingItemIndex = cartItems.findIndex((item) => item.id == id);
        if (existingItemIndex !== -1) {
            // Calculate new count for existing item
            updatedCount = Math.min(
                (cartItems[existingItemIndex].count || 0) + (quantity || 1),
                stock
            );

            cartItems[existingItemIndex] = {
                ...cartItems[existingItemIndex],
                count: updatedCount
            };
        } else {
            // Set count for new item
            updatedCount = Math.min(count || 1, stock);
            cartItems.push({
                ...product,
                count: updatedCount
            });
        }

        localStorage.setItem("product", JSON.stringify(cartItems));
        setCount(updatedCount);
        setError(null);

        // Success feedback
        setTimeout(() => setIsAddingToCart(false), 1000);
    } catch (error) {
        console.error("Cart error:", error);
        setError("Failed to update cart. Please try again.");
        setIsAddingToCart(false);
    }
};
