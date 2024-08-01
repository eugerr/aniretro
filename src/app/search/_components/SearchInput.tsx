'use client'

import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  function handleForm(e: FormEvent) {
    e.preventDefault()
    router.push(`/search?query=${searchTerm}`)
  }

  return (
    <form onSubmit={handleForm}>
      <Input
        type='text'
        placeholder='Search episodes...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='mb-5 p-2 border border-gray-300 rounded'
      />
    </form>
  )
}
