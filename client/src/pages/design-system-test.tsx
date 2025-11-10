/**
 * Design System Test Page
 *
 * Showcases all nature-themed components and design tokens.
 * View at: /design-system-test
 */

import {
  CircularProgress,
  HexagonalCard,
  BloomAnimation,
  PollinatorIcon,
  NatureLoader,
  HoneyLoader,
} from '@/components/nature';

export default function DesignSystemTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-garden-dawn via-white to-hive-wax p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-serif font-bold text-garden-soil">
            FloreSer Design System
          </h1>
          <p className="text-lg text-garden-stem font-body">
            Nature-inspired components for My Garden and My Hive
          </p>
        </div>

        {/* Color Palette */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold text-garden-soil">
            Color Palette
          </h2>

          {/* Garden Theme */}
          <div>
            <h3 className="text-lg font-body font-medium text-garden-stem mb-3">
              Garden Theme (Client Dashboard)
            </h3>
            <div className="grid grid-cols-7 gap-4">
              {[
                { name: 'dawn', color: 'bg-garden-dawn' },
                { name: 'leaf', color: 'bg-garden-leaf' },
                { name: 'bloom', color: 'bg-garden-bloom' },
                { name: 'soil', color: 'bg-garden-soil' },
                { name: 'mist', color: 'bg-garden-mist' },
                { name: 'petal', color: 'bg-garden-petal' },
                { name: 'stem', color: 'bg-garden-stem' },
              ].map(({ name, color }) => (
                <div key={name} className="text-center space-y-2">
                  <div className={`h-16 rounded-lg ${color} border border-gray-200`} />
                  <p className="text-sm font-body">{name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hive Theme */}
          <div>
            <h3 className="text-lg font-body font-medium text-hive-gold mb-3">
              Hive Theme (Facilitator Dashboard)
            </h3>
            <div className="grid grid-cols-7 gap-4">
              {[
                { name: 'honey', color: 'bg-hive-honey' },
                { name: 'amber', color: 'bg-hive-amber' },
                { name: 'comb', color: 'bg-hive-comb' },
                { name: 'nectar', color: 'bg-hive-nectar' },
                { name: 'gold', color: 'bg-hive-gold' },
                { name: 'wax', color: 'bg-hive-wax' },
                { name: 'royal', color: 'bg-hive-royal' },
              ].map(({ name, color }) => (
                <div key={name} className="text-center space-y-2">
                  <div className={`h-16 rounded-lg ${color} border border-gray-200`} />
                  <p className="text-sm font-body">{name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold text-garden-soil">
            Typography
          </h2>
          <div className="space-y-3 bg-white p-6 rounded-lg border border-garden-leaf/20">
            <p className="text-4xl font-serif text-garden-soil">
              Playfair Display (Headings)
            </p>
            <p className="text-lg font-body text-garden-stem">
              Inter (Body Text) - Clean, modern, readable
            </p>
            <p className="text-sm font-body text-gray-600">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        </section>

        {/* Circular Progress */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold text-garden-soil">
            Circular Progress
          </h2>
          <div className="flex gap-8 flex-wrap items-center bg-white p-6 rounded-lg border border-garden-leaf/20">
            <CircularProgress value={25} size={100} theme="garden" label="25%" />
            <CircularProgress value={50} size={120} theme="garden" label="50%" />
            <CircularProgress value={75} size={100} theme="garden" label="75%" />
            <CircularProgress value={100} size={120} theme="garden" label="100%" />
            <CircularProgress value={60} size={100} theme="hive" label="60%" />
            <CircularProgress value={80} size={120} theme="hive" label="80%" />
          </div>
        </section>

        {/* Hexagonal Cards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold text-garden-soil">
            Hexagonal Cards (My Hive)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <HexagonalCard variant="honey">
              <h3 className="text-xl font-serif font-semibold">Calendar</h3>
              <p className="text-sm mt-2">3 sessions today</p>
            </HexagonalCard>
            <HexagonalCard variant="amber">
              <h3 className="text-xl font-serif font-semibold">Earnings</h3>
              <p className="text-sm mt-2">$1,250 this month</p>
            </HexagonalCard>
            <HexagonalCard variant="comb">
              <h3 className="text-xl font-serif font-semibold">Analytics</h3>
              <p className="text-sm mt-2">95% satisfaction</p>
            </HexagonalCard>
          </div>
        </section>

        {/* Animations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold text-garden-soil">
            Bloom Animation
          </h2>
          <div className="flex gap-8 flex-wrap items-center justify-center bg-white p-8 rounded-lg border border-garden-leaf/20">
            <BloomAnimation petalCount={6} size={120} color="#F4C2C2" />
            <BloomAnimation petalCount={8} size={150} color="#9CA986" />
            <BloomAnimation petalCount={5} size={100} color="#F4C430" />
          </div>
        </section>

        {/* Pollinator Icons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold text-garden-soil">
            Pollinator Icons
          </h2>
          <div className="flex gap-8 flex-wrap items-center bg-white p-6 rounded-lg border border-garden-leaf/20">
            <div className="text-center space-y-2">
              <PollinatorIcon archetype="bee" size="lg" theme="hive" />
              <p className="text-sm font-body">Bee</p>
            </div>
            <div className="text-center space-y-2">
              <PollinatorIcon archetype="hummingbird" size="lg" theme="garden" />
              <p className="text-sm font-body">Hummingbird</p>
            </div>
            <div className="text-center space-y-2">
              <PollinatorIcon archetype="butterfly" size="lg" theme="garden" />
              <p className="text-sm font-body">Butterfly</p>
            </div>
            <div className="text-center space-y-2">
              <PollinatorIcon archetype="beetle" size="lg" theme="hive" />
              <p className="text-sm font-body">Beetle</p>
            </div>
          </div>
        </section>

        {/* Loaders */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold text-garden-soil">
            Loading States
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-garden-dawn p-8 rounded-lg border border-garden-leaf/20">
              <NatureLoader message="Tending your garden..." size="md" />
            </div>
            <div className="bg-hive-wax p-8 rounded-lg border border-hive-amber/20">
              <HoneyLoader message="Gathering nectar..." size="md" />
            </div>
          </div>
        </section>

        {/* Animations Showcase */}
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold text-garden-soil">
            Tailwind Animations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border border-garden-leaf/20 text-center">
              <div className="w-12 h-12 bg-garden-bloom rounded-full mx-auto animate-bloom" />
              <p className="text-sm font-body mt-3">Bloom</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-garden-leaf/20 text-center">
              <div className="w-12 h-12 bg-garden-leaf rounded-lg mx-auto animate-petal-fade" />
              <p className="text-sm font-body mt-3">Petal Fade</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-garden-leaf/20 text-center">
              <div className="w-12 h-12 bg-garden-stem rounded-lg mx-auto animate-sprout" />
              <p className="text-sm font-body mt-3">Sprout</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-hive-amber/20 text-center">
              <div className="w-12 h-12 bg-hive-honey rounded-full mx-auto animate-honey-drip" />
              <p className="text-sm font-body mt-3">Honey Drip</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
