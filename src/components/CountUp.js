import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

function AnimatedCount({ end, duration = 2, suffix = '' }) {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

    return (
        <span ref={ref}>
            {inView ? <CountUp end={end} duration={duration} suffix={suffix} /> : '0'}
        </span>
    );
}

export default AnimatedCount;