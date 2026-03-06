import { AnimatePresence } from "motion/react";
import useNotifications from "../../hooks/useNotifications";
import Toast from "./Toast";


const ToastContainer = () => {
    const { showToast, toastMessage, hideToast } = useNotifications();
    return (
        <AnimatePresence>
            {showToast && (
                <Toast
                    message={toastMessage}
                    onClose={hideToast}
                />
            )}
        </AnimatePresence>
    );
};

export default ToastContainer;