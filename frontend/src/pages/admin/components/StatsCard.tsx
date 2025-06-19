import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

type StatsCardProp = {
    label: string,
    value: string,
    iconColor: string,
    bgColor: string,
    icon: React.ElementType
}
const StatsCard = ({ label, value, iconColor, bgColor, icon: Icon }: StatsCardProp) => {

    return (
        <Card className='bg-zinc-800 border-zinc-700 hover:bg-zinc-700 transition-colors'>
            <CardContent className='p-6'>
                <div className='flex items-center gap-4'>
                    <div className={`p-3 rounded-lg ${bgColor}`}>
                        <Icon className={`size-6 ${iconColor}`} />
                    </div>

                    <div>
                        <p className='text-sm text-zinc-400'>{label}</p>
                        <p className='text-2xl font-bold'>{value}</p>
                    </div>

                </div>

            </CardContent>
        </Card>
    )
}

export default StatsCard
