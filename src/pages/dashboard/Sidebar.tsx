import { LayoutDashboard, ArrowLeftRight, Target, BarChart3, Settings, Download, User, LogOut } from "lucide-react";
import './Sidebar.css';
import { Button } from "../../components/button/Button";
import { useTransactions } from "../../hooks/useTransactions";
import { useAuth } from "../../hooks/useAuth";
import useNotifications from "../../hooks/useNotifications";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
}

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Transactions', icon: ArrowLeftRight },
    { label: 'Budget', icon: Target },
    { label: 'Analytics', icon: BarChart3 },
    { label: 'Settings', icon: Settings },
];

export const Sidebar = ({ activePage, onNavigate }: SidebarProps) => {
    const { allTransactions, currency } = useTransactions();
    const { user, logout } = useAuth();
    const { addNotification } = useNotifications();
    const navigate = useNavigate();

    const escapeCsvValue = (value: string | number | boolean) => {
        const stringValue = String(value ?? '');
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    };

    const downloadUserDataCsv = () => {
        try {
            const rows: Array<Array<string | number | boolean>> = [
                ['id', 'date', 'type', 'category', 'description', 'amount', 'currency', 'is_reported', 'is_deleted', 'report_reason'],
            ];

            allTransactions.forEach((tx) => {
                rows.push([
                    tx.id,
                    tx.date,
                    tx.type,
                    tx.category,
                    tx.description,
                    tx.amount,
                    currency,
                    tx.isReported ? 'Yes' : 'No',
                    tx.isDeleted ? 'Yes' : 'No',
                    tx.reportReason || ''
                ]);
            });

            const csvContent = rows
                .map((row) => row.map((cell) => escapeCsvValue(cell)).join(','))
                .join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const today = new Date().toISOString().split('T')[0];

            link.href = url;
            link.download = `Finance-Report-${today}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            addNotification('CSV report downloaded successfully.');
        } catch {
            addNotification('Failed to download CSV report. Please try again.');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <aside className="sidebar-container">
            <div className="sidebar-header">
                <div className="logo-icon">
                    <img src="/src/assets/finance-logo.svg" alt="Finance logo" className="logo-image" />
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        onClick={() => onNavigate(item.label)}
                        className={`sidebar-nav-item ${
                            activePage === item.label ? 'active' : 'inactive'
                        }`}
                    >
                        <item.icon className="nav-icon" />
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="upgrade-section">
                <div className="upgrade-card">
                    <div className="upgrade-bg-accent"></div>
                    <h4 className="upgrade-title">Upgrade to Pro</h4>
                    <p className="upgrade-description">Get full access to additional features.</p>
                    <Button text="Upgrade" onClick={() => console.log('Upgrade clicked!')} className="upgrade-button" />
                </div>
            </div>

            <div className="sidebar-footer">
                <button className="footer-item" onClick={downloadUserDataCsv}>
                    <Download className="footer-icon" />
                    <span className="footer-label">Download</span>
                </button>
                <button className="footer-item" onClick={() => navigate('/profile')}>
                    <User className="footer-icon" />
                    <span className="footer-label">{user?.name || 'User'}</span>
                </button>
                <button className="footer-item" onClick={handleLogout}>
                    <LogOut className="footer-icon" />
                    <span className="footer-label">Logout</span>
                </button>
            </div>
        </aside>
    )
}