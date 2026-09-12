import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Lightbulb, ArrowRight, CheckCircle, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Ideas Submitted', value: '2K+' },
  { label: 'Ideas Funded', value: '150+' },
  { label: 'Implemented', value: '75+' },
  { label: 'Prize Pool', value: '₹5Cr+' },
];

const steps = [
  { step: '01', title: 'Submit Your Idea', desc: 'Share your innovative solution to a civic problem through our platform.' },
  { step: '02', title: 'Community Review', desc: 'Ideas are reviewed and voted on by the community and expert panel.' },
  { step: '03', title: 'Get Funded', desc: 'Selected ideas receive funding and mentorship to build prototypes.' },
  { step: '04', title: 'Implementation', desc: 'Winning solutions are deployed in partnership with municipal bodies.' },
];

const CivicInnovation = () => {
  return (
    <Layout>
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-500 flex items-center justify-center mx-auto mb-6">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <span className="badge-primary mb-4 inline-block">Program</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Civic <span className="text-primary">Innovation</span> Lab
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Propose innovative solutions to civic problems. Best ideas get funded and implemented by our partners.
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

          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {steps.map((s) => (
              <div key={s.step} className="card-elevated p-6 text-center">
                <span className="stat-number text-2xl">{s.step}</span>
                <h3 className="text-lg font-bold text-foreground mt-3 mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/50">
        <div className="container-custom text-center">
          <Rocket className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">Have a Great Idea?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Whether it's an app, a process improvement, or a new community model — we want to hear it. The best ideas get funded and implemented.
          </p>
          <Button size="lg" className="btn-gradient" asChild>
            <Link to="/contact">
              Submit Your Idea <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default CivicInnovation;
