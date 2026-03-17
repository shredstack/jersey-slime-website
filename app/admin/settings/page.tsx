import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Site Settings',
}

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Site Settings</h1>

      <form className="space-y-8 max-w-2xl">
        {/* Business Hours */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h2>
          <div className="space-y-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
              (day) => (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-28 text-sm font-medium text-gray-700">{day}</span>
                  <input
                    type="time"
                    defaultValue="10:00"
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                  />
                  <span className="text-gray-400">to</span>
                  <input
                    type="time"
                    defaultValue={day === 'Sunday' ? '17:00' : '20:00'}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                  />
                </div>
              )
            )}
          </div>
        </section>

        {/* Address */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Address</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                defaultValue="123 Slime Lane"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  defaultValue="Salt Lake City"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  defaultValue="UT"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                <input
                  type="text"
                  defaultValue="84101"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Phone */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Phone</h2>
          <input
            type="tel"
            defaultValue="(555) 123-4567"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
          />
        </section>

        {/* Social Media */}
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
              <input
                type="url"
                defaultValue="https://instagram.com/jerseyslimestudio38"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
              <input
                type="url"
                defaultValue="https://tiktok.com/@jerseyslimestudio38"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
              <input
                type="url"
                defaultValue="https://facebook.com/jerseyslimestudio38"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
              />
            </div>
          </div>
        </section>

        {/* Save */}
        <button
          type="button"
          className="rounded-lg bg-brand-pink px-8 py-3 text-sm font-semibold text-white hover:bg-brand-pink/90 transition-colors"
        >
          Save Settings
        </button>
      </form>
    </div>
  )
}
