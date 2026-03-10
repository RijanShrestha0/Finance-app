import { Download, Moon, RotateCcw, Sun } from "lucide-react";
import { useSettings } from "../../hooks/useSettings";

const ProfileCard = () => {
    const {
        user,
        theme,
        toggleTheme,
        localCurrency,
        localBudget,
        setLocalBudget,
        handleCurrencyChange,
        handleSave,
        handleReset,
        handleExport
    } = useSettings();

    return (
    <div className="settings-card profile-card">
      <div className="card-header">
        <div className="profile-avatar">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
            alt="Profile" 
            referrerPolicy="no-referrer"
          />
        </div>
        <h2 className="card-title">Profile info</h2>
      </div>

      <div className="settings-form">
        <div className="settings-row">
          <label>Currency</label>
          <select 
            value={localCurrency} 
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="settings-select"
          >
            <option value="Rs.">NPR (Rs.)</option>
            <option value="$">Dollar ($)</option>
            <option value="€">Euro (€)</option>
            <option value="₹">INR (₹)</option>
            <option value="A$">AusDollar (A$)</option>
          </select>
        </div>

        <div className="settings-row">
          <label>Budget Limit</label>
          <input 
            type="number" 
            value={localBudget} 
            onChange={(e) => setLocalBudget(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="settings-row">
          <label>Dark Mode</label>
          <button 
            className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}
            onClick={toggleTheme}
          >
            <div className="toggle-handle">
              {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
            </div>
          </button>
        </div>

        <div className="settings-row">
          <label>Data Export</label>
          <button className="btn-secondary" onClick={handleExport}>
            <Download size={16} />
            Export
          </button>
        </div>

        <div className="settings-row">
          <label>Reset Account</label>
          <button className="btn-danger" onClick={handleReset}>
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        <div className="form-footer">
          <button className="btn-primary" onClick={handleSave}>
            Save Change
          </button>
        </div>
      </div>
    </div>
  );
};


export default ProfileCard;