import React from 'react'

export const EmbedPlayer: React.FC<{ src: string }> = ({ src }) => {
  return (
    <div className='rounded-lg overflow-hidden bg-gray-100'>
      <iframe
        className='w-full h-full'
        src={src}
        allowFullScreen
        title='Embedded Player'
      />
    </div>
  )
}
