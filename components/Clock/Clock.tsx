import React, { useEffect, useState } from 'react'
import { Inter, Poppins } from 'next/font/google'
import './clock.css'

type Props = {}

const poppins = Poppins({
    subsets: ['latin'],
    weight: '100'
})

const Clock = (props: Props) => {

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []); // This effect runs on mount and cleans up on unmount

    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentTime.getDay()].slice(0, 3);
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][currentTime.getMonth()];
    const date = currentTime.getDate();
    const year = currentTime.getFullYear();

    return (
        <div className='relative flex items-center justify-center'>
            <div className={`w-[212px] h-[212px] bg-white bg-opacity-50 border-white border text-white rounded-full flex items-center justify-center gap-5 ${poppins.className}`}>
                <div className='flex flex-col items-end'>
                    <div className='text-4xl font-bold'>{hours}</div>
                    <div className='text-lg'>{date}</div>
                </div>
                <div className='h-1/2 w-[2px] bg-white '></div>
                <div className='flex flex-col items-start'>
                    <div className='text-4xl font-bold'>{minutes}</div>
                    <div className='text-lg'>{dayOfWeek}</div>
                </div>
            </div>
            <div className="spinner"></div>
        </div>

    )
}

export default Clock