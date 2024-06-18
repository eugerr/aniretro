import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React, { Suspense } from 'react'
import { cache } from '@/lib/cache'
import {
  fetchAnimeData,
  fetchAnimeEpisodes,
  fetchAnimeStreamingLinks,
} from '@/lib/anime'
import { Anime, Episode, StreamingAnime } from '@/types'
import Player from './_components/Player'
import EpisodeSection from '../details/_components/EpisodeSection'
import { formatTitle } from '@/lib/utils'

export default function WatchPage({
  searchParams,
}: {
  searchParams: { id: string; episodeId: string }
}) {
  const getAnimeStreamingLinks = cache(
    () => {
      return fetchAnimeStreamingLinks(searchParams.episodeId)
    },
    ['/watch', 'getAnimeStreamingLinks', searchParams.episodeId],
    { revalidate: 60 * 60 * 24 }
  )

  const getAnimeData = cache(
    () => {
      return fetchAnimeData(searchParams.id)
    },
    ['/details', `getAnimeData-${searchParams.id}`],
    { revalidate: 60 * 60 * 24 }
  )

  const getAnimeEpisodes = cache(
    () => {
      return fetchAnimeEpisodes(searchParams.id)
    },
    ['/details', `getAnimeEpisodes-${searchParams.id}`],
    { revalidate: 60 * 60 * 24 }
  )

  return (
    <Card>
      <Suspense fallback={<h1>loading...</h1>}>
        <AnimePlayerSuspense
          getAnimeData={getAnimeData}
          getAnimeEpisodes={getAnimeEpisodes}
          getAnimeStreamingLinks={getAnimeStreamingLinks}
        />
      </Suspense>
    </Card>
  )
}

interface AnimePlayerProps {
  getAnimeStreamingLinks: () => Promise<StreamingAnime>
  getAnimeData: () => Promise<Anime>
  getAnimeEpisodes: () => Promise<Episode[]>
}

async function AnimePlayerSuspense({
  getAnimeStreamingLinks,
  getAnimeData,
  getAnimeEpisodes,
}: AnimePlayerProps) {
  const anime = await getAnimeData()
  const episodes = await getAnimeEpisodes()
  const streamingLinks = await getAnimeStreamingLinks()
  return (
    <Card>
      <CardHeader>
        <CardTitle>{formatTitle(anime.title)}</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col md:flex-row gap-5 p-2'>
        <Player
          anime={anime}
          episodes={episodes}
          streamingLinks={streamingLinks}
        />
        <EpisodeSection data={anime} episodes={episodes || anime.episodes} />
      </CardContent>
    </Card>
  )
}
