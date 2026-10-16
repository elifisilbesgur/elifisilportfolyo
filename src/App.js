import React, { useEffect, useRef, useState } from 'react';
import { FaGithub, FaXTwitter, FaEnvelope, FaSun, FaMoon } from 'react-icons/fa6';
import PixelRoom from './PixelRoom';
import './App.css';

const EMAIL = 'elifisilbesgur.bursa@gmail.com';
const GITHUB = 'https://github.com/elifisilbesgur';

const PROJECTS = [
  {
    id: 'lumanote',
    title: 'LumaNote',
    lede: 'Odak oturumlarını, notları ve çalıştıkça büyüyen bir piksel bahçeyi bir araya getiren telefon uygulaması.',
    body: 'Pomodoro sayacıyla çalıştıkça jeton kazanılıyor; jetonlarla bahçeye tohum, eve eşya alınıyor. Not editöründe biçimlendirme, çizim alanı, tablo ve dosya ekleri var. Arka planda projeye ait özgün sentez piyano besteleri çalıyor.',
    stack: 'Expo, React Native, TypeScript, WebView, Canvas',
    image: '/projects/lumanote.webp',
    alt: 'LumaNote ekranları: not editörü, karlı piksel bahçe ve ses ayarları',
    repo: `${GITHUB}/lumanote`,
  },
  {
    id: 'lumaraf',
    title: 'LumaRaf',
    lede: 'Okudukça kitaplığı, izledikçe kaset rafı dolan piksel bir ev.',
    body: 'Okunan her kitap rafa bir sırt olarak yerleşiyor; kalınlığı sayfa sayısından geliyor. İzlenen filmler TV ünitesindeki kaset kutusuna giriyor. Odaların tamamı kodla, 160×200 piksellik bir tuvale her karede yeniden çiziliyor.',
    stack: 'Expo SDK 57, React Native, TypeScript',
    image: '/projects/lumaraf.webp',
    alt: 'LumaRaf ekranları: okuma odası, kitaplık ve TV odası',
    repo: `${GITHUB}/lumaraf`,
  },
  {
    id: 'kapibara',
    title: 'Kapibara Uçuşu',
    lede: 'Sinir bozucu ama sakinleştirici bir piksel art uçuş oyunu.',
    body: 'Jetpack’li bir kapibara bambuların arasından süzülüyor, portakal topluyor ve sırtına yolcu alıyor. Skor arttıkça uçuş modu değişiyor, gökyüzü sabahtan geceye dönüyor. Her yolcunun kendine özgü bir yeteneği var.',
    stack: 'Expo, React Native Skia, Reanimated',
    image: '/projects/kapibara.webp',
    alt: 'Sırtında kuş, kaplumbağa, maymun, baykuş, flamingo ve penguen taşıyan piksel kapibaralar',
    repo: `${GITHUB}/kapibara-ucusu-oyun`,
    pixel: true,
  },
  {
    id: 'bursa',
    title: 'Bursa Hazırlık Atlası',
    lede: 'Bursa için harita tabanlı deprem bilgilendirme ve hazırlık platformu.',
    body: 'Haritada bir nokta seçince ilçe ve mahalle bilgisi, ilçe nüfusu ve en yakın üç toplanma alanı listeleniyor. 17 ilçe ve 1.206 toplanma alanı kaydı yerel verilerden okunuyor; son depremler AFAD panelinde süzülebiliyor.',
    stack: 'Python, FastAPI, HTML, CSS, JavaScript, Canvas',
    image: '/projects/bursa-atlas.svg',
    alt: 'Bursa’nın 17 ilçe sınırı ve kırmızı noktalarla toplanma alanları',
    caption: 'Görsel, projedeki ilçe sınırları ve toplanma alanı verilerinden çizildi.',
    repo: `${GITHUB}/Bursa-Deprem-Web-Uygulamas-`,
  },
];

