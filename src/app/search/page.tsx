import AnimeCard, { AnimeCardSkeleton } from '@/components/AnimeCard'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { fetchAnimeSearchResults } from '@/lib/anime'
import { cache } from '@/lib/cache'
import { FetchResults } from '@/types'
import { Suspense } from 'react'
import SearchInput from './_components/SearchInput'

export default function Search({
  searchParams,
}: {
  searchParams: { query: string }
}) {
  const searchQuery = searchParams?.query

  // fetch anime data from params
  const getAnimeSearchResults = cache(
    () => {
      return fetchAnimeSearchResults(searchQuery)
    },
    ['/details', `getAnimeSearchResults-${searchQuery}`],
    { revalidate: 60 * 60 * 24 }
  )

  return (
    <Card>
      <CardHeader>Search for anime</CardHeader>
      <CardContent>
        <SearchInput />
        {searchQuery && (
          <AnimeGridSection
            title={`Search Results for ${searchQuery}`}
            animeFetcher={getAnimeSearchResults}
          />
        )}
      </CardContent>
    </Card>
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
  return (await animeFetcher()).results.map((anime) => {
    return <AnimeCard key={anime.id} data={anime} />
  })
}
