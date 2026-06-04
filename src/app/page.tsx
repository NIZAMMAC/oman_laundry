export default function Home() {
  return (
    <div className="container animate-fade-in" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      
      <section className="flex flex-col items-center text-center gap-8" style={{ marginBottom: '6rem' }}>
        <div style={{ maxWidth: '800px' }}>
          <h1 className="h1">
            Premium Laundry & Dry Cleaning by <span style={{ color: '#0088ff' }}>SIMS</span> <span style={{ color: '#ff3366' }}>AI</span> Laundry360
          </h1>
          <p className="p-large">
            Fresh clothes delivered to your door. We handle wash & fold, dry cleaning, and ironing with the utmost care. Schedule a pickup in seconds.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/book" className="btn-primary">
              Schedule Pickup
            </a>
            <a href="#services" className="btn-secondary">
              View Services
            </a>
          </div>
        </div>
      </section>

      <section id="services" style={{ marginBottom: '6rem' }}>
        <h2 className="h2 text-center" style={{ marginBottom: '3rem' }}>Our Services</h2>
        <div className="flex justify-center gap-8" style={{ flexWrap: 'wrap' }}>
          
          <div className="glass-card animate-float" style={{ flex: '1', minWidth: '300px', maxWidth: '350px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👕</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Wash & Fold</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Perfect for your everyday laundry. We wash, dry, and neatly fold your clothes.
            </p>
          </div>

          <div className="glass-card animate-float" style={{ flex: '1', minWidth: '300px', maxWidth: '350px', animationDelay: '0.2s' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👔</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Dry Cleaning</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Professional dry cleaning for your delicate fabrics and formal wear.
            </p>
          </div>

          <div className="glass-card animate-float" style={{ flex: '1', minWidth: '300px', maxWidth: '350px', animationDelay: '0.4s' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Ironing</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Crisp, wrinkle-free ironing service so you always look your best.
            </p>
          </div>

        </div>
      </section>

      <section className="glass-card text-center">
        <h2 className="h2">Ready for fresh clothes?</h2>
        <p className="p-large" style={{ margin: '0 auto 2rem auto', maxWidth: '600px' }}>
          Join thousands of satisfied customers in Oman who trust us with their laundry.
        </p>
        <a href="/book" className="btn-primary">
          Get Started Now
        </a>
      </section>

    </div>
  );
}
