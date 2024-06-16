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

// Utility function to ensure URL ends with a slash
function ensureUrlEndsWithSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`
}

// Adjusting environment variables to ensure they end with a slash
const BASE_URL = ensureUrlEndsWithSlash(process.env.BACKEND_URL as string)

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
}
