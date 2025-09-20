import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSimilarProducts } from '../features/products/similarProductsSlice';
import ProductCard from './ProductCard';

const SimilarProducts = ({ productId }) => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.similarProducts);

  useEffect(() => {
    if (productId) {
      dispatch(fetchSimilarProducts(productId));
    }
  }, [dispatch, productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return null; // Không hiển thị gì nếu có lỗi
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Sản phẩm tương tự</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;