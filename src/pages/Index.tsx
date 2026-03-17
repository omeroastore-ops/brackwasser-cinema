import { motion, useScroll, useTransform } from 'framer-motion';
import heroImg from '@/assets/hero-cafe.jpg';
import aboutImg from '@/assets/about-detail.jpg';
import gallery1 from '@/assets/gallery-1.jpg';
import gallery2 from '@/assets/gallery-2.jpg';
import gallery3 from '@/assets/gallery-3.jpg';
import gallery4 from '@/assets/gallery-4.jpg';
import gallery5 from '@/assets/gallery-5.jpg';
import merchHoodie from '@/assets/merch-hoodie.jpg';
import merchTote from '@/assets/merch-tote.jpg';
import merchBeanie from '@/assets/merch-beanie.jpg';

const ease = [0.23, 1, 0.32, 1] as const;

const Nav = () => (
  <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 mix-blend-difference">
    <span className="text-xl font-light tracking-[0.3em] uppercase text-foreground">Brackwasser</span>
    <div className="hidden md:flex gap-12 text-label">
      <a href="#menu" className="accent-hover">Menü</a>
      <a href="#gallery" className="accent-hover">Galerie</a>
      <a href="#merch" className="accent-hover">Kollektion</a>
      <a href="#location" className="accent-hover">Kontakt</a>
    </div>
  </nav>
);

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  return (
    <section className="relative h-svh w-full overflow-hidden flex items-center justify-center">
      <motion.div style={{ opacity, scale }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/50 z-10" />
        <img src={heroImg} className="img-cinematic" alt="Brackwasser Design Café Interieur" />
      </motion.div>
      <div className="relative z-20 text-center px-4">
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease }}
          className="text-6xl md:text-[12vw] font-display italic leading-none mb-6 text-foreground"
        >
          Brackwasser
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease }}
          className="text-sm md:text-xl uppercase tracking-[0.5em] font-light text-muted-foreground"
        >
          Kaffee trifft Kreativität.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-col md:flex-row gap-6 justify-center items-center"
        >
          <a href="#menu" className="btn-outline-hero">Das Café entdecken</a>
          <a href="#gallery" className="btn-text-hero">Galerie ansehen</a>
        </motion.div>
      </div>
    </section>
  );
};

const About = () => (
  <section className="py-[20vh] px-8 max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
    <motion.div
      whileInView={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: -30 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease }}
      className="space-y-8"
    >
      <h2 className="text-4xl md:text-6xl font-display text-foreground">
        Ein Intervall<br />zwischen Ebbe und Flut.
      </h2>
      <p className="text-lg text-muted-foreground leading-relaxed font-light">
        Brackwasser ist kein gewöhnliches Café. Es ist ein temporäres Refugium für Ästheten und Denker am Hafen Ost. 
        Wir kuratieren Momente aus feinstem Rösthandwerk und progressivem Design. 
        In einer Welt, die niemals stillsteht, bieten wir den Ankerplatz.
      </p>
      <div className="pt-8 border-t border-border flex gap-12">
        {['Röstung', 'Design', 'Kultur'].map((label, i) => (
          <div key={label}>
            <p className="text-2xl font-display italic text-foreground">0{i + 1}</p>
            <p className="text-label">{label}</p>
          </div>
        ))}
      </div>
    </motion.div>
    <motion.div
      whileInView={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.9 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease }}
      className="aspect-[3/4] bg-secondary overflow-hidden"
    >
      <img
        src={aboutImg}
        className="w-full h-full object-cover grayscale hover:scale-105 transition-transform duration-[2s]"
        alt="Kaffeedetail"
      />
    </motion.div>
  </section>
);

const menuItems = [
  { n: 'Americano', p: '4.0' }, { n: 'Espresso', p: '3.0' },
  { n: 'Espresso Doppio', p: '4.0' }, { n: 'Filterkaffee', p: '4.0' },
  { n: 'Cappuccino', p: '4.5' }, { n: 'Flat White', p: '5.0' },
  { n: 'Milchkaffee', p: '5.5' }, { n: 'Latte Macchiato', p: '5.0' },
  { n: 'Chococino', p: '5.5' }, { n: 'Espresso Tonic', p: '5.5' },
  { n: 'Heiße Schokolade', p: '4.0' }, { n: 'Tee diverse Sorten', p: '3.5' },
  { n: 'Bio Limonade', p: '3.5' }, { n: 'Fritz Cola', p: '3.5' },
];

