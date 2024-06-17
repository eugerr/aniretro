'use client'

import { Skeleton } from '@/components/ui/skeleton'
import Player from '@/components/video/Player'
import { useCountdown } from '@/hooks/useCountdown'
import {
  fetchAnimeData,
  fetchAnimeEmbeddedEpisodes,
  fetchAnimeEpisodes,
  fetchAnimeInfo,
} from '@/lib/anime'
import { Anime, Episode } from '@/types'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState, useCallback, useRef } from 'react'

const LOCAL_STORAGE_KEYS = {
  LAST_WATCHED_EPISODE: 'last-watched-',
  WATCHED_EPISODES: 'watched-episodes-',
  LAST_ANIME_VISITED: 'last-anime-visited',
}

export default function WatchPage() {
  const videoPlayerContainerRef = useRef<HTMLDivElement>(null)
  const [videoPlayerWidth, setVideoPlayerWidth] = useState('100%')
  const router = useRouter()
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

  const searchParams = useSearchParams()

  const id = searchParams?.get('id')
  const animeTitle = searchParams?.get('animeTitle')
  const episodeNumber = searchParams?.get('episodeNumber')

  const STORAGE_KEYS = {
    SOURCE_TYPE: `source-[${id}]`,
    LANGUAGE: `subOrDub-[${id}]`,
  }

  const [selectedBackgroundImage, setSelectedBackgroundImage] =
    useState<string>('')
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [currentEpisode, setCurrentEpisode] = useState<Episode>({
    id: '0',
    number: 1,
    title: '',
    image: '',
    description: '',
    imageHash: '',
    airDate: '',
  })

  const [animeInfo, setAnimeInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showNoEpisodesMessage, setShowNoEpisodesMessage] = useState(false)
  const [lastKeypressTime, setLastKeypressTime] = useState(0)
  const [sourceType, setSourceType] = useState(
    () => localStorage.getItem(STORAGE_KEYS.SOURCE_TYPE) || 'default'
  )
  const [embeddedVideoUrl, setEmbeddedVideoUrl] = useState('')
  const [language, setLanguage] = useState(
    () => localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'sub'
  )
  const [downloadLink, setDownloadLink] = useState('')
  const nextEpisodeAiringTime =
    animeInfo && animeInfo.nextAiringEpisode
      ? animeInfo.nextAiringEpisode.airingTime * 1000
      : null

  const nextEpisodenumber = animeInfo?.nextAiringEpisode?.episode
  const countdown = useCountdown(nextEpisodeAiringTime)
  const currentEpisodeIndex = episodes.findIndex(
    (ep) => ep.id === currentEpisode.id
  )
  const [languageChanged, setLanguageChanged] = useState(false)

  // TODO FETCH VIDSTREAMING VIDEO
  const fetchVidstreamingUrl = async (episodeId: string) => {
    try {
      const embeddedServers = await fetchAnimeEmbeddedEpisodes(episodeId)
      if (embeddedServers && embeddedServers.length > 0) {
        const vidstreamingServer = embeddedServers.find(
          (server: any) => server.name === 'Vidstreaming'
        )
        const selectedServer = vidstreamingServer || embeddedServers[0]
        setEmbeddedVideoUrl(selectedServer.url)
      }
    } catch (error) {
      console.error(
        'Error fetching Vidstreaming servers for episode ID:',
        episodeId,
        error
      )
    }
  }

  // TODO FETCH GOGO VIDEO
  const fetchEmbeddedUrl = async (episodeId: string) => {
    try {
      const embeddedServers = await fetchAnimeEmbeddedEpisodes(episodeId)
      if (embeddedServers && embeddedServers.length > 0) {
        const gogoServer = embeddedServers.find(
          (server: any) => server.name === 'Gogo server'
        )
        const selectedServer = gogoServer || embeddedServers[0]
        setEmbeddedVideoUrl(selectedServer.url)
      }
    } catch (error) {
      console.error(
        'Error fetching gogo servers for episode ID:',
        episodeId,
        error
      )
    }
  }

  // TODO SAVE TO LOCAL STORAGE NAVIGATED/CLICKED EPISODES
  const updateWatchedEpisodes = (episode: Episode) => {
    const watchedEpisodesJson = localStorage.getItem(
      LOCAL_STORAGE_KEYS.WATCHED_EPISODES + id
    )
    const watchedEpisodes: Episode[] = watchedEpisodesJson
      ? JSON.parse(watchedEpisodesJson)
      : []
    if (!watchedEpisodes.some((ep) => ep.id === episode.id)) {
      watchedEpisodes.push(episode)
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.WATCHED_EPISODES + id,
        JSON.stringify(watchedEpisodes)
      )
    }
  }

  // TODO UPDATES CURRENT EPISODE INFORMATION, UPDATES WATCHED EPISODES AND NAVIGATES TO NEW URL
  const handleEpisodeSelect = useCallback(
    async (selectedEpisode: Episode) => {
      const animeTitle = selectedEpisode.id.split('-episode')[0]
      setCurrentEpisode({
        id: selectedEpisode.id,
        number: selectedEpisode.number,
        image: selectedEpisode.image,
        title: selectedEpisode.title,
        description: selectedEpisode.description,
        imageHash: selectedEpisode.imageHash,
        airDate: selectedEpisode.airDate,
      })

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.LAST_WATCHED_EPISODE + id,
        JSON.stringify({
          id: selectedEpisode.id,
          title: selectedEpisode.title,
          number: selectedEpisode.number,
        })
      )
      updateWatchedEpisodes(selectedEpisode)

      router.replace(
        `/watch/${id}/${encodeURI(animeTitle)}/${selectedEpisode.number}`
      )
      await new Promise((resolve) => setTimeout(resolve, 100))
    },
    [id, router, updateWatchedEpisodes]
  )

  // TODO UPDATE DOWNLOAD LINK WHEN EPISODE ID CHANGES
  const updateDownloadLink = useCallback((link: string) => {
    setDownloadLink(link)
  }, [])

  // TODO AUTOPLAY BUTTON TOGGLE PROPS
  const handleEpisodeEnd = async () => {
    const nextEpisodeIndex = currentEpisodeIndex + 1
    if (nextEpisodeIndex >= episodes.length) {
      console.log('No more episodes.')
      return
    }
    handleEpisodeSelect(episodes[nextEpisodeIndex])
  }

  // TODO NAVIGATE TO NEXT AND PREVIOUS EPISODES WITH SHIFT+N/P KEYBOARD COMBINATIONS (500MS DELAY)
  const onPrevEpisode = () => {
    const prevIndex = currentEpisodeIndex - 1
    if (prevIndex >= 0) {
      handleEpisodeSelect(episodes[prevIndex])
    }
  }
  const onNextEpisode = () => {
    const nextIndex = currentEpisodeIndex + 1
    if (nextIndex < episodes.length) {
      handleEpisodeSelect(episodes[nextIndex])
    }
  }

  //----------------------------------------------USEFFECTS----------------------------------------------
  // TODO SETS DEFAULT SOURCE TYPE AND LANGUGAE TO DEFAULT AND SUB
  useEffect(() => {
    const defaultSourceType = 'default'
    const defaultLanguage = 'sub'
    setSourceType(
      localStorage.getItem(getSourceTypeKey(id || '')) || defaultSourceType
    )
    setLanguage(
      localStorage.getItem(getLanguageKey(id || '')) || defaultLanguage
    )
  }, [id])

  // TODO SAVES LANGUAGE PREFERENCE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem(getLanguageKey(id?.toString()), language)
  }, [language, id])

  //FETCHES ANIME DATA AND ANIME INFO AS BACKUP
  useEffect(() => {
    let isMounted = true
    const fetchInfo = async () => {
      if (!id) {
        console.error('Anime ID is null.')
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const info = await fetchAnimeData(id)
        if (isMounted) {
          setAnimeInfo(info)
        }
      } catch (error) {
        console.error(
          'Failed to fetch anime data, trying fetchAnimeInfo as a fallback:',
          error
        )
        try {
          const fallbackInfo = await fetchAnimeInfo(id)
          if (isMounted) {
            setAnimeInfo(fallbackInfo)
          }
        } catch (fallbackError) {
          console.error(
            'Also failed to fetch anime info as a fallback:',
            fallbackError
          )
        } finally {
          if (isMounted) setLoading(false)
        }
      }
    }

    fetchInfo()

    return () => {
      isMounted = false
    }
  }, [id])

  // TODO FETCHES ANIME EPISODES BASED ON LANGUAGE, ANIME ID AND UPDATES COMPONENTS
  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      setLoading(true)
      if (!id) return
      try {
        const isDub = language === 'dub'
        const animeData = await fetchAnimeEpisodes(id, undefined, isDub)
        if (isMounted && animeData) {
          const transformedEpisodes = animeData
            .filter((ep: any) => ep.id.includes('-episode-')) // TODO Continue excluding entries without '-episode-'
            .map((ep: any) => {
              const episodePart = ep.id.split('-episode-')[1]
              // TODO New regex to capture the episode number including cases like "7-5"
              const episodeNumberMatch = episodePart.match(/^(\d+(?:-\d+)?)/)
              return {
                ...ep,
                number: episodeNumberMatch ? episodeNumberMatch[0] : ep.number,
                id: ep.id,
                title: ep.title,
                image: ep.image,
              }
            })
          setEpisodes(transformedEpisodes)
          const navigateToEpisode = (() => {
            if (languageChanged) {
              const currentEpisodeNumber =
                episodeNumber || currentEpisode.number
              return (
                transformedEpisodes.find(
                  (ep: any) => ep.number === currentEpisodeNumber
                ) || transformedEpisodes[transformedEpisodes.length - 1]
              )
            } else if (animeTitle && episodeNumber) {
              const episodeId = `${animeTitle}-episode-${episodeNumber}`
              return (
                transformedEpisodes.find((ep: any) => ep.id === episodeId) ||
                router.replace(`/watch/${id}`)
              )
            } else {
              const savedEpisodeData = localStorage.getItem(
                LOCAL_STORAGE_KEYS.LAST_WATCHED_EPISODE + id
              )
              const savedEpisode = savedEpisodeData
                ? JSON.parse(savedEpisodeData)
                : null
              return savedEpisode
                ? transformedEpisodes.find(
                    (ep: any) => ep.number === savedEpisode.number
                  ) || transformedEpisodes[0]
                : transformedEpisodes[0]
            }
          })()

          if (navigateToEpisode) {
            setCurrentEpisode({
              id: navigateToEpisode.id,
              number: navigateToEpisode.number,
              image: navigateToEpisode.image,
              title: navigateToEpisode.title,
              description: navigateToEpisode.description,
              imageHash: navigateToEpisode.imageHash,
              airDate: navigateToEpisode.airDate,
            })

            const newAnimeTitle = navigateToEpisode.id.split('-episode-')[0]

            router.replace(
              `/watch/${id}/${newAnimeTitle}/${navigateToEpisode.number}`
            )
            setLanguageChanged(false) // TODO Reset the languageChanged flag after handling the navigation
          }
        }
      } catch (error) {
        console.error('Failed to fetch episodes:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    // TODO Last visited cache to order continue watching
    const updateLastVisited = () => {
      if (!animeInfo || !id) return // TODO Ensure both animeInfo and animeId are available

      const lastVisited = localStorage.getItem(
        LOCAL_STORAGE_KEYS.LAST_ANIME_VISITED
      )
      const lastVisitedData = lastVisited ? JSON.parse(lastVisited) : {}
      lastVisitedData[id] = {
        timestamp: Date.now(),
        titleEnglish: animeInfo.title.english, // TODO Assuming animeInfo contains the title in English
        titleRomaji: animeInfo.title.romaji, // TODO Assuming animeInfo contains the title in Romaji
      }

      localStorage.setItem(
        LOCAL_STORAGE_KEYS.LAST_ANIME_VISITED,
        JSON.stringify(lastVisitedData)
      )
    }

    if (id) {
      updateLastVisited()
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [
    id,
    animeTitle,
    episodeNumber,
    language,
    languageChanged,
    currentEpisode.number,
    animeInfo,
    router,
  ])

  // TODO FETCH EMBEDDED EPISODES IF VIDSTREAMING OR GOGO HAVE BEEN SELECTED
  useEffect(() => {
    if (sourceType === 'vidstreaming' && currentEpisode.id) {
      fetchVidstreamingUrl(currentEpisode.id).catch(console.error)
    } else if (sourceType === 'gogo' && currentEpisode.id) {
      fetchEmbeddedUrl(currentEpisode.id).catch(console.error)
    }
  }, [sourceType, currentEpisode.id])

  // TODO UPDATE BACKGROUND IMAGE TO ANIME BANNER IF WIDTH IS UNDER 500PX / OR USE ANIME COVER IF NO BANNER FOUND
  useEffect(() => {
    const updateBackgroundImage = () => {
      const episodeImage = currentEpisode.image
      const bannerImage = animeInfo?.cover || animeInfo?.artwork[3].img
      if (episodeImage && episodeImage !== animeInfo.image) {
        const img = new Image()
        img.onload = () => {
          if (img.width > 500) {
            setSelectedBackgroundImage(episodeImage)
          } else {
            setSelectedBackgroundImage(bannerImage)
          }
        }
        img.onerror = () => {
          setSelectedBackgroundImage(bannerImage)
        }
        img.src = episodeImage
      } else {
        setSelectedBackgroundImage(bannerImage)
      }
    }
    if (animeInfo && currentEpisode.id !== '0') {
      updateBackgroundImage()
    }
  }, [animeInfo, currentEpisode])

  // TODO UPDATES VIDEOPLAYER WIDTH WHEN WINDOW GETS RESIZED
  useEffect(() => {
    updateVideoPlayerWidth()
    const handleResize = () => {
      updateVideoPlayerWidth()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateVideoPlayerWidth])

  // TODO UPDATES EPISODE LIST MAX HEIGHT BASED ON VIDEO PLAYER CURRENT HEIGHT
  useEffect(() => {
    const updateMaxHeight = () => {
      if (videoPlayerContainerRef.current) {
        const height = videoPlayerContainerRef.current.offsetHeight
        setMaxEpisodeListHeight(`${height}px`)
      }
    }
    updateMaxHeight()
    window.addEventListener('resize', updateMaxHeight)
    return () => window.removeEventListener('resize', updateMaxHeight)
  }, [])

  // TODO SAVES SOURCE TYPE PREFERENCE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem(getSourceTypeKey(id?.toString()), sourceType)
  }, [sourceType, id])

  // TODO NAVIGATE TO NEXT AND PREVIOUS EPISODES WITH SHIFT+N/P KEYBOARD COMBINATIONS (500MS DELAY)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const targetTagName = (event.target as HTMLElement).tagName.toLowerCase()
      if (targetTagName === 'input' || targetTagName === 'textarea') {
        return
      }
      if (!event.shiftKey || !['N', 'P'].includes(event.key.toUpperCase()))
        return
      const now = Date.now()
      if (now - lastKeypressTime < 200) return
      setLastKeypressTime(now)
      const currentIndex = episodes.findIndex(
        (ep) => ep.id === currentEpisode.id
      )
      if (
        event.key.toUpperCase() === 'N' &&
        currentIndex < episodes.length - 1
      ) {
        const nextEpisode = episodes[currentIndex + 1]
        handleEpisodeSelect(nextEpisode)
      } else if (event.key.toUpperCase() === 'P' && currentIndex > 0) {
        const prevEpisode = episodes[currentIndex - 1]
        handleEpisodeSelect(prevEpisode)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [episodes, currentEpisode, handleEpisodeSelect, lastKeypressTime])

  // TODO SET PAGE TITLE TO MIRURO + ANIME TITLE
  useEffect(() => {
    if (animeInfo && animeInfo.title) {
      document.title =
        'Watch ' +
        (animeInfo.title.english ||
          animeInfo.title.romaji ||
          animeInfo.title.romaji ||
          '') +
        ' | Miruro'
    }
  }, [animeInfo])

  // TODO No idea
  useEffect(() => {
    let isMounted = true
    const fetchInfo = async () => {
      if (!id) {
        console.error('Anime ID is undefined.')
        return
      }
      try {
        const info = await fetchAnimeData(id)
        if (isMounted) {
          setAnimeInfo(info)
        }
      } catch (error) {
        console.error('Failed to fetch anime info:', error)
      }
    }
    fetchInfo()
    return () => {
      isMounted = false
    }
  }, [id])

  // TODO SHOW NO EPISODES DIV IF NO RESPONSE AFTER 10 SECONDS
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!episodes || episodes.length === 0) {
        setShowNoEpisodesMessage(true)
      }
    }, 10000)
    return () => clearTimeout(timeoutId)
  }, [loading, episodes])

  // TODO SHOW NO EPISODES DIV IF NOT LOADING AND NO EPISODES FOUND
  useEffect(() => {
    if (!loading && episodes.length === 0) {
      setShowNoEpisodesMessage(true)
    } else {
      setShowNoEpisodesMessage(false)
    }
  }, [loading, episodes])

  return (
    <div>
      {animeInfo &&
      animeInfo.status === 'Not yet aired' &&
      animeInfo.trailer ? (
        <div style={{ textAlign: 'center' }}>
          <strong>
            <h2>Time Remaining:</h2>
          </strong>
          {animeInfo &&
          animeInfo.nextAiringEpisode &&
          countdown !== 'Airing now or aired' ? (
            <p>
              <Bell /> {countdown}
            </p>
          ) : (
            <p>Unknown</p>
          )}
          {animeInfo.trailer && (
            <iframe
              className='relative top-0 left-0 md:w-full w-3/4 h-full text-center'
              src={`https://www.youtube.com/embed/${animeInfo.trailer.id}`}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          )}
        </div>
      ) : !showNoEpisodesMessage ? (
        <div className='text-center my-5 md:my-10'>
          <h2>No episodes found {':('}</h2>
          <div className='mb-5 max-w-full'>no episode image</div>
          <Link href='/'>go back</Link>
        </div>
      ) : (
        <div className='flex gap-2 flex-col items-center'>
          {showNoEpisodesMessage && (
            <>
              <div className='relative w-full flex-1'>
                {loading ? (
                  <Skeleton className='aspect-video' />
                ) : sourceType === 'default' ? (
                  <Player
                    episodeId={currentEpisode.id}
                    malId={animeInfo?.malId}
                    banner={selectedBackgroundImage}
                    updateDownloadLink={updateDownloadLink}
                    onEpisodeEnd={handleEpisodeEnd}
                    onPrevEpisode={onPrevEpisode}
                    onNextEpisode={onNextEpisode}
                    animeTitle={
                      animeInfo?.title?.english || animeInfo?.title?.romaji
                    }
                  />
                ) : (
                  <iframe
                    allowFullScreen
                    className='min-h-[50vh]'
                    src={embeddedVideoUrl}
                  />
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
