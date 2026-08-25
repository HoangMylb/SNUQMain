'use client';
import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { birthday, memories, notes } from './birthday-data';

gsap.registerPlugin(ScrollTrigger);

function Flower({ className = '' }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`flower ${className}`}>
      <i /><i /><i /><i /><b />
    </span>
  );
}

function Cake({ blown, onBlow }: { blown: boolean; onBlow: () => void }) {
  return (
    <section className="cake-scene" aria-labelledby="cake-title">
      <div className="cake-copy" data-reveal>
        <p className="script">một điều ước nhỏ</p>
        <h2 id="cake-title">Bé còn chưa<br />thổi nến mà</h2>
      </div>
      <div className={`cake-wrap ${blown ? 'is-blown' : ''}`} data-reveal>
        <div className="spark spark-one">✦</div>
        <div className="spark spark-two">✦</div>
        <div className="spark spark-three">✦</div>
        <div className="spark spark-four">✨</div>
        <div className="cake" aria-hidden="true">
          <span className="flame" />
          <span className="candle" />
          <span className="icing" />
          <span className="cake-top" />
          <span className="cake-base" />
        </div>
      </div>
      <div className="cake-actions" data-reveal>
        <button 
          className={`blow-button ${blown ? 'is-blown-btn' : ''}`} 
          type="button" 
          onClick={onBlow} 
          disabled={blown}
        >
          {blown ? '✨ Điều ước đã được gửi đi rồi ♡' : <>Thổi nến sinh nhật <span>🎂</span></>}
        </button>
        {blown && (
          <p className="blown-cheer">Mong mọi điều ước tuổi mới của Út đều thành hiện thực 🌸</p>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [blown, setBlown] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [promptDismissed, setPromptDismissed] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.8;

    const startAudio = () => {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          if (ctx.state === 'suspended') {
            ctx.resume();
          }
        }
      } catch {}

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setMusicPlaying(true);
            removeInteractionListeners();
          })
          .catch(() => {
            // Keep waiting for user gesture
          });
      }
    };

    const interactionEvents = [
      'touchstart',
      'touchend',
      'pointerdown',
      'pointerup',
      'mousedown',
      'click',
      'keydown',
    ];

    const handleFirstInteraction = () => {
      startAudio();
    };

    const removeInteractionListeners = () => {
      interactionEvents.forEach((event) => {
        window.removeEventListener(event, handleFirstInteraction, true);
        document.removeEventListener(event, handleFirstInteraction, true);
      });
    };

    // 1. Try immediate autoplay
    startAudio();

    // 2. Attach listeners for valid user activation gestures
    interactionEvents.forEach((event) => {
      window.addEventListener(event, handleFirstInteraction, true);
      document.addEventListener(event, handleFirstInteraction, true);
    });

    return () => {
      removeInteractionListeners();
    };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
    } else {
      audio.play().then(() => {
        setMusicPlaying(true);
      }).catch(() => {});
    }
  };

  const handleBlowCandle = () => {
    if (blown) return;
    setBlown(true);
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 50, 40]);
      }
    } catch {}
  };

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    timeline
      .from('.hero-date', { autoAlpha: 0, y: 12, duration: 0.55 })
      .from('.hero-intro', { autoAlpha: 0, y: 22, duration: 0.7 }, '-=.2')
      .from('.hero-name span', { autoAlpha: 0, yPercent: 110, stagger: 0.12, duration: 0.8 }, '-=.25')
      .from('.hero-signoff, .open-gift', { autoAlpha: 0, y: 14, stagger: 0.12, duration: 0.55 }, '-=.35')
      .from('.hero-photo-frame', { autoAlpha: 0, scale: 0.85, rotate: -4, duration: 0.8 }, '-=.4')
      .from('.hero-flower', { autoAlpha: 0, scale: 0.3, rotate: -18, duration: 0.7 }, '-=.5');

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) =>
      gsap.from(el, {
        autoAlpha: 0,
        y: 28,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%' },
      })
    );

    gsap.utils.toArray<HTMLElement>('.note').forEach((el, i) =>
      gsap.from(el, {
        autoAlpha: 0,
        y: 32,
        rotate: i % 2 ? 3 : -3,
        duration: 0.7,
        scrollTrigger: { trigger: el, start: 'top 88%' },
      })
    );
  }, { scope: root });

  const scrollToGift = () => document.querySelector('#reveal')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main ref={root} className={blown || letterOpen ? 'celebrating' : ''}>
      <audio
        ref={audioRef}
        src="/audio/happy-birthday.mp3"
        autoPlay
        loop
        preload="auto"
        playsInline
      />

      {/* Floating Top-Right Music Button */}
      <button
        className={`music-button ${musicPlaying ? 'is-playing' : 'is-paused'}`}
        aria-label={musicPlaying ? 'Tắt nhạc sinh nhật' : 'Bật nhạc sinh nhật'}
        title={musicPlaying ? 'Tắt nhạc sinh nhật' : 'Bật nhạc sinh nhật'}
        onClick={toggleMusic}
      >
        <span className="music-icon">{musicPlaying ? '♫' : '♪'}</span>
      </button>

      {/* Floating Bottom Music Prompt */}
      {!musicPlaying && !promptDismissed && (
        <div className="music-prompt-bar-wrap">
          <div className="music-prompt-bar">
            <button
              type="button"
              className="music-prompt-content"
              onClick={toggleMusic}
              aria-label="Bật nhạc sinh nhật"
            >
              <span className="music-prompt-icon">🎵</span>
              <span className="music-prompt-text">Chạm để bật nhạc sinh nhật nhé Út 🌸</span>
            </button>
            <button
              type="button"
              className="music-prompt-close"
              onClick={(e) => {
                e.stopPropagation();
                setPromptDismissed(true);
              }}
              aria-label="Đóng thông báo nhạc"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="fireworks" aria-hidden="true"><i/><i/><i/><i/><i/></div>

      {/* HERO SECTION */}
      <section className="hero" aria-labelledby="hero-title">
        <header className="hero-header">
          <p className="hero-date">25 · 08</p>
          <span className="hero-tag">Special Edition</span>
        </header>

        <Flower className="hero-flower flower-left" />
        <Flower className="hero-flower flower-right" />

        <div className="hero-body">
          <div className="hero-content">
            <p className="hero-intro">Có một điều nhỏ<br />dành cho Út hôm nay.</p>
            <h1 id="hero-title" className="hero-name">
              <span>TRỊNH PHƯƠNG</span>
              <span>QUYÊN</span>
            </h1>
            <p className="hero-signoff">Happy Birthday, Út Quyên <span>♡</span></p>
            <button className="open-gift" onClick={scrollToGift} type="button">
              Mở quà sinh nhật <span>↓</span>
            </button>
          </div>

          <div className="hero-photo-frame">
            <img 
              className="hero-photo" 
              src="/images/quyen/quyen-birthday.png" 
              alt="Bé Quyên trong món quà sinh nhật" 
              loading="eager"
            />
            <span className="hero-photo-pin">✦</span>
          </div>
        </div>

        <footer className="hero-footer">
          <p className="hero-caption">một món quà nhỏ được làm riêng cho Út</p>
        </footer>
      </section>

      {/* BIRTHDAY REVEAL SECTION */}
      <section id="reveal" className="birthday-reveal" aria-labelledby="reveal-title">
        <Flower className="reveal-flower one" />
        <Flower className="reveal-flower two" />
        <p className="reveal-line" data-reveal>chúc mừng sinh nhật</p>
        <h2 id="reveal-title" data-reveal>TRỊNH PHƯƠNG<br />QUYÊN</h2>
        <p className="reveal-date" data-reveal>25.08</p>
        <div className="reveal-heart" data-reveal>♡</div>
      </section>

      {/* MESSAGE SECTION */}
      <section className="message-section" aria-labelledby="message-title">
        <p className="script" data-reveal>đây là ngày của Út</p>
        <h2 id="message-title" data-reveal>Hôm nay là<br /><em>ngày của Út.</em></h2>
        <p className="message-desc" data-reveal>
          Mong bé sẽ có thật nhiều niềm vui,<br />
          thật nhiều tiếng cười, và thật nhiều điều dễ thương<br />
          tìm đến với bé.
        </p>
        <button className="letter-button" onClick={() => setLetterOpen(true)} data-reveal>
          Mở thư của anh 3 <span>💌</span>
        </button>
      </section>

      {/* STICKY NOTES SECTION */}
      <section className="notes-section" aria-labelledby="notes-title">
        <div className="notes-heading" data-reveal>
          <p className="script">để ở đây vài lời</p>
          <h2 id="notes-title">Có vài điều<br />muốn nói với bé...</h2>
        </div>
        <div className="notes-stack">
          {notes.map((note, index) => (
            <article className={`note note-${index + 1}`} key={note}>
              <div className="note-tape" aria-hidden="true" />
              <div className="note-header">
                <span className="note-heart">♡</span>
                <span className="note-number">0{index + 1}</span>
              </div>
              <p className="note-text">{note}</p>
            </article>
          ))}
        </div>
      </section>

      {/* MEMORY PHOTOS SECTION */}
      <section className="memory-section" aria-labelledby="memory-title">
        <div className="memory-heading" data-reveal>
          <p className="script">để dành cho những ngày đẹp trời</p>
          <h2 id="memory-title">Những mảnh<br />ký ức của bé.</h2>
        </div>
        <div className="memory-stack" data-reveal>
          {memories.map((memory, index) => (
            <figure className={`memory memory-${index + 1}`} key={memory.caption}>
              <div className="memory-tape" aria-hidden="true" />
              <div className="memory-img-wrap">
                <img src={memory.image} alt={memory.caption} loading="lazy" />
              </div>
              <figcaption>{memory.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* WISH SECTION */}
      <section className="wish-section" aria-labelledby="wish-title">
        <div className="wish-inner">
          <p className="wish-intro" data-reveal>Nếu hôm nay được ước một điều...</p>
          <h2 id="wish-title" data-reveal>thì mong Út Quyên<br /><em>sẽ luôn hạnh phúc.</em></h2>
        </div>
      </section>

      {/* CAKE & CANDLE SCENE */}
      <Cake blown={blown} onBlow={handleBlowCandle} />

      {/* FINAL SECTION */}
      <section className="final-section" aria-labelledby="final-title">
        <Flower className="final-flower" />
        <p className="script" data-reveal>một món quà nhỏ, thật lòng</p>
        <h2 id="final-title" data-reveal>Happy Birthday</h2>
        <p className="final-name" data-reveal>{birthday.displayName}</p>
        <p className="final-date" data-reveal>25 · 08</p>
        <p className="final-note" data-reveal>Tuổi mới thật nhiều niềm vui và bình an nhé Út. <span>♡</span></p>
      </section>

      {/* FOOTER */}
      <footer className="page-footer">
        <p className="footer-date">25.08 <span>♡</span></p>
        <p className="footer-sign">Happy Birthday, Út Quyên.</p>
        <p className="footer-made">From Anh 3 with all warmth</p>
      </footer>

      {/* LETTER MODAL */}
      {letterOpen && (
        <div 
          className="letter-modal" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="letter-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLetterOpen(false);
          }}
        >
          <div className="letter-wrapper">
            <button 
              className="letter-close-btn"
              aria-label="Đóng thư" 
              onClick={() => setLetterOpen(false)}
            >
              ✕
            </button>
            <article className="letter">
              <div className="letter-stamp" aria-hidden="true">🌸</div>
              <Flower className="letter-flower" />
              <p className="letter-title" id="letter-title">Gửi Út Quyên,</p>
              <div className="letter-body">
                <p>Chúc Út tuổi mới luôn rạng rỡ, bình an và vui vẻ thật nhiều.</p>
                <p>Mong mọi điều Út đang ấp ủ sẽ từ từ trở thành sự thật, và mỗi ngày trôi qua đều có thật nhiều lý do để mỉm cười.</p>
                <p>Cảm ơn vì đã là một cô bé rất riêng, rất đáng yêu. Hôm nay là sinh nhật Út, cứ tận hưởng và vui thật trọn vẹn nhé.</p>
                <p>Đây là món quà nhỏ anh 3 tự tay làm dành riêng cho Út. Mong bé sẽ cảm thấy ấm áp khi mở nó ra.</p>
              </div>
              <div className="letter-footer">
                <p className="letter-date-stamp">25 tháng 08</p>
                <p className="letter-signature">Anh 3 ♡</p>
              </div>
            </article>
          </div>
        </div>
      )}
    </main>
  );
}
