import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-8">Privacy Policy</h1>

        <Card className="p-8 prose prose-invert max-w-none">
          <div className="space-y-8 text-foreground">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground">
                Souvenir Stories ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy
                Policy explains how we collect, use, disclose, and safeguard your information when you visit our
                website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">We may collect information about you in a variety of ways:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Personal identification information (name, email address, phone number, etc.)</li>
                <li>Billing and shipping address information</li>
                <li>Payment information (processed securely)</li>
                <li>Information about your browsing and purchase history</li>
                <li>Device information and usage data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Process and fulfill your orders</li>
                <li>Send you order confirmations and updates</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Improve our website and services</li>
                <li>Send promotional emails (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission
                over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
              <p className="text-muted-foreground mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <p className="text-muted-foreground mt-4">
                Email: privacy@souvenirstories.com
                <br />
                Address: 123 Travel Lane, Adventure City, AC 12345
              </p>
            </section>

            <section>
              <p className="text-sm text-muted-foreground">Last updated: January 2025</p>
            </section>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