const EARLIER = [
  {
    title: 'Soru Bankası',
    text: 'Soru bankası oluşturup soruları yönetmeye yarayan masaüstü uygulaması.',
    image: '/projects/soru-bankasi.webp',
    repo: `${GITHUB}/Soru-Bankas-Uygulamas-`,
  },
  {
    title: 'Pastane Siparişi',
    text: 'Siparişleri alıp veritabanına kaydeden, takibini kolaylaştıran pastane uygulaması.',
    image: '/projects/pastane.webp',
    repo: `${GITHUB}/Pastane-Uygulamas-`,
  },
  {
    title: 'Kelime İşlemci',
    text: 'Yazı rengi ve boyutu, kalın-italik-altı çizili biçimler ve dosya kaydetme sunan Word benzeri bir editör.',
    image: '/projects/kelime-islemci.webp',
    repo: `${GITHUB}/Kelime-lemci`,
  },
];

const TOOLS = [
  ['Mobil', 'Expo, React Native, TypeScript, Skia'],
  ['Web', 'React, JavaScript, HTML, CSS, FastAPI'],
  ['Masaüstü', 'Python, PyQt5, Qt Designer, C# Windows Forms'],
  ['Diğer', 'C++, Java, Fusion 360 ile 3B modelleme'],
];

function initialTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) { /* depolama kapalı olabilir */ }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

