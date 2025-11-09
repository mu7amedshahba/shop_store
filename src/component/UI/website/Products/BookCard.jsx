import React from 'react';
import books from '../../../DateBase_files/books_data.json';
import { Link } from 'react-router-dom';

const BooksCard = ({products}) => {
    
    return (

        <section className="bg-background text-textMain py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-primary mb-10 text-center">
                    Explore Our <span className="text-secondary">Collection</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {products.map((book) => (
                        <Link to={book.path}
                            key={book.id}
                            className="bg-surface rounded-2xl shadow-lg overflow-hidden transition hover:scale-[1.02] duration-200"
                        >
                            <img
                                src={`/assets/images/notebook/${book.image}`}
                                alt={book.images[0].image}
                                className="w-full h-56 object-cover"
                            />

                            <div className="p-5 space-y-2">
                                <h3 className="text-xl font-semibold text-primary  text-[var(--color-primary)]">{book.name}</h3>
                                <p className="text-sm text-textMuted  text-[var(--color-primary-light)]">{book.description}</p>

                                <div className="mt-3 ">
                                    {book.sale ? (
                                        <div className="flex gap-2 items-center justify-between">
                                            <span className="line-through text-red-400">${book.price}</span>
                                            <span className="font-bold text-accent">${book.sale}</span>
                                        </div>
                                    ) : (
                                        <span className="font-semibold text-accent">${book.price}</span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BooksCard;
