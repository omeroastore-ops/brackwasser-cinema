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

const Nav = () => (
  <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 mix-blend-difference">
    <span className="text-xl font-light tracking-[0.3em] uppercase text-white">Brackwasser</span>
    <div className="hidden md:flex gap-12 text-[10px] uppercase tracking-[0.3em] font-medium text-white/70">
      <a href="#menu" className="hover:text-white transition-colors">Menü</a>
      <a href="#gallery" className="hover:text-white transition-colors">Galerie</a>
      <a href="#merch" className="hover:text-white transition-colors">Kollektion</a>
      <a href="#location" className="hover:text-white transition-colors">Kontakt</a>
    </div>
  </nav>
);

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '80%']);

  return (
    <section ref={ref} className="relative h-[120vh] w-full overflow-hidden">
      {/* Background with parallax */}
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <img src={heroImg} className="img-cinematic" alt="Brackwasser Design Café" />
        {/* Warm overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/30 via-transparent to-amber-800/20" />
      </motion.div>

      {/* Gold glow orb */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px] z-[1]" />

      {/* Content */}
      <motion.div style={{ y: textY, opacity }} className="relative z-20 h-full flex flex-col justify-center px-8 md:px-16">
        <div className="max-w-[90vw]">
          <motion.p
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.4, ease }}
            className="text-[10px] md:text-xs uppercase tracking-[0.6em] text-amber-200/80 mb-8 font-medium"
          >
            Pop-Up Design Café — Wittmund
          </motion.p>
          <motion.h1
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.6, ease }}
            className="text-[15vw] md:text-[12vw] font-display italic leading-[0.85] text-white"
          >
            Brack
            <br />
            <span className="text-gradient-gold ml-[10vw]">wasser</span>
          </motion.h1>
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease }}
            className="mt-12 flex flex-col md:flex-row items-start gap-8"
          >
            <p className="text-sm md:text-lg uppercase tracking-[0.4em] font-light text-white/60 max-w-sm">
              Kaffee trifft Kreativität.
            </p>
            <a href="#menu" className="group relative px-10 py-4 border border-white/20 text-[10px] uppercase tracking-widest text-white overflow-hidden transition-all duration-700 hover:border-amber-400/40">
              <span className="relative z-10 group-hover:text-espresso transition-colors duration-500">Das Café entdecken</span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-amber-100 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-expo" />
            </a>
          </motion.div>
        </div>

        {/* Floating side element */}
        <motion.div
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block"
        >
          <p className="text-[9px] uppercase tracking-[0.5em] text-white/30 rotate-90 origin-center whitespace-nowrap">
            Scroll — Entdecke mehr
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  return (
    <section ref={ref} className="relative py-[15vh] md:py-[25vh] overflow-hidden surface-cream">
      {/* Decorative large text */}
      <div className="absolute top-[10%] -left-[5%] text-[20vw] font-display italic text-foreground/[0.03] leading-none select-none pointer-events-none">
        Kaffee
      </div>

      <div className="relative px-8 md:px-16 max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Image - overlapping positioning */}
          <motion.div
            style={{ y: imgY }}
            className="md:col-span-5 md:col-start-1 relative z-10"
          >
            <motion.div
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.85 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease }}
              className="aspect-[3/4] overflow-hidden relative"
            >
              <img src={aboutImg} className="img-warm hover:scale-110 transition-transform duration-[2s]" alt="Kaffeedetail" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
            {/* Floating label */}
            <motion.div
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, ease }}
              className="absolute -bottom-6 -right-6 md:-right-16 bg-espresso text-espresso-foreground px-6 py-4 z-20"
            >
              <p className="text-[9px] uppercase tracking-[0.4em]">Seit 2024</p>
            </motion.div>
          </motion.div>

          {/* Text - offset to overlap */}
          <motion.div
            style={{ y: textY }}
            className="md:col-span-6 md:col-start-7 md:mt-[20vh] relative z-20"
          >
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
              className="space-y-8"
            >
              <p className="text-label-wide">Über uns</p>
              <h2 className="text-4xl md:text-6xl font-display leading-[1.1] text-foreground">
                Ein Intervall<br />
                <span className="italic text-gradient-gold">zwischen Ebbe</span><br />
                und Flut.
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-light max-w-lg">
                Brackwasser ist kein gewöhnliches Café. Es ist ein temporäres Refugium für Ästheten
                und Denker am Hafen Ost. Wir kuratieren Momente aus feinstem Rösthandwerk und
                progressivem Design.
              </p>
              <div className="pt-8 border-t border-border flex gap-12">
                {['Röstung', 'Design', 'Kultur'].map((label, i) => (
                  <motion.div
                    key={label}
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1, ease }}
                  >
                    <p className="text-3xl font-display italic text-foreground">0{i + 1}</p>
                    <p className="text-label mt-1">{label}</p>
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

const menuItems = [
  { n: 'Americano', p: '4.0', cat: 'Espresso' },
  { n: 'Espresso', p: '3.0', cat: 'Espresso' },
  { n: 'Espresso Doppio', p: '4.0', cat: 'Espresso' },
  { n: 'Filterkaffee', p: '4.0', cat: 'Kaffee' },
  { n: 'Cappuccino', p: '4.5', cat: 'Milch' },
  { n: 'Flat White', p: '5.0', cat: 'Milch' },
  { n: 'Milchkaffee', p: '5.5', cat: 'Milch' },
  { n: 'Latte Macchiato', p: '5.0', cat: 'Milch' },
  { n: 'Chococino', p: '5.5', cat: 'Spezial' },
  { n: 'Espresso Tonic', p: '5.5', cat: 'Spezial' },
  { n: 'Heiße Schokolade', p: '4.0', cat: 'Warm' },
  { n: 'Tee diverse Sorten', p: '3.5', cat: 'Warm' },
  { n: 'Bio Limonade', p: '3.5', cat: 'Kalt' },
  { n: 'Fritz Cola', p: '3.5', cat: 'Kalt' },
];

const Menu = () => (
  <section id="menu" className="relative py-[15vh] surface-espresso overflow-hidden">
    {/* Diagonal decorative line */}
    <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-amber-400/20 to-transparent transform rotate-12 origin-top-right" />

    <div className="max-w-6xl mx-auto px-8 md:px-16">
      <div className="grid md:grid-cols-12 gap-8 mb-20">
        <motion.div
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -40 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="md:col-span-8"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-amber-400/60 mb-4">Die Selektion</p>
          <h2 className="text-5xl md:text-7xl font-display italic text-espresso-foreground">
            Unsere <span className="text-gradient-gold">Karte</span>
          </h2>
        </motion.div>
        <div className="md:col-span-4 flex items-end justify-end">
          <span className="text-[10px] uppercase tracking-[0.3em] text-espresso-foreground/40">Preise in Euro</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-x-20 gap-y-0">
        {menuItems.map((item, i) => (
          <motion.div
            key={i}
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03, ease }}
            className="group relative py-5 border-b border-white/[0.06] cursor-default"
          >
            <div className="absolute inset-0 bg-amber-400/[0.03] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-expo" />
            <div className="relative flex justify-between items-baseline">
              <div className="flex items-baseline gap-4">
                <span className="text-[9px] uppercase tracking-widest text-amber-400/40 w-16">{item.cat}</span>
                <span className="text-lg font-light text-espresso-foreground group-hover:text-amber-200 transition-colors duration-500">
                  {item.n}
                </span>
              </div>
              <span className="font-display italic text-xl text-espresso-foreground/50 group-hover:text-amber-300 transition-colors duration-500">
                {item.p}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Gallery = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], ['15%', '-15%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['5%', '-25%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['20%', '-10%']);

  return (
    <section ref={ref} id="gallery" className="relative py-[10vh] md:py-[20vh] px-8 md:px-16 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/4 right-0 w-[50vw] h-[50vw] rounded-full bg-gold/5 blur-[150px]" />

      <motion.div
        whileInView={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        viewport={{ once: true }}
        className="mb-16 md:mb-24"
      >
        <p className="text-label-wide mb-4">Einblicke</p>
        <h2 className="text-5xl md:text-8xl font-display italic text-foreground">
          Gal<span className="text-gradient-gold">lerie</span>
        </h2>
      </motion.div>

      {/* Artistic collage layout */}
      <div className="relative max-w-[1400px] mx-auto min-h-[80vh] md:min-h-[120vh]">
        {/* Large image - left */}
        <motion.div
          style={{ y: y1 }}
          className="relative md:absolute md:left-0 md:top-0 md:w-[45%] z-10 mb-8 md:mb-0"
        >
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            className="aspect-[3/4] overflow-hidden group"
          >
            <img src={gallery1} alt="Latte Art" className="img-warm group-hover:scale-110 transition-transform duration-[1.5s]" />
          </motion.div>
        </motion.div>

        {/* Small image - right top */}
        <motion.div
          style={{ y: y2 }}
          className="relative md:absolute md:right-0 md:top-[8%] md:w-[35%] z-20 mb-8 md:mb-0"
        >
          <motion.div
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 40 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="aspect-square overflow-hidden group"
          >
            <img src={gallery2} alt="Ambiente" className="img-warm group-hover:scale-110 transition-transform duration-[1.5s]" />
          </motion.div>
          {/* Floating decorative text */}
          <motion.p
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-[9px] uppercase tracking-[0.5em] text-muted-foreground"
          >
            Atmosphäre & Detail
          </motion.p>
        </motion.div>

        {/* Overlapping medium image - center */}
        <motion.div
          style={{ y: y3 }}
          className="relative md:absolute md:left-[25%] md:top-[45%] md:w-[40%] z-30 mb-8 md:mb-0"
        >
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 60 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="aspect-[16/10] overflow-hidden group shadow-2xl"
          >
            <img src={gallery3} alt="Kaffeetasse" className="img-warm group-hover:scale-110 transition-transform duration-[1.5s]" />
          </motion.div>
        </motion.div>

        {/* Wide image - bottom right */}
        <motion.div
          style={{ y: y1 }}
          className="relative md:absolute md:right-[5%] md:top-[55%] md:w-[30%] z-20 mb-8 md:mb-0"
        >
          <motion.div
            whileInView={{ opacity: 1, rotate: 0 }}
            initial={{ opacity: 0, rotate: 3 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
            className="aspect-[4/5] overflow-hidden group"
          >
            <img src={gallery4} alt="Espressomaschine" className="img-warm group-hover:scale-110 transition-transform duration-[1.5s]" />
          </motion.div>
        </motion.div>

        {/* Small floating image - bottom left */}
        <motion.div
          style={{ y: y2 }}
          className="relative md:absolute md:left-[5%] md:top-[75%] md:w-[25%] z-30"
        >
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="aspect-square overflow-hidden group glow-gold"
          >
            <img src={gallery5} alt="Sitzecke" className="img-warm group-hover:scale-110 transition-transform duration-[1.5s]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const merchItems = [
  { t: 'Heavy Hoodie', c: 'Deep Black', img: merchHoodie },
  { t: 'Signature Tote', c: 'Raw Canvas', img: merchTote },
  { t: 'Design Beanie', c: 'Slate Grey', img: merchBeanie },
];

const Merch = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  return (
    <section ref={ref} id="merch" className="relative py-[15vh] md:py-[25vh] overflow-hidden surface-warm">
      {/* Large background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[25vw] font-display italic text-foreground/[0.03] leading-none select-none pointer-events-none whitespace-nowrap">
        Kollektion
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
            <p className="text-label-wide mb-4">Tragbare Ästhetik</p>
            <h2 className="text-5xl md:text-8xl font-display italic text-foreground">
              Kollektion <span className="text-gradient-gold">01</span>
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs font-light">
            Limitierte Stücke für den kreativen Alltag. Handverlesen. Einzigartig.
          </p>
        </motion.div>

        {/* Lookbook layout - staggered, floating */}
        <motion.div style={{ x }} className="flex flex-col md:flex-row gap-8 md:gap-6 items-start">
          {merchItems.map((item, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 60 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, ease }}
              className={`group flex-1 ${i === 1 ? 'md:mt-24' : i === 2 ? 'md:mt-12' : ''}`}
            >
              <div className="relative overflow-hidden mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.8, ease }}
                  className={`${i === 0 ? 'aspect-[3/4]' : i === 1 ? 'aspect-[4/5]' : 'aspect-square'} overflow-hidden`}
                >
                  <img
                    src={item.img}
                    className="w-full h-full object-cover sepia-[0.15] brightness-90 group-hover:brightness-100 group-hover:sepia-0 transition-all duration-700"
                    alt={item.t}
                  />
                </motion.div>
                {/* Edition badge */}
                <div className="absolute top-4 left-4 bg-foreground/90 text-background text-[8px] px-3 py-1.5 uppercase tracking-[0.2em] font-bold backdrop-blur-sm">
                  Limited
                </div>
              </div>
              <h3 className="text-2xl font-display italic text-foreground">{item.t}</h3>
              <p className="text-label mt-2">{item.c}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer id="location" className="relative surface-espresso pt-[15vh] pb-12 px-8 md:px-16 overflow-hidden">
    {/* Glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[150px] rounded-full" />

    <div className="relative max-w-[1400px] mx-auto">
      <div className="grid md:grid-cols-12 gap-16 border-b border-white/[0.08] pb-24">
        <div className="md:col-span-5 space-y-12">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            transition={{ ease }}
          >
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-amber-400/50 mb-4">Standort</h4>
            <p className="text-3xl md:text-4xl font-display italic text-espresso-foreground">
              Am Hafen Ost 2<br />26409 Wittmund
            </p>
          </motion.div>
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, ease }}
          >
            <h4 className="text-[10px] uppercase tracking-[0.4em] text-amber-400/50 mb-4">Öffnungszeiten</h4>
            <p className="text-xl md:text-2xl font-light text-espresso-foreground">
              Samstag & Sonntag<br />11:00 – 17:30
            </p>
          </motion.div>
        </div>

        <div className="md:col-span-7 flex flex-col justify-between items-start md:items-end text-right">
          <motion.div
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            viewport={{ once: true }}
            transition={{ ease }}
            className="text-6xl md:text-[10vw] font-display italic text-white/[0.04] leading-none"
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
            <p className="text-[10px] uppercase tracking-[0.4em] text-amber-400/50">Folge uns</p>
            <a
              href="https://instagram.com/brackwasser_designcafe"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xl md:text-2xl font-light text-espresso-foreground hover:text-amber-300 transition-colors duration-500"
            >
              @brackwasser_designcafe
            </a>
          </motion.div>
        </div>
      </div>

      {/* CTA band */}
      <motion.div
        whileInView={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-16 mb-12 text-center"
      >
        <p className="text-3xl md:text-5xl font-display italic text-espresso-foreground/80">
          „Wir sehen uns am Wochenende."
        </p>
      </motion.div>

      <div className="flex justify-between items-center text-[8px] uppercase tracking-[0.4em] text-white/20">
        <p>© 2025 Brackwasser Design Café</p>
        <p>Impressum / Datenschutz</p>
      </div>
    </div>
  </footer>
);

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
