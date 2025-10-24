const QuantityStepper = ({ value, onIncrease, onDecrease, disabled }) => (
    <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden">
        <button
            onClick={onDecrease}
            disabled={disabled}
            className="px-3 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            aria-label="Giảm số lượng"
        >
            −
        </button>
        <div className="min-w-10 text-center px-2 font-semibold text-slate-800 select-none">{value}</div>
        <button
            onClick={onIncrease}
            disabled={disabled}
            className="px-3 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            aria-label="Tăng số lượng"
        >
            +
        </button>
    </div>
);

export default QuantityStepper;