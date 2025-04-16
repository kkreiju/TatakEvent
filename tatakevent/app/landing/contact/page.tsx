"use client";

import ContactHeader from "@/components/contact/contact-header";
import ContactInfoSection from "@/components/contact/contact-info-section";
import ContactMap from "@/components/contact/contact-map";
import ContactForm from "@/components/contact/contact-form";

export default function ContactPage() {
  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <ContactHeader />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Panel */}
            <div className="space-y-8">
              <ContactInfoSection />
              <ContactMap />
            </div>

            {/* Right Panel - Contact Form */}
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
