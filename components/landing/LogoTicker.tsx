'use client'

import Image from 'next/image'

const insuranceLogos = [
    { name: 'LIC', logo: '/logos/lic.svg' },
    { name: 'HDFC Life', logo: '/logos/hdfc-life.svg' },
    { name: 'ICICI Prudential', logo: '/logos/icici-prudential.svg' },
    { name: 'SBI Life', logo: '/logos/sbi-life.svg' },
    { name: 'United India', logo: '/logos/united-india.svg' },
    { name: 'National Insurance', logo: '/logos/national-insurance.svg' },
    { name: 'AIG', logo: '/logos/aig.svg' },
    { name: 'Liberty Mutual', logo: '/logos/liberty-mutual.svg' },
    { name: 'Max Life', logo: '/logos/max-life.svg' },
    { name: 'Bajaj Allianz', logo: '/logos/bajaj-allianz.svg' },
    { name: 'Tata AIA', logo: '/logos/tata-aia.svg' },
    { name: 'Star Health', logo: '/logos/star-health.svg' },
]

export function LogoTicker() {
    return (
        <div className="w-full overflow-hidden bg-muted/30 py-10">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-center text-sm text-muted-foreground mb-8 font-medium uppercase tracking-wider">
                    Trusted by agents working with India's top insurers
                </p>
            </div>
            <div className="relative">
                {/* Gradient overlays for smooth fade effect */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted/30 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted/30 to-transparent z-10"></div>

                {/* Scrolling container */}
                <div className="flex animate-scroll">
                    {/* First set of logos + duplicate for seamless loop */}
                    {[...insuranceLogos, ...insuranceLogos].map((logo, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 mx-3 flex items-center justify-center"
                        >
                            <div
                                className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer hover:scale-105"
                            >
                                <Image
                                    src={logo.logo}
                                    alt={logo.name}
                                    width={160}
                                    height={50}
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
