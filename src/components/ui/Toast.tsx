import { X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import './Toast.css';

interface ToastProps {
    message: string;
    duration?: number;
    onClose: () => void;
}

const Toast =({ message, duration = 3000, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);
    
    return (
        <motion.div initial = {{y: -100, opacity: 0}} animate = {{y: 0, opacity: 1}} exit = {{y: -100, opacity: 0}} className="toast">
            <span className="toast-message">{message}</span>
            <X size={20} className="toast-close-btn" />
        </motion.div>
    );
};

export default Toast;