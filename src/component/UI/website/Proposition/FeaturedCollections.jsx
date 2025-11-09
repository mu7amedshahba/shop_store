import { FiAward, FiCalendar, FiTrendingUp } from "react-icons/fi";
import { motion } from 'framer-motion';

const FeaturedCollections = () => {
  const collections = [
    {
      title: "Editor's Picks",
      description: "Handpicked titles our team loves",
      icon: <FiAward className="text-[var(--color-accent)]" />,
      count: "42+ Titles"
    },
    {
      title: "New Releases",
      description: "Fresh reads added weekly",
      icon: <FiCalendar className="text-[var(--color-accent)]" />,
      count: "15+ New"
    },
    {
      title: "Bestsellers",
      description: "Community favorites",
      icon: <FiTrendingUp className="text-[var(--color-accent)]" />,
      count: "30+ Books"
    }
  ];

  return (
    <section className="py-16 bg-[var(--color-neutral-lightest)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--color-primary-dark)]">
            Explore Our Collections
          </h2>
          <p className="mt-4 text-lg text-[var(--color-primary)] max-w-2xl mx-auto">
            Curated categories to match your reading mood
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-[var(--color-primary-light)] hover:shadow-md transition-all"
            >
              <div className="text-4xl mb-4">{collection.icon}</div>
              <h3 className="text-xl font-bold text-[var(--color-primary-dark)] mb-2">
                {collection.title}
              </h3>
              <p className="text-[var(--color-primary)] mb-4">
                {collection.description}
              </p>
              <span className="inline-block px-3 py-1 bg-[var(--color-accent-light)] text-[var(--color-accent-dark)] rounded-full text-sm">
                {collection.count}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections