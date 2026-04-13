import React from 'react';
import { Terminal } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const { t } = useLanguage();

  return (
    <nav className="glass-panel" style={{ 
      position: 'sticky', 
      top: '1rem', 
      zIndex: 50, 
      margin: '1rem', 
      padding: '1rem 2rem' 
    }}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)'
          }}>
            <img 
              src="/src/assets/carriedo_logo.png" 
              alt="Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <h1 className="text-gradient" style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '1px' }}>
            CARRIEDO
          </h1>
        </div>
        
        <div className="flex gap-4 items-center">
          <LanguageSelector />
          <a href="https://soterctf.com/app/practice" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
            <Terminal size={16} />
            {t('practice')}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;
