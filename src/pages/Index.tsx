import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { supabase } from "@/lib/supabase";
import {
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import heroImg from '@/assets/hero-cafe.jpg';
import aboutImg from '@/assets/about-detail.jpg';

const ease = [0.23, 1, 0.32, 1] as const;

/* ─── MOBILE HELPER ─── */
const useMobileCheck = () => {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return mobile;
};

/* ─── 3D TILT HOOK ─── */
const useTilt = (intensity = 12) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [intensity, -intensity]),
    { stiffness: 150, damping: 20 }
  );

  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-intensity, intensity]),
    { stiffness: 150, damping: 20 }
  );

  const handleMouse = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return { rotateX, rotateY, handleMouse, reset };
};

/* ─── SCROLL TEXT REVEAL ─── */
const RevealText = ({
  children,
  className = '',
  delay = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}) => (
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

/* ─── PARALLAX WRAPPER ─── */
const ParallaxLayer = ({
  children,
  speed = 0.5,
  className = '',
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) => {
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'Café', href: '#about' },
    { label: 'Karte', href: '#menu' },
    { label: 'Galerie', href: '#gallery' },
    { label: 'Kollektion', href: '#merch' },
    { label: 'Kontakt', href: '#location' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease }}
        className={`fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-12 py-5 transition-all duration-700 ${
          scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/50' : ''
        }`}
      >
        <a
          href="#"
          className={`text-lg font-black tracking-[0.4em] uppercase transition-colors duration-500 ${
            scrolled ? 'text-foreground' : 'text-white'
          }`}
        >
          BRACKWASSER
        </a>

        <div
          className={`hidden md:flex gap-10 text-[10px] uppercase tracking-[0.3em] font-semibold transition-colors duration-500 ${
            scrolled ? 'text-muted-foreground' : 'text-white/60'
          }`}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-primary transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className={`md:hidden text-2xl leading-none transition-colors duration-300 ${
            scrolled ? 'text-foreground' : 'text-white'
          }`}
          aria-label="Open menu"
        >
          ☰
        </button>
      </motion.nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md md:hidden">
          <div className="flex justify-between items-center px-4 py-5 border-b border-white/10">
            <span className="text-white text-lg font-black tracking-[0.3em] uppercase">
              BRACKWASSER
            </span>

            <button
              onClick={() => setMobileOpen(false)}
              className="text-white text-3xl leading-none"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          <div className="flex flex-col px-6 py-8 gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-white text-lg uppercase tracking-[0.25em] border-b border-white/10 pb-4"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

/* ─── HERO ─── */
const Hero = ({
  heroTitle,
  heroSubtitle,
  heroButtonText,
  heroVideoUrl,
  heroImageUrl,
  heroMode,
}: {
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroVideoUrl?: string;
  heroImageUrl?: string;
  heroMode?: string;
}) => {
  const isMobile = useMobileCheck();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "12%" : "25%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, isMobile ? 1.03 : 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "20%" : "50%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={ref} className="relative h-[95vh] md:h-[120vh] w-full overflow-hidden">
      {/* HERO BACKGROUND */}
      <motion.div
  style={{ y: bgY, scale: bgScale }}
  className="absolute inset-0 z-0"
>
  {heroMode?.toLowerCase?.() === "image" ? (
  <img
    key={heroImageUrl || heroImg}
    src={heroImageUrl || heroImg}
    className="absolute inset-0 w-full h-full object-cover"
    alt="Hero"
  />
) : heroVideoUrl ? (
  <video
    key={heroVideoUrl}
    src={heroVideoUrl}
    className="absolute inset-0 w-full h-full object-cover"
    autoPlay
    muted
    loop
    playsInline
  />
) : (
  <img
    key={heroImageUrl || heroImg}
    src={heroImageUrl || heroImg}
    className="absolute inset-0 w-full h-full object-cover"
    alt="Hero"
  />
)}
</motion.div>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      {/* CONTENT */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 h-full flex flex-col justify-center px-6 md:px-20"
      >
        <h1 className="text-[14vw] md:text-[10vw] font-black uppercase leading-[0.9] text-white">
          {heroTitle}
        </h1>

        <p className="mt-4 text-white/70 max-w-xl text-sm md:text-base">
          {heroSubtitle}
        </p>

        <div className="mt-8 flex gap-6">
          <a
            href="#about"
            className="px-8 py-4 bg-white text-black text-xs uppercase tracking-[0.2em] font-bold"
          >
            {heroButtonText}
          </a>

          <a
            href="#gallery"
            className="text-white/60 text-xs uppercase tracking-[0.2em]"
          >
            Galerie ansehen
          </a>
        </div>
      </motion.div>
    </section>
  );
};

const MusicPlayer = ({ musicUrl }: { musicUrl?: string }) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const tryPlay = async () => {
      if (!musicUrl) return;

      try {
        await audioRef.current?.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    };

    tryPlay();
  }, [musicUrl]);

  const toggle = async () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {}
    }
  };

  if (!musicUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop />

      <button
        onClick={toggle}
        className="fixed bottom-5 right-5 z-[9999] w-14 h-14 rounded-full bg-black/50 text-white flex items-center justify-center"
      >
        {playing ? "❚❚" : "▶️"}
      </button>
    </>
  );
};

