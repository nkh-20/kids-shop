import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const hasSale = product.sale_price && product.sale_price > 0 && product.sale_price < product.price;
    const discount = hasSale ? Math.round((1 - product.sale_price / product.price) * 100) : 0;

    return (
        <Link to={`/products/${product.id}`} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group">
            <div className="h-48 bg-gradient-to-br from-kids-blue/20 to-kids-purple/20 flex items-center justify-center relative">
                <span className="text-4xl">🎁</span>
                {hasSale && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        -{discount}%
                    </span>
                )}
            </div>
            <div className="p-4">
                <span className="text-xs text-kids-purple font-medium">{product.category?.name}</span>
                <h3 className="font-semibold text-gray-800 mt-1 group-hover:text-kids-purple transition">
                    {product.name}
                </h3>
                <div className="mt-2 flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                        {product.current_price?.toLocaleString()} Ks
                    </span>
                    {hasSale && (
                        <span className="text-sm text-gray-400 line-through">
                            {product.price?.toLocaleString()} Ks
                        </span>
                    )}
                </div>
                <div className="mt-2 flex items-center">
                    <span className={`text-xs ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity})` : 'Out of Stock'}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
