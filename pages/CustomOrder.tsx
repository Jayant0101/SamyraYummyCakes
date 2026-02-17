import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { OrderFormData } from '../types';
import { Send, Upload } from 'lucide-react';

const CustomOrder: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<OrderFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: SubmitHandler<OrderFormData> = (data) => {
    setIsSubmitting(true);
    
    // Construct WhatsApp Message
    const text = `
*New Custom Cake Order Request*
---------------------------
*Name:* ${data.name}
*Phone:* ${data.phone}
*Date:* ${data.date}
*Occasion:* ${data.occasion}
*Flavor:* ${data.flavor}
*Weight:* ${data.weight} kg
*Details:* ${data.details}
    `.trim();

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/919876543210?text=${encodedText}`;

    // Small delay for UX effect
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-rose-500 py-6 px-8 text-center text-white">
          <h2 className="font-serif text-3xl font-bold">Custom Cake Order</h2>
          <p className="mt-2 text-rose-100">Fill out the details and send your request directly to us via WhatsApp.</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                  placeholder="John Doe"
                />
                {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  {...register("phone", { required: "Phone is required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                  placeholder="+91 98765 43210"
                />
                {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                <input 
                  type="date" 
                  {...register("date", { required: "Date is required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                />
                {errors.date && <span className="text-red-500 text-xs mt-1">{errors.date.message}</span>}
              </div>

              {/* Occasion */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
                <select 
                  {...register("occasion")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="Birthday">Birthday</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Baby Shower">Baby Shower</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Flavor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Flavor</label>
                <input 
                  type="text" 
                  {...register("flavor", { required: "Flavor is required" })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                  placeholder="Chocolate, Vanilla, Red Velvet..."
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <select 
                  {...register("weight")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="0.5">0.5 kg</option>
                  <option value="1">1 kg</option>
                  <option value="1.5">1.5 kg</option>
                  <option value="2">2 kg</option>
                  <option value="3+">3+ kg</option>
                </select>
              </div>
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Design Details / Message on Cake</label>
              <textarea 
                rows={4}
                {...register("details")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Describe your theme, colors, or specific design requirements..."
              ></textarea>
            </div>

            {/* Reference Image Dummy (Not functional as per prompt limits but UI included) */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
               <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
               <p className="text-sm text-gray-500">Upload a reference photo (Optional)</p>
               <input type="file" className="hidden" />
               <button type="button" className="mt-2 text-rose-500 text-sm font-medium hover:underline">Browse Files</button>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Opening WhatsApp...' : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Inquiry on WhatsApp
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomOrder;