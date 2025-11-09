import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiBookOpen,
    FiCoffee,
    FiPenTool,
    FiAward,
    FiArrowRight
} from 'react-icons/fi';
import aboutImage from '../../../../assets/images/notebook/table.jpg';
import with_hand from '../../../../assets/images/notebook/with_hand.jpg';
import book_cover from '../../../../assets/images/notebook/book_cover.jpg';


const About = () => {
    const imagesArray = [aboutImage, with_hand, book_cover]

    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
          setCurrentIndex(prev => prev < imagesArray.length - 1 ? prev + 1 : 0)  
        }, 3000)
     return () =>   clearTimeout(timer)
    }, [currentIndex])
    // 
    const img = imagesArray[currentIndex]

    
    const features = [
        {
            icon: <FiBookOpen className="text-2xl" />,
            title: "Curated Selection",
            description: "Handpicked titles from emerging and established authors"
        },
        {
            icon: <FiCoffee className="text-2xl" />,
            title: "Reading Comfort",
            description: "Optimized layouts for all-day reading sessions"
        },
        {
            icon: <FiPenTool className="text-2xl" />,
            title: "Interactive Tools",
            description: "Built-in annotation and highlighting features"
        },
        {
            icon: <FiAward className="text-2xl" />,
            title: "Quality Content",
            description: "Award-winning titles across multiple genres"
        }
    ];

    return (
        <section
            id="about"
            className="relative bg-[var(--color-accent-lightest)] pt-24 pb-16" // Adjusted padding to account for navbar
        >
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/soft-paper.png')]"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="inline-block px-4 py-1 mb-4 bg-[var(--color-accent-light)] text-[var(--color-accent-dark)] rounded-full text-xs font-medium tracking-wider"
                        >
                            OUR PHILOSOPHY
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-4xl md:text-5xl font-bold text-[var(--color-primary-dark)] mb-6"
                        >
                            More Than Just <span className="text-[var(--color-accent)]">eBooks</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-lg text-[var(--color-primary)] mb-8 leading-relaxed"
                        >
                            At <strong>eBook Haven</strong>, we're passionate about creating reading experiences that inspire and transform. Our carefully curated collection goes beyond digital pages - we craft journeys.
                        </motion.p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    whileHover={{ y: -5 }}
                                    className="bg-white p-4 rounded-lg shadow-sm border border-[var(--color-primary-light)] hover:shadow-md transition-all"
                                >
                                    <div className="text-[var(--color-accent)] mb-2">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-bold text-[var(--color-primary-dark)] mb-1">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-[var(--color-primary)]">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            viewport={{ once: true, margin: "-100px" }}
                        >
                            <button className="group flex items-center gap-2 px-6 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg">
                                Discover Our Collection
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-[var(--color-accent-light)] rounded-2xl -z-10"></div>
                        <div className="relative overflow-hidden rounded-xl shadow-xl border-4 border-white">
                            <img

                                src={with_hand}
                                alt="Reading experience at eBook Haven"
                                className="w-full h-auto object-cover transform hover:scale-105 transition duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-darkest)]/40 via-transparent to-transparent"></div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;