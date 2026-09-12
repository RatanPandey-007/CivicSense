import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, CheckCircle, BarChart3, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Corporate Partners', value: '50+' },
  { label: 'CSR Invested', value: '₹100Cr+' },
  { label: 'Projects Funded', value: '200+' },
  { label: 'Impact Score', value: '94%' },
];

const benefits = [
  'Verified, ground-level impact measurement',
  'Real-time project tracking dashboards',
  'Tax-compliant CSR documentation',
  'Brand visibility across platform and events',
  'Employee volunteer engagement programs',
  'Quarterly impact reports with analytics',
];

const partnerTypes = [
  { title: 'Program Sponsor', desc: 'Sponsor a specific civic program in your city or region. Full branding and impact reporting included.', investment: 'Starting ₹10 Lakhs' },
  { title: 'City Partner', desc: 'Adopt an entire city for comprehensive civic improvement. Multi-program deployment with dedicated team.', investment: 'Starting ₹50 Lakhs' },
  { title: 'Impact Partner', desc: 'Fund specific impact goals like planting 10,000 trees or resolving 5,000 issues. Milestone-based.', investment: 'Custom' },
  { title: 'Technology Partner', desc: 'Provide technology solutions, infrastructure, or expertise to enhance our platform capabilities.', investment: 'In-kind' },
];

const CSRPartnership = () => {
  return (
    <Layout>
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500 flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <span className="badge-primary mb-4 inline-block">Program</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            CSR <span className="text-primary">Partnership</span> Program
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            For corporates looking to make measurable civic impact. Partner with us for ground-level change.
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
              <h2 className="text-3xl font-bold text-foreground mb-6">Why Partner With Us?</h2>
              <p className="text-muted-foreground mb-4">
                Traditional CSR often lacks visibility into ground-level impact. Civic Pulse India provides a transparent, technology-driven platform where every rupee invested creates measurable civic change.
              </p>
              <p className="text-muted-foreground mb-8">
                Our partners get real-time dashboards, verified impact metrics, and comprehensive reporting that satisfies both compliance requirements and stakeholder expectations.
              </p>
              <Button className="btn-gradient" asChild>
                <Link to="/contact">
                  Discuss Partnership <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop"
                alt="Corporate partnership meeting"
                className="rounded-xl shadow-lg w-full object-cover aspect-[3/2]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Partnership Models</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {partnerTypes.map((type, i) => (
              <div key={i} className="card-elevated p-6">
                <Handshake className="w-8 h-8 text-rose-500 mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">{type.title}</h3>
                <p className="text-muted-foreground mb-4">{type.desc}</p>
                <p className="text-primary font-semibold text-sm">{type.investment}</p>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Partner Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="card-elevated p-6 flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-foreground font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Create Impact?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Let's discuss how your organization can drive meaningful civic change with measurable results.
          </p>
          <Button size="lg" className="btn-gradient" asChild>
            <Link to="/contact">
              Get in Touch <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default CSRPartnership;
