import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Shipping times vary depending on your location. Domestic orders typically arrive within 5-7 business days, while international orders may take 2-3 weeks. You'll receive tracking information via email once your order ships.",
  },
  {
    question: "Are all items authentic?",
    answer:
      "Yes, we guarantee the authenticity of all our products. Each item is carefully sourced from local artisans and verified for authenticity. If you have any concerns about an item, please contact our support team.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for all items in original condition. If you're not satisfied with your purchase, simply contact us within 30 days for a full refund or exchange.",
  },
  {
    question: "Do you offer gift wrapping?",
    answer:
      "Yes! We offer complimentary gift wrapping for all orders. Simply add a note during checkout, and we'll beautifully wrap your items with a personalized message.",
  },
  {
    question: "How do you handle payment?",
    answer:
      "We collect payment information after order confirmation. Our team will contact you within 24 hours to arrange payment via credit card, bank transfer, or other secure methods.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Once your order ships, you'll receive an email with a tracking number. You can use this to monitor your package's journey from our warehouse to your doorstep.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. International orders may be subject to customs duties and taxes.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach our support team via email at hello@souvenirstories.com, phone at +1 (234) 567-890, or through our contact form. We typically respond within 24 hours.",
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions about our products and services
          </p>
        </div>

        {/* FAQ Accordion */}
        <Card className="p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-lg font-semibold hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-4">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        {/* Still Have Questions */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <a href="/contact" className="text-primary hover:underline font-semibold">
            Contact us →
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}
