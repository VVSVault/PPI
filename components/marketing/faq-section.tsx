'use client'

import { motion } from 'framer-motion'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui'

const faqs = [
  {
    id: 'installation-speed',
    question: 'How quickly can you install my sign?',
    answer:
      'We offer same-day installation for orders placed before 12pm. Standard installation is within 24 hours. We also offer scheduled installations if you need the sign up on a specific date.',
  },
  {
    id: 'service-areas',
    question: 'What areas do you service?',
    answer:
      'We currently service the greater Lexington area and Central Kentucky, including Fayette, Scott, Woodford, Jessamine, Clark, Madison, and Bourbon counties. Contact us for service in other areas.',
  },
  {
    id: 'damaged-posts',
    question: 'What happens if my post is damaged?',
    answer:
      'If your post is damaged due to normal wear or weather, we\'ll replace it for our standard replacement fee. If the damage was caused by our installation or service, we\'ll replace it at no charge.',
  },
  {
    id: 'own-signs',
    question: 'Can I use my own signs?',
    answer:
      'Yes, we can install your own signs on our posts. Just provide the sign during scheduling or have it ready at the property. Standard installation fees apply.',
  },
  {
    id: 'schedule-removal',
    question: 'How do I schedule a removal?',
    answer:
      'Log into your dashboard and click "Schedule Removal" next to any active installation. You can also call us directly for same-day removal requests.',
  },
  {
    id: 'payment-terms',
    question: 'What are your payment terms?',
    answer:
      'We invoice weekly for all services rendered. Payment is due within 14 days. We accept all major credit cards, ACH transfers, and checks. Set up autopay in your dashboard for convenience.',
  },
]

const FAQSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to know about our service.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion className="border border-gray-200 rounded-xl overflow-hidden">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="px-6 border-b border-gray-200 last:border-0">
                <AccordionTrigger value={faq.id} className="text-left py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent value={faq.id} className="pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}

export { FAQSection }
