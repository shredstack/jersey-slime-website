'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

interface ProfileEditFormProps {
  initialName: string
  initialPhone: string
  email: string
}

export default function ProfileEditForm({ initialName, initialPhone, email }: ProfileEditFormProps) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(initialName)
  const [phone, setPhone] = useState(initialPhone)
  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState('')

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhone(e.target.value))
    setPhoneError('')
  }

  function validate() {
    let valid = true
    setNameError('')
    setPhoneError('')

    if (!name.trim()) {
      setNameError('Name is required')
      valid = false
    }

    if (phone) {
      const digits = phone.replace(/\D/g, '')
      if (digits.length !== 10) {
        setPhoneError('Enter a valid 10-digit US phone number')
        valid = false
      }
    }

    return valid
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    setServerError('')

    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: name.trim(), phone: phone || null }),
    })

    setSaving(false)

    if (!res.ok) {
      setServerError('Something went wrong. Please try again.')
      return
    }

    setEditing(false)
    router.refresh()
  }

  function handleCancel() {
    setName(initialName)
    setPhone(initialPhone)
    setNameError('')
    setPhoneError('')
    setServerError('')
    setEditing(false)
  }

  if (!editing) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="text-gray-900 font-medium">{initialName || 'Not set'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-gray-900 font-medium">{email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="text-gray-900 font-medium">{initialPhone || 'Not set'}</p>
        </div>
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="full_name" className="block text-sm text-gray-500 mb-1">Name</label>
        <input
          id="full_name"
          type="text"
          value={name}
          onChange={e => { setName(e.target.value); setNameError('') }}
          autoComplete="name"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        />
        {nameError && <p className="mt-1 text-xs text-red-600">{nameError}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1">Email</label>
        <p className="text-gray-900 font-medium text-sm py-2.5">{email}</p>
        <p className="text-xs text-gray-400">Email cannot be changed here</p>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm text-gray-500 mb-1">Phone</label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="(555) 000-0000"
          autoComplete="tel"
          inputMode="numeric"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        />
        {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <div className="flex gap-3 pt-2">
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
