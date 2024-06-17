import { MediaPlayer, MediaProvider } from '@vidstack/react'
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default'
import { Poster } from '@vidstack/react'

export default function Player() {
  return (
    <div className='flex flex-col flex-1'>
      <h3></h3>
      <div className='aspect-video'>
        <MediaPlayer
          className='h-full w-full'
          title='Sprite Fight'
          src='https://files.vidstack.io/sprite-fight/hls/stream.m3u8'
        >
          <MediaProvider>
            <Poster
              className='vds-poster'
              src='https://files.vidstack.io/sprite-fight/poster.webp'
              alt='Girl walks into campfire with gnomes surrounding her friend ready for their next meal!'
            />
          </MediaProvider>
          <DefaultVideoLayout
            thumbnails='https://files.vidstack.io/sprite-fight/thumbnails.vtt'
            icons={defaultLayoutIcons}
          />
        </MediaPlayer>
      </div>
    </div>
  )
}
