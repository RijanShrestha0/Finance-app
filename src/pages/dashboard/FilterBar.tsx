import React, { useState } from "react";
import useClickOutside from "../../hooks/useClickOutside";
import { useTransactions } from "../../hooks/useTransactions";
import { DayPicker, type DateRange } from "react-day-picker";
import { format, addDays, endOfMonth, endOfWeek, endOfYear, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import './FilterBar.css';
import { useNavigate } from "react-router-dom";

const FilterBar = () => {
    const { dateRange, setDateRange, activeFilter, setActiveFilter } = useTransactions();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null!);

      const navigate = useNavigate();


    useClickOutside(dropdownRef, () => setIsOpen(false));

    const handleFilterClick = (filter: string) => {
        setActiveFilter(filter);
        const today = new Date();
        let newRange: DateRange | undefined;

        switch (filter) {
            case 'Today':
                newRange = { from: today, to: today };
                break;
            case 'Week':
                newRange = { from: startOfWeek(today), to: endOfWeek(today) };
                break;
            case 'Month':
                newRange = { from: startOfMonth(today), to: endOfMonth(today) };
                break;
            case 'Year':
                newRange = { from: startOfYear(today), to: endOfYear(today) };
                break;
            default:
                newRange = dateRange;
            }
            setDateRange(newRange);
    };

    const formatDateRange = (range: DateRange | undefined) => {
        if (!range?.from) return 'Select Date Range';
        if (!range.to) return `${format(range.from, 'd MMM yyyy')} to ...`; 
        return `${format(range.from, 'd MMM yyyy')} to ${format(range.to, 'd MMM yyyy')}`; 
    };

    return (
        <div className="filter-bar-wrapper">
        <div className="filter-container">
            {['Today', 'Week', 'Month', 'Year'].map((filter) => (
            <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`filter-btn ${activeFilter === filter ? 'filter-btn-active' : 'filter-btn-inactive'}`}
            >
                {filter}
            </button>
            ))}
        </div>
        
        <div className="filter-actions">
            <div className="datepicker-wrapper" ref={dropdownRef}>
                <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`datepicker-trigger ${isOpen ? 'datepicker-trigger-active' : ''}`}
                >
                <CalendarIcon className="datepicker-icon" />
                <span className="datepicker-text">{formatDateRange(dateRange)}</span>
                </button>

                {isOpen && (
                <div className="datepicker-dropdown">
                    <div className="datepicker-header">
                    <div className="datepicker-header-item">
                        <p className="datepicker-label">Start Date</p>
                        <p className="datepicker-value">
                        {dateRange?.from ? format(dateRange.from, 'd MMM yyyy') : '---'}
                        </p>
                    </div>
                    <div className="datepicker-divider" />
                    <div className="datepicker-header-item text-right">
                        <p className="datepicker-label">End Date</p>
                        <p className="datepicker-value">
                        {dateRange?.to ? format(dateRange.to, 'd MMM yyyy') : '---'}
                        </p>
                    </div>
                    </div>
                    
                    <div className="datepicker-body">
                        
                    {/* Quick Selects */}
                    <div className="quick-selects">
                        {[
                        { label: 'Today', days: 0 },
                        { label: 'Last 7 Days', days: -7 },
                        { label: 'Last 30 Days', days: -30 },
                        { label: 'This Month', days: 'month' },
                        ].map((option) => (
                        <button
                            key={option.label}
                            onClick={() => {
                            const today = new Date();
                            if (option.days === 'month') {
                                setDateRange({
                                from: startOfMonth(today),
                                to: endOfMonth(today),
                                });
                            } else {
                                setDateRange({
                                from: addDays(today, option.days as number),
                                to: today,
                                });
                            }
                            setActiveFilter('Custom');
                            }}
                            className="quick-select-btn"
                        >
                            {option.label}
                        </button>
                        ))}
                    </div>

                    <div className="datepicker-calendar">
                        <DayPicker
                        mode="range"
                        selected={dateRange}
                        onSelect={(range) => {
                            setDateRange(range);
                            setActiveFilter('Custom');
                        }}
                        className="rdp-custom"
                        />
                    </div>
                    </div>

                    <div className="datepicker-footer">
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="btn-ghost"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="btn-primary"
                    >
                        Apply
                    </button>
                    </div>
                </div>
                )}
            </div>

            <button
                className="filterbar-add-transaction-btn"
                onClick={() => navigate('/transactions')}
            >
                <Plus size={16} />
                Add Transaction
            </button>
        </div>
        </div>
    )
}

export default FilterBar;