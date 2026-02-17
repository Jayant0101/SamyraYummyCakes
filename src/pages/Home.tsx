import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, Calendar, MessageCircle, Package } from 'lucide-react';
import { Testimonial } from '../types';

const Home: React.FC = () => {
  const testimonials: Testimonial[] = [
    { id: 1, name: "Priya Sharma", text: "The most beautiful wedding cake I could have asked for! Tasted as good as it looked.", rating: 5 },
    { id: 2, name: "Rahul Verma", text: "My son loved his dinosaur cake. The detailing was incredible.", rating: 5 },
    { id: 3, name: "Anjali Gupta", text: "Best chocolate truffle in Kharar. Highly recommended!", rating: 5 },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-50">
          <img
            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Delicious Cake Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
            Custom Cakes for <br />
            <span className="text-rose-400">Every Occasion</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light">
            Handcrafted with love, designed for your memories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919876543210?text=Hi! I'd like to order a cake 🎂"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" /> Order Now on WhatsApp
            </a>
            <Link
              to="/menu"
              className="px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              View Menu <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/ai-chef"
              className="px-8 py-3 bg-white hover:bg-gray-100 text-rose-900 font-bold rounded-full transition-all transform hover:scale-105 shadow-lg"
            >
              Try AI Cake Designer
            </Link>
          </div>
        </div>
      </section>

      {/* Features/Categories */}
      <section className="py-20 bg-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Baked to Perfection</h2>
            <div className="w-24 h-1 bg-rose-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/menu" className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow text-center group">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 group-hover:bg-rose-200 transition-colors">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3 text-gray-900">Birthdays</h3>
              <p className="text-gray-600">From superheroes to princesses, we make every birthday magical with themed custom cakes.</p>
            </Link>

            <Link to="/menu" className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow text-center transform md:-translate-y-4 group">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 group-hover:bg-rose-200 transition-colors">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3 text-gray-900">Weddings</h3>
              <p className="text-gray-600">Elegant multi-tier cakes that are the perfect centerpiece for your big day.</p>
            </Link>

            <Link to="/order" className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow text-center group">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 group-hover:bg-rose-200 transition-colors">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-3 text-gray-900">Custom Designs</h3>
              <p className="text-gray-600">Have a specific idea? We can bake it! Use our Custom Order form to bring your vision to life.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Highlight */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=400&q=80" className="rounded-2xl shadow-lg mt-8" alt="Cake 1" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80" className="rounded-2xl shadow-lg" alt="Cake 2" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=400&q=80" className="rounded-2xl shadow-lg" alt="Cake 3" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=400&q=80" className="rounded-2xl shadow-lg -mt-8" alt="Cake 4" loading="lazy" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">Gallery Highlights</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Explore our portfolio of handcrafted delights. From intricate fondant work to luscious buttercream swirls, every cake is a piece of art.
                We use only the finest ingredients to ensure a taste that keeps you coming back for more.
              </p>
              <Link to="/menu" className="text-rose-600 font-bold hover:text-rose-700 flex items-center gap-2">
                View Full Gallery <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold mb-12 text-gray-900">Sweet Words from Our Customers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4 text-yellow-400">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} fill="currentColor" className="w-5 h-5" />)}
                </div>
                <p className="text-gray-700 italic mb-4">"{t.text}"</p>
                <p className="font-bold text-rose-900">- {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track Order Banner */}
      <section className="py-10 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-rose-400" />
            <div>
              <h3 className="font-bold text-lg">Already placed an order?</h3>
              <p className="text-gray-400 text-sm">Track your cake's journey in real-time</p>
            </div>
          </div>
          <Link
            to="/track-order"
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-full font-bold transition-colors"
          >
            Track Your Order
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-rose-500 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold mb-6">Ready to Order Your Dream Cake?</h2>
          <p className="text-xl mb-8 text-rose-100">Contact us on WhatsApp for instant quotes and bookings.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-rose-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              <MessageCircle className="w-5 h-5" /> Order Now on WhatsApp
            </a>
            <Link
              to="/order"
              className="inline-block bg-rose-700 hover:bg-rose-800 text-white px-8 py-3 rounded-full font-bold text-lg transition-colors shadow-lg"
            >
              Place Custom Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;