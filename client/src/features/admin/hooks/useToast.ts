import { useCallback, useEffect, useRef, useState } from 'react';

export type ToastType = 'success' | 'error';
export type Toast = { type: ToastType; text: string };

export function useToast(duration = 4000) {
    const [toast, setToast] = useState<Toast | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const showToast = useCallback(
        (text: string, type: ToastType = 'success') => {
            clearTimeout(timer.current);
            setToast({ text, type });
            timer.current = setTimeout(() => setToast(null), duration);
        },
        [duration],
    );

    // Don't fire a state update after unmount
    useEffect(() => () => clearTimeout(timer.current), []);

    return { toast, showToast };
}