'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export default function LayoutShell({
  header,
  footer,
  children,
}: {
  header: ReactNode
  footer: ReactNode
  children: ReactNode
}) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      {header}
      <main className="min-h-screen">{children}</main>
      {footer}
    </>
  )
}
