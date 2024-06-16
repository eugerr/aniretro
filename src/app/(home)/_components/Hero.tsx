import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { RemoveHTMLTags, formatTitle } from '@/lib/utils'
import { Anime, FetchResults } from '@/types'
import { ArrowRight, ArrowRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

export function Hero({
  animeFetcher,
}: {
  animeFetcher: () => Promise<FetchResults>
}) {
  return (
    <Carousel
      opts={{
        loop: true,
      }}
    >
      <CarouselContent>
        <Suspense
          fallback={
            <CarouselItem>
              <Skeleton className='w-full h-[40vh]' />
            </CarouselItem>
          }
        >
          <CustomCarouselItemSuspense animeFetcher={animeFetcher} />
        </Suspense>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

async function CustomCarouselItemSuspense({
  animeFetcher,
}: {
  animeFetcher: () => Promise<FetchResults>
}) {
  return (await animeFetcher()).results.map((product) => (
    <CarouselItem key={product.id}>
      <CustomCard {...product} />
    </CarouselItem>
  ))
}

function CustomCard(props: Anime) {
  const { title, description, malId, cover, image, id } = props
  const animeTitle = formatTitle(title)
  return (
    <div className='flex flex-col gap-8 relative rounded-md overflow-hidden p-3 h-full'>
      <Image
        src={cover}
        fill
        alt={`${animeTitle} Image`}
        className='hidden sm:block object-cover lg:object-cover -z-10'
      />

      <Image
        src={image}
        fill
        alt={`${animeTitle} Image`}
        className='sm:hidden block object-cover object-top lg:object-cover -z-10'
      />
      <div className='inset-0 absolute bg-gradient-to-t from-black/70 via-black/50 to-transparent -z-10' />
      <Badge className='not-prose w-fit' variant='secondary'>
        <Link
          className='group flex items-center gap-1'
          href={`https://myanimelist.net/anime/${malId}`}
          target='_blank'
        >
          Visit MAL
          <ArrowRight className='w-4 transition-all group-hover:-rotate-45' />
        </Link>
      </Badge>
      <h1 className='font-bold text-2xl text-white text-center'>
        {animeTitle}
      </h1>
      <Button className='w-fit mx-auto md:mx-0' variant='gooeyLeft'>
        Watch Now
      </Button>
    </div>
  )
}
