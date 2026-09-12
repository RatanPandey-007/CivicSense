import { Layout } from '@/components/layout/Layout';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, CheckCircle } from 'lucide-react';

const RequestData = () => {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container-custom text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Request Submitted!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your data request. Our team will review it and get back to you within 3-5 business days.
            </p>
            <Button variant="outline" onClick={() => setSubmitted(false)}>Submit Another Request</Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="hero-gradient">
        <div className="container-custom section-padding text-center">
          <BarChart3 className="w-12 h-12 text-primary mx-auto mb-6" />
          <span className="badge-primary mb-4 inline-block">Data Request</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Request <span className="text-primary">Custom Data</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Need specific civic data for research, CSR planning, or governance? Submit a request and our data team will prepare a custom report.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-2xl mx-auto">
          <div className="card-elevated p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Data Request Form</h2>
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="org">Organization</Label>
                  <Input id="org" placeholder="Company / Institution" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Your Role</Label>
                  <Input id="role" placeholder="e.g. Researcher, CSR Head" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataType">Type of Data Needed</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="city-wise">City-wise Impact Data</SelectItem>
                    <SelectItem value="category">Category-wise Issue Data</SelectItem>
                    <SelectItem value="trends">Trend Analysis</SelectItem>
                    <SelectItem value="volunteer">Volunteer Statistics</SelectItem>
                    <SelectItem value="resolution">Resolution Metrics</SelectItem>
                    <SelectItem value="custom">Custom / Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cities">Cities / Regions of Interest</Label>
                  <Input id="cities" placeholder="e.g. Mumbai, Delhi, Bengaluru" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Time Period</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                      <SelectItem value="all-time">All Time</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Data Request</Label>
                <Textarea id="purpose" placeholder="Briefly describe how you plan to use the data..." rows={3} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">Additional Details</Label>
                <Textarea id="details" placeholder="Any specific metrics, formats, or requirements..." rows={3} />
              </div>

              <Button type="submit" size="lg" className="w-full btn-gradient">
                Submit Data Request
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RequestData;
