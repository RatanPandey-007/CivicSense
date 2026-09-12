import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Car, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Violations Reported', value: '89K+' },
  { label: 'Volunteers', value: '32K+' },
  { label: 'Cities Covered', value: '40+' },
  { label: 'Accidents Prevented', value: '12K+' },
];

const activities = [
  'Traffic violation reporting with photo evidence',
  'Unsafe road condition documentation',
  'Illegal parking zone monitoring',
  'Road safety awareness campaigns in schools',
  'Pedestrian and cyclist safety advocacy',
  'Collaboration with traffic police for enforcement',
];

const TrafficDiscipline = () => {
  return (
    <Layout>
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center mx-auto mb-6">
            <Car className="w-8 h-8 text-white" />
          </div>
          <span className="badge-primary mb-4 inline-block">Program</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Traffic <span className="text-primary">Discipline</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Report traffic violations, unsafe roads, and parking issues. Help create safer streets for everyone.
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
                India's roads see millions of violations daily. Our Traffic Discipline program empowers citizens to document and report traffic violations, unsafe road conditions, and illegal parking.
              </p>
              <p className="text-muted-foreground mb-8">
                By creating a database of violations and hotspots, we help traffic authorities prioritize enforcement and infrastructure improvements where they're needed most.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="btn-gradient" asChild>
                  <Link to="/report-issue">Report a Violation</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/volunteer">Join the Program</Link>
                </Button>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop"
                alt="Traffic management"
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
                <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-foreground font-medium">{activity}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Make Roads Safer</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Every report contributes to safer streets. Join thousands of citizens making a difference.
          </p>
          <Button size="lg" className="btn-gradient" asChild>
            <Link to="/volunteer">
              Get Involved <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default TrafficDiscipline;
