import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Star, TrendingUp, Target, Zap, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const earningWays = [
  { icon: Target, title: 'Report Issues', points: '+10 pts each', desc: 'Report civic issues in your area with photos and location.' },
  { icon: Star, title: 'Verify Reports', points: '+5 pts each', desc: 'Verify and upvote issues reported by other citizens.' },
  { icon: Zap, title: 'Join Drives', points: '+50 pts each', desc: 'Participate in community cleanup and awareness drives.' },
  { icon: Award, title: 'Complete Courses', points: '+100-500 pts', desc: 'Finish civic education courses and earn certifications.' },
  { icon: TrendingUp, title: 'Lead Initiatives', points: '+200 pts each', desc: 'Organize and lead community improvement initiatives.' },
  { icon: Trophy, title: 'Achieve Milestones', points: 'Bonus pts', desc: 'Hit milestones like 100 reports or 10 drives for bonus rewards.' },
];

const rewards = [
  { tier: 'Bronze', range: '0 - 500 pts', perks: 'Digital badge, platform recognition' },
  { tier: 'Silver', range: '500 - 2,000 pts', perks: 'Certificate, event priority access' },
  { tier: 'Gold', range: '2,000 - 5,000 pts', perks: 'Civic Hero title, mentorship access' },
  { tier: 'Platinum', range: '5,000+ pts', perks: 'Ambassador status, policy influence' },
];

const GetStarted = () => {
  return (
    <Layout>
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <span className="badge-primary mb-4 inline-block">Get Started</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Start Earning <span className="text-primary">Points</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Every civic action earns you points. Climb the ranks, unlock rewards, and become a recognized Civic Hero.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Ways to Earn Points</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earningWays.map((way, i) => (
              <div key={i} className="card-elevated p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <way.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{way.title}</h3>
                    <span className="text-primary font-semibold text-sm">{way.points}</span>
                    <p className="text-muted-foreground text-sm mt-2">{way.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Reward Tiers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewards.map((r, i) => (
              <div key={i} className="card-elevated p-6 text-center">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="text-xl font-bold text-foreground mb-1">{r.tier}</h3>
                <p className="text-primary font-medium text-sm mb-3">{r.range}</p>
                <p className="text-muted-foreground text-sm">{r.perks}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Begin?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Start with your first issue report or sign up as a volunteer. Every action counts!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="btn-gradient" asChild>
              <Link to="/report-issue">
                Report Your First Issue <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/volunteer">Become a Volunteer</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GetStarted;
