// Example BooksContent styling
const BooksContent = ({ products }) => {
    return (
        <>
            {products.map(product => (
                <div 
                    key={product.id}
                    className="bg-[var(--color-neutral-lightest)] rounded-lg overflow-hidden shadow-md
                    hover:shadow-lg transition-all duration-300 border border-[var(--border-light)]
                    flex flex-col h-full"
                >
                    <div className="p-4 flex-grow">
                        <h3 className="text-xl font-bold text-[var(--color-primary-darker)] mb-2">
                            {product.title}
                        </h3>
                        <p className="text-[var(--color-neutral-dark)] mb-4">
                            {product.description}
                        </p>
                    </div>
                    <div className="bg-[var(--color-accent-lightest)] p-4 border-t border-[var(--border-light)]">
                        <button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] 
                        text-[var(--text-inverse)] py-2 px-4 rounded transition-colors">
                            View Details
                        </button>
                    </div>
                </div>
            ))}
        </>
    );
};


export default BooksContent