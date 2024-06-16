'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'

export default function WatchPage() {
  const videoPlayerContainerRef = useRef<HTMLDivElement>(null)
  const [videoPlayerWidth, setVideoPlayerWidth] = useState('100%')
  const getSourceTypeKey = (animeId: string | undefined) =>
    `source-[${animeId}]`
  const getLanguageKey = (animeId: string | undefined) =>
    `subOrDub-[${animeId}]`

  const updateVideoPlayerWidth = useCallback(() => {
    if (videoPlayerContainerRef.current) {
      const width = `${videoPlayerContainerRef.current.offsetWidth}px`
      setVideoPlayerWidth(width)
    }
  }, [setVideoPlayerWidth, videoPlayerContainerRef])

  const [maxEpisodeListHeight, setMaxEpisodeListHeight] =
    useState<string>('100%')

  return <div>WatchPage</div>
}
