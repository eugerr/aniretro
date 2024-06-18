import { Badge, badgeVariants } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import { RemoveHTMLTags, cn, formatTitle } from '@/lib/utils'
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
  const { title, malId, cover, image, id } = props
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
      <Link
        className={cn(
          badgeVariants({ variant: 'secondary' }),
          'group flex items-center gap-1 not-prose w-fit'
        )}
        href={`https://myanimelist.net/anime/${malId}`}
        target='_blank'
      >
        Visit MAL
        <ArrowRight className='w-4 transition-all group-hover:-rotate-45' />
      </Link>
      <h1 className='font-bold text-2xl md:text-3xl text-white text-center'>
        {animeTitle}
      </h1>
      <Link
        className={cn(
          buttonVariants({ variant: 'gooeyLeft' }),
          'w-fit mx-auto md:mx-0'
        )}
        href={`/details?id=${id}`}
      >
        Watch Now
      </Link>
    </div>
  )
}
