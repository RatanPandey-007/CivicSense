import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, Trash2, Car, TreeDeciduous, Shield, Users, Lightbulb, GraduationCap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const programs = [
  {
    icon: Trash2,
    title: 'Clean City Initiative',
    description: 'Report and track waste management issues in your locality. Join community cleanup drives and make your neighborhood spotless.',
    stats: { issues: '125K+', volunteers: '45K+', cities: '50+' },
    color: 'bg-emerald-500',
    href: '/programs/clean-city',
  },
  {
    icon: Car,
    title: 'Traffic Discipline Program',
    description: 'Report traffic violations, unsafe roads, and parking issues. Help create safer streets for everyone.',
    stats: { issues: '89K+', volunteers: '32K+', cities: '40+' },
    color: 'bg-blue-500',
    href: '/programs/traffic',
  },
  {
    icon: TreeDeciduous,
    title: 'Green Spaces Initiative',
    description: 'Protect urban green areas, participate in tree plantation drives, and help create sustainable urban ecosystems.',
    stats: { trees: '500K+', parks: '200+', cities: '30+' },
    color: 'bg-green-600',
    href: '/programs/green-spaces',
  },
  {
    icon: Shield,
    title: 'Public Safety Watch',
    description: 'Report safety hazards, broken infrastructure, and poorly lit areas. Make public spaces safer for all.',
    stats: { issues: '67K+', resolved: '58K+', cities: '45+' },
    color: 'bg-amber-500',
    href: '/programs/public-safety',
  },
  {
    icon: Users,
    title: 'Civic Heroes Network',
    description: 'Join our elite volunteer network. Lead change in your neighborhood, organize drives, and inspire others.',
    stats: { heroes: '10K+', drives: '5K+', impact: '1M+' },
    color: 'bg-primary',
    href: '/programs/civic-heroes',
  },
  {
    icon: Lightbulb,
    title: 'Civic Innovation Lab',
    description: 'Propose innovative solutions to civic problems. Best ideas get funded and implemented by our partners.',
    stats: { ideas: '2K+', funded: '150+', implemented: '75+' },
    color: 'bg-purple-500',
    href: '/programs/innovation',
  },
  {
    icon: GraduationCap,
    title: 'Civic Education',
    description: 'Learn about your civic rights and responsibilities. Get certified and become a recognized civic leader.',
    stats: { courses: '25+', certified: '100K+', schools: '500+' },
    color: 'bg-indigo-500',
    href: '/programs/education',
  },
  {
    icon: Building2,
    title: 'CSR Partnership Program',
    description: 'For corporates looking to make measurable civic impact. Partner with us for ground-level change.',
    stats: { partners: '50+', invested: '₹100Cr+', projects: '200+' },
    color: 'bg-rose-500',
    href: '/programs/csr',
  },
];

const Programs = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <span className="badge-primary mb-4 inline-block">Our Programs</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Multiple Ways to <span className="text-primary">Make Impact</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the program that resonates with you. Every action counts, every voice matters.
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((program) => (
              <div
                key={program.title}
                className="card-elevated p-6 md:p-8 group"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-xl ${program.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <program.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      {program.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border mb-6">
                  {Object.entries(program.stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <p className="font-bold text-primary">{value}</p>
                      <p className="text-xs text-muted-foreground capitalize">{key}</p>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full group/btn" asChild>
                  <Link to={program.href}>
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Can't Decide? Start Here.
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Download the app and report your first civic issue. It's the simplest way to start making a difference.
          </p>
          <Button size="lg" className="btn-gradient" asChild>
            <Link to="/report-issue">Report Your First Issue</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Programs;
