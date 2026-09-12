import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, CheckCircle, Users, MapPin, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Issues Reported', value: '125K+' },
  { label: 'Volunteers', value: '45K+' },
  { label: 'Cities Covered', value: '50+' },
  { label: 'Resolution Rate', value: '87%' },
];

const activities = [
  'Community cleanup drives every weekend',
  'Waste segregation awareness campaigns',
  'Illegal dumping site reporting and tracking',
  'Door-to-door waste collection monitoring',
  'Zero-waste neighborhood certifications',
  'School and college sanitation programs',
];

const CleanCity = () => {
  return (
    <Layout>
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center mx-auto mb-6">
            <Trash2 className="w-8 h-8 text-white" />
          </div>
          <span className="badge-primary mb-4 inline-block">Program</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Clean City <span className="text-primary">Initiative</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Report and track waste management issues in your locality. Join community cleanup drives and make your neighborhood spotless.
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

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">About This Program</h2>
              <p className="text-muted-foreground mb-4">
                The Clean City Initiative is our flagship program aimed at transforming urban waste management through citizen participation. We empower communities to report, track, and resolve waste-related issues in real time.
              </p>
              <p className="text-muted-foreground mb-8">
                From illegal dumping to overflowing bins, our platform ensures every issue is documented and routed to the right authorities for swift action. Citizens earn points and recognition for their contributions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="btn-gradient" asChild>
                  <Link to="/report-issue">Report a Waste Issue</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/volunteer">Join a Cleanup Drive</Link>
                </Button>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop"
                alt="Community cleanup drive"
                className="rounded-xl shadow-lg w-full object-cover aspect-[3/2]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Key Activities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, i) => (
              <div key={i} className="card-elevated p-6 flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-foreground font-medium">{activity}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Get Involved Today</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Whether you report an issue, volunteer for a drive, or spread awareness — every action counts.
          </p>
          <Button size="lg" className="btn-gradient" asChild>
            <Link to="/volunteer">
              Become a Volunteer <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default CleanCity;
