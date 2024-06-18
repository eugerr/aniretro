'use client'

import { Button } from '@/components/ui/button'
import { formatTitle } from '@/lib/utils'
import { Anime, Episode, StreamingAnime } from '@/types'
import {
  MediaPlayer,
  MediaProvider,
  MediaSrc,
  MenuButton,
  Poster,
} from '@vidstack/react'
import {
  DefaultMenuButton,
  DefaultVideoLayout,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default'
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'

interface PlayerProps {
  streamingLinks: StreamingAnime
  anime: Anime
  episodes: Episode[]
}

const Player: React.FC<PlayerProps> = ({
  streamingLinks,
  anime,
  episodes,
}: PlayerProps) => {
  const searchParams = useSearchParams()
  const episodeId = searchParams.get('episodeId')

  const episodeNumber = episodes.find(
    (episode) => episode.id === episodeId
  )?.number

  const episodeThumbnail = episodes.find(
    (episode) => episode.id === episodeId
  )?.image

  const animeTitle = formatTitle(anime.title)

  const formattedSources = streamingLinks.sources.map((source) => ({
    src: source.url,
    type: source.isM3U8 ? 'application/x-mpegURL' : 'video/mp4',
    quality: source.quality,
  })) as any

  return (
    <div className='aspect-video flex-2'>
      <MediaPlayer
        className='h-full w-full'
        title={`${animeTitle} - Episode ${episodeNumber}`}
        src={formattedSources}
        streamType='on-demand'
        storage='storage-key'
        autoPlay
        hideControlsOnMouseLeave
        poster={episodeThumbnail}
      >
        <MediaProvider>
          <Poster
            className='vds-poster'
            src={episodeThumbnail}
            alt={`${animeTitle} - Episode ${episodeNumber} Image`}
          />
        </MediaProvider>
        <DefaultVideoLayout
          colorScheme='system'
          thumbnails='https://files.vidstack.io/sprite-fight/thumbnails.vtt'
          icons={defaultLayoutIcons}
        />
      </MediaPlayer>
    </div>
  )
}

export default Player
