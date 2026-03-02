export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'video' | 'sheet-music' | 'article' | 'interactive' | 'website';
  category: 'beginner-tutorials' | 'sheet-music' | 'theory' | 'ear-training' | 'sight-reading' | 'technique';
  level: 'beginner' | 'intermediate' | 'all';
  tags: string[];
}

export const resources: Resource[] = [
  // Beginner Tutorial Videos
  {
    id: 'yt-piano-basics',
    title: 'Piano Lessons for Absolute Beginners - Hoffman Academy',
    description: 'Complete free piano course for absolute beginners. Learn proper hand position, note reading, and basic songs step-by-step.',
    url: 'https://www.youtube.com/playlist?list=PL8hZtgRyL9WRWJLlIUPl-ydiDc8CZ_SRH',
    type: 'video',
    category: 'beginner-tutorials',
    level: 'beginner',
    tags: ['fundamentals', 'complete-course', 'hand-position', 'note-reading'],
  },
  {
    id: 'yt-easy-songs',
    title: 'Easy Piano Songs for Beginners - Piano Tutorial Easy',
    description: 'Simple popular songs arranged for beginners with easy-to-follow tutorials.',
    url: 'https://www.youtube.com/@PianoTutorialEasy',
    type: 'video',
    category: 'beginner-tutorials',
    level: 'beginner',
    tags: ['popular-songs', 'tutorials', 'fun'],
  },
  {
    id: 'yt-reading-music',
    title: 'How to Read Music - Music Theory for Beginners',
    description: 'Learn to read sheet music from scratch. Covers staff, clefs, notes, and rhythms.',
    url: 'https://www.youtube.com/watch?v=ZN41d7Txcq0',
    type: 'video',
    category: 'theory',
    level: 'beginner',
    tags: ['note-reading', 'theory-basics', 'music-notation'],
  },
  {
    id: 'yt-scales',
    title: 'Major Scales Tutorial - Learn All 12 Major Scales',
    description: 'Comprehensive tutorial on all major scales with fingering patterns and practice tips.',
    url: 'https://www.youtube.com/watch?v=5OqpLMVBWJE',
    type: 'video',
    category: 'technique',
    level: 'beginner',
    tags: ['scales', 'major-scales', 'technique'],
  },
  {
    id: 'yt-hanon',
    title: 'Hanon Exercises for Beginners - Finger Technique',
    description: 'Essential finger exercises to build dexterity and strength.',
    url: 'https://www.youtube.com/results?search_query=hanon+exercises+piano+beginner',
    type: 'video',
    category: 'technique',
    level: 'beginner',
    tags: ['exercises', 'technique', 'finger-independence'],
  },

  // Sheet Music Sites
  {
    id: 'imslp',
    title: 'IMSLP (Petrucci Music Library)',
    description: 'Massive free library of public domain sheet music. Over 500,000 scores available to download.',
    url: 'https://imslp.org/',
    type: 'sheet-music',
    category: 'sheet-music',
    level: 'all',
    tags: ['classical', 'free', 'public-domain', 'comprehensive'],
  },
  {
    id: 'musescore',
    title: 'MuseScore Community',
    description: 'Free sheet music created by the community. Searchable by difficulty level. Includes modern and popular songs.',
    url: 'https://musescore.com/',
    type: 'sheet-music',
    category: 'sheet-music',
    level: 'all',
    tags: ['community', 'popular-music', 'free', 'modern'],
  },
  {
    id: 'mutopia',
    title: 'Mutopia Project',
    description: 'Free sheet music editions of classical works. All in the public domain.',
    url: 'https://www.mutopiaproject.org/',
    type: 'sheet-music',
    category: 'sheet-music',
    level: 'all',
    tags: ['classical', 'free', 'public-domain'],
  },
  {
    id: 'free-scores',
    title: 'Free-scores.com',
    description: 'Free sheet music for all instruments. Beginner-friendly arrangements available.',
    url: 'https://www.free-scores.com/',
    type: 'sheet-music',
    category: 'sheet-music',
    level: 'all',
    tags: ['free', 'arrangements', 'multi-instrument'],
  },
  {
    id: 'easy-sheet-music',
    title: 'EasySheetMusic.com',
    description: 'Simplified arrangements of popular songs specifically for beginners.',
    url: 'https://www.easysheetmusic.com/',
    type: 'sheet-music',
    category: 'sheet-music',
    level: 'beginner',
    tags: ['easy', 'simplified', 'popular-songs'],
  },

  // Theory Resources
  {
    id: 'musictheory-net',
    title: 'MusicTheory.net',
    description: 'Comprehensive music theory lessons with exercises. Covers basics to advanced topics.',
    url: 'https://www.musictheory.net/',
    type: 'interactive',
    category: 'theory',
    level: 'all',
    tags: ['theory', 'lessons', 'exercises', 'interactive'],
  },
  {
    id: 'teoria',
    title: 'Teoria.com',
    description: 'Music theory tutorials and exercises. Interactive tools for learning intervals, chords, and scales.',
    url: 'https://www.teoria.com/',
    type: 'interactive',
    category: 'theory',
    level: 'all',
    tags: ['theory', 'interactive', 'exercises'],
  },
  {
    id: 'music-theory-beginner',
    title: 'Music Theory for Beginners - Complete Course',
    description: 'Free online course covering all fundamentals of music theory.',
    url: 'https://www.musictheoryacademy.com/',
    type: 'website',
    category: 'theory',
    level: 'beginner',
    tags: ['course', 'fundamentals', 'comprehensive'],
  },

  // Ear Training
  {
    id: 'perfect-ear',
    title: 'Perfect Ear - Ear Training App',
    description: 'Free ear training exercises. Practice intervals, chords, scales, and rhythms.',
    url: 'https://www.perfectear.app/',
    type: 'interactive',
    category: 'ear-training',
    level: 'all',
    tags: ['ear-training', 'intervals', 'chords', 'app'],
  },
  {
    id: 'musictheory-exercises',
    title: 'MusicTheory.net Exercises',
    description: 'Free ear training and music theory exercises online.',
    url: 'https://www.musictheory.net/exercises',
    type: 'interactive',
    category: 'ear-training',
    level: 'all',
    tags: ['ear-training', 'exercises', 'free'],
  },
  {
    id: 'tone-dear',
    title: 'Tone Dear - Music Theory & Ear Training',
    description: 'Customizable ear training exercises for all levels.',
    url: 'https://www.tonedear.com/',
    type: 'interactive',
    category: 'ear-training',
    level: 'all',
    tags: ['ear-training', 'customizable', 'intervals'],
  },

  // Sight Reading
  {
    id: 'sight-reading-factory',
    title: 'Sight Reading Factory',
    description: 'Generate unlimited sight reading exercises. Free trial available.',
    url: 'https://www.sightreadingfactory.com/',
    type: 'interactive',
    category: 'sight-reading',
    level: 'all',
    tags: ['sight-reading', 'practice', 'generated'],
  },
  {
    id: 'read-ahead',
    title: 'ReadAhead - Sight Reading Practice',
    description: 'Free sight reading practice tool with progressive difficulty.',
    url: 'https://www.readahead.app/',
    type: 'interactive',
    category: 'sight-reading',
    level: 'all',
    tags: ['sight-reading', 'progressive', 'free'],
  },

  // General Piano Learning Websites
  {
    id: 'piano-nanny',
    title: 'Piano Nanny - Beginner Piano Lessons',
    description: 'Free beginner piano lessons with printable worksheets and exercises.',
    url: 'https://www.pianonanny.com/',
    type: 'website',
    category: 'beginner-tutorials',
    level: 'beginner',
    tags: ['lessons', 'worksheets', 'beginners', 'free'],
  },
  {
    id: 'zebra-keys',
    title: 'Zebra Keys - Piano Lessons',
    description: 'Free online piano lessons for beginners. Covers basics and technique.',
    url: 'https://www.zebrakeys.com/',
    type: 'website',
    category: 'beginner-tutorials',
    level: 'beginner',
    tags: ['lessons', 'basics', 'technique', 'free'],
  },
];

export const resourceCategories = [
  { id: 'all', label: 'All Resources', icon: '📚' },
  { id: 'beginner-tutorials', label: 'Beginner Tutorials', icon: '🎓' },
  { id: 'sheet-music', label: 'Sheet Music', icon: '🎼' },
  { id: 'theory', label: 'Music Theory', icon: '📖' },
  { id: 'ear-training', label: 'Ear Training', icon: '👂' },
  { id: 'sight-reading', label: 'Sight Reading', icon: '👀' },
  { id: 'technique', label: 'Technique', icon: '💪' },
] as const;

export const resourceTypes = [
  { id: 'all', label: 'All Types' },
  { id: 'video', label: 'Videos', icon: '🎥' },
  { id: 'sheet-music', label: 'Sheet Music', icon: '🎵' },
  { id: 'interactive', label: 'Interactive', icon: '🎮' },
  { id: 'website', label: 'Websites', icon: '🌐' },
  { id: 'article', label: 'Articles', icon: '📄' },
] as const;
