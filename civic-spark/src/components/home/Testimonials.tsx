import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Civic Hero, Delhi',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    quote: 'I reported a broken streetlight in my colony. Within 3 days, it was fixed! Now I actively report issues and have earned the Civic Hero badge.',
    rating: 5,
  },
  {
    name: 'Rajesh Kumar',
    role: 'Municipal Commissioner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    quote: 'Civic India has transformed how we receive and respond to citizen grievances. The data insights help us prioritize interventions effectively.',
    rating: 5,
  },
  {
    name: 'Ananya Patel',
    role: 'CSR Head, TechCorp India',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    quote: 'Finally, a platform where we can see real impact of our CSR investments. Every rupee spent has measurable outcomes at the grassroots level.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="section-padding border-t border-border/30">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="badge-primary mb-4 inline-block">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Voices of Change
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From citizens to government officials, hear how Civic India is making a difference.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="card-elevated p-6 md:p-8 relative animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/15" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-xl object-cover border border-border/50"
                />
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
