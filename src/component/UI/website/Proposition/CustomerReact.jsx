import { FiDownload, FiUnlock, FiWifiOff } from "react-icons/fi";

const ValueProposition = () => {
  const benefits = [
    {
      title: "DRM-Free",
      description: "No restrictive digital rights management",
      icon: <FiUnlock className="text-[var(--color-accent)]" />
    },
    {
      title: "Multi-Format",
      description: "EPUB, PDF, MOBI formats included",
      icon: <FiDownload className="text-[var(--color-accent)]" />
    },
    {
      title: "Offline Access",
      description: "Download and read anywhere",
      icon: <FiWifiOff className="text-[var(--color-accent)]" />
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-[var(--color-primary-lightest)] to-[var(--color-primary-light)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--color-primary-dark)]">
            Why Readers Choose Us
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-[var(--color-primary-dark)] mb-2">
                {benefit.title}
              </h3>
              <p className="text-[var(--color-primary)]">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


export default ValueProposition ;