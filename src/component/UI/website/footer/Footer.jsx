import React from 'react'

const Footer = () => {
  return (
   <footer className="bg-[var(--color-primary-darker)] text-[var(--color-neutral-light)] py-12">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h4 className="font-serif text-xl mb-4">Shahba Books</h4>
        <p>Beautiful digital companions for your creative journey.</p>
      </div>
      <div>
        <h4 className="font-serif text-xl mb-4">Quick Links</h4>
        <ul className="space-y-2">
          <li><a href="#" className="hover:text-[var(--color-accent-light)]">Contact</a></li>
          <li><a href="#" className="hover:text-[var(--color-accent-light)]">FAQ</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-serif text-xl mb-4">Newsletter</h4>
        <input 
          type="email" 
          placeholder="Your email" 
          className="bg-[var(--color-primary-lightest)] text-[var(--text-main)] p-2 rounded w-full mb-2"
        />
        <button className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white py-2 px-4 rounded">
          Subscribe
        </button>
      </div>
    </div>
  </footer>
  )
}

export default Footer


