import React, { useEffect, useState } from "react";
import {
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} from "../services/cartService";
import gif from "../assets/shopping-cart.gif";


export default function Cart() {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(true);
    

    // Get cart
    const loadCart = async () => {
        try {
            const data = await getCart();
            setCart(data.cart || { items: [] });
        } catch (error) {
            console.error("Error loading cart:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    // Increase / decrease quantity
    const changeQuantity = async (productId, quantity) => {
        if (quantity < 1) return;

        try {
            const data = await updateCartItem(productId, quantity);
            console.log("Updated cart:", data.cart);
            setCart(data.cart);

        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Unable to update quantity"
            );
        }
    };

    // Remove item
    const handleRemove = async (productId) => {
        try {
            const data = await removeFromCart(productId);
            setCart(data.cart);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Unable to remove product"
            );
        }
    };

    // Clear cart
    const handleClearCart = async () => {
        try {
            const data = await clearCart();
            setCart(data.cart);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Unable to clear cart"
            );
        }
    };

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg">
                    Loading cart...
                </p>
            </div>
        );
    }

    const items = cart?.items || [];

    // Empty cart
    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
                <div className="text-6xl mb-5">
                    <img className="h-25" src={gif} alt="Shopping Cart" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900">
                    Your Cart is Empty
                </h1>

                <p className="text-gray-500 mt-2 text-center">
                    Looks like you haven't added anything to your cart yet.
                </p>

                <button
                    className="mt-6 bg-[#ff6547] text-white px-7 py-3 rounded-full font-semibold hover:bg-[#f5573a] transition"
                    onClick={() => (window.location.href = "/")}
                >
                    Explore Products
                </button>
            </div>
        );
    }

    // Calculate subtotal
    const subtotal = items.reduce((total, item) => {
        const product = item.product;

        const finalPrice =
            product.price -
            (product.price * product.discount) / 100;

        return total + finalPrice * item.quantity;
    }, 0);

    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const total = subtotal + deliveryFee;

    return (
        <div className="min-h-screen bg-[#fffaf8] px-5 md:px-10 lg:px-20 py-10">

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    Your Cart
                </h1>

                <p className="text-gray-500 mt-2">
                    {items.length}{" "}
                    {items.length === 1 ? "item" : "items"} in your cart
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">

                    {/* Clear Cart */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleClearCart}
                            className="text-sm text-red-500 hover:text-red-600 font-medium"
                        >
                            Clear Cart
                        </button>
                    </div>

                    {items.map((item) => {
                        const product = item.product;

                        const finalPrice =
                            product.price -
                            (product.price * product.discount) / 100;

                        return (
                            <div
                                key={product._id}
                                className="bg-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-5"
                            >

                                {/* Product Image */}
                                <img
                                    src={product.images?.[0]}
                                    alt={product.name}
                                    className="w-full sm:w-32 h-32 object-cover rounded-xl"
                                />

                                {/* Product Details */}
                                <div className="flex-1">

                                    <div className="flex justify-between gap-4">
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                {product.name}
                                            </h2>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {product.category}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() =>
                                                handleRemove(product._id)
                                            }
                                            className="text-gray-400 hover:text-red-500 text-xl"
                                            title="Remove"
                                        >
                                            ×
                                        </button>
                                    </div>

                                    {/* Price */}
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="text-lg font-bold text-[#ff6547]">
                                            ₹{finalPrice.toFixed(2)}
                                        </span>

                                        {product.discount > 0 && (
                                            <>
                                                <span className="text-sm text-gray-400 line-through">
                                                    ₹{product.price.toFixed(2)}
                                                </span>

                                                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                                    {product.discount}% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Quantity */}
                                    <div className="flex items-center justify-between mt-5">

                                        <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">

                                            <button
                                                onClick={() =>
                                                    changeQuantity(
                                                        product._id,
                                                        item.quantity - 1
                                                    )
                                                }
                                                disabled={item.quantity <= 1}
                                                className="w-9 h-9 text-lg hover:bg-gray-100 disabled:text-gray-300"
                                            >
                                                −
                                            </button>

                                            <span className="w-10 text-center font-medium">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    changeQuantity(
                                                        product._id,
                                                        item.quantity + 1
                                                    )
                                                }
                                                disabled={
                                                    item.quantity >=
                                                    product.stock
                                                }
                                                className="w-9 h-9 text-lg hover:bg-gray-100 disabled:text-gray-300"
                                            >
                                                +
                                            </button>

                                        </div>

                                        {/* Item total */}
                                        <p className="font-bold text-gray-900">
                                            ₹
                                            {(
                                                finalPrice *
                                                item.quantity
                                            ).toFixed(2)}
                                        </p>

                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Order Summary */}
                <div>
                    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">

                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            Order Summary
                        </h2>

                        <div className="space-y-4 text-sm">

                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Subtotal
                                </span>

                                <span className="font-medium">
                                    ₹{subtotal.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Delivery Fee
                                </span>

                                <span className="font-medium">
                                    {deliveryFee === 0
                                        ? "FREE"
                                        : `₹${deliveryFee}`}
                                </span>
                            </div>

                        </div>

                        <div className="border-t border-gray-100 my-5" />

                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold">
                                Total
                            </span>

                            <span className="text-2xl font-bold text-[#ff6547]">
                                ₹{total.toFixed(2)}
                            </span>
                        </div>

                        <button
                            className="w-full mt-6 bg-[#ff6547] hover:bg-[#f5573a] text-white py-3.5 rounded-full font-semibold transition"
                            onClick={() =>
                                (window.location.href = "/checkout")
                            }
                        >
                            Proceed to Checkout
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-4">
                            Secure checkout • Fast delivery
                        </p>

                    </div>
                </div>

            </div>
        </div>
    );
}