import React from 'react';
import { Target, Trophy, Award } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  return (
    <section style={{ padding: '4rem 1rem', textAlign: 'center', position: 'relative' }}>
      <div className="animate-fade-in">
        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid var(--accent-magenta)', backgroundColor: 'rgba(255, 0, 60, 0.1)', color: 'var(--accent-magenta)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem' }}>
          {t('comp')}
        </div>
        <h1 className="text-gradient" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
          {t('mastering')} <br />
          <span style={{ color: 'var(--text-main)' }}>{t('cyber_battlefield')}</span>
        </h1>
        <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1.1rem' }}>
          {t('hero_desc')}
        </p>

        <div className="flex justify-center gap-4" style={{ flexWrap: 'wrap' }}>
          <div className="glass-panel flex items-center gap-2 delay-100" style={{ padding: '1rem 2rem' }}>
            <Target color="var(--accent-cyan)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>500€</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('prize')}</div>
            </div>
          </div>
          <div className="glass-panel flex items-center gap-2 delay-200" style={{ padding: '1rem 2rem' }}>
            <Trophy color="#FFD700" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>21/27</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('challenges')}</div>
            </div>
          </div>
          <div className="glass-panel flex items-center gap-2 delay-300" style={{ padding: '1rem 2rem' }}>
            <Award color="var(--accent-magenta)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>100%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('certified')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
