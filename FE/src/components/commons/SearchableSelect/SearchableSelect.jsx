import { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';
import './SearchableSelect.css';

/**
 * SearchableSelect – dropdown có ô tìm kiếm, hỗ trợ số lượng lớn
 *
 * Props:
 *  - value        : giá trị đang chọn (string)
 *  - onChange     : (value: string) => void
 *  - options      : [{ value, label, sub? }]   — sub: dòng nhỏ bên dưới label
 *  - placeholder  : placeholder ô tìm kiếm
 *  - disabled     : boolean
 *  - clearable    : boolean  (hiện nút X để bỏ chọn)
 *  - emptyText    : text khi không có kết quả
 *  - id           : html id cho input
 */
const SearchableSelect = ({
  value = '',
  onChange,
  options = [],
  placeholder = 'Tìm kiếm...',
  disabled = false,
  clearable = true,
  emptyText = 'Không có dữ liệu phù hợp',
  id,
}) => {
  const uid = useId();
  const inputId = id || `ss-${uid}`;

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlighted, setHighlighted] = useState(0);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Lọc options theo từ khóa tìm kiếm
  const filtered = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase()) ||
    (opt.sub && opt.sub.toLowerCase().includes(search.toLowerCase()))
  );

  // Label của option đang được chọn
  const selectedLabel = options.find(opt => opt.value === value)?.label || '';

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Scroll option được highlight vào tầm nhìn
  useEffect(() => {
    if (isOpen && listRef.current) {
      const item = listRef.current.querySelector(`[data-idx="${highlighted}"]`);
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlighted, isOpen]);

  const openDropdown = () => {
    if (disabled) return;
    setSearch('');
    setHighlighted(0);
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const select = (val) => {
    onChange(val);
    setIsOpen(false);
    setSearch('');
  };

  const clear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearch('');
  };

  const handleKeyDown = (e) => {
    if (!isOpen) { if (e.key === 'Enter' || e.key === ' ') openDropdown(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[highlighted]) select(filtered[highlighted].value); }
    else if (e.key === 'Escape') setIsOpen(false);
  };

  return (
    <div className={`ss-wrapper${disabled ? ' ss-disabled' : ''}`} ref={containerRef}>
      {/* ── Trigger button ── */}
      <button
        type="button"
        className={`ss-trigger${isOpen ? ' ss-trigger--open' : ''}${value ? ' ss-trigger--has-value' : ''}`}
        onClick={isOpen ? () => setIsOpen(false) : openDropdown}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        id={inputId}
      >
        <span className="ss-trigger__label">
          {value ? selectedLabel : <span className="ss-trigger__placeholder">{placeholder}</span>}
        </span>
        <span className="ss-trigger__icons">
          {clearable && value && (
            <span className="ss-clear" onClick={clear} title="Xóa lựa chọn">
              <X size={13} />
            </span>
          )}
          <ChevronDown size={15} className={`ss-chevron${isOpen ? ' ss-chevron--up' : ''}`} />
        </span>
      </button>

      {/* ── Dropdown panel ── */}
      {isOpen && (
        <div className="ss-panel" role="listbox">
          {/* Search input */}
          <div className="ss-search-wrap">
            <Search size={14} className="ss-search-icon" />
            <input
              ref={inputRef}
              className="ss-search"
              type="text"
              placeholder="Gõ để tìm kiếm..."
              value={search}
              onChange={e => { setSearch(e.target.value); setHighlighted(0); }}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Options list */}
          <ul className="ss-list" ref={listRef} role="listbox">
            {/* Option: bỏ chọn */}
            {clearable && (
              <li
                className={`ss-option ss-option--none${value === '' && highlighted === -1 ? ' ss-option--highlighted' : ''}`}
                onClick={() => select('')}
                role="option"
              >
                <em>-- Không liên kết --</em>
              </li>
            )}

            {filtered.length === 0 ? (
              <li className="ss-empty">{emptyText}</li>
            ) : (
              filtered.map((opt, idx) => (
                <li
                  key={opt.value}
                  data-idx={idx}
                  className={`ss-option${opt.value === value ? ' ss-option--selected' : ''}${idx === highlighted ? ' ss-option--highlighted' : ''}`}
                  onClick={() => select(opt.value)}
                  onMouseEnter={() => setHighlighted(idx)}
                  role="option"
                  aria-selected={opt.value === value}
                >
                  <span className="ss-option__label">{opt.label}</span>
                  {opt.sub && <span className="ss-option__sub">{opt.sub}</span>}
                </li>
              ))
            )}
          </ul>

          {/* Counter */}
          <div className="ss-footer">
            {filtered.length} / {options.length} kết quả
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
