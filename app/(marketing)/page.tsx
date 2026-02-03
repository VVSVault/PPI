import {
  Hero,
  PostShowcase,
  RiderCallout,
  LockboxSection,
  ValueProposition,
  TripCallout,
  FAQSection,
  CTABanner,
} from '@/components/marketing'

export default function HomePage() {
  return (
    <>
      <Hero />
      <PostShowcase />
      <RiderCallout />
      <LockboxSection />
      <ValueProposition />
      <TripCallout />
      <FAQSection />
      <CTABanner />
    </>
  )
}
