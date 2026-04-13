import React from 'react';
import { ExternalLink, Heart } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="glass-panel" style={{ padding: '3rem 1rem', marginTop: '4rem', textAlign: 'center', borderRadius: '12px 12px 0 0', borderBottom: 'none' }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        {t('built_for')} <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{t('ctf_comp')}</span>
        <Heart size={16} color="var(--accent-magenta)" />
      </p>
      
      <div className="flex justify-center gap-4" style={{ flexWrap: 'wrap' }}>
        <a 
          href="https://docs.google.com/forms/d/e/1FAIpQLSek1i6-PUQkhwjpWgehgwMBhjaMmu4jt1AfrBrsVxR6OIpaPw/viewform?usp=publish-editor" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn" 
          style={{ fontSize: '0.875rem', padding: '0.4rem 1rem', borderColor: 'var(--border-color)' }}
        >
          <ExternalLink size={14} /> {t('survey')}
        </a>
        <a 
          href="https://palcamcg2026.soterctf.com/challenges" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn" 
          style={{ fontSize: '0.875rem', padding: '0.4rem 1rem', borderColor: 'var(--border-color)' }}
        >
          <ExternalLink size={14} /> {t('view_chal')}
        </a>
      </div>
      <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.3)' }}>
        {t('rights')}
      </div>
    </footer>
  );
};

export default Footer;
