const partners = [
  { name: 'Ministry of Urban Development', type: 'Government' },
  { name: 'NITI Aayog', type: 'Government' },
  { name: 'Tata Trusts', type: 'CSR Partner' },
  { name: 'Infosys Foundation', type: 'CSR Partner' },
  { name: 'Reliance Foundation', type: 'CSR Partner' },
  { name: 'Municipal Corporation of Delhi', type: 'Municipal' },
];

export function PartnersSection() {
  return (
    <section className="section-padding border-t border-border/30">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="badge-secondary mb-4 inline-block">Our Partners</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Leaders Across Sectors
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Government bodies, CSR partners, and municipal corporations working together for civic change.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="card-elevated p-6 text-center group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/8 border border-primary/10 mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/15 group-hover:border-primary/25 transition-all">
                <span className="text-xl font-bold text-primary">
                  {partner.name.charAt(0)}
                </span>
              </div>
              <p className="font-medium text-foreground text-sm mb-1">{partner.name}</p>
              <p className="text-xs text-muted-foreground">{partner.type}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
