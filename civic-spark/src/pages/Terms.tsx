import { Layout } from '@/components/layout/Layout';

const Terms = () => {
  return (
    <Layout>
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <span className="badge-primary mb-4 inline-block">Legal</span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: January 15, 2024</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto prose prose-lg">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">By accessing and using the Civic Pulse India platform ("Platform"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Eligibility</h2>
              <p className="text-muted-foreground leading-relaxed">You must be at least 16 years of age to use this Platform. By using the Platform, you represent that you are at least 16 years old. Users under 18 must have parental consent.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground leading-relaxed">You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You agree to provide accurate, current, and complete information during registration and to update it as necessary.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Acceptable Use</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">When using our Platform, you agree NOT to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Submit false, misleading, or fraudulent reports</li>
                <li>Upload offensive, defamatory, or illegal content</li>
                <li>Impersonate another person or entity</li>
                <li>Use the Platform for commercial solicitation</li>
                <li>Attempt to gain unauthorized access to the Platform</li>
                <li>Interfere with or disrupt the Platform's functionality</li>
                <li>Misuse the points or reward system</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Content Ownership</h2>
              <p className="text-muted-foreground leading-relaxed">You retain ownership of content you submit (photos, descriptions, etc.). By submitting content, you grant us a non-exclusive, royalty-free license to use, display, and share it for the purposes of issue resolution, impact reporting, and platform improvement.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Issue Reporting</h2>
              <p className="text-muted-foreground leading-relaxed">While we strive to ensure every reported issue reaches the appropriate authority, we do not guarantee resolution timelines or outcomes. We act as a facilitator between citizens and municipal bodies.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Points & Rewards</h2>
              <p className="text-muted-foreground leading-relaxed">Civic Points are earned through legitimate participation and have no monetary value. We reserve the right to modify the points system, adjust point values, or revoke points earned through fraudulent activity.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">Civic Pulse India is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Platform, including but not limited to direct, indirect, incidental, or consequential damages.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">We reserve the right to suspend or terminate your account at any time for violation of these terms. You may also delete your account at any time through your profile settings.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of New Delhi.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">11. Contact</h2>
              <p className="text-muted-foreground leading-relaxed">For questions about these Terms, contact us at legal@civicpulse.in or write to: Civic Pulse India, 123 Civic Center, Connaught Place, New Delhi - 110001.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
