import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import {
  fetchAnimeData,
  fetchAnimeEmbeddedEpisodes,
  fetchAnimeEpisodes,
  fetchAnimeInfo,
  fetchAnimeStreamingLinks,
} from '@/lib/anime'
import { cache } from '@/lib/cache'
import { formatTitle } from '@/lib/utils'
import { Anime, Episode } from '@/types'
import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import parse from 'html-react-parser'
import EpisodeSection from './_components/EpisodeSection'

const getAnimeDataWithCache = (
  fn: (params: string) => Promise<any>,
  params: string,
  cacheKey: string
) => {
  return cache(
    () => fn(params),
    ['/details', `${cacheKey}-${params}`],
    { revalidate: false } // Cache duration in seconds (1 day)
  )
}

export default function DetailsPage({
  searchParams,
}: {
  searchParams: { id: string; episodeId: string }
}) {
  const id = searchParams.id.toString()

  // fetch anime data from params
  const getAnimeData = getAnimeDataWithCache(fetchAnimeData, id, 'getAnimeData')

  // backup anime data
  const getAnimeInfo = getAnimeDataWithCache(fetchAnimeInfo, id, 'getAnimeInfo')

  // fetch episodes
  const getAnimeEpisodes = getAnimeDataWithCache(
    fetchAnimeEpisodes,
    id,
    'getAnimeEpisodes'
  )

  return (
    <div>
      <Suspense fallback={<h1>looading...</h1>}>
        <AnimeSectionSuspense
          getAnimeEpisodes={getAnimeEpisodes}
          getAnimeInfo={getAnimeInfo}
          getAnimeData={getAnimeData}
        />
      </Suspense>
    </div>
  )
}

interface AnimeSectionProps {
  getAnimeEpisodes: () => Promise<Episode[]>
  getAnimeData: () => Promise<Anime>
  getAnimeInfo: () => Promise<Anime>
}

async function AnimeSectionSuspense({
  getAnimeData,
  getAnimeInfo,
  getAnimeEpisodes,
}: AnimeSectionProps) {
  let data
  let episodes

  try {
    data = await getAnimeData()
  } catch (error) {
    console.error('Error fetching primary anime data:', error)
    try {
      data = await getAnimeInfo()
    } catch (backupError) {
      console.error('Error fetching backup anime data:', backupError)
      return <div>Error loading anime data. Please try again later.</div>
    }
  }

  if (!data.episodes) {
    episodes = await getAnimeEpisodes()
  }
  console.log(data)
  console.log(episodes)
  return (
    <Card>
      <CardHeader className='py-2 text-lg md:text-3xl'>
        <h3>{formatTitle(data.title)}</h3>
      </CardHeader>
      <CardContent>
        <EpisodeSection data={data} episodes={episodes || data.episodes} />
      </CardContent>
      <CardFooter className='flex flex-col items-start'>
        <p>{parse(data.description)}</p>
      </CardFooter>
    </Card>
  )
}
