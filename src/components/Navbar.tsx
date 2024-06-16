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
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { MenuIcon, Moon, SearchIcon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'
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
              href='#'
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

      <Button
        variant='expandIcon'
        className='md:mr-auto w-72 md:w-48 justify-between hover:scale-90 transition-all duration-300'
        Icon={SearchIcon}
        iconPlacement='right'
      >
        Search
      </Button>
      <div className='hidden md:flex'>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuLink asChild>
              <NavLink href='/'>Home</NavLink>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <NavLink href='#'>About</NavLink>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <NavLink href='#'>Products</NavLink>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <NavLink href='#'>Contact</NavLink>
            </NavigationMenuLink>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <ModeToggle />
    </header>
  )
}
