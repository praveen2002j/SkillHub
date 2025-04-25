import { useState, useEffect } from 'react';
import { ChevronRight, Code, Camera, Hammer, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SkillHubLanding() {
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #1e293b, #0f172a)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background floating shapes */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              backgroundColor: '#94a3b8',
              opacity: 0.05,
              width: `${Math.random() * 150 + 50}px`,
              height: `${Math.random() * 150 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `scale(${animationProgress / 100})`,
              transition: 'transform 1.5s ease',
              transitionDelay: `${i * 0.07}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '1100px',
        padding: '4rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Logo and Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 50}px)`,
          transition: 'transform 1s, opacity 1s'
        }}>
          <div style={{
            backgroundColor: '#38bdf8',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            marginRight: '1rem'
          }}>
            <Hammer size={40} color="#0f172a" />
          </div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            letterSpacing: '-0.025em'
          }}>SKILLHUB</h1>
        </div>

        {/* Headline */}
        <h2 style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '1.25rem',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 40}px)`,
          transition: 'transform 1s, opacity 1s',
          transitionDelay: '0.2s'
        }}>
          Learn, Share, and Grow Together.
        </h2>

        {/* Description */}
        <p style={{
          fontSize: '1.125rem',
          textAlign: 'center',
          maxWidth: '44rem',
          marginBottom: '2.5rem',
          color: '#e2e8f0',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 30}px)`,
          transition: 'transform 1s, opacity 1s',
          transitionDelay: '0.4s'
        }}>
          A collaborative platform where you can teach what you know and learn what you love—from
          programming and photography to DIY crafts and cooking. Let's build a global community of creators and learners.
        </p>

        {/* Skill Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          width: '100%',
          marginBottom: '3rem',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 20}px)`,
          transition: 'transform 1s, opacity 1s',
          transitionDelay: '0.6s'
        }}>
          {[
            { icon: <Code size={32} color="#38bdf8" />, title: 'Coding Tutorials', desc: 'Share and learn code with hands-on examples and projects.' },
            { icon: <Camera size={32} color="#38bdf8" />, title: 'Photography Tips', desc: 'Explore creative photography and editing techniques.' },
            { icon: <Hammer size={32} color="#38bdf8" />, title: 'DIY Crafts', desc: 'Unleash your creativity with easy-to-follow DIY guides.' },
            { icon: <Users size={32} color="#38bdf8" />, title: 'Community Support', desc: 'Join forums and groups for collaboration and feedback.' }
          ].map(({ icon, title, desc }, i) => (
            <div key={i} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              backdropFilter: 'blur(6px)'
            }}>
              {icon}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0.75rem 0' }}>{title}</h3>
              <p style={{ color: '#cbd5e1' }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link to="/s" style={{
          background: 'linear-gradient(to right, #38bdf8, #0ea5e9)',
          color: 'white',
          fontWeight: 'bold',
          padding: '1rem 2rem',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          fontSize: '1.25rem',
          textDecoration: 'none',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
          transform: `translateY(${(1 - animationProgress / 100) * 10}px)`,
          opacity: animationProgress / 100,
          transition: 'all 0.3s ease',
          transitionDelay: '0.8s'
        }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span>Start Exploring</span>
          <ChevronRight style={{ marginLeft: '0.5rem' }} />
        </Link>
      </div>
    </div>
  );
}