export default function App() {
  const [theme, setTheme] = useState(initialTheme);
  const [active, setActive] = useState('');
  const [highlight, setHighlight] = useState('');
  const [form, setForm] = useState({ name: '', subject: '', message: '' });
  const pickTimer = useRef(0);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch (e) { /* yok say */ }
  }, [theme]);

  useEffect(() => {
    const ids = ['projeler', 'hakkimda', 'iletisim'];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  const pickProject = (id) => {
    scrollToId(`proje-${id}`);
    setHighlight(id);
    window.clearTimeout(pickTimer.current);
    pickTimer.current = window.setTimeout(() => setHighlight(''), 2200);
  };

  const sendMail = (e) => {
    e.preventDefault();
    const subject = form.subject.trim() || 'Portfolyo üzerinden mesaj';
    const body = `${form.message.trim()}\n\n${form.name.trim()}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const nav = [
    ['projeler', 'Projeler'],
    ['hakkimda', 'Hakkımda'],
    ['iletisim', 'İletişim'],
  ];

  return (
    <>
      <a className="skip" href="#projeler">İçeriğe geç</a>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            Elif Işıl Beşgür
          </a>
          <nav aria-label="Bölümler">
            {nav.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className={active === id ? 'is-active' : undefined}
                aria-current={active === id ? 'true' : undefined}
                onClick={(e) => { e.preventDefault(); scrollToId(id); }}
              >
                {label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            className="theme-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? 'Gündüz görünümüne geç' : 'Gece görünümüne geç'}
            title={theme === 'dark' ? 'Gündüz görünümü' : 'Gece görünümü'}
          >
            {theme === 'dark' ? <FaSun aria-hidden /> : <FaMoon aria-hidden />}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero wrap">
          <div className="hero-text">
            <h1>Elif Işıl Beşgür</h1>
            <p className="hero-lede">
              Balıkesir Üniversitesi’nde bilgisayar mühendisliği 4. sınıf öğrencisiyim.
              Not almayı, kitap biriktirmeyi ve odaklanmayı biraz daha keyifli hale getiren
              küçük uygulamalar yapıyorum.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#projeler" onClick={(e) => { e.preventDefault(); scrollToId('projeler'); }}>
                Projelere bak
              </a>
              <a className="btn" href={`mailto:${EMAIL}`}>
                <FaEnvelope aria-hidden /> E-posta gönder
              </a>
            </div>
          </div>
          <figure className="hero-room">
            <PixelRoom theme={theme} onPick={pickProject} />
            <figcaption>Odadaki kitaplık, kapibara, saksı ve harita birer projeye açılıyor.</figcaption>
          </figure>
        </section>

        <section id="projeler" className="section wrap" aria-labelledby="projeler-baslik">
          <h2 id="projeler-baslik">Projeler</h2>
          <div className="projects">
            {PROJECTS.map((p) => (
              <article
                key={p.id}
                id={`proje-${p.id}`}
                className={`project${highlight === p.id ? ' is-picked' : ''}`}
              >
                <figure className={`project-media${p.pixel ? ' is-pixel' : ''}`}>
                  <img src={p.image} alt={p.alt} loading="lazy" />
                  {p.caption && <figcaption>{p.caption}</figcaption>}
                </figure>
                <div className="project-text">
                  <h3>{p.title}</h3>
                  <p className="project-lede">{p.lede}</p>
                  <p>{p.body}</p>
                  <p className="project-stack"><span>Kullandıklarım:</span> {p.stack}</p>
                  <a className="text-link" href={p.repo} target="_blank" rel="noopener noreferrer">
                    <FaGithub aria-hidden /> Kaynak kodu GitHub’da
                  </a>
                </div>
              </article>
            ))}
          </div>

          <h3 className="earlier-title">Daha önceki işler</h3>
          <p className="earlier-intro">Python ve PyQt5 ile masaüstü uygulamaları geliştirerek başladım. Bu üçü o dönemden.</p>
          <ul className="earlier">
            {EARLIER.map((p) => (
              <li key={p.title}>
                <a href={p.repo} target="_blank" rel="noopener noreferrer">
                  <img src={p.image} alt="" loading="lazy" />
                  <span className="earlier-name">{p.title}</span>
                  <span className="earlier-text">{p.text}</span>
                  <span className="earlier-stack">Python, PyQt5, Qt Designer</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section id="hakkimda" className="section wrap about" aria-labelledby="hakkimda-baslik">
          <img className="about-photo" src="/image/profil.webp" alt="Elif Işıl Beşgür" loading="lazy" />
          <div className="about-text">
            <h2 id="hakkimda-baslik">Hakkımda</h2>
            <p>
              Üniversitede C#, C++, Java ve Python ile çalıştım; ilk projelerim Qt Designer ve PyQt5 ile
              yaptığım masaüstü uygulamalarıydı. Arayüz tasarlamak ile arka plandaki kodu
              birleştirmek o zamandan beri en çok keyif aldığım kısım.
            </p>
            <p>
              Son dönemde telefon uygulamalarına yöneldim. Expo ve React Native ile, sahnelerini kodla
              çizdiğim piksel dünyalar kuruyorum: çalıştıkça büyüyen bir bahçe, okudukça dolan bir kitaplık,
              uçmayı öğrenen bir kapibara. Bursa Hazırlık Atlası’nda ise belediyenin açık verileriyle,
              harita üzerinde çalıştım.
            </p>
            <dl className="tools">
              {TOOLS.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="iletisim" className="section wrap contact" aria-labelledby="iletisim-baslik">
          <div className="contact-intro">
            <h2 id="iletisim-baslik">İletişim</h2>
            <p>Staj, ortak proje ya da sadece merhaba demek için yazabilirsin.</p>
            <a className="contact-mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <ul className="contact-links">
              <li><a href={GITHUB} target="_blank" rel="noopener noreferrer"><FaGithub aria-hidden /> GitHub</a></li>
              <li><a href="https://x.com/elifisilbesgur" target="_blank" rel="noopener noreferrer"><FaXTwitter aria-hidden /> X</a></li>
            </ul>
          </div>
          <form className="contact-form" onSubmit={sendMail}>
            <label>
              Adın
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
            </label>
            <label>
              Konu
              <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Portfolyo üzerinden mesaj" />
            </label>
            <label>
              Mesajın
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </label>
            <button type="submit" className="btn btn-primary">E-posta uygulamasında aç</button>
            <p className="form-note">Mesajın, e-posta uygulamanda gönderilmeye hazır olarak açılır.</p>
          </form>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">© 2026 Elif Işıl Beşgür</div>
      </footer>
    </>
  );
}
