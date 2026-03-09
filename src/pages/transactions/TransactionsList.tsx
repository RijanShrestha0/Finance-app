import { useState } from 'react';
import { type Transaction } from '../../context/TransactionContext';
import { useTransactions } from '../../hooks/useTransactions';
import { Flag } from 'lucide-react';
import ReportModal from './ReportModal';

interface TransactionsListProps {
  transactions: Transaction[];
  currency: string;
}

export const TransactionsList = ({ transactions, currency }: TransactionsListProps) => {
  const { reportTransaction } = useTransactions();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string>('');

  const handleReportClick = (transactionId: string) => {
    setSelectedTransactionId(transactionId);
    setIsReportModalOpen(true);
  };

  const handleReport = (reason: string, shouldDelete: boolean) => {
    reportTransaction(selectedTransactionId, reason, shouldDelete);
    setIsReportModalOpen(false);
  };

  return (
    <div className="transactions-list-card">
      <div className="list-header">
        <h2 className="list-title">Transaction History</h2>
      </div>
      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Report</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.category}</td>
                  <td>{t.description}</td>
                  <td>{currency} {t.amount.toLocaleString()}</td>
                  <td>
                    <span className={`type-badge ${t.type.toLowerCase()}`}>
                      {t.type}
                    </span>
                  </td>
                  <td>
                    {t.isReported ? (
                      <span className="reported-badge">Reported</span>
                    ) : (
                      <button 
                        className="report-button" 
                        onClick={() => handleReportClick(t.id)}
                        title="Report this transaction"
                      >
                        <Flag size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReport={handleReport}
      />
    </div>
  );
};
