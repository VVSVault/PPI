'use client'

import { motion } from 'framer-motion'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui'

const faqs = [
  {
    id: 'installation-speed',
    question: 'How quickly can you install my sign?',
    answer:
      'We offer next day installation for orders placed before 4pm. We strive for same day installations for an expedite fee if possible. We can also schedule installations for a specific date.',
  },
  {
    id: 'service-areas',
    question: 'What areas do you serve?',
    answer:
      'We currently serve the greater Lexington, Central Kentucky, Louisville, and Cincinnati and surrounding areas!',
  },
  {
    id: 'damaged-posts',
    question: 'What happens if my post is damaged?',
    answer:
      'If your post is damaged due to weather or normal wear and tear, notify us and we will replace for no cost within 24 hours. We strive for same day service, and replacement orders are always on priority.',
  },
  {
    id: 'own-signs',
    question: 'Can I use my own signs?',
    answer:
      'Yes, we install your sign on our posts. Just provide the sign for us to hold in storage, or have ready for pickup at the property and we will install.',
  },
  {
    id: 'payment-terms',
    question: 'What are your payment terms?',
    answer:
      'Payment is made during each order for what you ordered. There are no storage fees and we will keep your inventory amounts available in your dashboard for anytime you need to order.',
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
