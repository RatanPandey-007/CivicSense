import { Link } from 'react-router-dom';
import { ArrowRight, Trash2, Car, TreeDeciduous, Shield, Users, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

const programs = [
  { icon: Trash2, title: 'Clean City Initiative', description: 'Report and track waste management issues. Join community cleanup drives.', href: '/programs/clean-city' },
  { icon: Car, title: 'Traffic Discipline', description: 'Report traffic violations and unsafe roads. Promote road safety awareness.', href: '/programs/traffic' },
  { icon: TreeDeciduous, title: 'Green Spaces', description: 'Protect and develop urban green areas. Tree plantation drives.', href: '/programs/green-spaces' },
  { icon: Shield, title: 'Public Safety', description: 'Report safety hazards. Street lighting, broken infrastructure issues.', href: '/programs/public-safety' },
  { icon: Users, title: 'Civic Heroes Network', description: 'Join our volunteer network. Lead change in your neighborhood.', href: '/programs/civic-heroes' },
  { icon: Lightbulb, title: 'Civic Education', description: 'Learn about your rights and responsibilities. Get certified.', href: '/programs/education' },
];

export function ProgramsPreview() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <span className="badge-primary mb-4 inline-block">Our Programs</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Multiple Ways to Make an Impact
            </h2>
          </div>
          <Button variant="outline" className="group w-fit border-primary/30 hover:bg-primary/5 hover:border-primary/50 rounded-xl" asChild>
            <Link to="/programs">
              View All Programs
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <Link
              key={program.title}
              to={program.href}
              className="card-elevated p-6 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:border-primary/30 group-hover:shadow-glow-sm transition-all">
                <program.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {program.title}
              </h3>
              <p className="text-muted-foreground text-sm">{program.description}</p>
              <div className="mt-4 flex items-center text-primary font-medium text-sm">
                Learn more
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
