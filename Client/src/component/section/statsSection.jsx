// src/components/StatsSection.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Sample stats data
const stats = [
  { id: 1, name: 'Personal Training Sessions', value: 10000 },
  { id: 2, name: 'Cardio Workouts Completed', value: 85000 },
  { id: 3, name: 'Satisfied Members', value: 3000 },
];

const StatItem = ({ name, value }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });

      let start = 0;
      const increment = Math.ceil(value / 100); // Adjust the speed

      const interval = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(start);
        }
      }, 20); // Speed of incrementing the number

      return () => clearInterval(interval); // Clean up interval
    }
  }, [inView, value, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className="mx-auto flex max-w-xs flex-col gap-y-4"
    >
      <dt className="text-lg font-semibold text-gray-400">{name}</dt>
      <dd className="order-first text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        {count.toLocaleString()}
      </dd>
    </motion.div>
  );
};

export default function StatsSection() {
  return (
    <section className="bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Our Impact
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-400">
            Our success stories come from every workout and every satisfied member.
          </p>
        </div>

        <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <StatItem key={stat.id} name={stat.name} value={stat.value} />
          ))}
        </dl>
      </div>
    </section>
  );
}
