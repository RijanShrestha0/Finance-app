import React from 'react';
import TransactionForm from './TransactionForm';
import { useTransactionsForm } from '../../hooks/useTransactionsForm';
import './Transactions.css';
import { TransactionsList } from './TransactionsList';

const Transactions: React.FC = () => {
  const form = useTransactionsForm();

  return (
    <div className="page-container">
        <div className='Empty'>
        </div>
        <div className='page-content'>
        <TransactionForm 
          type={form.type}
          setType={form.setType}
          amount={form.amount}
          setAmount={form.setAmount}
          category={form.category}
          setCategory={form.setCategory}
          date={form.date}
          setDate={form.setDate}
          description={form.description}
          setDescription={form.setDescription}
          currentCategories={form.currentCategories}
          isModalOpen={form.isModalOpen}
          setIsModalOpen={form.setIsModalOpen}
          newCategory={form.newCategory}
          setNewCategory={form.setNewCategory}
          handleAddCategory={form.handleAddCategory}
          handleSave={form.handleSave}
          handleCancel={form.handleCancel}
        />
        <TransactionsList
          transactions={form.transactions}
          currency={form.currency}
          />
        </div>
    </div>
  );
};

export default Transactions;
