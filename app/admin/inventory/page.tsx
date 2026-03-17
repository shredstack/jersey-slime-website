import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Slime Inventory',
}

const slimeItems = [
  { id: '1', name: 'Cotton Candy Cloud Slime', color: '#FF6B9D', stock: 24, price: '$12.99' },
  { id: '2', name: 'Galaxy Glitter Slime', color: '#C084FC', stock: 18, price: '$14.99' },
  { id: '3', name: 'Ocean Breeze Slime', color: '#5EEAD4', stock: 30, price: '$11.99' },
  { id: '4', name: 'Butter Slime - Vanilla', color: '#FDE047', stock: 15, price: '$13.99' },
  { id: '5', name: 'Glow-in-the-Dark Slime', color: '#4ADE80', stock: 12, price: '$15.99' },
  { id: '6', name: 'Crunchy Bead Slime', color: '#7DD3FC', stock: 20, price: '$12.99' },
]

export default function AdminInventoryPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Slime Inventory</h1>
        <button className="rounded-lg bg-brand-pink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-pink/90 transition-colors">
          Add New Slime
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {slimeItems.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{item.price}</p>
                <p className="text-sm text-gray-500">Stock: {item.stock}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Edit
              </button>
              <button className="flex-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
