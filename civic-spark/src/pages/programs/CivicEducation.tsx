import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, CheckCircle, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Courses Available', value: '25+' },
  { label: 'Citizens Certified', value: '100K+' },
  { label: 'Partner Schools', value: '500+' },
  { label: 'Completion Rate', value: '78%' },
];

const courses = [
  { title: 'Civic Rights & Duties 101', duration: '2 hours', level: 'Beginner' },
  { title: 'Waste Management & Recycling', duration: '3 hours', level: 'Beginner' },
  { title: 'Traffic Rules & Road Safety', duration: '2.5 hours', level: 'Beginner' },
  { title: 'Community Leadership', duration: '5 hours', level: 'Intermediate' },
  { title: 'Environmental Conservation', duration: '4 hours', level: 'Intermediate' },
  { title: 'Urban Planning & Governance', duration: '6 hours', level: 'Advanced' },
];

const CivicEducation = () => {
  return (
    <Layout>
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <span className="badge-primary mb-4 inline-block">Program</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Civic <span className="text-primary">Education</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn about your civic rights and responsibilities. Get certified and become a recognized civic leader.
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
              <h2 className="text-3xl font-bold text-foreground mb-6">Learn. Certify. Lead.</h2>
              <p className="text-muted-foreground mb-4">
                Our Civic Education program offers free courses that teach citizens about their rights, responsibilities, and how they can contribute to building better communities.
              </p>
              <p className="text-muted-foreground mb-8">
                Complete courses to earn certifications recognized by municipal bodies and organizations. Certified citizens are prioritized for leadership roles in our programs.
              </p>
              <Button className="btn-gradient" asChild>
                <Link to="/get-started">
                  Start Learning <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop"
                alt="Civic education workshop"
                className="rounded-xl shadow-lg w-full object-cover aspect-[3/2]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Available Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <div key={i} className="card-elevated p-6">
                <BookOpen className="w-8 h-8 text-indigo-500 mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">{course.title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>⏱ {course.duration}</span>
                  <span className="badge-primary text-xs">{course.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom text-center">
          <Award className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">Get Certified Today</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join 100,000+ certified citizens who are leading change with knowledge and commitment.
          </p>
          <Button size="lg" className="btn-gradient" asChild>
            <Link to="/get-started">
              Enroll Now <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default CivicEducation;
