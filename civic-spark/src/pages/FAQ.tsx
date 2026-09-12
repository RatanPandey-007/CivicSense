import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqCategories = [
  {
    title: 'General',
    faqs: [
      { q: 'What is Civic Pulse India?', a: 'Civic Pulse India is a citizen-driven civic discipline ecosystem that enables people to report, track, and resolve civic issues in their neighborhoods. Our platform connects citizens with municipal authorities for faster, transparent resolution of problems.' },
      { q: 'Is Civic Pulse India free to use?', a: 'Yes, Civic Pulse India is completely free for citizens. Our platform is funded through CSR partnerships and government collaborations.' },
      { q: 'Which cities is Civic Pulse India available in?', a: 'We are currently active in 100+ cities across India, including all major metros and many tier-2 cities. We are expanding rapidly and aim to cover 200+ cities by the end of next year.' },
      { q: 'How do I create an account?', a: 'You can register on our platform using your email address, phone number, or Aadhaar-based verification. The registration process takes less than 2 minutes.' },
    ],
  },
  {
    title: 'Reporting Issues',
    faqs: [
      { q: 'How do I report a civic issue?', a: 'Click the "Report Issue" button, select the issue category, add photos and location details, provide a description, and submit. Your report will be routed to the relevant municipal authority.' },
      { q: 'Can I report issues anonymously?', a: 'Yes, you can choose to submit anonymous reports. However, identified reports tend to receive faster responses as authorities can follow up for additional details.' },
      { q: 'What types of issues can I report?', a: 'You can report waste management issues, potholes, broken streetlights, traffic violations, public safety hazards, water supply problems, illegal constructions, and many more categories.' },
      { q: 'How do I track my reported issue?', a: 'Each report gets a unique tracking ID. You can check the status anytime through your dashboard or the real-time tracking map.' },
    ],
  },
  {
    title: 'Civic Heroes & Points',
    faqs: [
      { q: 'What are Civic Points?', a: 'Civic Points are earned by taking civic actions like reporting issues, participating in drives, completing courses, and verifying reports. Points help you climb the ranking tiers and earn recognition.' },
      { q: 'How do I become a Civic Hero?', a: 'Sign up as a volunteer, actively participate in programs, earn points, and apply for Civic Hero status once you reach the Gold tier (2,000+ points).' },
      { q: 'What rewards do I get for earning points?', a: 'Rewards include digital badges, official certificates, priority access to events, mentorship programs, and the prestigious Civic Hero title. Top performers may also receive awards at national events.' },
      { q: 'Can organizations earn points?', a: 'Currently, points are earned by individual citizens. Organizations can participate through our CSR Partnership Program for corporate recognition.' },
    ],
  },
  {
    title: 'Volunteering & Programs',
    faqs: [
      { q: 'How can I volunteer?', a: 'Visit our Volunteer page and fill out the registration form. You can select areas of interest and preferred schedule. Our team will match you with relevant opportunities in your area.' },
      { q: 'Do I need any special skills to volunteer?', a: 'No special skills are required. We have opportunities for everyone, from community cleanups to tech-based contributions. We also provide training for specialized roles.' },
      { q: 'Can I start my own initiative?', a: 'Absolutely! Once you reach Silver tier or above, you can propose and lead your own community initiatives through our platform.' },
    ],
  },
  {
    title: 'CSR & Partnerships',
    faqs: [
      { q: 'How can my company partner with Civic Pulse India?', a: 'Visit our CSR Partnership page or contact us directly. We offer multiple partnership models including Program Sponsorship, City Partnership, Impact Partnership, and Technology Partnership.' },
      { q: 'Is the CSR contribution tax-deductible?', a: 'Yes, all CSR contributions through our registered trust are eligible for tax benefits under Section 80G of the Income Tax Act.' },
      { q: 'What kind of impact reports do CSR partners receive?', a: 'Partners receive quarterly impact reports with detailed metrics, photo documentation, beneficiary data, and ROI analysis. Real-time dashboards are also available.' },
    ],
  },
];

const FAQ = () => {
  return (
    <Layout>
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <HelpCircle className="w-12 h-12 text-primary mx-auto mb-6" />
          <span className="badge-primary mb-4 inline-block">FAQs</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about our platform, programs, and how you can get involved.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto">
          {faqCategories.map((category, ci) => (
            <div key={ci} className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">{category.title}</h2>
              <Accordion type="single" collapsible className="space-y-3">
                {category.faqs.map((faq, fi) => (
                  <AccordionItem key={fi} value={`${ci}-${fi}`} className="card-elevated px-6">
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-muted/50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Still Have Questions?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Can't find what you're looking for? Reach out to our team and we'll get back to you promptly.
          </p>
          <Button size="lg" className="btn-gradient" asChild>
            <Link to="/contact">
              Contact Us <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
