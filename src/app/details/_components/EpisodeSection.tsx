'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Anime, Episode } from '@/types'
import { PlayCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { formatTitle } from '@/lib/utils'

interface EpisodeSectionProps {
  data: Anime
  episodes: Episode[]
}

export default function EpisodeSection({
  episodes,
  data,
}: EpisodeSectionProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEpisodes =
    episodes.filter(
      (episode) =>
        episode?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        episode?.number?.toString().includes(searchTerm)
    ) || []

  return (
    <div className='flex-1'>
      <h3 className='pb-5'>Episodes</h3>
      <Input
        type='text'
        placeholder='Search episodes...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='mb-5 p-2 border border-gray-300 rounded'
      />
      {episodes.length ? (
        <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {filteredEpisodes.map((episode) => (
            <Link
              key={episode.id}
              href={`/watch?id=${data.id}&episodeId=${episode.id}`}
            >
              <EpisodeCard episode={episode} />
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className='flex items-center justify-center flex-col gap-5'>
            <div className='relative aspect-video h-52 mt-10'>
              <Image
                className='object-cover group-hover:-z-10'
                src={data.image}
                alt={`${formatTitle(data.title)} image`}
                fill
              />
            </div>
            <p className='text-center'>No episodes available</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <Card
      key={episode.id}
      className='overflow-hidden shadow-lg transition-all hover:scale-105 cursor-pointer relative group'
    >
      <div className='absolute bg-black/50 group-hover:inset-0 flex items-center justify-center'>
        <PlayCircle className='size-10' />
      </div>
      <div className='relative aspect-video'>
        <Image
          className='object-cover group-hover:-z-10'
          src={episode.image}
          alt={'episode ' + episode.number}
          fill
        />
      </div>
      <CardDescription className='px-2 line-clamp-2'>
        {episode.number} - {episode.title}
      </CardDescription>
    </Card>
  )
}
