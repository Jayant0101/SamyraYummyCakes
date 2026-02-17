import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-rose-50 py-16 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">Get in Touch</h1>
        <p className="text-gray-600">We'd love to hear from you. Visit us or send a message.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Side */}
          <div className="space-y-8">
            <h2 className="font-serif text-2xl font-bold text-gray-800">Bakery Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-rose-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Address</h3>
                  <p className="text-gray-600 mt-1">
                    Samyra's Yummy Cakes<br/>
                    123 Bakery Lane, Near City Center<br/>
                    Kharar, Punjab 140301
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-rose-100 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Phone & WhatsApp</h3>
                  <p className="text-gray-600 mt-1">+91 987 654 3210</p>
                  <p className="text-sm text-gray-500">Available on WhatsApp for orders</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-rose-100 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Email</h3>
                  <p className="text-gray-600 mt-1">orders@samyrascakes.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-rose-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Opening Hours</h3>
                  <p className="text-gray-600 mt-1">Mon - Sat: 9:00 AM - 9:00 PM</p>
                  <p className="text-gray-600">Sun: 10:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Side */}
          <div className="h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-lg relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3428.0!2d76.6!3d30.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQyJzAwLjAiTiA3NsKwMzYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy"
              title="Bakery Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;