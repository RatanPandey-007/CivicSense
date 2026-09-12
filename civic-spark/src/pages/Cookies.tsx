import { Layout } from '@/components/layout/Layout';

const Cookies = () => {
  return (
    <Layout>
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <span className="badge-primary mb-4 inline-block">Legal</span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: January 15, 2024</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl mx-auto prose prose-lg">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. What Are Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences, understand usage patterns, and improve your experience.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">We use cookies for the following purposes:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Essential Cookies:</strong> Required for the Platform to function properly (authentication, session management).</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our Platform to improve features.</li>
                <li><strong>Preference Cookies:</strong> Remember your settings like language and region preferences.</li>
                <li><strong>Performance Cookies:</strong> Monitor Platform performance and identify areas for optimization.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">We may use third-party services (such as Google Analytics) that set their own cookies. These cookies are governed by the respective third party's privacy policy.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Managing Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of our Platform. Most browsers allow you to block or delete cookies.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">If you have questions about our cookie practices, please contact us at privacy@civicpulse.in.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cookies;
