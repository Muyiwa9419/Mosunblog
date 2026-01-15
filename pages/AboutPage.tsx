
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold mb-12 serif text-center">Beyond the Headlines</h1>
      <div className="aspect-[21/9] bg-slate-200 rounded-3xl overflow-hidden mb-16 shadow-2xl">
        <img src="https://picsum.photos/seed/office/1200/600" className="w-full h-full object-cover opacity-80" alt="Lumina Press Office" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-lg leading-relaxed text-slate-700">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 serif">Our Philosophy</h2>
          <p>
            In an era of rapid-fire information, Lumina Press stands for slow, deliberate, and thoughtful storytelling. 
            We believe that complexity shouldn't be sacrificed for clicks.
          </p>
          <p>
            Our team of dedicated writers explores the intersection of humanity, science, and the digital frontier, 
            seeking to bring clarity to the noise of the modern age.
          </p>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 serif">The Lumina Way</h2>
          <p>
            Transparency, accuracy, and aesthetic delight are our core pillars. Every pixel of our platform 
            is designed to provide an immersive reading experience that respects your attention.
          </p>
          <div className="pt-4">
            <h3 className="font-bold text-slate-900 mb-2">Editor-in-Chief</h3>
            <p className="italic text-slate-500">Elena Vance</p>
          </div>
        </div>
      </div>

      <div className="mt-20 p-12 bg-indigo-50 rounded-3xl border border-indigo-100 text-center">
        <h2 className="text-3xl font-bold mb-6 serif text-indigo-900">Want to join our collective?</h2>
        <p className="text-indigo-700 mb-8 max-w-xl mx-auto">
          We are always looking for fresh voices with unique perspectives. Send your pitch to our editorial team.
        </p>
        <button className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
          Get in Touch
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
