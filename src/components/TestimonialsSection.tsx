
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Emily Johnson",
    role: "Home Gardener",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    content: "Plant Doc saved my indoor garden! It identified a fungal infection on my monstera that I'd been struggling with for weeks. The treatment advice was perfect.",
    rating: 5
  },
  {
    id: 2,
    name: "Robert Chen",
    role: "Plant Enthusiast",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    content: "I'm amazed by the accuracy of this app. It correctly identified nutrient deficiencies in my plants and recommended exactly what they needed to thrive again.",
    rating: 5
  },
  {
    id: 3,
    name: "Sarah Miller",
    role: "Urban Farmer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content: "As someone managing a small urban farm, Plant Doc has become an essential tool. The immediate diagnosis helps me act quickly to protect my entire crop.",
    rating: 4
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4 text-gradient relative inline-block">
            What Our Users Say
            <div className="absolute -bottom-2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-plantDoc-primary to-transparent"></div>
          </h2>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Real stories from plant lovers who've transformed their gardening experience with Plant Doc.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="glass-card p-6 rounded-xl relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ 
                y: -5,
                backgroundColor: "rgba(0,0,0,0.5)"
              }}
            >
              <Quote className="absolute top-4 right-4 text-plantDoc-primary/20 h-8 w-8" />
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-plantDoc-primary/20" 
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-foreground/70">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="mb-4 flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-4 w-4 ${i < testimonial.rating ? 'text-plantDoc-primary' : 'text-gray-400'}`}
                    fill={i < testimonial.rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              
              <p className="text-foreground/80 italic">"{testimonial.content}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
