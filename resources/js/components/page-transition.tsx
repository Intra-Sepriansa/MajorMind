import { useState, useEffect, type ReactNode } from 'react';
import { router } from '@inertiajs/react';

interface Props {
    children: ReactNode;
}

export default function PageTransition({ children }: Props) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const removeStart = router.on('before', () => {
            setVisible(false);
        });

        const removeFinish = router.on('finish', () => {
            setTimeout(() => setVisible(true), 50);
        });

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    return (
        <div style={{
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(6px)',
        }}>
            {children}
        </div>
    );
}
