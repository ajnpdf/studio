import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Is it safe to upload my files?", a: "Absolutely. All files are encrypted using 256-bit SSL during transit and at rest. We never share your data with anyone." },
  { q: "How long are my files stored?", a: "On the free tier, files are automatically deleted after 24 hours. Pro users can choose to retain files for up to 30 days." },
  { q: "Are there file size limits?", a: "Free users can upload up to 100MB per file. Pro users get 2GB limits, and Business users have no hard limit." },
  { q: "What formats do you support?", a: "We support over 300 format combinations across documents, images, video, audio, and archives." },
  { q: "Do I need to install anything?", a: "No software is required. Everything runs directly in your web browser using cloud processing." },
  { q: "Can I use the API for my own app?", a: "Yes, our Developer API is available on Pro and Business plans with extensive documentation." },
  { q: "How does guest mode work?", a: "You can convert up to 3 files without an account. After that, we'll ask you to create a free account to continue." },
  { q: "Is there bulk processing?", a: "Yes, Business users can upload and process hundreds of files simultaneously using our batch tools." },
  { q: "Are conversions pixel-perfect?", a: "Our conversion engine uses original libraries to ensure no loss in quality, especially for images and docs." },
  { q: "How do I cancel my subscription?", a: "You can cancel anytime from your dashboard settings. You'll retain access until the end of your billing cycle." },
];

export function FaqAccordion() {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border rounded-2xl px-6 bg-card">
                <AccordionTrigger className="text-left font-bold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
