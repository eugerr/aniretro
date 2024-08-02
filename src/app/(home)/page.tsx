import { cache } from '@/lib/cache'

import AnimeCard, { AnimeCardSkeleton } from '@/components/AnimeCard'
import { Button } from '@/components/ui/button'
import { getAnime } from '@/lib/anime'
import { FetchResults } from '@/types'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { Suspense } from 'react'
import { Hero } from './_components/Hero'

const getAnimeWithCache = (category: string) =>
  cache(() => getAnime(category, 1, 10), ['/', `get${category}Anime`], {
    revalidate: 60 * 60 * 24,
  })

const getTrendingAnime = getAnimeWithCache('Trending')
const getPopularAnime = getAnimeWithCache('Popular')
const getTopRatedAnime = getAnimeWithCache('TopRated')
const getUpcomingAnime = getAnimeWithCache('Upcoming')

export default function HomePage() {
  return (
    <div className='my-2 space-y-10'>
      {/* Hero Section */}
      <Hero animeFetcher={getTrendingAnime} />

      {/* First Row */}
      <div className='flex flex-col md:flex-row gap-10'>
        <AnimeGridSection title='Trending' animeFetcher={getTrendingAnime} />
        <AnimeGridSection title='Popular' animeFetcher={getPopularAnime} />
      </div>

      {/* Second Row */}
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
  // change " " to "-" and lowercase
  const urlTitle = `?type=${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className='space-y-4 flex-1'>
      <div className='flex gap-4 justify-between'>
        <h2 className='text-xl md:text-2xl font-bold'>{title}</h2>
        {/* <Button
          variant='expandIcon'
          Icon={ArrowRightIcon}
          iconPlacement='right'
          asChild
        >
          <Link href={urlTitle} className='space-x-2'>
            View All
          </Link>
        </Button> */}
      </div>
      <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        <Suspense
          fallback={Array.from({ length: 8 }).map((_, index) => (
            <AnimeCardSkeleton key={index} />
          ))}
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
