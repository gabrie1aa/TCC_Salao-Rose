import Image from 'next/image'
import { Heart } from 'lucide-react'
import { salonConfig } from '@/lib/salon-data'
import { MapPin } from 'lucide-react'

export function AuthHero() {
  return (
    <div className="relative h-56 w-full overflow-hidden">
      <Image
        src="/images/hero-salon.png"
        alt="Cabelo sendo finalizado com escova no Salão da Rose"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-primary/45" />
      <div className="absolute inset-x-0 bottom-8 flex flex-col items-center text-center text-primary-foreground">
        <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-white shadow-md">
          <Heart className="size-7 fill-primary text-primary" />
        </div>
        <h1 className="font-display text-2xl font-semibold">
          {salonConfig.name.replace(' da Rose', '')} da <span className="italic">Rose</span>
        </h1>
        <p className="mt-1 flex items-center gap-1 text-xs text-primary-foreground/85">
          <MapPin className="size-3" />
          {salonConfig.city}
        </p>
      </div>
    </div>
  )
}