const Menu = () => (
  <section id="menu" className="py-[15vh] surface-dark">
    <div className="max-w-5xl mx-auto px-8">
      <div className="flex justify-between items-end mb-24">
        <h2 className="text-5xl font-display italic text-foreground">Die Selektion</h2>
        <span className="text-label">Preise in Euro</span>
      </div>
      <div className="grid md:grid-cols-2 gap-x-32 gap-y-12">
        {menuItems.map((item, i) => (
          <motion.div
            key={i}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, ease }}
            className="flex justify-between items-center group cursor-default"
          >
            <span className="text-lg font-light text-foreground group-hover:text-accent transition-colors">{item.n}</span>
            <div className="flex-1 mx-4 border-b border-border border-dotted" />
            <span className="font-display italic text-muted-foreground">{item.p}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const galleryImages = [
  { src: gallery1, alt: 'Latte Art', span: 'md:row-span-2' },
  { src: gallery2, alt: 'Ambiente', span: '' },
  { src: gallery3, alt: 'Kaffeetasse', span: '' },
  { src: gallery4, alt: 'Espressomaschine', span: 'md:col-span-2' },
  { src: gallery5, alt: 'Sitzecke', span: '' },
];

const Gallery = () => (
  <section id="gallery" className="py-[15vh] px-8">
    <div className="max-w-7xl mx-auto">
      <motion.div
        whileInView={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        viewport={{ once: true }}
        className="mb-24 text-center"
      >
        <p className="text-label-wide mb-4">Einblicke</p>
        <h2 className="text-5xl md:text-7xl font-display italic text-foreground">Galerie</h2>
      </motion.div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {galleryImages.map((img, i) => (
          <motion.div
            key={i}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, ease }}
            className={`overflow-hidden group ${img.span} ${i === 0 ? 'aspect-[3/4]' : i === 3 ? 'aspect-[2/1]' : 'aspect-square'}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-700"
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const merchItems = [
  { t: 'Heavy Hoodie', c: 'Deep Black', img: merchHoodie },
  { t: 'Signature Tote', c: 'Raw Canvas', img: merchTote },
  { t: 'Design Beanie', c: 'Slate Grey', img: merchBeanie },
];

const Merch = () => (
  <section id="merch" className="py-[20vh] px-8">
    <div className="max-w-7xl mx-auto">
      <p className="text-label-wide text-center mb-4">Tragbare Ästhetik</p>
      <h2 className="text-6xl font-display text-center mb-24 italic text-foreground">Kollektion 01</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {merchItems.map((item, i) => (
          <motion.div
            key={i}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, ease }}
            whileHover={{ y: -10 }}
            className="group"
          >
            <div className="aspect-[4/5] bg-secondary overflow-hidden mb-6 relative">
              <img src={item.img} className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-110 transition-transform duration-700" alt={item.t} />
              <div className="absolute top-4 right-4 bg-foreground text-background text-[8px] px-2 py-1 uppercase tracking-tighter font-bold">
                Limitierte Edition
              </div>
            </div>
            <h3 className="text-xl font-display italic text-foreground">{item.t}</h3>
            <p className="text-label mt-1">{item.c}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer id="location" className="surface-darker pt-[15vh] pb-12 px-8">
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 border-b border-border pb-24">
      <div className="space-y-12">
        <div>
          <h4 className="text-label mb-4">Standort</h4>
          <p className="text-3xl font-display italic text-foreground">Am Hafen Ost 2<br />26409 Wittmund</p>
        </div>
        <div>
          <h4 className="text-label mb-4">Öffnungszeiten</h4>
          <p className="text-xl font-light text-foreground">Samstag & Sonntag<br />11:00 – 17:30</p>
        </div>
      </div>
      <div className="flex flex-col justify-between items-end text-right">
        <div className="text-6xl md:text-8xl font-display italic text-foreground/10">Brackwasser</div>
        <div className="space-y-4">
          <p className="text-label">Folge uns</p>
          <a href="https://instagram.com/brackwasser_designcafe" target="_blank" rel="noopener noreferrer" className="block text-2xl font-light text-foreground accent-hover">
            @brackwasser_designcafe
          </a>
        </div>
      </div>
    </div>
    <div className="mt-12 flex justify-between items-center text-[8px] uppercase tracking-[0.4em] text-muted-foreground/40">
      <p>© 2025 Brackwasser Design Café</p>
      <p>Impressum / Datenschutz</p>
    </div>
  </footer>
);

const FloatingCTA = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 1 }}
    className="fixed bottom-8 right-8 z-40 hidden md:block"
  >
    <div className="bg-foreground text-background px-6 py-4 text-[10px] font-bold uppercase tracking-widest shadow-2xl">
      Wir sehen uns am Wochenende.
    </div>
  </motion.div>
);

const Index = () => (
  <div className="bg-background text-foreground selection:bg-accent/30 antialiased font-body">
    <Nav />
    <Hero />
    <About />
    <Menu />
    <Gallery />
    <Merch />
    <Footer />
    <FloatingCTA />
  </div>
);

export default Index;
