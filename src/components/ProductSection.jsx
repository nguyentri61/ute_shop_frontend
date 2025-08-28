import React from "react";
import ProductCard from "./ProductCard";

export default function ProductSection({ title, products }) {
    return (
        <section className="py-8 px-4">
            <h3 className="text-2xl font-bold mb-2">{title}</h3>

            <div className="overflow-x-auto">
                <div className="flex space-x-6 min-w-[120%] h-[32rem] pl-4"> {/* thêm pl-4 */}
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex-shrink-0 w-64 relative flex items-center"
                        >
                            <div className="transform transition duration-300 hover:scale-105 origin-center">
                                <ProductCard product={product} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>


    );
}
