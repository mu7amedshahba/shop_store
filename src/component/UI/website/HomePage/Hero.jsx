import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaChevronDown } from "react-icons/fa";
import { GiOpenBook } from "react-icons/gi";

const Hero = () => {
  const books = [
    {
      title: "Morning Rituals",
      author: "Shahba Books",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80",
      tag: "Self-Improvement"
    },
    {
      title: "The Silent Chapter",
      author: "Shahba Books",
      image: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=1200&q=80",
      tag: "Mystery"
    },
    {
      title: "Paged Memories",
      author: "Shahba Books",
      image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=1200&q=80",
      tag: "Memoir"
    },
    {
      title: "Digital Leaves",
      author: "Shahba Books",
      image: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=1200&q=80",
      tag: "Technology"
    },
  ];

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % books.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [books.length]);

  const handleBookSelect = (index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax effect */}
      <motion.div 
        className="absolute inset-0 bg-fixed bg-center bg-cover"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=2000&q=80)`,
        }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-darkest)]/90 via-[var(--color-primary-darkest)]/70 to-[var(--color-primary-darkest)]/90" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Text */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center px-4 py-1 bg-[var(--color-accent-dark)]/30 border border-[var(--color-accent-light)] text-[var(--color-accent-light)] rounded-full text-xs tracking-widest font-semibold"
          >
            <span className="mr-2 animate-pulse">●</span>
            PREMIUM EBOOK COLLECTION
          </motion.div>

          <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold leading-tight">
            <span className="block text-[var(--color-neutral-lightest)]">Discover</span>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="block text-[var(--color-accent-light)]"
            >
              Digital Masterpieces
            </motion.span>
          </h1>

          <p className="text-lg text-[var(--color-neutral-light)] max-w-lg leading-relaxed">
            Step into our curated world of premium eBooks — timeless classics and modern gems await your discovery.
          </p>

          <div className="flex flex-wrap gap-4 pt-6">
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#shop"
              className="flex items-center px-8 py-4 bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-[var(--color-neutral-lightest)] font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              Explore Collection <FaArrowRight className="ml-2" />
            </motion.a>
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              href="#bestsellers"
              className="flex items-center px-8 py-4 border border-[var(--color-neutral-light)] text-[var(--color-neutral-light)] hover:bg-[var(--color-neutral-lightest)]/10 rounded-lg transition-all"
            >
              View Bestsellers <GiOpenBook className="ml-2" />
            </motion.a>
          </div>
        </motion.div>

        {/* Right Carousel */}
        <div className="relative w-full max-w-md mx-auto h-[500px]">
          <AnimatePresence custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border-2 border-[var(--color-accent-light)]"
              style={{
                backgroundImage: `url(${books[current].image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-[var(--color-primary-darkest)]/90 to-transparent backdrop-blur-sm">
                <div className="text-[var(--color-accent-light)] text-xs font-bold uppercase tracking-widest">
                  {books[current].tag}
                </div>
                <h3 className="text-2xl font-semibold text-[var(--color-neutral-lightest)]">
                  {books[current].title}
                </h3>
                <div className="text-[var(--color-neutral-light)] text-sm">
                  by {books[current].author}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {books.map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.2 }}
                onClick={() => handleBookSelect(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  current === i
                    ? "bg-[var(--color-accent-light)] w-6"
                    : "bg-[var(--color-neutral-light)]/50 hover:bg-[var(--color-neutral-light)]/80"
                }`}
                aria-label={`View ${books[i].title}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center"
        >
          <div className="text-[var(--color-neutral-light)] text-sm mb-1">Scroll</div>
          <div className="w-6 h-10 border-2 border-[var(--color-neutral-light)] rounded-full flex items-start justify-center p-1">
            <FaChevronDown className="text-[var(--color-neutral-light)] text-xs" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;