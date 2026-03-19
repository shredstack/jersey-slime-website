import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import InventoryManager from './InventoryManager'

export const metadata: Metadata = {
  title: 'Slime Inventory',
}

export default async function AdminInventoryPage() {
  const supabase = createServiceClient()
  const { data: inventory } = await supabase
    .from('slime_inventory')
    .select('*')
    .order('sort_order')
    .order('created_at')

  return <InventoryManager initialInventory={inventory ?? []} />
}
