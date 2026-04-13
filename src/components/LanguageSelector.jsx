import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'es', label: 'Castellano' },
    { code: 'en', label: 'English' },
    { code: 'ca', label: 'Català' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef} style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="btn" 
        style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', borderColor: 'var(--border-color)', gap: '0.5rem' }}
      >
        <Globe size={16} /> 
        {languages.find(l => l.code === language)?.label}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '0.5rem',
          background: 'var(--bg-card-hover)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          overflow: 'hidden',
          zIndex: 100,
          backdropFilter: 'blur(12px)',
          minWidth: '130px'
        }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setIsOpen(false); }}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '0.5rem 1rem',
                background: language === lang.code ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                border: 'none',
                color: language === lang.code ? 'var(--accent-cyan)' : 'var(--text-main)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => {
                if (language !== lang.code) e.target.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseOut={(e) => {
                if (language !== lang.code) e.target.style.background = 'transparent';
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
