import React, { useRef, useEffect, useState } from 'react';
import { FaHome, FaUser, FaCode, FaBriefcase, FaEnvelope, FaTwitter, FaGithub, FaFacebook, FaAngleUp, FaAngleDown, FaBars, FaTimes, FaPhoneAlt, FaFax, FaEnvelopeOpenText, FaMapMarkerAlt, FaSun, FaMoon, FaCog } from 'react-icons/fa';
import { SiPython } from 'react-icons/si';
import './App.css';

function App() {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const servicesRef = useRef(null);
  const portfolioRef = useRef(null);
  const contactRef = useRef(null);
  
  const [activeSection, setActiveSection] = useState('home');
  const [showScrollButtons] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  
  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Toggle menu function
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu when clicking on a nav link
  const handleNavClick = (ref) => {
    scrollToSection(ref);
    setMenuOpen(false);
  };

  // Handle scroll to set active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      if (homeRef.current && scrollPosition < aboutRef.current.offsetTop) {
        setActiveSection('home');
      } else if (aboutRef.current && scrollPosition >= aboutRef.current.offsetTop && scrollPosition < servicesRef.current.offsetTop) {
        setActiveSection('about');
      } else if (servicesRef.current && scrollPosition >= servicesRef.current.offsetTop && scrollPosition < portfolioRef.current.offsetTop) {
        setActiveSection('services');
      } else if (portfolioRef.current && scrollPosition >= portfolioRef.current.offsetTop && scrollPosition < contactRef.current.offsetTop) {
        setActiveSection('portfolio');
      } else if (contactRef.current && scrollPosition >= contactRef.current.offsetTop) {
        setActiveSection('contact');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: 'smooth'
    });
  };

  // Scroll to next section
  const scrollToNext = () => {
    if (activeSection === 'home') {
      scrollToSection(aboutRef);
    } else if (activeSection === 'about') {
      scrollToSection(servicesRef);
    } else if (activeSection === 'services') {
      scrollToSection(portfolioRef);
    } else if (activeSection === 'portfolio') {
      scrollToSection(contactRef);
    }
  };

  // Scroll to previous section
  const scrollToPrev = () => {
    if (activeSection === 'contact') {
      scrollToSection(portfolioRef);
    } else if (activeSection === 'portfolio') {
      scrollToSection(servicesRef);
    } else if (activeSection === 'services') {
      scrollToSection(aboutRef);
    } else if (activeSection === 'about') {
      scrollToSection(homeRef);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form gönderildi!');
  };

  return (
    <div className={`app-container ${theme}-theme ${menuOpen ? 'menu-open' : ''}`}>
      <div className={`menu-toggle ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        {menuOpen ? <FaTimes className="close-icon" /> : <FaBars className="menu-icon" />}
      </div>
      
      <aside className={`sidebar ${menuOpen ? 'menu-open' : ''}`}>
        <div className="site-title">Elif Işıl Beşgür</div>
        <nav className="nav-links">
          <a 
            href="#home" 
            className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(homeRef);
            }}
          >
            <FaHome /> <span>Ana Sayfa</span>
          </a>
          <a 
            href="#about" 
            className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(aboutRef);
            }}
          >
            <FaUser /> <span>Ben Kimim?</span>
          </a>
          <a 
            href="#services" 
            className={`nav-link ${activeSection === 'services' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(servicesRef);
            }}
          >
            <FaCode /> <span>Neler Yapabilirim?</span>
          </a>
          <a 
            href="#portfolio" 
            className={`nav-link ${activeSection === 'portfolio' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(portfolioRef);
            }}
          >
            <FaBriefcase /> <span>Portfolyo</span>
          </a>
          <a 
            href="#contact" 
            className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(contactRef);
            }}
          >
            <FaEnvelope /> <span>İletişim</span>
          </a>
          <div className="theme-toggle" onClick={toggleTheme}>
            <FaSun className="theme-icon sun" />
            <FaMoon className="theme-icon moon" />
            <div className="toggle-slider"></div>
          </div>
          
        </nav>
        <div className="social-links">
          <a href="https://x.com/elifisilbesgur" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://github.com/elifisilbesgur" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
        </div>
      </aside>
      <main className="content">
        {/* Home Section */}
        <section className="section hero-section" id="home" ref={homeRef}>
          <div className="section-background-text">HOŞ GELDİNİZ</div>
          <h1>Ben Elif Işıl Beşgür</h1>
          <p>Portfolyo sayfamı incelemek için kaydırın!</p>
          <a 
            href="#portfolio" 
            className="hero-btn"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(portfolioRef);
            }}
          >
            Portfolyomu İncele
          </a>
          <div className="hero-photo-container">
            <img 
              src="/image/profil.jpg" 
              alt="Elif Işıl BEŞGÜR" 
              className="hero-photo"
            />
          </div>
          
          {showScrollButtons && (
            <div className="scroll-buttons">
              <button className="scroll-btn down" onClick={scrollToNext}>
                <FaAngleDown />
              </button>
            </div>
          )}
        </section>

        {/* About Section */}
        <section className="section" id="about" ref={aboutRef}>
          <div className="section-background-text">HAKKIMDA</div>
          <h2 className="section-title">Ben Kimim?</h2>
          <div className="about-content">
            <div className="about-img">
              <img src="image/5.jpg" alt="Hakkımdanın fotorafı" />
            </div>
            <div className="about-text">
              <p> Ben bilgisayar mühendisliği bölümü 2. sınıf öğrencisiyim. Öğrendiğim yazılım dilleriyle uygulamalar geliştiriyorum.</p>
              <p>C#, C++, Java, Python, HTML, CSS, JavaScript dillerinde deneyimim var.</p>
              <p>Qt Designer ve PyQt kullanarak basit masaüstü uygulamaları geliştiriyorum. Şimdiye kadar küçük çaplı projeler yaptım. 
                Örneğin, bir pastane sipariş uygulaması, bir soru bankası uygulaması ve bir kelime işlemci uygulamasıgeliştirdim. Bu projeler sayesinde arayüz tasarımı
                 ve Python ile kodlama konularında kendimi geliştirme fırsatı buldum.</p>
              
              <div className="personal-info">
                <div className="personal-info-item">
                  <strong>İsim:</strong> <span>Elif Işıl BEŞGÜR</span>
                </div>
                <div className="personal-info-item">
                  <strong>Email:</strong> <a href="mailto:info@.com">elifisilbesgur.bursa@gmail.com</a>
                </div>
                <div className="personal-info-item">
                  <strong>Konum:</strong> <span>BALIKESİR, Türkiye</span>
                </div>
                <div className="personal-info-item">
                  <strong>Üniversite:</strong> <span>Balıkesir Üniversitesi</span>
                </div>
              </div>
              
            </div>
          </div>
          
          
          
          {showScrollButtons && (
            <div className="scroll-buttons">
              <button className="scroll-btn up" onClick={scrollToPrev}>
                <FaAngleUp />
              </button>
              <button className="scroll-btn down" onClick={scrollToNext}>
                <FaAngleDown />
              </button>
            </div>
          )}
        </section>

        {/* Services Section */}
        <section className="section" id="services" ref={servicesRef}>
          <div className="section-background-text">YAPABİLDİKLERİM</div>
          <h2 className="section-title">Neler Yapabilirim?</h2>
          <div className="services-container">
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">
                  <FaCode />
                </div>
                <h3 className="service-title">Web Geliştirme</h3>
                <p>HTML, CSS, JavaScript ve  React kullanarak basit düzeyde internet sayfaları tasarlayabiliyorum. Tasarımdan 
                  kodlamaya kadar web projelerini baştan sona oluşturma deneyimi edindim. Kendi portföy sayfamı oluşturarak öğrendiklerimi uyguluyorum.</p>
              </div>
              <div className="service-card">
                <div className="service-icon">
                  <SiPython />
                </div>
                <h3 className="service-title">PyQt5 ve Qtdesigner</h3>
                <p>PyQt5 ve Qtdesigner kullanarak uygulama yapabiliyorum.Qt Designer ile tasarladığım kullanıcı arayüzlerini PyQt5 ile birleştirerek 
                  işlevsel projeler ortaya koyuyorum. PyQt5 ve Qt Designer kullanarak soru bankası uygulaması, pastane uygulaması ve kelime
                   istemci uygulaması gibi projeler geliştirdim.</p>
              </div>
              <div className="service-card fusion-card">
                <div className="service-icon">
                  <FaCog />
                </div>
                <h3 className="service-title">Fusion 360 ile 3D Modelleme</h3>
                <p>Üniversite projelerimde ve kişisel çalışmalarımda Fusion 360 kullanarak temel seviyede 3D modellemeler yapabiliyorum. 
                  Parça tasarımı, montaj ve basit simülasyonlar üzerinde çalışıyor; fikirlerimi somut hale getirmek için dijital prototipleme becerilerimi geliştiriyorum.
                </p>
              </div>
            </div>
            
            <div className="skills-section">
              <h3 className="skills-title">Programlama Becerileri</h3>
              <div className="skills-container">
                <div className="skill-item">
                  <div className="skill-info">
                    <span>HTML/CSS</span>
                    <span>90%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-progress" style={{width: '90%'}}></div>
                  </div>
                </div>
                
                <div className="skill-item">
                  <div className="skill-info">
                    <span>JavaScript</span>
                    <span>75%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-progress" style={{width: '75%'}}></div>
                  </div>
                </div>
                
                <div className="skill-item">
                  <div className="skill-info">
                    <span>React</span>
                    <span>65%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-progress" style={{width: '65%'}}></div>
                  </div>
                </div>
                
                <div className="skill-item">
                  <div className="skill-info">
                    <span>Python</span>
                    <span>85%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-progress" style={{width: '85%'}}></div>
                  </div>
                </div>
                
                <div className="skill-item">
                  <div className="skill-info">
                    <span>PyQt5</span>
                    <span>80%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-progress" style={{width: '80%'}}></div>
                  </div>
                </div>
                
                <div className="skill-item">
                  <div className="skill-info">
                    <span>C#</span>
                    <span>70%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-progress" style={{width: '70%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {showScrollButtons && (
            <div className="scroll-buttons">
              <button className="scroll-btn up" onClick={scrollToPrev}>
                <FaAngleUp />
              </button>
              <button className="scroll-btn down" onClick={scrollToNext}>
                <FaAngleDown />
              </button>
            </div>
          )}
        </section>

        {/* Portfolio Section */}
        <section className="section" id="portfolio" ref={portfolioRef}>
          <div className="section-background-text">PORTFOLIO</div>
          <h2 className="section-title">Portfolyo</h2>
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">1. Proje</div>
              <div className="stat-title">Soru Bankası Uygulaması</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2. Proje</div>
              <div className="stat-title">Pastane Sipariş Uygulaması</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">3. Proje</div>
              <div className="stat-title">Kelime İşlemci Uygulaması</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4. Proje</div>
              <div className="stat-title">Portfolyo Sitesi</div>
            </div>
          </div>
          <div className="portfolio-grid">
            <div className="portfolio-item">
            <a href="https://github.com/elifisilbesgur/Soru-Bankas-Uygulamas-" target="_blank" rel="noopener noreferrer">
              <img 
                src="image/4.jpg" 
                alt="Soru Bankası Uygulaması" 
                className="portfolio-img" 
              />
            </a>
              <div className="portfolio-info">
                <h3>Soru Bankası Uygulaması</h3>
                <p>Python, PyQt5 ve Qtdesigner kullanarak geliştirdiğim soru bankası uygulaması. 
                  Bu uygulama, kullanıcıların soru bankası oluşturmasına ve sorularını yönetmesine olanak tanır. Qt Designer ve PyQt5 kullanarak geliştirdim.
                </p>
              </div>
            </div>
            <div className="portfolio-item">
            <a href="https://github.com/elifisilbesgur/Pastane-Uygulamas-" target="_blank" rel="noopener noreferrer">
              <img 
                src="image/3.jpg" 
                alt="Pastane Sipariş Uygulaması" 
                className="portfolio-img" 
              />
            </a>
              <div className="portfolio-info">
                <h3>Pastane Sipariş Uygulaması</h3>
                <p>Bu uygulama, kullanıcıların pastane siparişlerini yapmasına ve ödemelerini tamamlamasına olanak tanır.
                  Ayrıca, siparişlerin takibi ve yönetimi için güzel bir arayüz sunar. Kullanıcıların siparişlerini alır ve veritabanına kaydeder.
                  PyQt5 kullanarak geliştirdim.
                </p>
              </div>
            </div>
            <div className="portfolio-item">
            <a href="https://github.com/elifisilbesgur/Kelime-lemci" target="_blank" rel="noopener noreferrer">
              <img 
                src="image/2.jpg" 
                alt="Kelime İşlemci" 
                className="portfolio-img" 
              />
            </a> 
              <div className="portfolio-info">
                <h3>Kelime İşlemci Uygulaması</h3>
                <p>BU uygulama, word benzeri bir uygulamadır. Kullanıcılar girdikleri kelimelerin rengini boyutunu değiştirebilirler. Kelimeler üzerinden kes-kopyala-yapıştır işlemlerini gerçekleştirebilirler.
                Kelimeyi altı çizgili, kalın ve italik yapabilirler. Bu işlemlerden sonrada dosyayı kaydedebilirler. Qt Designer ve PyQt5 kullanarak geliştirdim. 
                   </p>
              </div>
            </div>
            <div className="portfolio-item">
              <img 
                src="image/1.jpg" 
                alt="Site Projesi" 
                className="portfolio-img" 
              />
              <div className="portfolio-info">
                <h3>Portfolyo Sitesi</h3>
                <p>Kendimi tanıtmak amacıyla HTML, JavaScript, CSS ve React kullanarak basit bir site oluşturdum.</p>
              </div>
            </div>
            
            
          </div>
          
          {showScrollButtons && (
            <div className="scroll-buttons">
              <button className="scroll-btn up" onClick={scrollToPrev}>
                <FaAngleUp />
              </button>
              <button className="scroll-btn down" onClick={scrollToNext}>
                <FaAngleDown />
              </button>
            </div>
          )}
        </section>

        {/* Contact Section */}
        <section className="section" id="contact" ref={contactRef}>
          <div className="section-background-text">CONTACT</div>
          <h2 className="section-title">İletişim</h2>
          <div className="contact-flex-container">
            <div className="contact-info-box">
              <h3 className="contact-info-title">ADRES</h3>
              <div className="contact-info-address">
                <FaMapMarkerAlt className="contact-info-icon" />
                <span>Balıkesir, Türkiye</span>
              </div>
              <div className="contact-info-item">
                <FaPhoneAlt className="contact-info-icon" />
                <span>(553) 553 28 80</span>
              </div>
              <div className="contact-info-item">
                <FaFax className="contact-info-icon" />
                <span>(553) 553 80 28</span>
              </div>
              <div className="contact-info-item">
                <FaEnvelopeOpenText className="contact-info-icon" />
                <span>elifisilbesgur.bursa@gmail.com</span>
              </div>
              <h4 className="contact-info-follow">SOSYAL MEDYA HESAPLARIM</h4>
              <div className="contact-info-social">
                <a href="https://x.com/elifisilbesgur" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                <a href="https://github.com/elifisilbesgur" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Ad Soyad</label>
                <input type="text" id="name" className="form-control" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-posta</label>
                <input type="email" id="email" className="form-control" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Mesaj</label>
                <textarea id="message" className="form-control" required></textarea>
              </div>
              <button type="submit" className="submit-btn">Gönder</button>
            </form>
          </div>
          {showScrollButtons && (
            <div className="scroll-buttons">
              <button className="scroll-btn up" onClick={scrollToPrev}>
                <FaAngleUp />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
