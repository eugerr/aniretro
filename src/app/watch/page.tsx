import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  fetchAnimeData,
  fetchAnimeEmbeddedEpisodes,
  fetchAnimeEpisodes,
  fetchAnimeInfo,
} from '@/lib/anime'
import { cache } from '@/lib/cache'
import { formatTitle } from '@/lib/utils'
import { Anime, Episode } from '@/types'
import { Suspense } from 'react'
import Player from './_components/video/player'
import Link from 'next/link'

export default function WatchPage({
  searchParams,
}: {
  searchParams: { id: string }
}) {
  // fetch anime data
  const getAnimeData = cache(
    () => {
      return fetchAnimeData(searchParams.id)
    },
    ['/watch', 'getAnimeData', searchParams.id],
    { revalidate: 60 * 60 * 24 }
  )

  // fetch anime data backup in case the other fail
  const getAnimeData2 = cache(
    () => {
      return fetchAnimeInfo(searchParams.id)
    },
    ['/watch', 'getAnimeData2', searchParams.id],
    { revalidate: 60 * 60 * 24 }
  )

  // fetch the episodes
  const getAnimeEpisodes = cache(
    () => {
      return fetchAnimeEpisodes(searchParams.id)
    },
    ['/watch', 'getAnimeEpisodes', searchParams.id],
    { revalidate: 60 * 60 * 24 }
  )

  // embedded episodes in case we cant fetch episodes
  const getAnimeEmbeddedEpisodes = cache(
    () => {
      return fetchAnimeEmbeddedEpisodes(searchParams.id)
    },
    ['/watch', 'getAnimeEmbeddedEpisodes', searchParams.id],
    { revalidate: 60 * 60 * 24 }
  )

  return (
    <div>
      {/* Anime Episodes */}
      <AnimeEpisodeSection
        id={searchParams.id}
        info={getAnimeData}
        info2={getAnimeData2}
        episodes={getAnimeEpisodes}
        embeddedEpisodes={getAnimeEmbeddedEpisodes}
      />

      {/* Anime Info */}
      <AnimeInfoSection info={getAnimeData} info2={getAnimeData2} />
    </div>
  )
}

interface AnimeEpisodeProps {
  episodes: () => Promise<Episode[]>
  embeddedEpisodes: () => Promise<Episode>
  info: () => Promise<Anime>
  info2: () => Promise<Anime>
  id: string
}

function AnimeEpisodeSection({
  episodes,
  embeddedEpisodes,
  info,
  info2,
  id,
}: AnimeEpisodeProps) {
  return (
    <div>
      <Suspense fallback={<h1>loading...</h1>}>
        <AnimeEpisodeSuspense
          id={id}
          info={info}
          info2={info2}
          episodes={episodes}
          embeddedEpisodes={embeddedEpisodes}
        />
      </Suspense>
    </div>
  )
}

async function AnimeEpisodeSuspense({
  episodes,
  embeddedEpisodes,
  info,
  info2,
  id,
}: AnimeEpisodeProps) {
  const ep = await episodes()
  const animeData = await info()
  const animeData2 = await info2()

  let animeTitle

  if (animeData) {
    animeTitle = animeData.title
  } else {
    animeTitle = animeData2.title
  }
  if (ep) {
    return (
      <Card>
        <CardHeader className='py-2'>{formatTitle(animeTitle)}</CardHeader>
        <CardContent className='flex justify-between gap-5'>
          <Player />
          <div className='flex-1'>
            <h3>Episodes</h3>

            <div className='flex flex-col'>
              {ep.map((item) => (
                <Link
                  href={`/watch?id=${id}&episodeId=${item.id}`}
                  key={item.id}
                >
                  {item.number}
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  } else {
    const embeddedEp = await embeddedEpisodes()
    return <Card>{JSON.stringify(embeddedEp)}</Card>
  }
}

interface AnimeInfoProps {
  info: () => Promise<Anime>
  info2: () => Promise<Anime>
}

function AnimeInfoSection({ info, info2 }: AnimeInfoProps) {
  return (
    <div>
      <Suspense fallback={<h1>loading...</h1>}>
        <AnimeInfoSuspense info={info} info2={info2} />
      </Suspense>
    </div>
  )
}

async function AnimeInfoSuspense({ info, info2 }: AnimeInfoProps) {
  const data = await info()
  const data2 = await info2()

  if (data) {
    return <Card>{formatTitle(data.title)}</Card>
  } else {
    return <Card>{formatTitle(data2.title)}</Card>
  }
}
