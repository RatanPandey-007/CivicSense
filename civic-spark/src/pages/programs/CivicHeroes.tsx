import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, CheckCircle, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Active Heroes', value: '10K+' },
  { label: 'Drives Led', value: '5K+' },
  { label: 'Lives Impacted', value: '1M+' },
  { label: 'Cities Active', value: '75+' },
];

const benefits = [
  'Official Civic Hero certification and badge',
  'Leadership training and mentorship programs',
  'Priority access to community events and drives',
  'Recognition on platform leaderboards',
  'Networking with government officials and CSR leaders',
  'Opportunity to lead neighborhood-level initiatives',
];

const levels = [
  { name: 'Bronze Hero', points: '0 - 500 pts', desc: 'Start your journey by reporting issues and participating in drives.' },
  { name: 'Silver Hero', points: '500 - 2000 pts', desc: 'Lead small initiatives and mentor new volunteers.' },
  { name: 'Gold Hero', points: '2000 - 5000 pts', desc: 'Organize city-level drives and represent your community.' },
  { name: 'Platinum Hero', points: '5000+ pts', desc: 'Become an ambassador and influence policy-level changes.' },
];

const CivicHeroes = () => {
  return (
    <Layout>
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-primary-foreground" />
          </div>
          <span className="badge-primary mb-4 inline-block">Program</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Civic Heroes <span className="text-primary">Network</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our elite volunteer network. Lead change in your neighborhood, organize drives, and inspire others.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {stats.map((stat) => (
              <div key={stat.label} className="card-elevated p-6 text-center">
                <p className="stat-number mb-2 text-3xl">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">What is a Civic Hero?</h2>
              <p className="text-muted-foreground mb-4">
                Civic Heroes are our most dedicated volunteers who go beyond reporting issues. They organize community drives, mentor new members, and serve as the bridge between citizens and authorities.
              </p>
              <p className="text-muted-foreground mb-8">
                As a Civic Hero, you earn points, climb ranks, and gain recognition for your contributions to building a better India.
              </p>
              <Button className="btn-gradient" asChild>
                <Link to="/volunteer">
                  Apply to Become a Hero <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop"
                alt="Civic heroes volunteers"
                className="rounded-xl shadow-lg w-full object-cover aspect-[3/2]"
              />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Hero Levels</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {levels.map((level, i) => (
              <div key={level.name} className="card-elevated p-6 text-center">
                <Star className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-bold text-foreground mb-1">{level.name}</h3>
                <p className="text-sm text-primary font-medium mb-3">{level.points}</p>
                <p className="text-muted-foreground text-sm">{level.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Benefits of Being a Civic Hero</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="card-elevated p-6 flex items-start gap-4">
                <Award className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Be a Hero?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join the network of changemakers who are transforming India one neighborhood at a time.
          </p>
          <Button size="lg" className="btn-gradient" asChild>
            <Link to="/volunteer">
              Join Now <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default CivicHeroes;
