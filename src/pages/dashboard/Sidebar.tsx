import { LayoutDashboard, ArrowLeftRight, Target, BarChart3, Settings, Download, LogIn, } from "lucide-react";
import './Sidebar.css';
import { Button } from "../../components/button/Button";

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
                <button className="footer-item">
                    <Download className="footer-icon" />
                    <span className="footer-label">Download</span>
                </button>
                <button className="footer-item">
                    <LogIn className="footer-icon" />
                    <span className="footer-label">Login/Signup</span>
                </button>
            </div>
        </aside>
    )
}