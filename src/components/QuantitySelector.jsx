import React from "react";

const QuantitySelector = ({ value, onIncrease, onDecrease }) => {
    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={onDecrease}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
            >
                -
            </button>
            <span className="px-3">{value}</span>
            <button
                type="button"
                onClick={onIncrease}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300"
            >
                +
            </button>
        </div>
    );
};

export default QuantitySelector;
