import { Layout } from '@/components/layout/Layout';

const Privacy = () => {
  return (
    <Layout>
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <span className="badge-primary mb-4 inline-block">Legal</span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: January 15, 2024</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto prose prose-lg">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">Civic Pulse India ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, mobile application, and website (collectively, the "Platform").</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">We collect information that you provide directly, including:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Personal identification information (name, email address, phone number)</li>
                <li>Location data when you report civic issues (with your permission)</li>
                <li>Photos and media uploaded as part of issue reports</li>
                <li>Volunteer registration details and preferences</li>
                <li>Feedback, survey responses, and correspondence</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>To process and route civic issue reports to relevant authorities</li>
                <li>To manage your account and provide platform services</li>
                <li>To communicate updates on reported issues and platform features</li>
                <li>To generate anonymized analytics and impact reports</li>
                <li>To improve our platform and user experience</li>
                <li>To comply with legal obligations and government requirements</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Sharing</h2>
              <p className="text-muted-foreground leading-relaxed">We share your issue reports (including location and photos) with relevant municipal authorities for resolution. We do not sell your personal information to third parties. Anonymized, aggregated data may be shared with CSR partners and research organizations for impact measurement.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">We implement industry-standard security measures including encryption, secure servers, and access controls to protect your data. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">You have the right to access, correct, or delete your personal information. You can update your profile settings or contact us at privacy@civicpulse.in to exercise these rights. You may also opt out of non-essential communications at any time.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">We use cookies and similar technologies to enhance your experience, analyze usage patterns, and personalize content. You can manage cookie preferences through your browser settings.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">If you have any questions about this Privacy Policy, please contact us at privacy@civicpulse.in or write to us at: Civic Pulse India, 123 Civic Center, Connaught Place, New Delhi - 110001.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
