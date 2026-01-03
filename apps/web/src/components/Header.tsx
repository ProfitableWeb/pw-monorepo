'use client';

import { useState } from 'react';
import { FaVk, FaTelegram, FaSearch, FaUser } from 'react-icons/fa';
import Link from 'next/link';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
    setIsSearchOpen(false);
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Left side - Logo */}
        <div className="header__logo">
          <Link href="/">
            <img src="/imgs/PW-logo.svg" alt="ProfitableWeb Logo" className="header__logo-img" />
          </Link>
        </div>

        {/* Center - Navigation (empty for now) */}
        <nav className="header__nav">
          {/* Navigation items will go here */}
        </nav>

        {/* Right side - Social icons, search, and user */}
        <div className="header__actions">
          {/* Social media icons */}
          <div className="header__social">
            <a href="https://vk.com" target="_blank" rel="noopener noreferrer" className="header__social-link">
              <FaVk className="header__social-icon" />
            </a>
            <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="header__social-link">
              <FaTelegram className="header__social-icon" />
            </a>
            <a href="https://dzen.ru" target="_blank" rel="noopener noreferrer" className="header__social-link">
              <img src="/imgs/yandex-dzen.svg" alt="Yandex Dzen" className="header__social-icon header__social-icon--dzen" />
            </a>
          </div>

          {/* Search icon */}
          <button 
            className="header__search-toggle"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle search"
          >
            <FaSearch className="header__search-icon" />
          </button>

          {/* User icon */}
          <button className="header__user" aria-label="User account">
            <FaUser className="header__user-icon" />
          </button>
        </div>
      </div>

      {/* Search form (collapsible) */}
      {isSearchOpen && (
        <div className="header__search-form">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="header__search-input"
              autoFocus
            />
            <button type="submit" className="header__search-submit">
              Search
            </button>
            <button 
              type="button" 
              className="header__search-close"
              onClick={() => setIsSearchOpen(false)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </header>
  );
}