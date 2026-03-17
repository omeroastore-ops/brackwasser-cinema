import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
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

/* ─── 3D TILT HOOK ─── */
const useTilt = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 30 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => { x.set(0); y.set(0); };
  return { rotateX, rotateY, handleMouse, reset };
};

/* ─── SCROLL TEXT REVEAL ─── */
const RevealText = ({ children, className = '', delay = 0, style }: { children: React.ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) => (
  <div className="overflow-hidden">
    <motion.div
      initial={{ y: '110%', rotate: 3 }}
      whileInView={{ y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 1, delay, ease }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  </div>
);

/* ─── NAV ─── */
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1, delay: 0.5, ease }}
      className={`fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-5 transition-all duration-700 ${
        scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/50' : ''
      }`}
    >
      <a href="#" className={`text-lg font-black tracking-[0.4em] uppercase transition-colors duration-500 ${scrolled ? 'text-foreground' : 'text-white'}`}>
        BRACKWASSER
      </a>
      <div className={`hidden md:flex gap-10 text-[10px] uppercase tracking-[0.3em] font-semibold transition-colors duration-500 ${scrolled ? 'text-muted-foreground' : 'text-white/60'}`}>
        {[
          { label: 'Café', href: '#about' },
          { label: 'Karte', href: '#menu' },
          { label: 'Galerie', href: '#gallery' },
          { label: 'Kollektion', href: '#merch' },
          { label: 'Kontakt', href: '#location' },
        ].map(link => (
          <a key={link.href} href={link.href} className={`hover:${scrolled ? 'text-primary' : 'text-white'} transition-colors duration-300`}>
            {link.label}
          </a>
        ))}
      </div>
    </motion.nav>
  );
};

