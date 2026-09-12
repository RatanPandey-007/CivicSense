import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Hazards Reported', value: '67K+' },
  { label: 'Issues Resolved', value: '58K+' },
  { label: 'Cities Covered', value: '45+' },
  { label: 'Lives Protected', value: '2M+' },
];

const activities = [
  'Broken streetlight and infrastructure reporting',
  'Open manhole and drainage hazard alerts',
  'Unsafe construction site monitoring',
  'Public space security assessments',
  'Emergency response coordination',
  'Community safety awareness workshops',
];

const PublicSafety = () => {
  return (
    <Layout>
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <span className="badge-primary mb-4 inline-block">Program</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Public <span className="text-primary">Safety</span> Watch
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Report safety hazards, broken infrastructure, and poorly lit areas. Make public spaces safer for all.
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
                Public safety is a fundamental right. Our Public Safety Watch program enables citizens to report hazards that put lives at risk — from broken streetlights to open manholes.
              </p>
              <p className="text-muted-foreground mb-8">
                Each report is geo-tagged and routed to the relevant municipal authority for priority resolution. Critical hazards are flagged for immediate attention.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="btn-gradient" asChild>
                  <Link to="/report-issue">Report a Hazard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/volunteer">Join Safety Watch</Link>
                </Button>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=400&fit=crop"
                alt="Public safety"
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
                <CheckCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-foreground font-medium">{activity}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Help Keep Communities Safe</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Your vigilance can prevent accidents and save lives. Report hazards in your area today.
          </p>
          <Button size="lg" className="btn-gradient" asChild>
            <Link to="/report-issue">
              Report Now <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default PublicSafety;
