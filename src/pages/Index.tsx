import { motion, useScroll, useTransform, useMotionValue, useSpring, MotionValue } from 'framer-motion';
import { useRef, useState, useEffect, type ReactNode } from 'react';
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
const useTilt = (intensity = 12) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 150, damping: 20 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => { x.set(0); y.set(0); };
  return { rotateX, rotateY, handleMouse, reset };
};

/* ─── SCROLL TEXT REVEAL ─── */
const RevealText = ({ children, className = '', delay = 0, style }: { children: ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) => (
  <div className="overflow-hidden">
    <motion.div
      initial={{ y: '120%', rotate: 4, skewY: 2 }}
      whileInView={{ y: 0, rotate: 0, skewY: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.2, delay, ease }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  </div>
);

/* ─── HORIZONTAL MARQUEE ─── */
const Marquee = ({ text, speed = 20, className = '' }: { text: string; speed?: number; className?: string }) => (
  <div className={`overflow-hidden whitespace-nowrap ${className}`}>
    <motion.div
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      className="inline-flex"
    >
      {[...Array(6)].map((_, i) => (
        <span key={i} className="inline-block mx-8">{text}</span>
      ))}
    </motion.div>
  </div>
);

/* ─── PARALLAX WRAPPER ─── */
const ParallaxLayer = ({ children, speed = 0.5, className = '' }: { children: ReactNode; speed?: number; className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * 30}%`, `${-speed * 30}%`]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

/* ─── NAV ─── */
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
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
          <a key={link.href} href={link.href} className="hover:text-primary transition-colors duration-300">
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
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const bgRotate = useTransform(scrollYProgress, [0, 1], [0, 3]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const titleX = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const subtitleX = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.55, 0.95]);
  const lineScale = useTransform(scrollYProgress, [0, 0.5], [1, 3]);

  return (
    <section ref={ref} className="relative h-[130vh] w-full overflow-hidden">
      {/* Parallax + rotating background */}
      <motion.div style={{ y: bgY, scale: bgScale, rotate: bgRotate }} className="absolute inset-[-10%] z-0">
        <img src={heroImg} className="w-full h-full object-cover" alt="Brackwasser Café" />
      </motion.div>

      {/* Layered overlays */}
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 z-[1] bg-gradient-to-b from-navy/80 via-brand-dark/40 to-navy/95" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-navy/70 via-transparent to-navy/30" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_30%_50%,hsl(var(--brand-glow)/0.15),transparent_70%)]" />

      {/* Animated glow orbs */}
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[20%] left-[25%] w-[700px] h-[700px] rounded-full bg-brand-glow/12 blur-[200px] z-[2]"
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 0.8, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[20%] right-[15%] w-[500px] h-[500px] rounded-full bg-brand-light/10 blur-[180px] z-[2]"
      />

      {/* Geometric lines with scroll scale */}
      <motion.div style={{ scaleY: lineScale }} className="absolute top-0 left-[15%] w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent z-[3] origin-top" />
      <motion.div style={{ scaleY: lineScale }} className="absolute top-0 right-[25%] w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent z-[3] origin-top" />
      <div className="absolute top-[45%] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent z-[3]" />
      <div className="absolute top-[65%] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/3 to-transparent z-[3]" />

      {/* Content */}
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-20 h-full flex flex-col justify-center px-6 md:px-20">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.4, delay: 0.3, ease }}
          className="flex items-center gap-4 mb-10"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.6, ease }}
            className="w-16 h-px bg-brand-glow/60 origin-left"
          />
          <p className="text-[10px] md:text-xs uppercase tracking-[0.8em] text-white/40 font-semibold">
            Wittmund — Hafen Ost — Pop-Up Design Café
          </p>
        </motion.div>

        {/* Main title with scroll-diverging X */}
        <div className="relative">
          <motion.div style={{ x: titleX }}>
            <RevealText className="text-[18vw] md:text-[13vw] font-black uppercase leading-[0.82] tracking-[-0.04em] text-white">
              BRACK
            </RevealText>
          </motion.div>
          <motion.div style={{ x: subtitleX }}>
            <RevealText delay={0.15} className="text-[18vw] md:text-[13vw] font-black uppercase leading-[0.82] tracking-[-0.04em] text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.35)' }}>
              WASSER
            </RevealText>
          </motion.div>

          {/* Floating accent panel */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.8, delay: 0.9, ease }}
            className="absolute -right-4 top-[20%] w-[250px] md:w-[350px] h-[70%] bg-primary/15 origin-left z-[-1] blur-sm"
          />
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, delay: 1.2, ease }}
            className="absolute -left-6 top-0 w-1 h-full bg-brand-glow/30 origin-top"
          />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.7, ease }}
          className="mt-14 flex flex-col sm:flex-row items-start gap-6 md:gap-12"
        >
          <a href="#about" className="group relative px-12 py-5 bg-white text-navy text-[10px] uppercase tracking-[0.3em] font-bold overflow-hidden">
            <span className="relative z-10 group-hover:text-white transition-colors duration-500">Das Café entdecken</span>
            <div className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-600 ease-expo" />
          </a>
          <a href="#gallery" className="group text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 hover:text-white transition-colors duration-500 flex items-center gap-4 py-5">
            <span className="w-8 h-px bg-white/20 group-hover:w-14 transition-all duration-700 ease-expo" />
            Galerie ansehen
          </a>
        </motion.div>

        {/* Side elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute right-6 md:right-12 bottom-28 hidden lg:flex flex-col items-center gap-4"
        >
          <motion.div animate={{ height: [40, 60, 40] }} transition={{ duration: 4, repeat: Infinity }} className="w-px bg-white/15" />
          <p className="text-[9px] uppercase tracking-[0.5em] text-white/15 [writing-mode:vertical-rl]">
            Kaffee trifft Kreativität — Seit 2024
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="absolute bottom-14 left-6 md:left-20 flex items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-5 h-9 border border-white/15 rounded-full flex justify-center pt-2"
          >
            <motion.div animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 2.5, repeat: Infinity }} className="w-1 h-2 bg-white/50 rounded-full" />
          </motion.div>
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/15 font-medium">Scroll</span>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ─── SLIDING MARQUEE TRANSITION ─── */
const MarqueeTransition = ({ bg = 'bg-background' }: { bg?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.div ref={ref} style={{ opacity }} className={`relative py-6 md:py-10 overflow-hidden ${bg}`}>
      <motion.div style={{ x }} className="flex whitespace-nowrap text-[8vw] md:text-[6vw] font-black uppercase text-primary/[0.06] leading-none select-none">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="mx-12">BRACKWASSER • DESIGN • CAFÉ • WITTMUND •</span>
        ))}
      </motion.div>
      <motion.div
        whileInView={{ scaleX: 1 }}
        initial={{ scaleX: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease }}
        className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent origin-center"
      />
    </motion.div>
  );
};

/* ─── ABOUT ─── */
const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const decorY = useTransform(scrollYProgress, [0, 1], ['30%', '-30%']);
  const decorX = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const imgScale = useTransform(scrollYProgress, [0, 0.4, 0.8], [0.8, 1.05, 1.1]);
  const imgRotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const blockY = useTransform(scrollYProgress, [0, 1], ['-10%', '20%']);
  const blockRotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);

  return (
    <section ref={ref} id="about" className="relative py-[20vh] md:py-[35vh] overflow-hidden bg-background">
      {/* Huge parallaxing watermark */}
      <motion.div style={{ y: decorY, x: decorX }} className="absolute -top-[15%] -right-[20%] text-[30vw] font-black uppercase text-primary/[0.025] leading-none select-none pointer-events-none">
        CAFÉ
      </motion.div>

      {/* Multiple floating blue shapes */}
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '-40%']), rotate: useTransform(scrollYProgress, [0, 1], [0, 15]) }}
        className="absolute right-[10%] top-[10%] w-[200px] h-[200px] border border-primary/10 z-0"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ['10%', '-20%']) }}
        className="absolute left-[5%] bottom-[20%] w-[80px] h-[80px] bg-primary/5 z-0"
      />

      {/* Animated accent bar */}
      <motion.div
        whileInView={{ scaleY: 1 }}
        initial={{ scaleY: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease }}
        className="absolute left-0 top-[15%] w-1.5 h-[300px] bg-primary origin-top"
      />

      <div className="relative px-6 md:px-20 max-w-[1500px] mx-auto">
        <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Image with intense parallax + scale + rotate */}
          <motion.div style={{ y: imgY }} className="md:col-span-5 relative z-10">
            <div className="perspective-container">
              <motion.div
                style={{ scale: imgScale, rotate: imgRotate }}
                className="aspect-[3/4] overflow-hidden relative shadow-2xl"
              >
                <img src={aboutImg} className="img-brand hover:scale-115 transition-transform duration-[2.5s]" alt="Kaffeedetail" />
                {/* Corner accent */}
                <motion.div
                  whileInView={{ x: 0, opacity: 1 }}
                  initial={{ x: -40, opacity: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4, ease }}
                  className="absolute bottom-0 left-0 w-1/3 h-1/4 bg-primary flex items-center justify-center"
                >
                  <p className="text-[9px] uppercase tracking-[0.3em] text-primary-foreground font-bold">Est. 2024</p>
                </motion.div>
              </motion.div>
            </div>

            {/* Multiple floating layers behind image */}
            <motion.div
              style={{ y: blockY, rotate: blockRotate }}
              className="absolute -bottom-10 -right-10 w-3/4 h-3/4 bg-primary/8 -z-10"
            />
            <motion.div
              style={{ y: useTransform(scrollYProgress, [0, 1], ['5%', '-15%']) }}
              className="absolute -top-6 -left-6 w-1/2 h-1/3 border border-primary/10 -z-10"
            />
          </motion.div>

          {/* Text */}
          <motion.div style={{ y: textY }} className="md:col-span-6 md:col-start-7 md:mt-[20vh] relative z-20">
            <div className="space-y-6">
              <motion.p
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease }}
                className="text-[10px] uppercase tracking-[0.5em] font-bold text-primary flex items-center gap-3"
              >
                <motion.span whileInView={{ scaleX: 1 }} initial={{ scaleX: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }} className="inline-block w-8 h-px bg-primary origin-left" />
                Über uns
              </motion.p>

              <RevealText>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] text-foreground">
                  Ein Ort
                </h2>
              </RevealText>
              <RevealText delay={0.1}>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] text-primary">
                  zwischen
                </h2>
              </RevealText>
              <RevealText delay={0.2}>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] text-foreground">
                  den Gezeiten.
                </h2>
              </RevealText>

              <motion.div
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 40 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4, ease }}
                className="pt-6"
              >
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
                  Brackwasser ist kein gewöhnliches Café. Es ist ein temporäres Refugium für Ästheten
                  und Denker am Hafen Ost. Wir kuratieren Momente aus feinstem Rösthandwerk und
                  progressivem Design — ein Ort, der Kaffee zur Kunst erhebt.
                </p>
              </motion.div>

              {/* Counters */}
              <div className="pt-12 flex gap-12 md:gap-20">
                {['Röstung', 'Design', 'Kultur'].map((label, i) => (
                  <motion.div
                    key={label}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    initial={{ opacity: 0, y: 40, rotateX: -30 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.15, ease, duration: 0.8 }}
                    className="group cursor-default perspective-container"
                  >
                    <p className="text-5xl md:text-7xl font-black text-primary group-hover:text-brand-glow transition-colors duration-500">0{i + 1}</p>
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
  const headerX = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const bgRotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);
  const sectionScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.98]);

  return (
    <motion.section
      ref={ref}
      id="menu"
      style={{ scale: sectionScale }}
      className="relative py-[15vh] md:py-[22vh] surface-navy overflow-hidden rounded-none md:rounded-[2px]"
    >
      {/* Floating geometric decorations with parallax */}
      <motion.div
        style={{ rotate: bgRotate, y: useTransform(scrollYProgress, [0, 1], ['0%', '-15%']) }}
        className="absolute top-0 right-0 w-[500px] h-[500px] border border-brand-glow/5 rotate-45 translate-x-1/2 -translate-y-1/2"
      />
      <motion.div
        style={{ rotate: useTransform(scrollYProgress, [0, 1], [12, -8]) }}
        className="absolute bottom-0 left-0 w-[300px] h-[300px] border border-brand-glow/5 -translate-x-1/3 translate-y-1/3"
      />
      <div className="absolute top-1/2 right-[8%] w-[600px] h-[600px] rounded-full bg-brand-glow/[0.03] blur-[250px]" />
      <div className="absolute bottom-[20%] left-[5%] w-[300px] h-[300px] rounded-full bg-primary/[0.05] blur-[150px]" />

      <div className="max-w-6xl mx-auto px-6 md:px-16 relative">
        {/* Sticky-feel header with intense parallax */}
        <motion.div style={{ x: headerX }} className="mb-16 md:mb-28">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <motion.p
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease }}
                className="text-[10px] uppercase tracking-[0.5em] text-brand-glow/40 mb-5 font-semibold flex items-center gap-3"
              >
                <motion.span whileInView={{ scaleX: 1 }} initial={{ scaleX: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease }} className="inline-block w-8 h-px bg-brand-glow/30 origin-left" />
                Die Selektion
              </motion.p>
              <RevealText>
                <h2 className="text-7xl md:text-[9vw] lg:text-[8vw] font-black uppercase text-white leading-[0.88]">
                  Unsere
                </h2>
              </RevealText>
              <RevealText delay={0.12}>
                <h2 className="text-7xl md:text-[9vw] lg:text-[8vw] font-black uppercase leading-[0.88]">
                  <span className="text-gradient-brand">Karte</span>
                </h2>
              </RevealText>
            </div>
            <motion.span
              whileInView={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-[10px] uppercase tracking-[0.3em] text-white/15 font-semibold"
            >
              Preise in EUR
            </motion.span>
          </div>
        </motion.div>

        {/* Menu items with dramatic staggered entrance */}
        <div className="grid md:grid-cols-2 gap-x-16 lg:gap-x-28">
          {menuItems.map((item, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50, rotateY: i % 2 === 0 ? -5 : 5 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.05, duration: 0.8, ease }}
              className="group relative py-6 md:py-7 border-b border-white/[0.05] cursor-default perspective-container"
            >
              {/* Multi-layer hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-primary/8 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-800 ease-expo" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-1000 delay-100 ease-expo" />

              <div className="relative flex justify-between items-baseline px-4">
                <span className="text-lg md:text-xl font-medium text-white/70 group-hover:text-white group-hover:translate-x-3 transition-all duration-600 ease-expo">
                  {item.n}
                </span>
                <div className="flex-1 mx-4 border-b border-dotted border-white/[0.06] group-hover:border-brand-glow/15 transition-colors duration-700" />
                <span className="text-xl md:text-2xl font-black text-white/25 group-hover:text-brand-glow group-hover:scale-110 transition-all duration-600 ease-expo tabular-nums origin-right">
                  {item.p}
                </span>
              </div>

              {/* Accent bars */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-2/3 bg-primary transition-all duration-600 ease-expo" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-0 group-hover:h-1/3 bg-brand-glow/30 transition-all duration-800 ease-expo delay-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

/* ─── GALLERY ─── */
const Gallery = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], ['25%', '-25%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['10%', '-35%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['30%', '-15%']);
  const y4 = useTransform(scrollYProgress, [0, 1], ['5%', '-20%']);
  const r1 = useTransform(scrollYProgress, [0, 1], [-3, 3]);
  const r2 = useTransform(scrollYProgress, [0, 1], [4, -2]);
  const r3 = useTransform(scrollYProgress, [0, 1], [-1, 4]);
  const headerScale = useTransform(scrollYProgress, [0, 0.3], [0.85, 1]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section ref={ref} id="gallery" className="relative py-[12vh] md:py-[22vh] px-6 md:px-16 overflow-hidden bg-background">
      {/* Background glows */}
      <div className="absolute top-[20%] left-0 w-[60vw] h-[60vw] rounded-full bg-primary/[0.04] blur-[250px]" />
      <div className="absolute bottom-[10%] right-0 w-[40vw] h-[40vw] rounded-full bg-brand-glow/[0.03] blur-[200px]" />

      {/* Header with scroll-driven scale */}
      <motion.div
        style={{ scale: headerScale, opacity: headerOpacity }}
        className="mb-16 md:mb-32 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 max-w-[1500px] mx-auto"
      >
        <div>
          <motion.p
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -30 }}
            viewport={{ once: true }}
            className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold mb-5 flex items-center gap-3"
          >
            <span className="w-8 h-px bg-primary" />
            Einblicke
          </motion.p>
          <RevealText>
            <h2 className="text-7xl md:text-[11vw] font-black uppercase text-foreground leading-[0.82]">
              GAL<span className="text-primary">LERIE</span>
            </h2>
          </RevealText>
        </div>
        <motion.p
          whileInView={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground max-w-xs"
        >
          Impressionen aus unserem Refugium am Hafen Ost.
        </motion.p>
      </motion.div>

      {/* Intense collage with more depth */}
      <div className="relative max-w-[1500px] mx-auto min-h-[80vh] md:min-h-[140vh]">
        {/* Image 1 – Large left, slow */}
        <motion.div style={{ y: y1, rotate: r1 }} className="relative md:absolute md:left-0 md:top-0 md:w-[50%] z-10 mb-6 md:mb-0">
          <GalleryImage src={gallery1} alt="Latte Art" aspect="aspect-[3/4]" />
        </motion.div>

        {/* Image 2 – Right top, fast */}
        <motion.div style={{ y: y2, rotate: r2 }} className="relative md:absolute md:right-0 md:top-[3%] md:w-[38%] z-20 mb-6 md:mb-0">
          <GalleryImage src={gallery2} alt="Ambiente" aspect="aspect-square" delay={0.1} />
          <motion.div
            whileInView={{ scaleX: 1 }}
            initial={{ scaleX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
            className="absolute -bottom-3 left-0 w-24 h-1 bg-primary origin-left"
          />
        </motion.div>

        {/* Image 3 – Center, overlapping both, medium speed */}
        <motion.div style={{ y: y3, rotate: r3 }} className="relative md:absolute md:left-[22%] md:top-[42%] md:w-[45%] z-30 mb-6 md:mb-0">
          <GalleryImage src={gallery3} alt="Kaffeetasse" aspect="aspect-[16/10]" delay={0.2} shadow />
        </motion.div>

        {/* Image 4 – Bottom right, different speed */}
        <motion.div style={{ y: y4 }} className="relative md:absolute md:right-[1%] md:top-[55%] md:w-[32%] z-20 mb-6 md:mb-0">
          <GalleryImage src={gallery4} alt="Espressomaschine" aspect="aspect-[4/5]" delay={0.3} />
        </motion.div>

        {/* Image 5 – Bottom left, with glow */}
        <motion.div style={{ y: y2, rotate: useTransform(scrollYProgress, [0, 1], [2, -3]) }} className="relative md:absolute md:left-[1%] md:top-[80%] md:w-[26%] z-30">
          <GalleryImage src={gallery5} alt="Sitzecke" aspect="aspect-square" delay={0.4} glow />
        </motion.div>

        {/* Floating decorative elements */}
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '-50%']), rotate: useTransform(scrollYProgress, [0, 1], [0, 45]) }}
          className="hidden md:block absolute right-[15%] top-[30%] w-[100px] h-[100px] border border-primary/10 z-0"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '-30%']) }}
          className="hidden md:block absolute left-[45%] top-[70%] w-[60px] h-[60px] bg-primary/5 z-0"
        />
      </div>
    </section>
  );
};

const GalleryImage = ({ src, alt, aspect, delay = 0, shadow = false, glow = false }: {
  src: string; alt: string; aspect: string; delay?: number; shadow?: boolean; glow?: boolean;
}) => {
  const tilt = useTilt(15);
  return (
    <div className="perspective-container">
      <motion.div
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.2, delay, ease }}
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
        onMouseMove={tilt.handleMouse}
        onMouseLeave={tilt.reset}
        className={`${aspect} overflow-hidden group relative ${shadow ? 'shadow-[0_25px_80px_-15px_rgba(0,0,0,0.3)]' : ''} ${glow ? 'glow-blue' : ''}`}
      >
        <img src={src} alt={alt} className="img-brand group-hover:scale-115 transition-transform duration-[2s] ease-expo" />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-700" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
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
  const bgTextX = useTransform(scrollYProgress, [0, 1], ['5%', '-15%']);
  const sectionScale = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.92, 1, 1, 0.96]);
  const geoRotate = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const geoY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);

  return (
    <motion.section
      ref={ref}
      id="merch"
      style={{ scale: sectionScale }}
      className="relative py-[15vh] md:py-[28vh] overflow-hidden surface-brand"
    >
      {/* Parallax geometric shapes */}
      <motion.div
        style={{ rotate: geoRotate, y: geoY }}
        className="absolute top-[8%] right-[3%] w-[300px] h-[300px] border border-white/[0.05]"
      />
      <motion.div
        style={{ rotate: useTransform(scrollYProgress, [0, 1], [-15, 15]), y: useTransform(scrollYProgress, [0, 1], ['0%', '-15%']) }}
        className="absolute bottom-[10%] left-[5%] w-[150px] h-[150px] bg-white/[0.02]"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '-30%']) }}
        className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-[150px]"
      />

      {/* Parallax background text */}
      <motion.div
        style={{ x: bgTextX }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black uppercase text-white/[0.025] leading-none select-none pointer-events-none whitespace-nowrap"
      >
        STREETWEAR
      </motion.div>

      <div className="relative px-6 md:px-16 max-w-[1500px] mx-auto">
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 60 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="mb-16 md:mb-28 flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
        >
          <div>
            <motion.p
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              viewport={{ once: true }}
              className="text-[10px] uppercase tracking-[0.5em] text-white/25 font-bold mb-5 flex items-center gap-3"
            >
              <span className="w-8 h-px bg-white/15" />
              Tragbare Ästhetik
            </motion.p>
            <RevealText>
              <h2 className="text-7xl md:text-[9vw] lg:text-[8vw] font-black uppercase text-white leading-[0.88]">
                DROP 01
              </h2>
            </RevealText>
          </div>
          <p className="text-sm text-white/30 max-w-xs">
            Limitierte Stücke. Kein Restock. Jedes Teil ein Statement.
          </p>
        </motion.div>

        {/* Product cards */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-start">
          {merchItems.map((item, i) => (
            <MerchCard key={i} item={item} index={i} scrollProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

const MerchCard = ({ item, index, scrollProgress }: { item: typeof merchItems[0]; index: number; scrollProgress: MotionValue<number> }) => {
  const tilt = useTilt(14);
  const cardY = useTransform(scrollProgress, [0, 1], [`${index * 5}%`, `${-index * 8}%`]);

  return (
    <motion.div
      style={{ y: cardY }}
      className={`group flex-1 ${index === 1 ? 'md:mt-20' : index === 2 ? 'md:mt-10' : ''}`}
    >
      <motion.div
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        initial={{ opacity: 0, y: 100, rotateX: -10 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.18, ease, duration: 1 }}
      >
        <div className="perspective-container">
          <motion.div
            style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
            onMouseMove={tilt.handleMouse}
            onMouseLeave={tilt.reset}
            className="relative overflow-hidden mb-6"
          >
            <div className={`${index === 0 ? 'aspect-[3/4]' : index === 1 ? 'aspect-[4/5]' : 'aspect-square'} overflow-hidden`}>
              <img
                src={item.img}
                className="w-full h-full object-cover brightness-90 group-hover:brightness-110 group-hover:scale-110 transition-all duration-[1.2s] ease-expo"
                alt={item.t}
              />
            </div>
            <div className="absolute top-4 left-4 bg-white text-primary text-[8px] px-3 py-1.5 uppercase tracking-[0.2em] font-black">
              {item.label}
            </div>
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-navy/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </motion.div>
        </div>
        <h3 className="text-xl font-bold uppercase tracking-wide text-white group-hover:translate-x-2 transition-transform duration-500 ease-expo">{item.t}</h3>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/25 mt-1 font-semibold">{item.c}</p>
      </motion.div>
    </motion.div>
  );
};

/* ─── FOOTER ─── */
const Footer = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const ctaScale = useTransform(scrollYProgress, [0.2, 0.7], [0.7, 1]);
  const ctaOpacity = useTransform(scrollYProgress, [0.15, 0.5], [0, 1]);
  const ctaRotateX = useTransform(scrollYProgress, [0.2, 0.7], [15, 0]);
  const glowScale = useTransform(scrollYProgress, [0.3, 0.8], [0.5, 1.5]);

  return (
    <footer ref={ref} id="location" className="relative surface-dark pt-[15vh] md:pt-[22vh] pb-12 px-6 md:px-16 overflow-hidden">
      {/* Animated glow */}
      <motion.div
        style={{ scale: glowScale }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-glow/[0.06] blur-[180px] rounded-full"
      />

      <div className="relative max-w-[1500px] mx-auto">
        <div className="grid md:grid-cols-12 gap-12 md:gap-16 border-b border-white/[0.05] pb-20 md:pb-32">
          <div className="md:col-span-5 space-y-16">
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              viewport={{ once: true }}
              transition={{ ease, duration: 1 }}
            >
              <p className="text-[10px] uppercase tracking-[0.5em] text-brand-glow/35 font-bold mb-5 flex items-center gap-3">
                <span className="w-8 h-px bg-brand-glow/15" />
                Standort
              </p>
              <RevealText>
                <p className="text-4xl md:text-6xl font-black uppercase text-white leading-[1]">Am Hafen</p>
              </RevealText>
              <RevealText delay={0.1}>
                <p className="text-4xl md:text-6xl font-black uppercase text-white leading-[1]">Ost 2</p>
              </RevealText>
              <motion.p
                whileInView={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-sm text-white/25 mt-4"
              >
                26409 Wittmund · Deutschland
              </motion.p>
            </motion.div>

            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, ease, duration: 0.8 }}
            >
              <p className="text-[10px] uppercase tracking-[0.5em] text-brand-glow/35 font-bold mb-5 flex items-center gap-3">
                <span className="w-8 h-px bg-brand-glow/15" />
                Öffnungszeiten
              </p>
              <p className="text-xl md:text-2xl font-semibold text-white">Samstag & Sonntag</p>
              <p className="text-xl md:text-2xl font-semibold text-white/50">11:00 – 17:30</p>
              <p className="text-sm text-white/15 mt-2">Montag bis Freitag: Geschlossen</p>
            </motion.div>
          </div>

          <div className="md:col-span-7 flex flex-col justify-between items-start md:items-end md:text-right">
            <ParallaxLayer speed={0.3}>
              <div className="text-[18vw] font-black uppercase text-white/[0.015] leading-none select-none pointer-events-none">
                BW
              </div>
            </ParallaxLayer>

            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, ease }}
              className="space-y-5"
            >
              <p className="text-[10px] uppercase tracking-[0.5em] text-brand-glow/35 font-bold flex items-center gap-3 md:justify-end">
                Social
                <span className="w-8 h-px bg-brand-glow/15" />
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

        {/* CTA with scroll-driven 3D entrance */}
        <div className="perspective-container">
          <motion.div
            style={{ scale: ctaScale, opacity: ctaOpacity, rotateX: ctaRotateX }}
            className="mt-20 md:mt-28 mb-20 text-center"
          >
            <RevealText>
              <p className="text-5xl md:text-7xl lg:text-8xl font-black uppercase text-white/40 leading-[0.95]">
                WIR SEHEN UNS
              </p>
            </RevealText>
            <RevealText delay={0.12}>
              <p className="text-5xl md:text-7xl lg:text-8xl font-black uppercase text-white leading-[0.95] mt-2">
                AM WOCHENENDE.
              </p>
            </RevealText>
          </motion.div>
        </div>

        <motion.div
          whileInView={{ scaleX: 1 }}
          initial={{ scaleX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease }}
          className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent origin-center mb-8"
        />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[8px] uppercase tracking-[0.4em] text-white/10 font-semibold pt-6">
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
    <MarqueeTransition />
    <About />
    <MarqueeTransition />
    <Menu />
    <MarqueeTransition bg="surface-navy" />
    <Gallery />
    <MarqueeTransition />
    <Merch />
    <Footer />
  </div>
);

export default Index;
