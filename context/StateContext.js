import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast';

const Context = createContext()

export const StateContext = ({ children }) => {
    const getLocalStorage = (name) => {
        if (typeof window !== 'undefined') {
            const storage = localStorage.getItem(name);

            if (storage) return JSON.parse(localStorage.getItem(name));

            if (name === 'cartItems') return [];

            return 0;
        }
    };

    const [showCart, setShowCart] = useState(false)
    const [cartItems, setCartItems] = useState(getLocalStorage('cartItems'));
    const [totalPrice, setTotalPrice] = useState(getLocalStorage('totalPrice'));
    const [totalQuantities, setTotalQuantities] = useState(getLocalStorage('totalQuantities'));
    const [qty, setQty] = useState(1)

    let foundProduct;
    let index;

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
        localStorage.setItem('totalQuantities', JSON.stringify(totalQuantities));
    }, [cartItems, totalPrice, totalQuantities]);

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find(item => item._id === product._id)

        setTotalPrice(prevTotalPrice => prevTotalPrice + product.price * quantity)
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities + quantity)

        if (checkProductInCart) {
            const updatedCartItems = cartItems.map(cartProduct => {
                if (cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })

            setCartItems(updatedCartItems)
        } else {
            product.quantity = quantity

            setCartItems([...cartItems, { ...product }])
        }

        toast.success(`${qty} ${product.name} added to the cart`)
    }

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id)
        index = cartItems.findIndex((item) => item._id === id)
        const newCartFilteredItem = cartItems.filter((item) => item._id !== id)

        if (value === 'inc') {
            let newCartItems = [...newCartFilteredItem, { ...foundProduct, quantity: foundProduct.quantity += 1 }]
            setCartItems(newCartItems)
            setTotalPrice((prevTotalPrice => prevTotalPrice + foundProduct.price))
            setTotalQuantities((prevTotalQuantities => prevTotalQuantities + 1))
        } else if (value === 'dec') {
            if (foundProduct.quantity > 1) {
                let newCartItems = [...newCartFilteredItem, { ...foundProduct, quantity: foundProduct.quantity -= 1 }]
                setCartItems(newCartItems)
                setTotalPrice((prevTotalPrice => prevTotalPrice - foundProduct.price))
                setTotalQuantities((prevTotalQuantities => prevTotalQuantities - 1))
            }
        }
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id)
        index = cartItems.findIndex((item) => item._id === product._id)
        const newCartFilteredItem = cartItems.filter((item) => item._id !== product._id)

        setTotalPrice(prevTotalPrice => prevTotalPrice - foundProduct.price * foundProduct.quantity)
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity)
        setCartItems(newCartFilteredItem)
    }

    const incQty = () => {
        setQty((prevQty) => prevQty + 1)
    }

    const decQty = () => {
        setQty((oldQty) => {
            let tempQty = oldQty - 1;
            if (tempQty < 1) {
                tempQty = 1;
            }
            return tempQty;
        });
    }

    return (
        <Context.Provider
            value={{
                showCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                setShowCart,
                showCart,
                toggleCartItemQuantity,
                onRemove,
                setTotalPrice,
                setTotalQuantities,
                setCartItems
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context) 