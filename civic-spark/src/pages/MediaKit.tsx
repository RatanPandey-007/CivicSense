import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Download, Image, FileText, Video, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const assets = [
  { icon: Image, title: 'Logo Pack', desc: 'Primary and secondary logos in PNG, SVG, and EPS formats. Includes light, dark, and monochrome versions.', format: 'ZIP • 8 MB' },
  { icon: FileText, title: 'Brand Guidelines', desc: 'Complete brand book with color palettes, typography, spacing rules, and usage examples.', format: 'PDF • 12 MB' },
  { icon: Image, title: 'Social Media Kit', desc: 'Ready-to-use templates for Facebook, Instagram, Twitter, and LinkedIn. Editable Figma files included.', format: 'ZIP • 25 MB' },
  { icon: FileText, title: 'Press Releases', desc: 'Latest press releases, fact sheets, and boilerplate text for media use.', format: 'PDF • 3 MB' },
  { icon: Video, title: 'Video Assets', desc: 'Campaign videos, platform demos, and testimonial clips in HD format.', format: 'ZIP • 500 MB' },
  { icon: Image, title: 'Impact Infographics', desc: 'Data visualization assets showing our impact across India. Updated quarterly.', format: 'ZIP • 15 MB' },
];

const mediaCoverage = [
  { outlet: 'The Times of India', title: 'Civic Pulse India reaches 10 million users milestone', date: 'Jan 2024' },
  { outlet: 'NDTV', title: 'How technology is transforming civic engagement in India', date: 'Dec 2023' },
  { outlet: 'The Hindu', title: 'Bengaluru\'s pothole problem solved through citizen reporting', date: 'Nov 2023' },
  { outlet: 'Economic Times', title: 'CSR meets civic action: The Civic Pulse model', date: 'Oct 2023' },
];

const MediaKit = () => {
  return (
    <Layout>
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <span className="badge-primary mb-4 inline-block">Media</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Media <span className="text-primary">Kit</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need for press coverage, partnerships, and media mentions. Download brand assets and access press materials.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-foreground mb-8">Brand Assets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {assets.map((asset, i) => (
              <div key={i} className="card-elevated p-6">
                <asset.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-bold text-foreground mb-2">{asset.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{asset.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{asset.format}</span>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" /> Download
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-8">Recent Media Coverage</h2>
          <div className="space-y-4 mb-16">
            {mediaCoverage.map((item, i) => (
              <div key={i} className="card-elevated p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-primary font-semibold text-sm">{item.outlet}</span>
                  <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                </div>
                <span className="text-muted-foreground text-sm flex-shrink-0">{item.date}</span>
              </div>
            ))}
          </div>

          <div className="card-elevated p-8 md:p-12 text-center">
            <Mail className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Media Inquiries</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              For interviews, press inquiries, or media collaborations, please reach out to our communications team.
            </p>
            <p className="text-primary font-semibold mb-6">media@civicpulse.in</p>
            <Button className="btn-gradient" asChild>
              <Link to="/contact">
                Contact Media Team <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MediaKit;
