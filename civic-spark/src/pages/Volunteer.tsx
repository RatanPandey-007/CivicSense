import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Heart, Users, Award, Clock, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const benefits = [
  {
    icon: Award,
    title: 'Earn Recognition',
    description: 'Get certified, earn badges, and climb the Civic Hero leaderboard.',
  },
  {
    icon: Users,
    title: 'Join a Community',
    description: 'Connect with like-minded citizens who care about civic improvement.',
  },
  {
    icon: Heart,
    title: 'Make Real Impact',
    description: 'See the tangible results of your contributions in your neighborhood.',
  },
  {
    icon: Clock,
    title: 'Flexible Commitment',
    description: 'Contribute as little or as much time as you can. Every bit counts.',
  },
];

const volunteerAreas = [
  { value: 'waste', label: 'Waste Management & Cleanliness' },
  { value: 'traffic', label: 'Traffic & Road Safety' },
  { value: 'green', label: 'Green Spaces & Environment' },
  { value: 'education', label: 'Civic Education & Awareness' },
  { value: 'tech', label: 'Technology & Data' },
  { value: 'community', label: 'Community Organizing' },
];

const Volunteer = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    pincode: '',
    areas: [] as string[],
    experience: '',
    availability: '',
    whyJoin: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAreaChange = (area: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      areas: checked
        ? [...prev.areas, area]
        : prev.areas.filter(a => a !== area)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Application Submitted!",
      description: "Welcome aboard! Check your email for next steps.",
    });

    setIsSubmitting(false);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient">
        <div className="container-custom section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-primary mb-4 inline-block">Become a Civic Hero</span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Lead the Change in Your <span className="text-primary">Community</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Join 10,000+ Civic Heroes who are transforming their neighborhoods. 
                Organize drives, verify issues, and earn recognition for your contributions.
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Free Certification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Official Badge</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Network Access</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="card-elevated p-5">
                  <benefit.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Register as a Volunteer
            </h2>
            <p className="text-muted-foreground">
              Fill out the form below. Our team will reach out within 48 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card-elevated p-6 md:p-10 space-y-8">
            {/* Personal Info */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Personal Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Your city"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Areas of Interest */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Areas of Interest
              </h3>
              <p className="text-sm text-muted-foreground mb-4">Select all that apply</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {volunteerAreas.map((area) => (
                  <div key={area.value} className="flex items-center space-x-3">
                    <Checkbox
                      id={area.value}
                      checked={formData.areas.includes(area.value)}
                      onCheckedChange={(checked) => handleAreaChange(area.value, checked as boolean)}
                    />
                    <Label htmlFor={area.value} className="font-normal cursor-pointer">
                      {area.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Availability
              </h3>
              <div className="space-y-2">
                <Label htmlFor="availability">How many hours per week can you volunteer? *</Label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Select availability</option>
                  <option value="1-2">1-2 hours</option>
                  <option value="3-5">3-5 hours</option>
                  <option value="5-10">5-10 hours</option>
                  <option value="10+">10+ hours</option>
                </select>
              </div>
            </div>

            {/* Motivation */}
            <div className="space-y-2">
              <Label htmlFor="whyJoin">Why do you want to become a Civic Hero? *</Label>
              <Textarea
                id="whyJoin"
                name="whyJoin"
                value={formData.whyJoin}
                onChange={handleChange}
                placeholder="Tell us about your motivation..."
                rows={4}
                required
              />
            </div>

            <Button type="submit" size="lg" className="btn-gradient w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Volunteer;
