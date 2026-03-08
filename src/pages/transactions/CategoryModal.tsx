import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'Income' | 'Expense';
    newCategory: string;
    setNewCategory: (value: string) => void;
    onAdd: () => void;
}

const CategoryModal = ({
    isOpen,
    onClose,
    type,
    newCategory,
    setNewCategory,
    onAdd
}: CategoryModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div className="modal-content"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    >
                        <div className="modal-header">
                            <h3>Add New {type} Category</h3>
                            <button className="close-btn" onClick={onClose}>
                                <X className="icon-md" />
                            </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group-modal">
                                    <label>Category Name</label>
                                    <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Enter category name" autoFocus 
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') onAdd();
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn-cancel-modal" onClick={onClose}>Cancel</button>
                                <button className="btn-save-modal" onClick={onAdd}>Add Category</button>
                            </div>
                    </motion.div>
                </div>
                )}
        </AnimatePresence>

    )
}

export default CategoryModal;