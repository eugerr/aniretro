import { getCurrentSeason, getNextSeason, year } from '@/hooks/useTime'
import axios from 'axios'

interface FetchOptions {
  type?: string
  season?: string
  format?: string
  sort?: string[]
  genres?: string[]
  id?: string
  year?: string
  status?: string
}

// Adjusting environment variables to ensure they end with a slash
const BASE_URL = `${process.env.BACKEND_URL}/`

async function fetchFromUrl(url: string) {
  const response = await axios.get(url)

  // After obtaining the response, verify it for errors or empty data

  if (
    response.status !== 200 ||
    (response.data.statusCode && response.data.statusCode >= 400)
  ) {
    const errorMessage = response.data.message || 'Unknown server error'
    throw new Error(
      `Server error: ${
        response.data.statusCode || response.status
      } ${errorMessage}`
    )
  }

  // Assuming response data is valid, Return the newly fetched data
  return response.data
}

// Function to fetch list of anime based on type (TopRated, Trending, Popular)
export async function getAnime(
  type: string,
  page: number = 1,
  perPage: number = 16,
  options: FetchOptions = {}
) {
  let url: string

  const params = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  })

  if (
    ['TopRated', 'Trending', 'Popular', 'TopAiring', 'Upcoming'].includes(type)
  ) {
    if (type === 'TopRated') {
      options = {
        type: 'ANIME',
        sort: ['["SCORE_DESC"]'],
      }
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&sort=${options.sort}&`
      console.log(url)
    } else if (type === 'Popular') {
      options = {
        type: 'ANIME',
        sort: ['["POPULARITY_DESC"]'],
      }
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&sort=${options.sort}&`
    } else if (type === 'Upcoming') {
      const season = getNextSeason() // This will set the season based on the current month
      options = {
        type: 'ANIME',
        season: season,
        year: year.toString(),
        status: 'NOT_YET_RELEASED',
        sort: ['["POPULARITY_DESC"]'],
      }
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&status=${options.status}&sort=${options.sort}&season=${options.season}&year=${options.year}&`
    } else if (type === 'TopAiring') {
      const season = getCurrentSeason() // This will set the season based on the current month
      options = {
        type: 'ANIME',
        season: season,
        year: year.toString(),
        status: 'RELEASING',
        sort: ['["POPULARITY_DESC"]'],
      }
      url = `${BASE_URL}meta/anilist/advanced-search?type=${options.type}&status=${options.status}&sort=${options.sort}&season=${options.season}&year=${options.year}&`
    } else {
      url = `${BASE_URL}meta/anilist/${type.toLowerCase()}`
    }
    return await fetchFromUrl(url)
  }
}

export async function fetchAnimeEmbeddedEpisodes(episodeId: string) {
  const url = `${BASE_URL}meta/anilist/servers/${episodeId}`
  return await fetchFromUrl(url)
}

// Fetch Anime DATA Function
export async function fetchAnimeData(
  animeId: string,
  provider: string = 'gogoanime'
) {
  const params = new URLSearchParams({ provider })
  const url = `${BASE_URL}meta/anilist/data/${animeId}?${params.toString()}`

  return await fetchFromUrl(url)
}

// Fetch Anime INFO Function
export async function fetchAnimeInfo(
  animeId: string,
  provider: string = 'gogoanime'
) {
  const params = new URLSearchParams({ provider })
  const url = `${BASE_URL}meta/anilist/info/${animeId}?${params.toString()}`

  return await fetchFromUrl(url)
}

// Fetch Anime Episodes Function
export async function fetchAnimeEpisodes(
  animeId: string,
  provider: string = 'gogoanime',
  dub: boolean = false
) {
  const params = new URLSearchParams({ provider, dub: dub ? 'true' : 'false' })
  const url = `${BASE_URL}meta/anilist/episodes/${animeId}?${params.toString()}`

  return await fetchFromUrl(url)
}

interface FetchSkipTimesParams {
  malId: string
  episodeNumber: string
  episodeLength?: string
}

// Function to fetch skip times for an anime episode
export async function fetchSkipTimes({
  malId,
  episodeNumber,
  episodeLength = '0',
}: FetchSkipTimesParams) {
  // Constructing the URL with query parameters
  const types = ['ed', 'mixed-ed', 'mixed-op', 'op', 'recap']
  const url = new URL(
    `${process.env.SKIP_TIMES}v2/skip-times/${malId}/${episodeNumber}`
  )
  url.searchParams.append('episodeLength', episodeLength.toString())
  types.forEach((type) => url.searchParams.append('types[]', type))

  // Use the fetchFromProxy function to make the request and handle caching
  return await fetchFromUrl(url.toString())
}

// Function to fetch anime streaming links
export async function fetchAnimeStreamingLinks(episodeId: string) {
  const url = `${BASE_URL}meta/anilist/watch/${episodeId}`

  return await fetchFromUrl(url)
}
