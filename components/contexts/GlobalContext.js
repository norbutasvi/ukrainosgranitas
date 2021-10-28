import React, { useContext, useState, useEffect } from 'react';
import { Pagination } from 'swiper';

export const GlobalContext = React.createContext();

export function GlobalContextProvider({ children }) {
    const [items, setItems] = useState([]);

    // SET INITIAL DATA FROM LOCALSTORAGE
    useEffect(() => {
            const localStorageItems = localStorage.getItem('items');
    
            let items = [];
            if (localStorageItems) {
                items = JSON.parse(localStorageItems);
            }
    
            setItems(items);
    }, [])

    // LISTEN FOR CHANGES IN THE CART AND SET LOCAL STORAGE
    useEffect(() => {
        localStorage.setItem('items', JSON.stringify(items));
    }, [items])

    const addToCart = (item) => {
        setItems([...items, item]);
    }

    const getItemsCount = () => {
        let count = 0;
        items.forEach(item => {
            count += item.quantity;
        })

        return count;
    }

    const deleteItem = (id) => {
        const array = items.filter(product => product.id !== id);
        setItems(array);
    }

    const getTotalSum = () => {
        let sum = 0;
        items.forEach(product => {
            sum += product.price * product.quantity
        })

        return sum;
    }

    return (
        <GlobalContext.Provider value={{items, getTotalSum, addToCart, setItems, getItemsCount, deleteItem}}>
            {children}
        </GlobalContext.Provider>
    )
}