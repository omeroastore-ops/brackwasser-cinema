import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
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

/* ─── NAV ─── */
const Nav = () => (
  <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 mix-blend-difference">
    <span className="text-lg font-bold tracking-[0.3em] uppercase text-white">BW</span>
    <div className="hidden md:flex gap-10 text-[10px] uppercase tracking-[0.3em] font-semibold text-white/70">
      <a href="#menu" className="hover:text-white transition-colors">Menü</a>
      <a href="#gallery" className="hover:text-white transition-colors">Galerie</a>
      <a href="#merch" className="hover:text-white transition-colors">Kollektion</a>
      <a href="#location" className="hover:text-white transition-colors">Kontakt</a>
    </div>
  </nav>
);

/* ─── HERO ─── */
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);

  return (
    <section ref={ref} className="relative h-[110vh] w-full overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <img src={heroImg} className="img-cinematic" alt="Brackwasser Café" />
        {/* Blue overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand/80 via-brand-dark/60 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </motion.div>

      {/* Blue glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-glow/15 blur-[120px] z-[1]" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-brand-light/10 blur-[100px] z-[1]" />

      {/* Geometric lines */}
      <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent z-[2]" />
      <div className="absolute top-0 right-[30%] w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent z-[2]" />

      {/* Content */}
      <motion.div style={{ y: textY, opacity }} className="relative z-20 h-full flex flex-col justify-center px-8 md:px-20">
        <motion.p
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease }}
          className="text-[10px] md:text-xs uppercase tracking-[0.8em] text-white/50 mb-6 font-semibold"
        >
          Wittmund — Hafen Ost
        </motion.p>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, ease }}
            className="text-[18vw] md:text-[14vw] font-black uppercase leading-[0.85] tracking-tight text-white"
            style={{ fontFamily: 'Geist, system-ui, sans-serif' }}
          >
            BRACK
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.15, ease }}
            className="text-[18vw] md:text-[14vw] font-black uppercase leading-[0.85] tracking-tight text-transparent"
            style={{
              fontFamily: 'Geist, system-ui, sans-serif',
              WebkitTextStroke: '2px rgba(255,255,255,0.6)',
            }}
          >
            WASSER
          </motion.h1>
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease }}
          className="mt-10 flex flex-col md:flex-row items-start gap-8"
        >
          <p className="text-xs md:text-sm uppercase tracking-[0.5em] font-bold text-white/40">
            Pop-Up Design Café
          </p>
          <a href="#menu" className="group relative px-10 py-4 bg-white text-brand text-[10px] uppercase tracking-widest font-bold overflow-hidden transition-all duration-500 hover:bg-brand-light hover:text-white">
            Entdecken →
          </a>
        </motion.div>

        {/* Side vertical text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute right-8 bottom-20 hidden lg:block"
        >
          <p className="text-[9px] uppercase tracking-[0.5em] text-white/20 [writing-mode:vertical-rl]">
            Kaffee trifft Kreativität
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ─── ABOUT ─── */
const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['12%', '-12%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);

  return (
    <section ref={ref} className="relative py-[15vh] md:py-[25vh] overflow-hidden bg-background">
      {/* Large decorative text */}
      <div className="absolute top-[5%] -right-[10%] text-[22vw] font-black uppercase text-primary/[0.03] leading-none select-none pointer-events-none" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
        CAFÉ
      </div>

      {/* Decorative blue bar */}
      <div className="absolute left-0 top-[30%] w-2 h-[200px] bg-primary" />

      <div className="relative px-8 md:px-20 max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Image block */}
          <motion.div style={{ y: imgY }} className="md:col-span-5 relative z-10">
            <motion.div
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.85 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease }}
              className="aspect-[3/4] overflow-hidden relative"
            >
              <img src={aboutImg} className="img-brand hover:scale-110 transition-transform duration-[2s]" alt="Kaffeedetail" />
              {/* Blue accent overlay corner */}
              <div className="absolute bottom-0 left-0 w-1/3 h-1/4 bg-primary/80 flex items-center justify-center">
                <p className="text-[9px] uppercase tracking-[0.3em] text-primary-foreground font-bold">Est. 2024</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div style={{ y: textY }} className="md:col-span-6 md:col-start-7 md:mt-[15vh] relative z-20">
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="space-y-8"
            >
              <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-primary">Über uns</p>
              <h2 className="text-4xl md:text-6xl font-black uppercase leading-[1] text-foreground" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
                Ein Ort<br />
                <span className="text-primary">zwischen</span><br />
                den Gezeiten.
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
                Brackwasser ist kein gewöhnliches Café. Es ist ein temporäres Refugium für Ästheten
                und Denker am Hafen Ost. Wir kuratieren Momente aus feinstem Rösthandwerk und
                progressivem Design.
              </p>
              <div className="pt-8 flex gap-16">
                {['Röstung', 'Design', 'Kultur'].map((label, i) => (
                  <motion.div
                    key={label}
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, ease }}
                  >
                    <p className="text-4xl font-black text-primary" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>0{i + 1}</p>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-muted-foreground mt-1">{label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ─── MENU ─── */
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
  <section id="menu" className="relative py-[15vh] surface-dark overflow-hidden">
    {/* Geometric accent */}
    <div className="absolute top-0 right-0 w-[300px] h-[300px] border border-brand-glow/10 rotate-45 translate-x-1/2 -translate-y-1/2" />
    <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-primary/5 -translate-x-1/2 translate-y-1/2" />

    <div className="max-w-6xl mx-auto px-8 md:px-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-6">
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -40 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-brand-glow/60 mb-4 font-semibold">Die Selektion</p>
          <h2 className="text-5xl md:text-7xl font-black uppercase text-white" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
            Unsere <span className="text-gradient-brand">Karte</span>
          </h2>
        </motion.div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-semibold">€ EUR</span>
      </div>

      <div className="grid md:grid-cols-2 gap-x-20">
        {menuItems.map((item, i) => (
          <motion.div
            key={i}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 15 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03, ease }}
            className="group relative py-5 border-b border-white/[0.06] cursor-default"
          >
            {/* Hover fill */}
            <div className="absolute inset-0 bg-primary/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-expo" />
            <div className="relative flex justify-between items-baseline px-2">
              <span className="text-lg font-medium text-white group-hover:text-brand-glow transition-colors duration-400">
                {item.n}
              </span>
              <div className="flex-1 mx-4 border-b border-dotted border-white/10" />
              <span className="text-xl font-bold text-white/40 group-hover:text-brand-glow transition-colors duration-400" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
                {item.p}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── GALLERY ─── */
const Gallery = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], ['15%', '-15%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['5%', '-25%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['20%', '-10%']);

  return (
    <section ref={ref} id="gallery" className="relative py-[10vh] md:py-[20vh] px-8 md:px-16 overflow-hidden bg-background">
      {/* Blue glow accent */}
      <div className="absolute top-1/3 left-0 w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[150px]" />

      <motion.div
        whileInView={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        viewport={{ once: true }}
        className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold mb-4">Einblicke</p>
          <h2 className="text-5xl md:text-8xl font-black uppercase text-foreground" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
            GAL<span className="text-primary">LERIE</span>
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-xs">Impressionen aus unserem Refugium am Hafen Ost.</p>
      </motion.div>

      {/* Collage layout */}
      <div className="relative max-w-[1400px] mx-auto min-h-[80vh] md:min-h-[120vh]">
        {/* Large left */}
        <motion.div style={{ y: y1 }} className="relative md:absolute md:left-0 md:top-0 md:w-[48%] z-10 mb-6 md:mb-0">
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="aspect-[3/4] overflow-hidden group relative"
          >
            <img src={gallery1} alt="Latte Art" className="img-brand group-hover:scale-110 transition-transform duration-[1.5s]" />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
          </motion.div>
        </motion.div>

        {/* Square right top */}
        <motion.div style={{ y: y2 }} className="relative md:absolute md:right-0 md:top-[5%] md:w-[38%] z-20 mb-6 md:mb-0">
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 40 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="aspect-square overflow-hidden group relative"
          >
            <img src={gallery2} alt="Ambiente" className="img-brand group-hover:scale-110 transition-transform duration-[1.5s]" />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
          </motion.div>
          {/* Blue accent bar */}
          <div className="absolute -bottom-2 left-0 w-16 h-1 bg-primary" />
        </motion.div>

        {/* Center overlap */}
        <motion.div style={{ y: y3 }} className="relative md:absolute md:left-[28%] md:top-[45%] md:w-[40%] z-30 mb-6 md:mb-0">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="aspect-[16/10] overflow-hidden group shadow-2xl relative"
          >
            <img src={gallery3} alt="Kaffeetasse" className="img-brand group-hover:scale-110 transition-transform duration-[1.5s]" />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
          </motion.div>
        </motion.div>

        {/* Bottom right */}
        <motion.div style={{ y: y1 }} className="relative md:absolute md:right-[3%] md:top-[55%] md:w-[28%] z-20 mb-6 md:mb-0">
          <motion.div
            whileInView={{ opacity: 1, rotate: 0 }}
            initial={{ opacity: 0, rotate: 2 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="aspect-[4/5] overflow-hidden group relative"
          >
            <img src={gallery4} alt="Espressomaschine" className="img-brand group-hover:scale-110 transition-transform duration-[1.5s]" />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
          </motion.div>
        </motion.div>

        {/* Bottom left small */}
        <motion.div style={{ y: y2 }} className="relative md:absolute md:left-[3%] md:top-[75%] md:w-[25%] z-30">
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="aspect-square overflow-hidden group glow-blue relative"
          >
            <img src={gallery5} alt="Sitzecke" className="img-brand group-hover:scale-110 transition-transform duration-[1.5s]" />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── MERCH ─── */
const merchItems = [
  { t: 'Heavy Hoodie', c: 'Deep Black', img: merchHoodie },
  { t: 'Signature Tote', c: 'Raw Canvas', img: merchTote },
  { t: 'Design Beanie', c: 'Slate Grey', img: merchBeanie },
];

const Merch = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['3%', '-3%']);

  return (
    <section ref={ref} id="merch" className="relative py-[15vh] md:py-[25vh] overflow-hidden surface-brand">
      {/* Geometric shapes */}
      <div className="absolute top-[10%] right-[5%] w-[200px] h-[200px] border border-white/10 rotate-12" />
      <div className="absolute bottom-[15%] left-[8%] w-[100px] h-[100px] bg-white/5 rotate-45" />

      {/* Large background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black uppercase text-white/[0.04] leading-none select-none pointer-events-none whitespace-nowrap" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
        STREETWEAR
      </div>

      <div className="relative px-8 md:px-16 max-w-[1400px] mx-auto">
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-bold mb-4">Tragbare Ästhetik</p>
            <h2 className="text-5xl md:text-8xl font-black uppercase text-white" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
              DROP 01
            </h2>
          </div>
          <p className="text-sm text-white/50 max-w-xs">
            Limitierte Stücke. Kein Restock.
          </p>
        </motion.div>

        <motion.div style={{ x }} className="flex flex-col md:flex-row gap-6 items-start">
          {merchItems.map((item, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 60 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, ease }}
              className={`group flex-1 ${i === 1 ? 'md:mt-20' : i === 2 ? 'md:mt-10' : ''}`}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.6, ease }}
                className="relative overflow-hidden mb-6"
              >
                <div className={`${i === 0 ? 'aspect-[3/4]' : i === 1 ? 'aspect-[4/5]' : 'aspect-square'} overflow-hidden`}>
                  <img
                    src={item.img}
                    className="w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-700"
                    alt={item.t}
                  />
                </div>
                {/* Label */}
                <div className="absolute top-4 left-4 bg-white text-primary text-[8px] px-3 py-1.5 uppercase tracking-[0.2em] font-black">
                  Limited
                </div>
              </motion.div>
              <h3 className="text-xl font-bold uppercase tracking-wide text-white">{item.t}</h3>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mt-1 font-semibold">{item.c}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ─── FOOTER ─── */
const Footer = () => (
  <footer id="location" className="relative surface-dark pt-[15vh] pb-12 px-8 md:px-16 overflow-hidden">
    {/* Blue glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-brand-glow/10 blur-[120px] rounded-full" />

    <div className="relative max-w-[1400px] mx-auto">
      <div className="grid md:grid-cols-12 gap-16 border-b border-white/[0.08] pb-24">
        <div className="md:col-span-5 space-y-12">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            transition={{ ease }}
          >
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-brand-glow/50 font-bold mb-4">Standort</h4>
            <p className="text-3xl md:text-4xl font-black uppercase text-white leading-tight" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
              Am Hafen<br />Ost 2
            </p>
            <p className="text-sm text-white/40 mt-2">26409 Wittmund</p>
          </motion.div>
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, ease }}
          >
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-brand-glow/50 font-bold mb-4">Öffnungszeiten</h4>
            <p className="text-xl font-medium text-white">
              Samstag & Sonntag<br />11:00 – 17:30
            </p>
          </motion.div>
        </div>

        <div className="md:col-span-7 flex flex-col justify-between items-start md:items-end text-right">
          <motion.div
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-[12vw] font-black uppercase text-white/[0.03] leading-none"
            style={{ fontFamily: 'Geist, system-ui, sans-serif' }}
          >
            BW
          </motion.div>
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, ease }}
            className="space-y-4"
          >
            <p className="text-[10px] uppercase tracking-[0.4em] text-brand-glow/50 font-bold">Social</p>
            <a
              href="https://instagram.com/brackwasser_designcafe"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xl md:text-2xl font-bold text-white hover:text-brand-glow transition-colors duration-500"
            >
              @brackwasser_designcafe
            </a>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <motion.div
        whileInView={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        viewport={{ once: true }}
        className="mt-16 mb-12 text-center"
      >
        <p className="text-3xl md:text-5xl font-black uppercase text-white/60" style={{ fontFamily: 'Geist, system-ui, sans-serif' }}>
          WIR SEHEN UNS<br />AM WOCHENENDE.
        </p>
      </motion.div>

      <div className="flex justify-between items-center text-[8px] uppercase tracking-[0.4em] text-white/20 font-semibold">
        <p>© 2025 Brackwasser</p>
        <p>Impressum / Datenschutz</p>
      </div>
    </div>
  </footer>
);

/* ─── PAGE ─── */
const Index = () => (
  <div className="bg-background text-foreground antialiased font-body">
    <Nav />
    <Hero />
    <About />
    <Menu />
    <Gallery />
    <Merch />
    <Footer />
  </div>
);

export default Index;
