import { cache } from '@/lib/cache'

import { Hero } from './_components/Hero'
import { getAnime } from '@/lib/anime'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { FetchResults } from '@/types'
import AnimeCard, { AnimeCardSkeleton } from '@/components/AnimeCard'
import { ArrowRightIcon } from '@radix-ui/react-icons'

const getTrendingAnime = cache(
  () => {
    return getAnime('Trending', 1, 10)
  },
  ['/', 'getTrendingAnime'],
  { revalidate: 60 * 60 * 24 }
)

const getPopularAnime = cache(
  () => {
    return getAnime('Popular', 1, 10)
  },
  ['/', 'getPopularAnime'],
  { revalidate: 60 * 60 * 24 }
)

const getTopRatedAnime = cache(
  () => {
    return getAnime('TopRated', 1, 10)
  },
  ['/', 'getTopRatedAnime'],
  { revalidate: 60 * 60 * 24 }
)

const getUpcomingAnime = cache(
  () => {
    return getAnime('Upcoming', 1, 10)
  },
  ['/', 'getUpcomingAnime'],
  { revalidate: 60 * 60 * 24 }
)

export default function Page() {
  return (
    <div className='my-2 space-y-10'>
      <Hero animeFetcher={getTrendingAnime} />
      <div className='flex flex-col md:flex-row gap-10'>
        <AnimeGridSection title='Trending' animeFetcher={getTrendingAnime} />
        <AnimeGridSection title='Most Popular' animeFetcher={getPopularAnime} />
      </div>

      <div className='flex flex-col md:flex-row gap-10'>
        <AnimeGridSection title='Top Rated' animeFetcher={getTopRatedAnime} />
        <AnimeGridSection title='Upcoming' animeFetcher={getUpcomingAnime} />
      </div>
    </div>
  )
}

interface AnimeGridSectionProps {
  title: string
  animeFetcher: () => Promise<FetchResults>
}

function AnimeGridSection({ animeFetcher, title }: AnimeGridSectionProps) {
  return (
    <div className='space-y-4 flex-1'>
      <div className='flex gap-4 justify-between'>
        <h2 className='text-xl md:text-2xl font-bold'>{title}</h2>
        <Button
          variant='expandIcon'
          Icon={ArrowRightIcon}
          iconPlacement='right'
          asChild
        >
          <Link href='/products' className='space-x-2'>
            View All
          </Link>
        </Button>
      </div>
      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        <Suspense
          fallback={
            <>
              <AnimeCardSkeleton />
              <AnimeCardSkeleton />
              <AnimeCardSkeleton />
              <AnimeCardSkeleton />
            </>
          }
        >
          <AnimeSuspense animeFetcher={animeFetcher} />
        </Suspense>
      </div>
    </div>
  )
}

async function AnimeSuspense({
  animeFetcher,
}: {
  animeFetcher: () => Promise<FetchResults>
}) {
  return (await animeFetcher()).results.slice(0, 8).map((anime) => {
    return <AnimeCard key={anime.id} data={anime} />
  })
}
