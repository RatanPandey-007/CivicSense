import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { TreeDeciduous, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Trees Planted', value: '500K+' },
  { label: 'Parks Restored', value: '200+' },
  { label: 'Cities Covered', value: '30+' },
  { label: 'Green Cover Added', value: '1200 Acres' },
];

const activities = [
  'Tree plantation drives across cities',
  'Urban park restoration and maintenance',
  'Green corridor development along highways',
  'Community garden setup in neighborhoods',
  'Deforestation monitoring and reporting',
  'Environmental education workshops',
];

const GreenSpaces = () => {
  return (
    <Layout>
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center mx-auto mb-6">
            <TreeDeciduous className="w-8 h-8 text-white" />
          </div>
          <span className="badge-primary mb-4 inline-block">Program</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Green <span className="text-primary">Spaces</span> Initiative
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Protect urban green areas, participate in tree plantation drives, and help create sustainable urban ecosystems.
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
                India's cities are losing green cover at an alarming rate. The Green Spaces Initiative works to reverse this trend by mobilizing citizens to plant, protect, and maintain urban green areas.
              </p>
              <p className="text-muted-foreground mb-8">
                From small community gardens to large-scale tree plantation drives, every green initiative creates cleaner air, cooler neighborhoods, and healthier communities.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="btn-gradient" asChild>
                  <Link to="/volunteer">Join a Plantation Drive</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/report-issue">Report Green Space Issues</Link>
                </Button>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop"
                alt="Green spaces and tree plantation"
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
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-foreground font-medium">{activity}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Plant a Tree, Grow a Future</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Every tree planted is a step toward a greener, healthier India. Join the movement today.
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

export default GreenSpaces;