/* ─── HERO ─── */
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '80%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 0.9]);

  return (
    <section ref={ref} className="relative h-[120vh] w-full overflow-hidden">
      {/* Parallax background */}
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 z-0">
        <img src={heroImg} className="w-full h-full object-cover" alt="Brackwasser Café" />
      </motion.div>

      {/* Gradient overlays */}
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 z-[1] bg-gradient-to-b from-navy/70 via-brand-dark/50 to-navy/90" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-navy/60 via-transparent to-transparent" />

      {/* Floating glow orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full bg-brand-glow/10 blur-[180px] z-[2]"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-light/8 blur-[140px] z-[2]"
      />

      {/* Geometric lines */}
      <div className="absolute top-0 left-[15%] w-px h-full bg-gradient-to-b from-transparent via-white/8 to-transparent z-[3]" />
      <div className="absolute top-0 right-[25%] w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent z-[3]" />
      <div className="absolute top-[40%] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent z-[3]" />

      {/* Hero content */}
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-20 h-full flex flex-col justify-center px-6 md:px-20">
        {/* Stagger label */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-12 h-px bg-brand-glow/60" />
          <p className="text-[10px] md:text-xs uppercase tracking-[0.8em] text-white/50 font-semibold">
            Wittmund — Hafen Ost — Pop-Up Design Café
          </p>
        </motion.div>

        {/* Main title - layered */}
        <div className="relative">
          <RevealText className="text-[16vw] md:text-[12vw] font-black uppercase leading-[0.85] tracking-[-0.03em] text-white">
            BRACK
          </RevealText>
          <RevealText delay={0.12} className="text-[16vw] md:text-[12vw] font-black uppercase leading-[0.85] tracking-[-0.03em] text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.4)' }}>
            WASSER
          </RevealText>

          {/* Floating accent behind text */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.8, ease }}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-[200px] md:w-[300px] h-[60%] bg-primary/20 origin-left z-[-1]"
          />
        </div>

        {/* CTA row */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6, ease }}
          className="mt-12 flex flex-col sm:flex-row items-start gap-6 md:gap-10"
        >
          <a href="#about" className="group relative px-10 py-4 bg-white text-navy text-[10px] uppercase tracking-[0.3em] font-bold overflow-hidden">
            <span className="relative z-10 group-hover:text-white transition-colors duration-500">Das Café entdecken</span>
            <div className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-expo" />
          </a>
          <a href="#gallery" className="group text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 hover:text-white transition-colors duration-500 flex items-center gap-3">
            <span className="w-8 h-px bg-white/30 group-hover:w-12 transition-all duration-500" />
            Galerie ansehen
          </a>
        </motion.div>

        {/* Vertical side text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute right-6 md:right-12 bottom-24 hidden lg:flex flex-col items-center gap-4"
        >
          <div className="w-px h-16 bg-white/20" />
          <p className="text-[9px] uppercase tracking-[0.5em] text-white/20 [writing-mode:vertical-rl]">
            Kaffee trifft Kreativität — Seit 2024
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-12 left-6 md:left-20 flex items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 bg-white/40 rounded-full" />
          </motion.div>
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-medium">Scroll</span>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ─── ABOUT ─── */
const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['15%', '-15%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
  const decorY = useTransform(scrollYProgress, [0, 1], ['25%', '-25%']);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 1.05]);

  return (
    <section ref={ref} id="about" className="relative py-[20vh] md:py-[30vh] overflow-hidden bg-background">
      {/* Huge decorative watermark */}
      <motion.div style={{ y: decorY }} className="absolute -top-[10%] -right-[15%] text-[28vw] font-black uppercase text-primary/[0.03] leading-none select-none pointer-events-none">
        CAFÉ
      </motion.div>

      {/* Blue accent bar */}
      <motion.div
        whileInView={{ scaleY: 1 }}
        initial={{ scaleY: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease }}
        className="absolute left-0 top-[20%] w-1.5 h-[250px] bg-primary origin-top"
      />

      <div className="relative px-6 md:px-20 max-w-[1500px] mx-auto">
        <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Image with parallax + scale */}
          <motion.div style={{ y: imgY }} className="md:col-span-5 relative z-10">
            <div className="perspective-container">
              <motion.div
                style={{ scale: imgScale }}
                className="aspect-[3/4] overflow-hidden relative"
              >
                <img src={aboutImg} className="img-brand hover:scale-110 transition-transform duration-[2s]" alt="Kaffeedetail" />
                {/* Layered corner accent */}
                <motion.div
                  whileInView={{ x: 0, opacity: 1 }}
                  initial={{ x: -30, opacity: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3, ease }}
                  className="absolute bottom-0 left-0 w-1/3 h-1/4 bg-primary flex items-center justify-center"
                >
                  <p className="text-[9px] uppercase tracking-[0.3em] text-primary-foreground font-bold">Est. 2024</p>
                </motion.div>
              </motion.div>
            </div>

            {/* Floating blue block behind image */}
            <motion.div
              style={{ y: useTransform(scrollYProgress, [0, 1], ['-5%', '15%']) }}
              className="absolute -bottom-8 -right-8 w-2/3 h-2/3 bg-primary/10 -z-10"
            />
          </motion.div>

          {/* Text block */}
          <motion.div style={{ y: textY }} className="md:col-span-6 md:col-start-7 md:mt-[18vh] relative z-20">
            <div className="space-y-8">
              <motion.p
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -20 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease }}
                className="text-[10px] uppercase tracking-[0.5em] font-bold text-primary flex items-center gap-3"
              >
                <span className="w-6 h-px bg-primary" />
                Über uns
              </motion.p>

              <RevealText>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] text-foreground">
                  Ein Ort
                </h2>
              </RevealText>
              <RevealText delay={0.08}>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95]">
                  <span className="text-primary">zwischen</span>
                </h2>
              </RevealText>
              <RevealText delay={0.16}>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] text-foreground">
                  den Gezeiten.
                </h2>
              </RevealText>

              <motion.p
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease }}
                className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg pt-4"
              >
                Brackwasser ist kein gewöhnliches Café. Es ist ein temporäres Refugium für Ästheten
                und Denker am Hafen Ost. Wir kuratieren Momente aus feinstem Rösthandwerk und
                progressivem Design — ein Ort, der Kaffee zur Kunst erhebt.
              </motion.p>

              {/* Counters with stagger */}
              <div className="pt-10 flex gap-12 md:gap-16">
                {['Röstung', 'Design', 'Kultur'].map((label, i) => (
                  <motion.div
                    key={label}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    initial={{ opacity: 0, y: 30, scale: 0.8 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.12, ease, duration: 0.6 }}
                    className="group cursor-default"
                  >
                    <p className="text-5xl md:text-6xl font-black text-primary group-hover:text-brand-glow transition-colors duration-500">0{i + 1}</p>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-muted-foreground mt-2">{label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ─── HORIZONTAL DIVIDER ─── */
const Divider = ({ dark = false }: { dark?: boolean }) => (
  <div className={`relative py-4 overflow-hidden ${dark ? 'surface-navy' : 'bg-background'}`}>
    <motion.div
      whileInView={{ scaleX: 1 }}
      initial={{ scaleX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease }}
      className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent origin-center"
    />
  </div>
);

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

const Menu = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const headerX = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <section ref={ref} id="menu" className="relative py-[15vh] md:py-[20vh] surface-navy overflow-hidden">
      {/* Geometric decorations */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] border border-brand-glow/5 rotate-45 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] border border-brand-glow/5 rotate-12 -translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 right-[10%] w-[500px] h-[500px] rounded-full bg-brand-glow/3 blur-[200px]" />

      <div className="max-w-6xl mx-auto px-6 md:px-16 relative">
        {/* Header with parallax */}
        <motion.div style={{ x: headerX }} className="mb-16 md:mb-24">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-brand-glow/50 mb-4 font-semibold flex items-center gap-3">
                <span className="w-6 h-px bg-brand-glow/30" />
                Die Selektion
              </p>
              <RevealText>
                <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase text-white leading-[0.9]">
                  Unsere
                </h2>
              </RevealText>
              <RevealText delay={0.1}>
                <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.9]">
                  <span className="text-gradient-brand">Karte</span>
                </h2>
              </RevealText>
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-semibold">Preise in EUR</span>
          </motion.div>
        </motion.div>

        {/* Menu grid with stagger */}
        <div className="grid md:grid-cols-2 gap-x-16 lg:gap-x-24">
          {menuItems.map((item, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: i * 0.04, duration: 0.6, ease }}
              className="group relative py-5 md:py-6 border-b border-white/[0.06] cursor-default"
            >
              {/* Animated hover background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-primary/5 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-expo" />

              <div className="relative flex justify-between items-baseline px-3">
                <span className="text-lg md:text-xl font-medium text-white/80 group-hover:text-white group-hover:translate-x-2 transition-all duration-500">
                  {item.n}
                </span>
                <div className="flex-1 mx-4 border-b border-dotted border-white/[0.08] group-hover:border-brand-glow/20 transition-colors duration-500" />
                <span className="text-xl md:text-2xl font-black text-white/30 group-hover:text-brand-glow transition-colors duration-500 tabular-nums">
                  {item.p}
                </span>
              </div>

              {/* Left accent bar on hover */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-1/2 bg-primary transition-all duration-500 ease-expo" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── GALLERY ─── */
const Gallery = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['8%', '-30%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['25%', '-10%']);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [3, -1]);

  return (
    <section ref={ref} id="gallery" className="relative py-[12vh] md:py-[20vh] px-6 md:px-16 overflow-hidden bg-background">
      {/* Glow */}
      <div className="absolute top-1/3 left-0 w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[200px]" />
      <div className="absolute bottom-1/4 right-0 w-[30vw] h-[30vw] rounded-full bg-brand-glow/3 blur-[150px]" />

      {/* Header */}
      <motion.div
        whileInView={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        viewport={{ once: true }}
        className="mb-16 md:mb-28 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 max-w-[1500px] mx-auto"
      >
        <div>
          <motion.p
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -20 }}
            viewport={{ once: true }}
            className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold mb-4 flex items-center gap-3"
          >
            <span className="w-6 h-px bg-primary" />
            Einblicke
          </motion.p>
          <RevealText>
            <h2 className="text-6xl md:text-[10vw] font-black uppercase text-foreground leading-[0.85]">
              GAL<span className="text-primary">LERIE</span>
            </h2>
          </RevealText>
        </div>
        <motion.p
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground max-w-xs"
        >
          Impressionen aus unserem Refugium am Hafen Ost — ein Raum zwischen Kaffee und Kreativität.
        </motion.p>
      </motion.div>

      {/* Collage */}
      <div className="relative max-w-[1500px] mx-auto min-h-[80vh] md:min-h-[130vh]">
        {/* Large left */}
        <motion.div style={{ y: y1, rotate: rotate1 }} className="relative md:absolute md:left-0 md:top-0 md:w-[48%] z-10 mb-6 md:mb-0">
          <GalleryImage src={gallery1} alt="Latte Art" aspect="aspect-[3/4]" />
        </motion.div>

        {/* Square right top */}
        <motion.div style={{ y: y2, rotate: rotate2 }} className="relative md:absolute md:right-0 md:top-[5%] md:w-[36%] z-20 mb-6 md:mb-0">
          <GalleryImage src={gallery2} alt="Ambiente" aspect="aspect-square" delay={0.1} />
          <motion.div
            whileInView={{ scaleX: 1 }}
            initial={{ scaleX: 0 }}
            viewport={{ once: true }}
            className="absolute -bottom-2 left-0 w-20 h-1 bg-primary origin-left"
          />
        </motion.div>

        {/* Center overlap */}
        <motion.div style={{ y: y3 }} className="relative md:absolute md:left-[25%] md:top-[45%] md:w-[42%] z-30 mb-6 md:mb-0">
          <GalleryImage src={gallery3} alt="Kaffeetasse" aspect="aspect-[16/10]" delay={0.2} shadow />
        </motion.div>

        {/* Bottom right */}
        <motion.div style={{ y: y1 }} className="relative md:absolute md:right-[2%] md:top-[55%] md:w-[30%] z-20 mb-6 md:mb-0">
          <GalleryImage src={gallery4} alt="Espressomaschine" aspect="aspect-[4/5]" delay={0.3} />
        </motion.div>

        {/* Bottom left small */}
        <motion.div style={{ y: y2 }} className="relative md:absolute md:left-[2%] md:top-[78%] md:w-[24%] z-30">
          <GalleryImage src={gallery5} alt="Sitzecke" aspect="aspect-square" delay={0.4} glow />
        </motion.div>
      </div>
    </section>
  );
};

const GalleryImage = ({ src, alt, aspect, delay = 0, shadow = false, glow = false }: {
  src: string; alt: string; aspect: string; delay?: number; shadow?: boolean; glow?: boolean;
}) => {
  const tilt = useTilt();
  return (
    <div className="perspective-container">
      <motion.div
        whileInView={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.88 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 1, delay, ease }}
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
        onMouseMove={tilt.handleMouse}
        onMouseLeave={tilt.reset}
        className={`${aspect} overflow-hidden group relative ${shadow ? 'shadow-2xl' : ''} ${glow ? 'glow-blue' : ''}`}
      >
        <img src={src} alt={alt} className="img-brand group-hover:scale-110 transition-transform duration-[1.5s]" />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-navy/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
    </div>
  );
};

/* ─── MERCH ─── */
const merchItems = [
  { t: 'Heavy Hoodie', c: 'Deep Black', label: 'DROP 01', img: merchHoodie },
  { t: 'Signature Tote', c: 'Raw Canvas', label: 'LIMITED', img: merchTote },
  { t: 'Design Beanie', c: 'Slate Grey', label: 'EDITION', img: merchBeanie },
];

const Merch = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgX = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  return (
    <section ref={ref} id="merch" className="relative py-[15vh] md:py-[25vh] overflow-hidden surface-brand">
      {/* Geometric shapes */}
      <motion.div
        style={{ x: bgX }}
        className="absolute top-[10%] right-[5%] w-[250px] h-[250px] border border-white/[0.06] rotate-12"
      />
      <div className="absolute bottom-[15%] left-[8%] w-[120px] h-[120px] bg-white/[0.03] rotate-45" />

      {/* Background text with parallax */}
      <motion.div
        style={{ x: useTransform(scrollYProgress, [0, 1], ['0%', '-10%']) }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] font-black uppercase text-white/[0.03] leading-none select-none pointer-events-none whitespace-nowrap"
      >
        STREETWEAR
      </motion.div>

      <div className="relative px-6 md:px-16 max-w-[1500px] mx-auto">
        {/* Header */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-bold mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-white/20" />
              Tragbare Ästhetik
            </p>
            <RevealText>
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase text-white leading-[0.9]">
                DROP 01
              </h2>
            </RevealText>
          </div>
          <p className="text-sm text-white/40 max-w-xs">
            Limitierte Stücke. Kein Restock. Jedes Teil ein Statement.
          </p>
        </motion.div>

        {/* Product cards with stagger and tilt */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {merchItems.map((item, i) => {
            const tilt = useTilt();
            return (
              <motion.div
                key={i}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 80 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, ease, duration: 0.8 }}
                className={`group flex-1 ${i === 1 ? 'md:mt-16' : i === 2 ? 'md:mt-8' : ''}`}
              >
                <div className="perspective-container">
                  <motion.div
                    style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
                    onMouseMove={tilt.handleMouse}
                    onMouseLeave={tilt.reset}
                    className="relative overflow-hidden mb-6"
                  >
                    <div className={`${i === 0 ? 'aspect-[3/4]' : i === 1 ? 'aspect-[4/5]' : 'aspect-square'} overflow-hidden`}>
                      <img
                        src={item.img}
                        className="w-full h-full object-cover brightness-90 group-hover:brightness-110 group-hover:scale-105 transition-all duration-700"
                        alt={item.t}
                      />
                    </div>
                    {/* Label badge */}
                    <div className="absolute top-4 left-4 bg-white text-primary text-[8px] px-3 py-1.5 uppercase tracking-[0.2em] font-black">
                      {item.label}
                    </div>
                    {/* Bottom gradient */}
                    <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold uppercase tracking-wide text-white group-hover:text-white/80 transition-colors">{item.t}</h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mt-1 font-semibold">{item.c}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ─── FOOTER / LOCATION ─── */
const Footer = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const ctaScale = useTransform(scrollYProgress, [0.3, 0.8], [0.8, 1]);
  const ctaOpacity = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);

  return (
    <footer ref={ref} id="location" className="relative surface-dark pt-[15vh] md:pt-[20vh] pb-12 px-6 md:px-16 overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-glow/8 blur-[150px] rounded-full" />

      <div className="relative max-w-[1500px] mx-auto">
        <div className="grid md:grid-cols-12 gap-12 md:gap-16 border-b border-white/[0.06] pb-20 md:pb-28">
          {/* Left column */}
          <div className="md:col-span-5 space-y-14">
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              viewport={{ once: true }}
              transition={{ ease }}
            >
              <p className="text-[10px] uppercase tracking-[0.5em] text-brand-glow/40 font-bold mb-4 flex items-center gap-3">
                <span className="w-6 h-px bg-brand-glow/20" />
                Standort
              </p>
              <RevealText>
                <p className="text-4xl md:text-5xl font-black uppercase text-white leading-[1.05]">
                  Am Hafen
                </p>
              </RevealText>
              <RevealText delay={0.08}>
                <p className="text-4xl md:text-5xl font-black uppercase text-white leading-[1.05]">
                  Ost 2
                </p>
              </RevealText>
              <p className="text-sm text-white/30 mt-3">26409 Wittmund · Deutschland</p>
            </motion.div>

            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, ease }}
            >
              <p className="text-[10px] uppercase tracking-[0.5em] text-brand-glow/40 font-bold mb-4 flex items-center gap-3">
                <span className="w-6 h-px bg-brand-glow/20" />
                Öffnungszeiten
              </p>
              <p className="text-xl md:text-2xl font-semibold text-white">
                Samstag & Sonntag
              </p>
              <p className="text-xl md:text-2xl font-semibold text-white/60">
                11:00 – 17:30
              </p>
              <p className="text-sm text-white/20 mt-2">Montag bis Freitag: Geschlossen</p>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="md:col-span-7 flex flex-col justify-between items-start md:items-end md:text-right">
            {/* Huge watermark */}
            <motion.div
              whileInView={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="text-[15vw] font-black uppercase text-white/[0.02] leading-none select-none pointer-events-none"
            >
              BW
            </motion.div>

            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, ease }}
              className="space-y-5"
            >
              <p className="text-[10px] uppercase tracking-[0.5em] text-brand-glow/40 font-bold flex items-center gap-3 md:justify-end">
                Social
                <span className="w-6 h-px bg-brand-glow/20" />
              </p>
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

        {/* CTA with scroll-based scale */}
        <motion.div
          style={{ scale: ctaScale, opacity: ctaOpacity }}
          className="mt-16 md:mt-24 mb-16 text-center"
        >
          <RevealText>
            <p className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white/50 leading-[1]">
              WIR SEHEN UNS
            </p>
          </RevealText>
          <RevealText delay={0.1}>
            <p className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white leading-[1] mt-2">
              AM WOCHENENDE.
            </p>
          </RevealText>
        </motion.div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[8px] uppercase tracking-[0.4em] text-white/15 font-semibold pt-8 border-t border-white/[0.04]">
          <p>© 2025 Brackwasser Design Café</p>
          <p>Impressum / Datenschutz</p>
        </div>
      </div>
    </footer>
  );
};

/* ─── PAGE ─── */
const Index = () => (
  <div className="bg-background text-foreground antialiased font-body">
    <Nav />
    <Hero />
    <About />
    <Divider />
    <Menu />
    <Divider dark />
    <Gallery />
    <Divider />
    <Merch />
    <Footer />
  </div>
);

export default Index;
