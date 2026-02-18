import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
    delay?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    hoverEffect = false,
    delay = 0
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: delay, ease: [0.16, 1, 0.3, 1] }}
            className={clsx(
                'glass-panel p-6 relative overflow-hidden',
                hoverEffect && 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
                className
            )}
        >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-gradient-to-br from-rose-100 to-transparent rounded-full opacity-50 blur-2xl pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};

export default GlassCard;
