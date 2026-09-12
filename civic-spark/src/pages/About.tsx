import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Target, Eye, Heart, Users, Award, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Heart,
    title: "Citizen First",
    description:
      "Every decision we make starts with the question: How does this help citizens?",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "We believe real change happens when communities come together.",
  },
  {
    icon: Award,
    title: "Accountability",
    description:
      "We hold ourselves and institutions accountable for promises made.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We leverage technology to solve age-old civic challenges.",
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <span className="badge-primary mb-4 inline-block">About Us</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Building a More <span className="text-primary">Civic India</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Civic Pulse India is on a mission to transform civic participation
            through technology, community action, and data-driven governance.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="card-elevated p-8" id="mission">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To empower every Indian citizen with the tools and platform to
                actively participate in civic improvement. We bridge the gap
                between citizens and governance by making issue reporting
                seamless, tracking transparent, and resolution accountable.
              </p>
            </div>

            <div className="card-elevated p-8">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Our Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To build India's largest citizen-driven civic discipline
                ecosystem that transforms public behavior through
                technology-enabled accountability, gamified participation, and
                data-driven governance—reaching 100+ cities and 10 million
                certified citizens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="badge-secondary mb-4 inline-block">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              What Drives Us
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-card rounded-xl p-6 text-center border border-border"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Mission
          </h2>
          <p className="text-lg text-secondary-foreground/80 max-w-2xl mx-auto mb-8">
            Whether you're a citizen, a corporation, or a government body,
            there's a place for you in the Civic Pulse ecosystem.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="btn-gradient" asChild>
              <Link to="/volunteer">Become a Volunteer</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10"
              asChild
            >
              <Link to="/contact">Partner With Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
