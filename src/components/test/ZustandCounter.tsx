// src/components/ZustandCounter.tsx
"use client";

import useCounterStore from '@/store/counterStore';
import React from 'react';

const ZustandCounter = () => {
    const { count, increment, decrement } = useCounterStore();

    return (
        <div>
            <h2>Zustand Counter</h2>
            <p>Count: {count}</p>
            <div className="flex space-x-2">
                <button onClick={decrement} className="px-4 py-2 bg-red-500 text-white rounded">-</button>
                <button onClick={increment} className="px-4 py-2 bg-green-500 text-white rounded">+</button>
            </div>
        </div>
    );
};

export default ZustandCounter;
