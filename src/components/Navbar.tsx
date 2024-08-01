'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { MenuIcon, Moon, SearchIcon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { ComponentProps } from 'react'
import Logo from './Logo'

function ModeToggle() {
  const { setTheme } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NavLink(props: Omit<ComponentProps<typeof Link>, 'className'>) {
  const pathname = usePathname()
  return (
    <Link
      {...props}
      className={cn(
        'group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50',
        pathname === props.href && 'underline'
      )}
    />
  )
}

export default function Navbar() {
  const router = useRouter()
  return (
    <header className='flex justify-between h-10 md:h-20 w-full shrink-0 items-center gap-5  px-2 sm:px-4 md:px-6 my-2 md:my-0'>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon' className='md:hidden'>
            <MenuIcon className='h-6 w-6' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left'>
          <div className='flex items-center gap-2'>
            <Logo />
          </div>
          <div className='grid gap-2 py-6'>
            <Link
              href='/search'
              className='flex w-full items-center py-2 text-lg font-semibold'
              prefetch={false}
            >
              Search
            </Link>
            <Link
              href='#'
              className='flex w-full items-center py-2 text-lg font-semibold'
              prefetch={false}
            >
              Home
            </Link>
            <Link
              href='#'
              className='flex w-full items-center py-2 text-lg font-semibold'
              prefetch={false}
            >
              About
            </Link>
            <Link
              href='#'
              className='flex w-full items-center py-2 text-lg font-semibold'
              prefetch={false}
            >
              Products
            </Link>
            <Link
              href='#'
              className='flex w-full items-center py-2 text-lg font-semibold'
              prefetch={false}
            >
              Contact
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <div className='hidden md:flex items-center gap-2'>
        <Logo />
      </div>

      <div className='hidden md:flex md:mr-auto'>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href='/' legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Contact</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                  <li className='row-span-3'>
                    <NavigationMenuLink asChild>
                      <a
                        className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
                        href='/contact'
                      >
                        <div className='mb-2 mt-4 text-lg font-medium'>
                          Get in Touch
                        </div>
                        <p className='text-sm leading-tight text-muted-foreground'>
                          For potential clients or work opportunities, or if you
                          encounter any bugs in the app, please feel free to
                          reach out to me.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href='/contact/work' title='Work Inquiries'>
                    Contact me for potential client projects or job
                    opportunities.
                  </ListItem>
                  <ListItem href='/contact/bugs' title='Report a Bug'>
                    Let me know if you find any bugs or issues with the app.
                  </ListItem>
                  <ListItem href='/contact/general' title='General Inquiries'>
                    For any other questions or general information, feel free to
                    get in touch.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Built With</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
                  <ListItem
                    target='_blank'
                    title='Next.js'
                    href='https://nextjs.org'
                  >
                    A React framework for building server-side rendered and
                    static web applications.
                  </ListItem>
                  <ListItem
                    target='_blank'
                    title='shadcn/ui'
                    href='https://ui.shadcn.com/'
                  >
                    Beautifully designed components that you can copy and paste
                    into your apps. Accessible, customizable, and open source.
                  </ListItem>
                  <ListItem
                    target='_blank'
                    title='axios'
                    href='https://axios-http.com'
                  >
                    Promise-based HTTP client for the browser and Node.js, used
                    for making HTTP requests.
                  </ListItem>

                  <ListItem
                    target='_blank'
                    title='@vidstack/react'
                    href='https://vidstack.io'
                  >
                    A React library for building media players with support for
                    modern video streaming.
                  </ListItem>
                  <ListItem
                    target='_blank'
                    title='HLS.js'
                    href='https://github.com/video-dev/hls.js'
                  >
                    A JavaScript library for playing HLS (HTTP Live Streaming)
                    streams in browsers.
                  </ListItem>
                  <ListItem
                    target='_blank'
                    title='Tailwind CSS'
                    href='https://tailwindcss.com'
                  >
                    A utility-first CSS framework for creating custom designs
                    without having to leave your HTML.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <Button
        variant='expandIcon'
        className='md:mr-auto w-72 md:w-96 justify-between hover:scale-105 transition-all duration-300'
        Icon={SearchIcon}
        iconPlacement='right'
        onClick={() => router.push('/search')}
      >
        Search
      </Button>

      <ModeToggle />
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className='text-sm font-medium leading-none'>{title}</div>
          <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
]
