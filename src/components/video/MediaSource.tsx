import { Bell, Captions, Download, Mic, Mic2, Share } from 'lucide-react'
import React, { useState } from 'react'

interface MediaSourceProps {
  sourceType: string
  setSourceType: (sourceType: string) => void
  language: string
  setLanguage: (language: string) => void
  downloadLink: string
  episodeId?: string
  airingTime?: string
  nextEpisodenumber?: string
}

const UpdatedContainer = 'flex justify-center mt-4 gap-4' // Tailwind classes for flex container

const Table = 'table-auto w-full text-sm font-bold mx-auto' // Tailwind classes for table

const TableCell = 'px-3 py-2 sm:text-center' // Tailwind classes for table cell

const ButtonWrapper = 'w-24 flex justify-center gap-2' // Tailwind classes for button wrapper

const ButtonBase =
  'flex-1 py-2 px-4 rounded cursor-pointer transition duration-200 bg-gray-200 text-gray-800 font-bold' // Base button styles

const Button = 'active:bg-blue-500 active:text-white' // Active button styles

const DownloadLink =
  'inline-flex items-center ml-2 py-2 px-4 gap-1 rounded cursor-pointer transition duration-300 bg-gray-200 text-gray-800 font-bold' // Download link styles

const ShareButton =
  'flex items-center ml-2 py-2 px-4 gap-1 rounded cursor-pointer transition duration-300 bg-gray-200 text-gray-800 font-bold' // Share button styles

const ResponsiveTableContainer = 'bg-gray-100 rounded-lg p-3' // Tailwind classes for responsive table container

const EpisodeInfoColumn = 'flex-grow block bg-gray-100 rounded-lg p-3' // Tailwind classes for episode info column

const MediaSource: React.FC<MediaSourceProps> = ({
  sourceType,
  setSourceType,
  language,
  setLanguage,
  downloadLink,
  episodeId,
  airingTime,
  nextEpisodenumber,
}) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <div className={UpdatedContainer}>
      <div className={EpisodeInfoColumn}>
        {episodeId ? (
          <>
            You&apos;re watching <strong>Episode {episodeId}</strong>
            <a
              href={downloadLink}
              className={DownloadLink}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Download className='h-4 w-4' />
            </a>
            <button className={ShareButton} onClick={handleShareClick}>
              <Share className='h-4 w-4' />
            </button>
            {isCopied && <p className='mt-2'>Copied to clipboard!</p>}
            <br />
            <br />
            <p>If current servers don&apos;t work, please try other servers.</p>
          </>
        ) : (
          'Loading episode information...'
        )}
        {airingTime && (
          <>
            <p>
              Episode <strong>{nextEpisodenumber}</strong> will air in{' '}
              <Bell className='h-4 w-4' />
              <strong> {airingTime}</strong>.
            </p>
          </>
        )}
      </div>
      <div className={ResponsiveTableContainer}>
        <table className={Table}>
          <tbody>
            <tr className='border-b'>
              <td className={TableCell}>
                <Captions className='h-4 w-4 mr-1 inline-block align-middle' />{' '}
                Sub
              </td>
              <td className={TableCell}>
                <div className={ButtonWrapper}>
                  <button
                    className={`${Button} ${
                      sourceType === 'default' && language === 'sub' && 'active'
                    }`}
                    onClick={() => {
                      setSourceType('default')
                      setLanguage('sub')
                    }}
                  >
                    Default
                  </button>
                </div>
              </td>
              <td className={TableCell}>
                <div className={ButtonWrapper}>
                  <button
                    className={`${Button} ${
                      sourceType === 'vidstreaming' &&
                      language === 'sub' &&
                      'active'
                    }`}
                    onClick={() => {
                      setSourceType('vidstreaming')
                      setLanguage('sub')
                    }}
                  >
                    Vidstream
                  </button>
                </div>
              </td>
              <td className={TableCell}>
                <div className={ButtonWrapper}>
                  <button
                    className={`${Button} ${
                      sourceType === 'gogo' && language === 'sub' && 'active'
                    }`}
                    onClick={() => {
                      setSourceType('gogo')
                      setLanguage('sub')
                    }}
                  >
                    Gogo
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td className={TableCell}>
                <Mic2 className='h-4 w-4 mr-1 inline-block align-middle' /> Dub
              </td>
              <td className={TableCell}>
                <div className={ButtonWrapper}>
                  <button
                    className={`${Button} ${
                      sourceType === 'default' && language === 'dub' && 'active'
                    }`}
                    onClick={() => {
                      setSourceType('default')
                      setLanguage('dub')
                    }}
                  >
                    Default
                  </button>
                </div>
              </td>
              <td className={TableCell}>
                <div className={ButtonWrapper}>
                  <button
                    className={`${Button} ${
                      sourceType === 'vidstreaming' &&
                      language === 'dub' &&
                      'active'
                    }`}
                    onClick={() => {
                      setSourceType('vidstreaming')
                      setLanguage('dub')
                    }}
                  >
                    Vidstream
                  </button>
                </div>
              </td>
              <td className={TableCell}>
                <div className={ButtonWrapper}>
                  <button
                    className={`${Button} ${
                      sourceType === 'gogo' && language === 'dub' && 'active'
                    }`}
                    onClick={() => {
                      setSourceType('gogo')
                      setLanguage('dub')
                    }}
                  >
                    Gogo
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MediaSource
