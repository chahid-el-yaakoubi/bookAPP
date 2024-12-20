import React, { createContext, useState, useContext } from 'react';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState('USD');
    
    const formatPrice = (amount) => {
        const currencies = {
            USD: { symbol: '$', divisor: 1 },
            EUR: { symbol: '€', divisor: 0.85 },
            GBP: { symbol: '£', divisor: 0.73 },
            JPY: { symbol: '¥', divisor: 110 }
        };

        const { symbol, divisor } = currencies[currency];
        const convertedAmount = amount * divisor;
        
        return `${symbol}${convertedAmount.toFixed(2)}`;
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    return useContext(CurrencyContext);
} 