import { PageHero } from "@/components/ui/PageHero";
import { CardList } from "@/components/ui/CardList";
import { RichCTA } from "@/components/ui/RichCTA";

const flights = [
  { id: "1", title: "Kigali to Dubai", subtitle: "From $450 Round Trip", description: "Direct flights available via RwandAir or Emirates." },
  { id: "2", title: "Kigali to London", subtitle: "From $750 Round Trip", description: "Connecting flights with seamless layovers." },
  { id: "3", title: "Kigali to New York", subtitle: "From $950 Round Trip", description: "Best rates for trans-Atlantic journeys." },
];

export default function FlightBookingPage() {
  return (
    <div className="min-h-screen">
      <PageHero title="Flight Booking" subtitle="Secure the best routes and rates for your global travels." />
      <main className="shell py-16 lg:py-24 space-y-16">
        <div>
          <h2 className="font-display text-3xl text-bone mb-8 text-center">Popular Routes</h2>
          <CardList items={flights} />
        </div>
        <RichCTA title="Looking for corporate rates?" description="We offer special negotiated fares for group and corporate bookings." buttonText="Request a Quote" buttonHref="/contact" />
      </main>
    </div>
  );
}