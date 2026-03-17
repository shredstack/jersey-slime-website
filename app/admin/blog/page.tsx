import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Management',
}

const posts = [
  { id: '1', title: '5 Tips for Making the Perfect Slime at Home', status: 'published', date: 'Mar 10, 2026' },
  { id: '2', title: 'Why Slime Parties Are the Best Birthday Idea', status: 'published', date: 'Mar 5, 2026' },
  { id: '3', title: 'New Glow-in-the-Dark Experience Coming Soon!', status: 'draft', date: 'Mar 14, 2026' },
  { id: '4', title: 'The Science Behind Slime: A Fun Learning Activity', status: 'draft', date: 'Mar 12, 2026' },
  { id: '5', title: 'Our Top 10 Slime Recipes for Kids', status: 'published', date: 'Feb 28, 2026' },
]

export default function AdminBlogPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
        <button className="rounded-lg bg-brand-pink px-4 py-2 text-sm font-semibold text-white hover:bg-brand-pink/90 transition-colors">
          New Post
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-3 text-gray-900 font-medium">{post.title}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-700">{post.date}</td>
                  <td className="px-6 py-3 space-x-2">
                    <button className="text-brand-purple hover:text-brand-pink text-sm font-medium transition-colors">
                      Edit
                    </button>
                    <button className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