/* ─── MARQUEE TRANSITION ─── */
const MarqueeTransition = ({ bg = 'bg-background' }: { bg?: string }) => {
  return (
    <div className={`py-8 md:py-12 overflow-hidden ${bg}`}>
      <div className="flex whitespace-nowrap text-[10vw] md:text-[6vw] font-black uppercase text-primary/10">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="mx-10">
            BRACKWASSER • DESIGN • CAFÉ •
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─── ABOUT ─── */
const About = ({ siteSettings }: { siteSettings: any }) => {
  const isMobile = useMobileCheck();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);
  const decorY = useTransform(scrollYProgress, [0, 1], ['12%', '-12%']);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.01, 1.04]);
  const imgRotate = useTransform(scrollYProgress, [0, 1], [-1, 1]);

  return (
    <section
      ref={ref}
      id="about"
      className="relative py-24 md:py-32 bg-background overflow-hidden px-6 md:px-16"
    >
      {/* soft background text */}
      <motion.div
        style={{ y: decorY }}
        className="absolute -top-[5%] right-[-8%] text-[24vw] font-black uppercase text-primary/[0.04] leading-none pointer-events-none select-none"
      >
        CAFÉ
      </motion.div>

      {/* soft shapes */}
      <div className="absolute top-[18%] left-[6%] w-[120px] h-[120px] md:w-[180px] md:h-[180px] border border-primary/10" />
      <div className="absolute bottom-[18%] right-[8%] w-[90px] h-[90px] md:w-[130px] md:h-[130px] bg-primary/[0.05]" />
      <div className="absolute left-0 top-[18%] w-[2px] h-[180px] md:h-[240px] bg-primary" />

      <div className="relative max-w-[1150px] mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* image */}
        <motion.div
          style={isMobile ? {} : { y: imgY }}
          className="relative"
        >
          <motion.div
            style={isMobile ? {} : { scale: imgScale, rotate: imgRotate }}
            className="relative aspect-[3/4] overflow-hidden rounded-[22px] shadow-[0_25px_80px_-20px_rgba(0,0,0,0.35)]"
          >
            <img
              src={siteSettings?.about_image_url || aboutImg}
              alt="About Brackwasser"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-[1400ms] hover:scale-[1.04]"
            />

            <motion.div
              whileInView={{ x: 0, opacity: 1 }}
              initial={{ x: -30, opacity: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="absolute bottom-0 left-0 bg-primary text-primary-foreground px-6 py-5"
            >
              <p className="text-[9px] uppercase tracking-[0.3em] font-bold">
                Est. 2024
              </p>
            </motion.div>
          </motion.div>

          <div className="absolute -bottom-6 -right-6 w-[72%] h-[72%] bg-primary/[0.08] -z-10 rounded-[24px]" />
          <div className="absolute -top-4 -left-4 w-[42%] h-[26%] border border-primary/10 -z-10 rounded-[18px]" />
        </motion.div>

        {/* text */}
        <motion.div
          style={isMobile ? {} : { y: textY }}
          className="relative"
        >
          <motion.p
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[10px] uppercase tracking-[0.5em] font-bold text-primary flex items-center gap-3 mb-5"
          >
            <span className="inline-block w-8 h-px bg-primary" />
            Über uns
          </motion.p>

          <div className="space-y-1 md:space-y-2">
            <RevealText>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] text-foreground">
                {siteSettings?.about_title_1 || "Ein Ort"}
              </h2>
            </RevealText>

            <RevealText delay={0.08}>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] text-primary">
                {siteSettings?.about_title_2 || "zwischen"}
              </h2>
            </RevealText>

            <RevealText delay={0.16}>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] text-foreground">
                {siteSettings?.about_title_3 || "den Gezeiten."}
              </h2>
            </RevealText>
          </div>

          <motion.p
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 24 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="mt-7 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl"
          >
            {siteSettings?.about_description ||
              "Brackwasser ist kein gewöhnliches Café. Es ist ein temporäres Refugium für Ästheten und Denker am Hafen Ost. Wir kuratieren Momente aus feinstem Rösthandwerk und progressivem Design — ein Ort, der Kaffee zur Kunst erhebt."}
          </motion.p>

          {/* counters */}
          <div className="pt-10 flex gap-10 md:gap-16">
            {['Röstung', 'Design', 'Kultur'].map((label, i) => (
              <motion.div
                key={label}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 24 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + i * 0.12, duration: 0.6 }}
                className="group"
              >
                <p className="text-4xl md:text-6xl font-black text-primary group-hover:text-brand-glow transition-colors duration-300">
                  0{i + 1}
                </p>
                <p className="text-[10px] uppercase tracking-[0.28em] font-semibold text-muted-foreground mt-2">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};


/* ─── MENU ─── */
const Menu = ({ items }: { items: any[] }) => {
  const kaffe = items.filter((i) => i.category === "Kaffee");
  const klassiker = items.filter((i) => i.category === "Klassiker");
  const erfrischung = items.filter((i) => i.category === "Erfrischung");

  const renderSection = (title: string, data: any[]) => (
    <div className="mb-16">
      <motion.h3
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 20 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-2xl md:text-3xl font-bold text-primary mb-6"
      >
        {title}
      </motion.h3>

      <div className="space-y-3">
        {data.map((item, i) => (
          <motion.div
            key={i}
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.04, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            className="group relative overflow-hidden rounded-[16px] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/12 via-primary/5 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500" />

            <div className="relative flex items-center justify-between gap-4 px-5 py-4 md:px-6 md:py-5">
              <div className="min-w-0">
                <p className="text-white text-lg md:text-xl font-semibold group-hover:translate-x-1 transition-transform duration-300">
                  {item.name}
                </p>
                <p className="text-white/40 text-sm mt-1">
                  {item.description}
                </p>
              </div>

              <div className="flex-1 border-b border-dotted border-white/10 group-hover:border-primary/25 transition-colors duration-500 hidden md:block" />

              <p className="text-white/75 group-hover:text-white font-black text-lg md:text-xl whitespace-nowrap transition-colors duration-300">
                {item.price}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="menu" className="relative py-24 md:py-32 px-6 md:px-16 bg-[#0b0f1a] overflow-hidden">
      <div className="absolute top-1/3 right-[10%] w-[220px] h-[220px] md:w-[340px] md:h-[340px] rounded-full bg-primary/[0.06] blur-[90px] md:blur-[140px]" />
      <div className="max-w-[1000px] mx-auto relative">
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14 md:mb-20"
        >
          <p className="text-[10px] uppercase tracking-[0.45em] text-white/30 mb-4">
            Die Selektion
          </p>

          <RevealText>
            <h2 className="text-5xl md:text-7xl font-black uppercase text-white leading-[0.9]">
              Unsere
            </h2>
          </RevealText>

          <RevealText delay={0.08}>
            <h2 className="text-5xl md:text-7xl font-black uppercase text-primary leading-[0.9]">
              Karte
            </h2>
          </RevealText>
        </motion.div>

        {renderSection("Kaffee", kaffe)}
        {renderSection("Klassiker", klassiker)}
        {renderSection("Erfrischung", erfrischung)}
      </div>
    </section>
  );
};

/* ─── GALLERY ─── */
const Gallery = ({ gallery }: { gallery: any[] }) => {
  const isMobile = useMobileCheck();
  const [selectedImage, setSelectedImage] = useState<{
    image_url: string;
    description?: string;
  } | null>(null);

  return (
    <section id="gallery" className="py-20 md:py-28 px-5 md:px-16 bg-background">
      <div className="max-w-[1150px] mx-auto">
        <div className="mb-10 md:mb-14">
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-4">
            Impressionen
          </p>

          <RevealText>
            <h2 className="text-4xl md:text-6xl font-black uppercase text-foreground leading-[0.95]">
              GAL<span className="text-primary">LERIE</span>
            </h2>
          </RevealText>

          <p className="text-sm md:text-base text-muted-foreground mt-4 max-w-xl leading-relaxed">
            Eindrücke aus unserem Refugium am Hafen Ost.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {gallery.map((img, index) => (
            <motion.button
              key={img.id || index}
              type="button"
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 26 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.04, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              onClick={() =>
                setSelectedImage({
                  image_url: img.image_url,
                  description: img.description,
                })
              }
              className="group relative overflow-hidden rounded-[20px] text-left bg-black/5 focus:outline-none"
            >
              <div className="relative overflow-hidden rounded-[20px]">
                <img
                  src={img.image_url}
                  alt={img.description || `Gallery ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className={`w-full object-cover block transition duration-500 ${
                    isMobile ? "" : "group-hover:scale-[1.04]"
                  } ${
                    index % 3 === 0
                      ? "h-[380px] md:h-[420px]"
                      : index % 3 === 1
                      ? "h-[280px] md:h-[320px]"
                      : "h-[320px] md:h-[360px]"
                  }`}
                />

                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/75 via-black/18 to-transparent transition duration-300 ${
                    isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />

                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <p
                    className={`text-white leading-relaxed transition duration-300 ${
                      isMobile
                        ? "text-[13px] opacity-100 translate-y-0"
                        : "text-[13px] opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0"
                    }`}
                  >
                    {img.description || ""}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 md:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[980px] max-h-[92vh] overflow-y-auto rounded-[22px] bg-[#0f1117] border border-white/10"
          >
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-black/35 backdrop-blur-md text-white text-2xl"
              >
                ×
              </button>

              <img
                src={selectedImage.image_url}
                alt={selectedImage.description || "Preview"}
                loading="lazy"
                decoding="async"
                className="w-full max-h-[72vh] object-cover md:object-contain rounded-t-[22px]"
              />
            </div>

            <div className="p-5 md:p-6">
              <p className="text-white/85 text-sm md:text-base leading-relaxed">
                {selectedImage.description || "Brackwasser Galerie"}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


/* ─── MERCH ─── */
const Merch = ({ items, siteSettings }: { items: any[]; siteSettings: any }) => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [productImages, setProductImages] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const openProduct = async (product: any) => {
    setSelectedProduct(product);

    const { data: images } = await supabase
      .from("merch_images")
      .select("*")
      .eq("merch_id", product.id)
      .order("sort_order", { ascending: true });

    setProductImages(images || []);
    setActiveImage(images?.[0]?.image_url || product.image_url);
  };

  return (
    <section id="merch" className="py-24 md:py-32 px-6 md:px-16 bg-[#11141d]">
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-14 md:mb-20">
          <p className="text-xs uppercase tracking-[0.4em] text-white/30 mb-4">
  {siteSettings?.merch_eyebrow || 'Tragbare Ästhetik'}
</p>
          <h2 className="text-5xl md:text-7xl font-black uppercase text-white">
  {siteSettings?.merch_title || 'DROP 01'}
</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <MerchCard
              key={item.id || i}
              item={item}
              onSelect={openProduct}
              isMobile={isMobile}
            />
          ))}
        </div>

        {selectedProduct && (
          <div
            onClick={() => {
              setSelectedProduct(null);
              setProductImages([]);
              setActiveImage(null);
            }}
            className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-3 md:p-6"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[1100px] max-h-[92vh] overflow-y-auto rounded-[20px] bg-[#0f0f12]"
            >
              <div
                className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-[1.2fr_0.8fr]"}`}
              >
                <div className="p-4 md:p-6 bg-[#111]">
                  <div className="w-full h-[320px] md:h-[520px] rounded-[16px] overflow-hidden bg-[#1a1a1a]">
                    <img
                      src={activeImage || selectedProduct.image_url}
                      alt={selectedProduct.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
                    {[selectedProduct.image_url, ...productImages.map((img) => img.image_url)]
                      .filter((value, index, self) => self.indexOf(value) === index)
                      .map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImage(img)}
                          className={`flex-none overflow-hidden rounded-[12px] ${
                            activeImage === img ? "border-2 border-white" : "border border-white/10"
                          }`}
                          style={{
                            width: isMobile ? 72 : 88,
                            height: isMobile ? 72 : 88,
                          }}
                        >
                          <img
                            src={img}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                  </div>
                </div>

                <div className="p-5 md:p-8 text-white flex flex-col justify-between gap-6">
                  <div>
                    <div className="inline-block px-3 py-2 border border-white/15 rounded-full text-[12px] uppercase tracking-[0.08em] text-white/70 mb-4">
                      {selectedProduct.label}
                    </div>

                    <h2 className="text-[28px] md:text-[38px] leading-[1.05] font-extrabold">
                      {selectedProduct.name}
                    </h2>

                    <p className="mt-3 text-white/65 text-sm md:text-base leading-7">
                      {selectedProduct.subtitle}
                    </p>

                    <p className="mt-5 text-[22px] md:text-[28px] font-bold">
                      {selectedProduct.price}
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => {
                        const message = `Hallo 👋

ich interessiere mich für dieses Produkt:

Produkt: ${selectedProduct.name}
Preis: ${selectedProduct.price}

Es sieht wirklich sehr hochwertig aus.
Könnt ihr mir bitte mehr Informationen dazu geben?

Vielen Dank!`;

                        navigator.clipboard.writeText(message);
                        alert("Die Nachricht wurde kopiert. Füge sie einfach auf Instagram ein.");
                        window.open("https://instagram.com/brackwasser_designcafe", "_blank");
                      }}
                      className="w-full py-4 rounded-[14px] bg-white text-black font-bold"
                    >
                      Auf Instagram anfragen
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        setProductImages([]);
                        setActiveImage(null);
                      }}
                      className="w-full py-4 rounded-[14px] border border-white/15 text-white mt-3"
                    >
                      Schließen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const MerchCard = ({
  item,
  onSelect,
  isMobile,
}: {
  item: any;
  onSelect: (product: any) => void;
  isMobile: boolean;
}) => {
  const tilt = useTilt(10);

  return (
    <div className="group">
      <div className="perspective-container">
        <motion.div
          style={isMobile ? {} : { rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
          onMouseMove={isMobile ? undefined : tilt.handleMouse}
          onMouseLeave={isMobile ? undefined : tilt.reset}
          onClick={() => onSelect(item)}
          className="group relative overflow-hidden rounded-[18px] cursor-pointer"
        >
          <img
            src={item.image_url}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="w-full h-[320px] object-cover transition duration-500 group-hover:scale-[1.04]"
          />

          <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 bg-gradient-to-t from-black/75 to-transparent">
            <h3 className="text-white text-[16px] font-semibold">{item.name}</h3>
            <p className="text-white/75 text-[13px]">{item.subtitle}</p>
            <p className="text-white font-bold mt-1">{item.price}</p>
          </div>

          <div className="absolute top-4 left-4 bg-white text-black text-[10px] px-3 py-1.5 uppercase tracking-[0.2em] font-black rounded-full">
            {item.label}
          </div>
        </motion.div>
      </div>

      <h3 className="mt-4 text-xl font-bold uppercase tracking-wide text-white">
        {item.name}
      </h3>
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/25 mt-1 font-semibold">
        {item.subtitle}
      </p>
    </div>
  );
};

/* ─── MOBILE HELPER ─── */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
};


/* ─── FOOTER ─── */
const Footer = ({ siteSettings }: { siteSettings: any }) => {
  return (
    <footer
      id="location"
      className="relative surface-dark pt-20 md:pt-24 pb-12 px-6 md:px-16 overflow-hidden"
    >
      <div className="relative max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-start">
          <div className="space-y-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-brand-glow/35 font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-brand-glow/15" />
                Standort
              </p>

              <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-[0.95]">
                {siteSettings?.address || "Am Hafen Ost 2"}
              </h2>

              <p className="text-base text-white/35 mt-4">
                {siteSettings?.address || "26409 Wittmund · Deutschland"}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-brand-glow/35 font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-brand-glow/15" />
                Öffnungszeiten
              </p>

              <p className="text-lg md:text-xl font-semibold text-white whitespace-pre-line">
                {siteSettings?.opening_hours ||
                  "Samstag & Sonntag\n11:00 – 17:30\nMontag bis Freitag: Geschlossen"}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-brand-glow/35 font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-brand-glow/15" />
                Kontakt
              </p>

              <div className="space-y-2">
                <a
                  href={`tel:${siteSettings?.phone || "+49123456789"}`}
                  className="block text-lg md:text-xl font-semibold text-white/85 hover:text-white transition-colors"
                >
                  {siteSettings?.phone || "+49 123 456789"}
                </a>

                <a
                  href={`mailto:${siteSettings?.email || "info@brackwasser.de"}`}
                  className="block text-base md:text-lg text-white/60 hover:text-white transition-colors"
                >
                  {siteSettings?.email || "info@brackwasser.de"}
                </a>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.5em] text-brand-glow/35 font-bold mb-4 flex items-center gap-3">
                <span className="w-8 h-px bg-brand-glow/15" />
                Social
              </p>

              <a
                href={siteSettings?.instagram || "https://instagram.com/brackwasser_designcafe"}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xl md:text-2xl font-bold text-white hover:text-brand-glow transition-colors duration-500"
              >
                @brackwasser_designcafe
              </a>
            </div>
          </div>

          <div className="rounded-[20px] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm min-h-[320px]">
            <iframe
              title="Brackwasser Location"
              src={
                siteSettings?.map_url ||
                "https://www.google.com/maps?q=Am%20Hafen%20Ost%202,%2026409%20Wittmund,%20Deutschland&z=15&output=embed"
              }
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "320px", display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="mt-12 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[8px] uppercase tracking-[0.4em] text-white/10 font-semibold pt-6">
          <p>© 2026 Brackwasser Design Café</p>
          <p>Impressum / Datenschutz</p>
        </div>
      </div>
    </footer>
  );
};

/* ─── PAGE ─── */
const Index = () => {
  const [data, setData] = useState<any>(null);
  const [gallery, setGallery] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [merch, setMerch] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("*")
        .single();

      setData(settingsData);

      const { data: galleryData } = await supabase
        .from("gallery")
        .select("*");

      setGallery(galleryData || []);

      const { data: menuData } = await supabase
        .from("menu_items")
        .select("*");

      setMenuItems(menuData || []);

      const { data: merchData } = await supabase
        .from("merch_items")
        .select("*");

      setMerch(merchData || []);
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground antialiased font-body">
      <Nav />

      <Hero
        heroTitle={data.hero_title}
        heroSubtitle={data.hero_subtitle}
        heroButtonText={data.hero_button_text}
        heroVideoUrl={data.hero_video_url}
        heroImageUrl={data.hero_image_url}
        heroMode={data.hero_mode}
      />

      <MarqueeTransition />
      <About siteSettings={data} />
      <MarqueeTransition />
      <Menu items={menuItems} />
      <MarqueeTransition bg="surface-navy" />
      <Gallery gallery={gallery} />
      <MarqueeTransition />
      <Merch items={merch} siteSettings={data} />
      <Footer siteSettings={data} />
      <MusicPlayer musicUrl={data.music_url} />
    </div>
  );
};

export default Index;