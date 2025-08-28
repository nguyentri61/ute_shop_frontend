import React, { useState } from "react";

export default function Pagination({ totalPages = 5, currentPage = 1, onPageChange }) {
    const [page, setPage] = useState(currentPage);

    const handleClick = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
        if (onPageChange) onPageChange(newPage);
    };

    const renderPageNumbers = () => {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <li key={i}>
                    <button
                        onClick={() => handleClick(i)}
                        className={`flex items-center justify-center px-3 h-8 leading-tight border ${page === i
                                ? "text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                                : "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                            }`}
                    >
                        {i}
                    </button>
                </li>
            );
        }
        return pages;
    };

    return (
        <nav aria-label="Page navigation">
            <ul className="flex items-center -space-x-px h-8 text-sm">
                <li>
                    <button
                        onClick={() => handleClick(page - 1)}
                        className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                    >
                        <span className="sr-only">Previous</span>
                        <svg
                            className="w-2.5 h-2.5 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 1 1 5l4 4"
                            />
                        </svg>
                    </button>
                </li>

                {renderPageNumbers()}

                <li>
                    <button
                        onClick={() => handleClick(page + 1)}
                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                    >
                        <span className="sr-only">Next</span>
                        <svg
                            className="w-2.5 h-2.5 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="m1 9 4-4-4-4"
                            />
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    );
}
