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
      <div className="cake-copy">
        <p className="script">một điều ước nhỏ</p>
        <h2 id="cake-title">Bé còn chưa<br />thổi nến mà</h2>
      </div>
      <div className={`cake-wrap ${blown ? 'is-blown' : ''}`}>
        <div className="spark spark-one">✦</div>
        <div className="spark spark-two">✦</div>
        <div className="spark spark-three">✦</div>
        <div className="cake" aria-hidden="true">
          <span className="flame" />
          <span className="candle" />
          <span className="icing" />
          <span className="cake-top" />
          <span className="cake-base" />
        </div>
      </div>
      <button className="blow-button" type="button" onClick={onBlow} disabled={blown}>
        {blown ? 'Điều ước đã được gửi đi rồi.' : <>Thổi nến <span aria-hidden="true">↓</span></>}
      </button>
    </section>
  );
}

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [blown, setBlown] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

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

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    timeline
      .from('.hero-date', { autoAlpha: 0, y: 12, duration: 0.55 })
      .from('.hero-intro', { autoAlpha: 0, y: 22, duration: 0.7 }, '-=.2')
      .from('.hero-name span', { autoAlpha: 0, yPercent: 110, stagger: 0.12, duration: 0.8 }, '-=.25')
      .from('.hero-signoff, .open-gift', { autoAlpha: 0, y: 14, stagger: 0.12, duration: 0.55 }, '-=.35')
      .from('.hero-flower', { autoAlpha: 0, scale: 0.3, rotate: -18, duration: 0.7 }, '-=.5');

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) =>
      gsap.from(el, {
        autoAlpha: 0,
        y: 28,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 84%' },
      })
    );

    gsap.utils.toArray<HTMLElement>('.note').forEach((el, i) =>
      gsap.from(el, {
        autoAlpha: 0,
        y: 35,
        rotate: i % 2 ? 4 : -4,
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
      <button
        className={`music-button ${musicPlaying ? 'is-playing' : 'is-paused'}`}
        aria-label={musicPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
        title={musicPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
        onClick={toggleMusic}
      >
        {musicPlaying ? '♫' : '♪'}
      </button>

      {!musicPlaying && (
        <button
          type="button"
          className="music-prompt-bar"
          onClick={toggleMusic}
          aria-label="Bật nhạc sinh nhật"
        >
          <span className="music-prompt-icon">🎵</span>
          <span>Chạm vào màn hình để nghe nhạc sinh nhật nhé Út 🌸</span>
        </button>
      )}

      <div className="fireworks" aria-hidden="true"><i/><i/><i/></div>

      <section className="hero" aria-labelledby="hero-title">
        <p className="hero-date">25 · 08</p>
        <Flower className="hero-flower flower-left" />
        <Flower className="hero-flower flower-right" />
        <img className="hero-photo" src="/images/quyen/quyen-birthday.png" alt="Bé Quyên trong món quà sinh nhật" />
        <div className="hero-content">
          <p className="hero-intro">Có một điều nhỏ<br />dành cho Út hôm nay.</p>
          <h1 id="hero-title" className="hero-name"><span>TRỊNH PHƯƠNG</span><span>QUYÊN</span></h1>
          <p className="hero-signoff">Happy Birthday, Út Quyên <span>♡</span></p>
          <button className="open-gift" onClick={scrollToGift} type="button">Mở quà <span>↓</span></button>
        </div>
        <p className="hero-caption">một món quà nhỏ được làm riêng cho Út</p>
      </section>

      <section id="reveal" className="birthday-reveal" aria-labelledby="reveal-title">
        <Flower className="reveal-flower one" />
        <Flower className="reveal-flower two" />
        <p className="reveal-line" data-reveal>chúc mừng sinh nhật</p>
        <h2 id="reveal-title" data-reveal>TRỊNH PHƯƠNG<br />QUYÊN</h2>
        <p className="reveal-date" data-reveal>25.08</p>
      </section>

      <section className="message-section" aria-labelledby="message-title">
        <p className="script" data-reveal>đây là ngày của Út</p>
        <h2 id="message-title" data-reveal>Hôm nay là<br /><em>ngày của Út.</em></h2>
        <p data-reveal>Mong bé sẽ có thật nhiều niềm vui,<br />thật nhiều tiếng cười, và thật nhiều điều dễ thương<br />tìm đến với bé.</p>
        <button className="letter-button" onClick={() => setLetterOpen(true)}>Mở thư của anh 3 <span>♡</span></button>
      </section>

      <section className="notes-section" aria-labelledby="notes-title">
        <div className="notes-heading" data-reveal>
          <p className="script">để ở đây vài lời</p>
          <h2 id="notes-title">Có vài điều<br />muốn nói với bé...</h2>
        </div>
        <div className="notes-stack">
          {notes.map((note, index) => (
            <article className={`note note-${index + 1}`} key={note}>
              <span>♡</span>
              <p>{note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="memory-section" aria-labelledby="memory-title">
        <div data-reveal>
          <p className="script">để dành cho những ngày đẹp trời</p>
          <h2 id="memory-title">Những mảnh<br />ký ức của bé.</h2>
        </div>
        <div className="memory-stack" data-reveal>
          {memories.map((memory, index) => (
            <figure className={`memory memory-${index + 1}`} key={memory.caption}>
              <img src={memory.image} alt="Kỷ niệm của Út Quyên" />
              <figcaption>{memory.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="wish-section" aria-labelledby="wish-title">
        <p data-reveal>Nếu hôm nay được ước một điều...</p>
        <h2 id="wish-title" data-reveal>thì mong Út Quyên<br /><em>sẽ luôn hạnh phúc.</em></h2>
      </section>

      <Cake blown={blown} onBlow={() => setBlown(true)} />

      <section className="final-section" aria-labelledby="final-title">
        <Flower className="final-flower" />
        <p className="script" data-reveal>một món quà nhỏ, thật lòng</p>
        <h2 id="final-title" data-reveal>Happy Birthday</h2>
        <p className="final-name" data-reveal>{birthday.displayName}</p>
        <p className="final-date" data-reveal>25 · 08</p>
        <p className="final-note" data-reveal>Tuổi mới thật nhiều niềm vui nhé Út. <span>♡</span></p>
      </section>

      <footer>
        25.08 <span>♡</span><br />
        <small>Happy Birthday, Út Quyên.</small>
      </footer>

      {letterOpen && (
        <div className="letter-modal" role="dialog" aria-modal="true" aria-labelledby="letter-title">
          <button aria-label="Đóng thư" onClick={() => setLetterOpen(false)}>×</button>
          <div className="letter">
            <Flower className="letter-flower" />
            <p className="letter-title" id="letter-title">Gửi Út Quyên,</p>
            <div className="letter-body">
              <p>Chúc Út tuổi mới luôn rạng rỡ, bình an và vui vẻ thật nhiều.</p>
              <p>Mong mọi điều Út đang ấp ủ sẽ từ từ trở thành sự thật, và mỗi ngày đều có lý do để mỉm cười.</p>
              <p>Cảm ơn vì đã là một cô bé rất riêng, rất dễ thương. Hôm nay, Út cứ vui thật trọn vẹn nhé.</p>
              <p>Đây là món quà nhỏ anh 3 làm dành riêng cho Út. Mong Út thấy vui khi mở nó ra.</p>
            </div>
            <p className="letter-signature">Anh 3 ♡</p>
          </div>
        </div>
      )}
    </main>
  );
}

