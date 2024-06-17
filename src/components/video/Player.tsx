import { useEffect, useRef, useState } from 'react'
import './PlayerStyles.css' // Import your additional CSS styles if needed
import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
  type MediaPlayerInstance,
} from '@vidstack/react'

import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default'
import { CheckCheck, SkipBack, SkipForward } from 'lucide-react'
import { CheckboxIcon } from '@radix-ui/react-icons'
import { useSettings } from '../settings/SettingsProvider'
import { fetchAnimeStreamingLinks, fetchSkipTimes } from '@/lib/anime'

type PlayerProps = {
  episodeId: string
  banner?: string
  malId?: string
  updateDownloadLink: (link: string) => void
  onEpisodeEnd: () => Promise<void>
  onPrevEpisode: () => void
  onNextEpisode: () => void
  animeTitle?: string
}

type StreamingSource = {
  url: string
  quality: string
}

type SkipTime = {
  interval: {
    startTime: number
    endTime: number
  }
  skipType: string
}

type FetchSkipTimesResponse = {
  results: SkipTime[]
}

const Player = ({
  episodeId,
  banner,
  malId,
  updateDownloadLink,
  onEpisodeEnd,
  onPrevEpisode,
  onNextEpisode,
  animeTitle,
}: PlayerProps) => {
  const player = useRef<MediaPlayerInstance>(null)
  const [src, setSrc] = useState<string>('')
  const [vttUrl, setVttUrl] = useState<string>('')
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [skipTimes, setSkipTimes] = useState<SkipTime[]>([])
  const [totalDuration, setTotalDuration] = useState<number>(0)
  const [vttGenerated, setVttGenerated] = useState<boolean>(false)
  const episodeNumber = getEpisodeNumber(episodeId)
  const animeVideoTitle = animeTitle

  const { settings, setSettings } = useSettings()
  const { autoPlay, autoNext, autoSkip } = settings

  useEffect(() => {
    setCurrentTime(parseFloat(localStorage.getItem('currentTime') || '0'))

    fetchAndSetAnimeSource()
    fetchAndProcessSkipTimes()
    return () => {
      if (vttUrl) URL.revokeObjectURL(vttUrl)
    }
  }, [
    episodeId,
    malId,
    updateDownloadLink,
    fetchAndProcessSkipTimes,
    vttUrl,
    fetchAndSetAnimeSource,
  ])

  useEffect(() => {
    if (autoPlay && player.current) {
      player.current
        .play()
        .catch((e: any) =>
          console.log('Playback failed to start automatically:', e)
        )
    }
  }, [autoPlay, src])

  useEffect(() => {
    if (player.current && currentTime) {
      player.current.currentTime = currentTime
    }
  }, [currentTime])

  function onProviderChange(
    provider: MediaProviderAdapter | null,
    _nativeEvent: MediaProviderChangeEvent
  ) {
    if (isHLSProvider(provider)) {
      provider.config = {}
    }
  }

  function onLoadedMetadata() {
    if (player.current) {
      setTotalDuration(player.current.duration)
    }
  }

  function onTimeUpdate() {
    if (player.current) {
      const currentTime = player.current.currentTime
      const duration = player.current.duration || 1
      const playbackPercentage = (currentTime / duration) * 100
      const playbackInfo = {
        currentTime,
        playbackPercentage,
      }
      const allPlaybackInfo = JSON.parse(
        localStorage.getItem('all_episode_times') || '{}'
      )
      allPlaybackInfo[episodeId] = playbackInfo
      localStorage.setItem('all_episode_times', JSON.stringify(allPlaybackInfo))

      if (autoSkip && skipTimes.length) {
        const skipInterval = skipTimes.find(
          ({ interval }) =>
            currentTime >= interval.startTime && currentTime < interval.endTime
        )
        if (skipInterval) {
          player.current.currentTime = skipInterval.interval.endTime
        }
      }
    }
  }

  function generateWebVTTFromSkipTimes(
    skipTimes: FetchSkipTimesResponse,
    totalDuration: number
  ): string {
    let vttString = 'WEBVTT\n\n'
    let previousEndTime = 0

    const sortedSkipTimes = skipTimes.results.sort(
      (a, b) => a.interval.startTime - b.interval.startTime
    )

    sortedSkipTimes.forEach((skipTime, index) => {
      const { startTime, endTime } = skipTime.interval
      const skipType =
        skipTime.skipType.toUpperCase() === 'OP' ? 'Opening' : 'Outro'

      // Insert default title chapter before this skip time if there's a gap
      if (previousEndTime < startTime) {
        vttString += `${formatTime(previousEndTime)} --> ${formatTime(
          startTime
        )}\n`
        vttString += `${animeVideoTitle} - Episode ${episodeNumber}\n\n`
      }

      // Insert this skip time
      vttString += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`
      vttString += `${skipType}\n\n`
      previousEndTime = endTime

      // Insert default title chapter after the last skip time
      if (index === sortedSkipTimes.length - 1 && endTime < totalDuration) {
        vttString += `${formatTime(endTime)} --> ${formatTime(totalDuration)}\n`
        vttString += `${animeVideoTitle} - Episode ${episodeNumber}\n\n`
      }
    })

    return vttString
  }

  async function fetchAndProcessSkipTimes() {
    if (malId && episodeId) {
      const episodeNumber = getEpisodeNumber(episodeId)
      try {
        const response: FetchSkipTimesResponse = await fetchSkipTimes({
          malId: malId.toString(),
          episodeNumber,
        })
        const filteredSkipTimes = response.results.filter(
          ({ skipType }) => skipType === 'op' || skipType === 'ed'
        )
        if (!vttGenerated) {
          const vttContent = generateWebVTTFromSkipTimes(
            { results: filteredSkipTimes },
            totalDuration
          )
          const blob = new Blob([vttContent], { type: 'text/vtt' })
          const vttBlobUrl = URL.createObjectURL(blob)
          setVttUrl(vttBlobUrl)
          setSkipTimes(filteredSkipTimes)
          setVttGenerated(true)
        }
      } catch (error) {
        console.error('Failed to fetch skip times', error)
      }
    }
  }

  async function fetchAndSetAnimeSource() {
    try {
      const response = await fetchAnimeStreamingLinks(episodeId)
      const backupSource = response.sources.find(
        (source: StreamingSource) => source.quality === 'default'
      )
      if (backupSource) {
        setSrc(backupSource.url)
        updateDownloadLink(response.download)
      } else {
        console.error('Backup source not found')
      }
    } catch (error) {
      console.error('Failed to fetch anime streaming links', error)
    }
  }

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  function getEpisodeNumber(id: string): string {
    const parts = id.split('-')
    return parts[parts.length - 1]
  }

  const toggleAutoPlay = () => setSettings({ ...settings, autoPlay: !autoPlay })
  const toggleAutoNext = () => setSettings({ ...settings, autoNext: !autoNext })
  const toggleAutoSkip = () => setSettings({ ...settings, autoSkip: !autoSkip })

  const handlePlaybackEnded = async () => {
    if (!autoNext) return

    try {
      player.current?.pause()

      await new Promise((resolve) => setTimeout(resolve, 200)) // Delay for transition
      await onEpisodeEnd()
    } catch (error) {
      console.error('Error moving to the next episode:', error)
    }
  }

  return (
    <div
      className='animate-popIn'
      style={{
        animationDuration: '0.25s',
        animationTimingFunction: 'ease-in-out',
      }}
    >
      <MediaPlayer
        className='player'
        title={`${animeVideoTitle} - Episode ${episodeNumber}`}
        src={src}
        autoplay={autoPlay}
        crossorigin
        playsinline
        onLoadedMetadata={onLoadedMetadata}
        onProviderChange={onProviderChange}
        onTimeUpdate={onTimeUpdate}
        ref={player}
        aspectRatio='16/9'
        load='eager'
        posterLoad='eager'
        streamType='on-demand'
        storage='storage-key'
        keyTarget='player'
        onEnded={handlePlaybackEnded}
      >
        <MediaProvider>
          <Poster className='vds-poster' src={banner} alt='' />
          {vttUrl && (
            <Track kind='chapters' src={vttUrl} default label='Skip Times' />
          )}
        </MediaProvider>
        <DefaultAudioLayout icons={defaultLayoutIcons} />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
      <div
        className='player-menu'
        style={{
          backgroundColor: 'var(--global-div-tr)',
          borderRadius: 'var(--global-border-radius)',
        }}
      >
        <button
          className={`p-1 text-xs border-none mr-1 rounded cursor-pointer ${
            autoPlay ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
          onClick={toggleAutoPlay}
        >
          {autoPlay ? (
            <CheckCheck className='inline-block h-3 w-3 mb-0.5' />
          ) : (
            <CheckboxIcon className='inline-block h-3 w-3 mb-0.5' />
          )}{' '}
          Autoplay
        </button>
        <button
          className={`p-1 text-xs border-none rounded cursor-pointer ${
            autoSkip ? 'text-yellow-600' : 'bg-gray-200 text-gray-800'
          }`}
          onClick={toggleAutoSkip}
        >
          {autoSkip ? (
            <CheckCheck className='inline-block h-3 w-3 mb-0.5' />
          ) : (
            <CheckboxIcon className='inline-block h-3 w-3 mb-0.5' />
          )}{' '}
          Auto Skip
        </button>
        <button
          className='p-1 text-xs border-none rounded cursor-pointer'
          onClick={onPrevEpisode}
        >
          <SkipBack className='inline-block h-3 w-3 mb-0.5' /> Prev
        </button>
        <button
          className='p-1 text-xs border-none rounded cursor-pointer'
          onClick={onNextEpisode}
        >
          <SkipForward className='inline-block h-3 w-3 mb-0.5' /> Next
        </button>
        <button
          className={`p-1 text-xs border-none rounded cursor-pointer ${
            autoNext ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
          onClick={toggleAutoNext}
        >
          {autoNext ? (
            <CheckCheck className='inline-block h-3 w-3 mb-0.5' />
          ) : (
            <CheckboxIcon className='inline-block h-3 w-3 mb-0.5' />
          )}{' '}
          Auto Next
        </button>
      </div>
    </div>
  )
}

export default Player
