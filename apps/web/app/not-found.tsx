import Link from 'next/link'
import { Button } from '@/components/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-black to-gray-900 text-white px-4">
      <div className="text-center">
        <h1 className="font-display text-8xl sm:text-9xl text-brand-blue mb-4">404</h1>
        <h2 className="font-display text-3xl sm:text-4xl mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <Link href="/">
          <Button>Go Back Home</Button>
        </Link>
      </div>
    </div>
  )
}
