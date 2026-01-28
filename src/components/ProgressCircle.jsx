import React from 'react';
import { motion } from 'framer-motion';

const ProgressCircle = ({ solved, total, label, color, glowClass }) => {
    const percentage = total > 0 ? (solved / total) * 100 : 0;
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4 group"
        >
            <div className="relative w-36 h-36 flex items-center justify-center">
                {/* Glow Filter Definition */}
                <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                    <filter id={`glow-${label}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </svg>

                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Track */}
                    <circle
                        cx="72"
                        cy="72"
                        r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-white/5"
                    />
                    {/* Progress Path */}
                    <motion.circle
                        cx="72"
                        cy="72"
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        strokeLinecap="round"
                        style={{ filter: `url(#glow-${label})` }}
                        className={glowClass}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-xl font-black tracking-tighter"
                    >
                        {solved}
                    </motion.span>
                    <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest mt-[-2px]">
                        of {total}
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/80 group-hover:text-white transition-colors">
                    {label}
                </p>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="h-[2px] mt-1 rounded-full"
                    style={{ backgroundColor: color }}
                />
            </div>
        </motion.div>
    );
};

export default ProgressCircle;
