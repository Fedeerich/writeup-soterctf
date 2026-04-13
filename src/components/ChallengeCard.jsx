import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const ChallengeCard = ({ category, name, points, description, resolution, flag, payload }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  // Create a clean URL-friendly slug from the challenge name
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  useEffect(() => {
    // If the URL has this challenge's hash, open it and scroll to it smoothly
    if (window.location.hash === `#${slug}`) {
      setIsOpen(true);
      setTimeout(() => {
        const element = document.getElementById(slug);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 400); // Wait for open animation to settle
    }
  }, [slug]);

  const copyPayload = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    if (newState) {
      window.history.pushState(null, '', `#${slug}`);
    } else if (window.location.hash === `#${slug}`) {
      // Clear hash if the active card is closed
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <div id={slug} className="glass-panel" style={{ marginBottom: '1.5rem', overflow: 'hidden', scrollMarginTop: '100px' }}>
      <div 
        style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        onClick={toggleOpen}
      >
        <div>
          <div style={{ fontSize: '0.875rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '0.25rem' }}>
            {category} • {points} {t('pts')}
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{name}</h3>
        </div>
        <div style={{ color: 'var(--text-muted)' }}>
          {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>
      
      {isOpen && (
        <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '0.5rem', paddingTop: '1.5rem' }} className="animate-fade-in">
          <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{t('insights')}</h4>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>{description}</p>
          
          {resolution && (
            <>
              <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{t('resolution')}</h4>
              <div style={{ background: '#111', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '1.5rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.9rem', lineHeight: 1.5, overflowX: 'auto' }}>
                {resolution}
              </div>
            </>
          )}

          {payload && (
            <>
              <div className="flex justify-between items-center" style={{ marginBottom: '0.5rem' }}>
                <h4 style={{ color: 'var(--accent-cyan)' }}>{t('payload')}</h4>
                <button 
                  onClick={copyPayload}
                  style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px', padding: '0.3rem 0.6rem', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }}
                >
                  {copied ? <Check size={14} color="var(--accent-cyan)" /> : <Copy size={14} />}
                  <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{copied ? t('copied') : t('copy')}</span>
                </button>
              </div>
              <pre style={{ margin: 0, marginBottom: '1.5rem' }}>
                <code>{payload}</code>
              </pre>
            </>
          )}

          <h4 style={{ color: 'var(--accent-magenta)', marginBottom: '0.5rem' }}>{t('flag')}</h4>
          {flag && flag.includes('\n') ? (
            flag.split('\n').map((singleFlag, i) => (
              <div key={i} style={{ marginBottom: i < flag.split('\n').length - 1 ? '1rem' : '0' }}>
                <div style={{ color: 'var(--accent-magenta)', fontSize: '0.85rem', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('task')} {i + 1}
                </div>
                <div style={{ background: 'rgba(255, 0, 60, 0.1)', border: '1px solid var(--accent-magenta)', padding: '0.75rem', borderRadius: '6px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-main)' }}>
                  {singleFlag}
                </div>
              </div>
            ))
          ) : (
            <div style={{ background: 'rgba(255, 0, 60, 0.1)', border: '1px solid var(--accent-magenta)', padding: '0.75rem', borderRadius: '6px', fontFamily: 'var(--font-mono, monospace)', marginBottom: '0', color: 'var(--text-main)' }}>
              {flag}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChallengeCard;
