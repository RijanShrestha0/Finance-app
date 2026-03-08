import { Plus } from "lucide-react";
import CategoryModal from "./CategoryModal";

interface TransactionFormProps {
    type: 'Income' | 'Expense';
    setType: (type: 'Income' | 'Expense') => void;
    amount: string;
    setAmount: (val: string) => void;
    category: string;
    setCategory: (val: string) => void;
    date: string;
    setDate: (val: string) => void;
    description: string;
    setDescription: (val: string) => void;
    currentCategories: string[];
    isModalOpen: boolean;
    setIsModalOpen: (val: boolean) => void;
    newCategory: string;
    setNewCategory: (val: string) => void;
    handleAddCategory: () => void;
    handleSave: () => void;
    handleCancel: () => void;
}

const TransactionForm = ({
    type,
    setType,
    amount,
    setAmount,
    category,
    setCategory,
    date,
    setDate,
    description,
    setDescription,
    currentCategories,
    isModalOpen,
    setIsModalOpen,
    newCategory,
    setNewCategory,
    handleAddCategory,
    handleSave,
    handleCancel
}: TransactionFormProps) => {
    return (
            <div className="transaction-form-card">
      <div className="form-header">
        <h2 className="form-title">Add Transaction</h2>
      </div>

      <div className="form-body">
        <div className="type-selector">
          <label className="radio-label">
            <input 
              type="radio" 
              name="type" 
              checked={type === 'Income'} 
              onChange={() => setType('Income')} 
            />
            <span className="radio-custom"></span>
            Income
          </label>
          <label className="radio-label">
            <input 
              type="radio" 
              name="type" 
              checked={type === 'Expense'} 
              onChange={() => setType('Expense')} 
            />
            <span className="radio-custom"></span>
            Expense
          </label>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Amount</label>
            <div className="input-wrapper">
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <div className="input-wrapper">
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="category-select"
              >
                <option value="" disabled>Select Category</option>
                {currentCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Date</label>
            <div className="input-wrapper">
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <div className="input-wrapper">
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Optional details..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <button className="add-category-btn" onClick={() => setIsModalOpen(true)}>
          <Plus className="icon-sm" />
          Add New Category
        </button>

        <CategoryModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          type={type}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          onAdd={handleAddCategory}
        />

        <div className="form-actions">
          <button className="btn-save" onClick={handleSave}>Save</button>
          <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;