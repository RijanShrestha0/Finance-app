import { type Transaction } from '../../context/TransactionContext';

interface TransactionsListProps {
  transactions: Transaction[];
  currency: string;
}

export const TransactionsList = ({ transactions, currency }: TransactionsListProps) => {
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
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted">
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
