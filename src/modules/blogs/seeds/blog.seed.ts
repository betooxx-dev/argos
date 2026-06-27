import { BlogLocale, BlogPostStatus } from '../dto';

export type SeedBlogComment = {
  id: string;
  author: string;
  date: string;
  body: string;
};

export type SeedBlogPost = {
  slug: string;
  locale: BlogLocale;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  readingTime: string;
  category: string;
  tags: string[];
  cover: string;
  featured?: boolean;
  rating: number;
  ratingCount: number;
  related: string[];
  comments: SeedBlogComment[];
  status: BlogPostStatus;
};

export const blogSeedPosts: SeedBlogPost[] = [
  {
    slug: 'disenar-software-tranquilo',
    locale: BlogLocale.ES,
    title: 'Diseñar software tranquilo',
    excerpt:
      'Por qué las mejores interfaces son las que apenas notas, y cómo la moderación se convierte en una ventaja.',
    content: [
      'El software tranquilo respeta tu atención. No grita, no llena cada esquina de alertas y nunca te hace sentir que vas tarde. Hace su trabajo con claridad y deja que sigas avanzando.',
      'El principio es simple, pero difícil de practicar: cada elemento en pantalla debe justificar la atención que pide. El movimiento debe orientar, no entretener. El color debe señalar, no decorar. El copy debe respetar el tiempo de quien lee.',
      'Cuando quitas el ruido, lo que queda es confianza. Y la confianza, más que una función aislada, es lo que hace que una persona vuelva a un producto todos los días.',
      'Empieza auditando tu interfaz para detectar interrupciones. Luego pregunta por cada una: ¿esto se ganó su lugar? Muchas veces la respuesta es no.',
    ],
    date: '2026-05-18',
    readingTime: '6 min',
    category: 'Diseño',
    tags: ['Diseño', 'Craft', 'UX'],
    cover: '/blog/calm-software.png',
    featured: true,
    rating: 4.8,
    ratingCount: 124,
    related: [
      'movimiento-con-intencion',
      'el-poder-silencioso-de-la-tipografia',
    ],
    comments: [
      {
        id: 'c1',
        author: 'Mariana López',
        date: '2026-05-19',
        body: 'Esto le puso palabras a algo que he sentido por años. El ejercicio de auditoría está buenísimo.',
      },
      {
        id: 'c2',
        author: 'Devon Park',
        date: '2026-05-20',
        body: 'La idea de moderación como feature me sirve perfecto para mi próxima revisión de diseño.',
      },
    ],
    status: BlogPostStatus.PUBLISHED,
  },
  {
    slug: 'movimiento-con-intencion',
    locale: BlogLocale.ES,
    title: 'Movimiento con intención',
    excerpt:
      'Una guía práctica para usar animación como herramienta de claridad y no como decoración.',
    content: [
      'La animación es un lenguaje. Bien usada, explica de dónde vienen las cosas, hacia dónde van y cómo se relacionan las partes de una interfaz. Mal usada, solo es movimiento porque sí.',
      'El mejor movimiento es funcional. Un modal que aparece desde el botón que lo abrió crea una historia espacial. Un item que sale de la lista confirma una eliminación. La persona no tiene que pensarlo: lo entiende.',
      'Mantén duraciones cortas, respeta las preferencias de movimiento reducido y usa easing con intención. Cuando haya duda, anima menos.',
    ],
    date: '2026-04-29',
    readingTime: '5 min',
    category: 'Ingeniería',
    tags: ['Motion', 'Front-end', 'UX'],
    cover: '/blog/motion-meaning.png',
    rating: 4.6,
    ratingCount: 89,
    related: ['disenar-software-tranquilo', 'enviar-rapido-sin-romper'],
    comments: [
      {
        id: 'c3',
        author: 'Sara Kim',
        date: '2026-04-30',
        body: 'La idea de historia espacial por fin hizo que la animación me hiciera clic.',
      },
    ],
    status: BlogPostStatus.PUBLISHED,
  },
  {
    slug: 'el-poder-silencioso-de-la-tipografia',
    locale: BlogLocale.ES,
    title: 'El poder silencioso de la tipografía',
    excerpt:
      'Cómo un sistema tipográfico bien pensado puede sostener toda la personalidad de un producto.',
    content: [
      'La tipografía es la voz de un producto. Antes de leer una palabra, el tipo ya marcó un tono: seguro o tímido, cálido o clínico, moderno o nostálgico.',
      'Un buen sistema tipográfico trata sobre ritmo: una escala clara, line-height generoso para lectura y espaciado consistente. Si el ritmo está bien, todo se siente intencional.',
      'Rara vez necesitas más de dos familias. Una para expresión, otra para claridad. La restricción es parte del punto.',
    ],
    date: '2026-04-08',
    readingTime: '4 min',
    category: 'Diseño',
    tags: ['Tipografía', 'Diseño', 'Sistemas'],
    cover: '/blog/typography.png',
    rating: 4.9,
    ratingCount: 156,
    related: ['disenar-software-tranquilo', 'movimiento-con-intencion'],
    comments: [],
    status: BlogPostStatus.PUBLISHED,
  },
  {
    slug: 'enviar-rapido-sin-romper',
    locale: BlogLocale.ES,
    title: 'Enviar rápido sin romper cosas',
    excerpt:
      'Notas sobre construir una cultura donde velocidad y calidad se refuerzan entre sí.',
    content: [
      'La velocidad y la calidad suelen presentarse como una tensión. En equipos sanos son parte de lo mismo: enviar cambios pequeños y reversibles rápido ayuda a mantener la calidad alta.',
      'La clave es confianza: tipado fuerte, buenas pruebas, CI rápido y una cultura donde revertir no se castiga. Cuando enviar es seguro, el equipo envía más seguido y los ciclos de feedback se acortan.',
      'Los lanzamientos gigantes son donde la calidad se deteriora. Prefiere el camino continuo y aburrido.',
    ],
    date: '2026-03-15',
    readingTime: '7 min',
    category: 'Ingeniería',
    tags: ['Equipos', 'Proceso', 'Front-end'],
    cover: '/blog/shipping-fast.png',
    rating: 4.5,
    ratingCount: 73,
    related: [
      'movimiento-con-intencion',
      'el-poder-silencioso-de-la-tipografia',
    ],
    comments: [
      {
        id: 'c4',
        author: 'Tomás Herrera',
        date: '2026-03-16',
        body: 'La idea de celebrar reversions me la llevo para nuestra próxima retro.',
      },
    ],
    status: BlogPostStatus.PUBLISHED,
  },
  {
    slug: 'designing-calm-software',
    locale: BlogLocale.EN,
    title: 'Designing calm software',
    excerpt:
      'Why the best interfaces are the ones you barely notice, and how restraint becomes a feature.',
    content: [
      'Calm software respects your attention. It does not shout, badge every corner of the screen, or make you feel behind. It quietly does its job and lets you keep moving.',
      "The principle is simple but hard to practice: every element on the screen should justify the attention it asks for. Motion should guide rather than entertain. Color should signal rather than decorate. Copy should respect the reader's time.",
      'When you remove the noise, what remains is trust. And trust, more than any single feature, is what makes people return to a product day after day.',
      'Start by auditing your interface for things that interrupt. Then ask, for each one: does this earn its place? Most do not.',
    ],
    date: '2026-05-18',
    readingTime: '6 min',
    category: 'Design',
    tags: ['Design', 'Craft', 'UX'],
    cover: '/blog/calm-software.png',
    featured: true,
    rating: 4.8,
    ratingCount: 124,
    related: ['motion-that-means-something', 'the-quiet-power-of-typography'],
    comments: [
      {
        id: 'c1',
        author: 'Mariana López',
        date: '2026-05-19',
        body: 'This put words to something I have felt for years. The audit exercise is gold.',
      },
      {
        id: 'c2',
        author: 'Devon Park',
        date: '2026-05-20',
        body: 'Restraint as a feature is a framing I am taking into our next design review.',
      },
    ],
    status: BlogPostStatus.PUBLISHED,
  },
  {
    slug: 'motion-that-means-something',
    locale: BlogLocale.EN,
    title: 'Motion that means something',
    excerpt:
      'A practical guide to using animation as a tool for clarity instead of decoration.',
    content: [
      'Animation is a language. Used well, it tells users where things came from, where they are going, and how parts of the interface relate. Used poorly, it is just movement for movement’s sake.',
      'The best motion is functional. A modal that scales up from the button that opened it creates a spatial story. A list item that slides out confirms a deletion. The user never has to think; they just understand.',
      'Keep durations short, respect reduced-motion preferences, and ease with intent. When in doubt, animate less.',
    ],
    date: '2026-04-29',
    readingTime: '5 min',
    category: 'Engineering',
    tags: ['Motion', 'Front-end', 'UX'],
    cover: '/blog/motion-meaning.png',
    rating: 4.6,
    ratingCount: 89,
    related: ['designing-calm-software', 'shipping-fast-without-breaking'],
    comments: [
      {
        id: 'c3',
        author: 'Sara Kim',
        date: '2026-04-30',
        body: 'The spatial story idea finally made motion click for me.',
      },
    ],
    status: BlogPostStatus.PUBLISHED,
  },
  {
    slug: 'the-quiet-power-of-typography',
    locale: BlogLocale.EN,
    title: 'The quiet power of typography',
    excerpt:
      "How a considered type system can carry an entire product's personality.",
    content: [
      'Typography is the voice of a product. Before anyone reads a word, the type has already set a tone: confident or timid, warm or clinical, modern or nostalgic.',
      'A good type system is mostly about rhythm: a clear scale, generous line-height for body copy, and consistent spacing. Get the rhythm right and everything feels intentional.',
      'You rarely need more than two families. One for expression, one for clarity. The restraint is the point.',
    ],
    date: '2026-04-08',
    readingTime: '4 min',
    category: 'Design',
    tags: ['Typography', 'Design', 'Systems'],
    cover: '/blog/typography.png',
    rating: 4.9,
    ratingCount: 156,
    related: ['designing-calm-software', 'motion-that-means-something'],
    comments: [],
    status: BlogPostStatus.PUBLISHED,
  },
  {
    slug: 'shipping-fast-without-breaking',
    locale: BlogLocale.EN,
    title: 'Shipping fast without breaking things',
    excerpt:
      'Notes on building a team culture where speed and quality reinforce each other.',
    content: [
      'Speed and quality are often framed as a trade-off. In healthy teams, they are the same thing: shipping small, reversible changes quickly is how you keep quality high.',
      'The unlock is confidence: strong typing, good tests, fast CI, and a culture where reverting is celebrated, not feared. When it is safe to ship, people ship more often, and feedback loops tighten.',
      'Big-bang releases are where quality goes to die. Prefer the boring, continuous path.',
    ],
    date: '2026-03-15',
    readingTime: '7 min',
    category: 'Engineering',
    tags: ['Teams', 'Process', 'Front-end'],
    cover: '/blog/shipping-fast.png',
    rating: 4.5,
    ratingCount: 73,
    related: ['motion-that-means-something', 'the-quiet-power-of-typography'],
    comments: [
      {
        id: 'c4',
        author: 'Tomás Herrera',
        date: '2026-03-16',
        body: 'Reverting as a celebrated practice is going into our next retro.',
      },
    ],
    status: BlogPostStatus.PUBLISHED,
  },
];
