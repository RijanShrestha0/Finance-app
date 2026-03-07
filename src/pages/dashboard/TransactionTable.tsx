import type { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import './TransactionTable.css';

const TransactionTable = () => {
    const { filteredTransactions, currency } = useTransactions();

    const recentTransactions = filteredTransactions.slice(0, 5); // Show only the 5 most recent transactions

    return (
        <div className="table-wrapper">
            <div className="table-header">
                <h3 className="table-title">Recent Transactions</h3>
            </div>
            <div className="table-container">
                <table className="transaction-table">
                <thead>
                    <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th className="cell-center">Amount</th>
                    <th className="cell-center">Type</th>
                    </tr>
                </thead>
                <tbody>
                    {recentTransactions.map((tx: { id: Key | null | undefined; date: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; category: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; amount: { toLocaleString: () => string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; type: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                    <tr key={tx.id}>
                        <td className="cell-date">{tx.date}</td>
                        <td className="cell-category">{tx.category}</td>
                        <td className="cell-description">{tx.description}</td>
                        <td className="cell-amount cell-center">{currency} {tx.amount.toLocaleString()}</td>
                        <td className="cell-center">
                        <span className={`badge ${
                            tx.type === 'Income' ? 'badge-income' : 'badge-expense'
                        }`}>
                            {tx.type}
                        </span>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            </div>
    );
}

export default TransactionTable;