import React, { useState } from 'react';
import { 
  Camera, 
  Users, 
  Info, 
  Mail, 
  Briefcase, 
  ShieldCheck, 
  CheckCircle, 
  Phone, 
  MapPin, 
  Globe, 
  Send, 
  FileText, 
  DollarSign, 
  Award, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { NewsCategory, Author, GalleryAlbum, JobListing } from '../types';
import { AUTHORS_LIST, GALLERY_ALBUMS, JOB_LISTINGS } from '../data/newsData';
import { KmkLogo } from './KmkLogo';

interface SpecialtyPagesProps {
  category: NewsCategory;
  onSelectCategory: (cat: NewsCategory) => void;
}

export const SpecialtyPages: React.FC<SpecialtyPagesProps> = ({
  category,
  onSelectCategory,
}) => {
  // Dynamic Authors list synced with localStorage
  const [authorsList, setAuthorsList] = useState<Author[]>(() => {
    const saved = localStorage.getItem('knews254_authors_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return AUTHORS_LIST;
  });

  // Re-sync if localStorage changes
  React.useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('knews254_authors_list');
      if (saved) {
        try { setAuthorsList(JSON.parse(saved)); } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Contact form state
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactData, setContactData] = useState({ name: '', email: '', subject: '', message: '' });

  // Advertising inquiry state
  const [adInquirySubmitted, setAdInquirySubmitted] = useState(false);

  // Active Photo Album Modal
  const [activeAlbum, setActiveAlbum] = useState<GalleryAlbum | null>(null);

  // Active Author Detail
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactData({ name: '', email: '', subject: '', message: '' });
    }, 5000);
  };

  // Render Authors Page
  if (category === 'authors') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="border-b border-slate-800 pb-6">
            <span className="text-[10px] bg-red-600 text-white font-black px-2.5 py-1 rounded uppercase tracking-widest inline-block mb-2">
              KNEWS254 EDITORIAL BOARD
            </span>
            <h1 className="text-3xl font-black text-white">Authors, Editors &amp; Correspondents</h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              Meet our award-winning journalists, bureau chiefs, and data analysts across 47 counties and international desks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorsList.map((author) => (
              <div
                key={author.id}
                onClick={() => setSelectedAuthor(author)}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-red-500/50 transition cursor-pointer space-y-4 shadow-xl"
              >

                <div className="flex items-center gap-4">
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-red-500/40"
                  />
                  <div>
                    <h3 className="font-extrabold text-lg text-white">{author.name}</h3>
                    <p className="text-xs text-red-400 font-bold">{author.role}</p>
                    {author.website && (
                      <a
                        href={author.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] text-sky-400 font-mono font-bold hover:underline mt-0.5"
                      >
                        <Globe className="w-3 h-3" /> Portfolio Website <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">{author.location}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{author.bio}</p>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{author.articlesCount} Articles</span>
                  <span className="text-red-400 font-bold hover:underline flex items-center gap-1">
                    View Profile <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Single Author Detail Modal */}
          {selectedAuthor && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 relative text-slate-100 shadow-2xl">
                <button
                  onClick={() => setSelectedAuthor(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
                >
                  ✕
                </button>
                <div className="flex items-center gap-4">
                  <img
                    src={selectedAuthor.avatar}
                    alt={selectedAuthor.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-red-500"
                  />
                  <div>
                    <h2 className="text-xl font-black">{selectedAuthor.name}</h2>
                    <p className="text-xs text-red-400 font-bold">{selectedAuthor.role}</p>
                    <p className="text-xs text-slate-400 mt-1">{selectedAuthor.twitter}</p>
                    {selectedAuthor.website && (
                      <a
                        href={selectedAuthor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-mono font-bold hover:underline mt-1.5 bg-sky-950/60 border border-sky-800/60 px-2.5 py-1 rounded-lg"
                      >
                        <Globe className="w-3.5 h-3.5" /> Visit Portfolio <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedAuthor.bio}</p>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <p className="font-bold text-slate-200">Featured Beat Coverage:</p>
                  <p className="text-slate-400 capitalize">{selectedAuthor.featuredBeats.join(', ')}</p>
                </div>
                <button
                  onClick={() => setSelectedAuthor(null)}
                  className="w-full bg-red-600 hover:bg-red-500 font-bold text-xs py-2 rounded-lg text-white"
                >
                  Close Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Photo Gallery
  if (category === 'gallery') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="border-b border-slate-800 pb-6">
            <span className="text-[10px] bg-red-600 text-white font-black px-2.5 py-1 rounded uppercase tracking-widest inline-block mb-2">
              VISUAL JOURNALISM
            </span>
            <h1 className="text-3xl font-black text-white">Photo Gallery & Visual Albums</h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1">
              High-definition photojournalism capturing milestone events across sports, politics, technology, and cultural festivals in Kenya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {GALLERY_ALBUMS.map((album) => (
              <div
                key={album.id}
                onClick={() => setActiveAlbum(album)}
                className="group cursor-pointer bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-red-500/50 transition shadow-2xl space-y-4 p-4"
              >
                <div className="relative h-64 overflow-hidden rounded-xl">
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 text-white font-bold text-[10px] px-2.5 py-1 rounded border border-slate-800">
                    {album.images.length} PHOTOS
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-lg text-white group-hover:text-red-400 transition">
                    {album.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{album.description}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800">
                    <span>Photo by {album.photographer}</span>
                    <span>{album.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active Album Lightbox */}
          {activeAlbum && (
            <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-6 relative text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setActiveAlbum(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg"
                >
                  ✕
                </button>
                <h2 className="text-xl font-black">{activeAlbum.title}</h2>
                <p className="text-xs text-slate-400">{activeAlbum.description}</p>

                <div className="space-y-6">
                  {activeAlbum.images.map((img, idx) => (
                    <div key={idx} className="space-y-2 border-b border-slate-800 pb-4">
                      <img src={img.url} alt={img.caption} className="w-full h-72 object-cover rounded-xl" />
                      <p className="text-xs text-slate-300 italic font-mono">Photo {idx + 1}: {img.caption}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render About Us Page
  if (category === 'about') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="border-b border-slate-800 pb-6 text-center space-y-2">
            <span className="text-[10px] bg-red-600 text-white font-black px-2.5 py-1 rounded uppercase tracking-widest inline-block">
              ABOUT KNEWS254
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white">Kenya's Premier Digital Media House</h1>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Built on fast, independent, verified journalism across all 47 counties, East Africa, and global diaspora networks.
            </p>
          </div>

          {/* Founder & Chairman Spotlight Profile: Kelly Muthomi Kinoti */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/40 border-2 border-red-600/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-mono font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest shadow-md">
              FOUNDER & CHAIRMAN SPOTLIGHT
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pt-2">
              <div className="relative shrink-0 w-48 sm:w-56 shadow-2xl rounded-2xl overflow-hidden border-2 border-emerald-500/50">
                <KmkLogo variant="card" showName={false} className="w-full bg-white p-3" />
                <span className="absolute bottom-2 right-2 bg-emerald-500 text-slate-950 font-black text-[9px] font-mono px-2 py-0.5 rounded-full border border-slate-950 shadow-md">
                  SUPER ADMIN
                </span>
              </div>

              <div className="space-y-3 text-center md:text-left flex-1">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-serif">
                    Kelly Muthomi Kinoti
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-red-400 mt-0.5">
                    Creator, Chairman & Super Administrator • Knews254 Media Group
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">
                    Nairobi, Kenya • Educator • Lead Full-Stack Architect & Data Researcher
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                  <span className="bg-slate-950 border border-slate-800 text-slate-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg">
                    Mathematics & Business Education (Moi University)
                  </span>
                  <span className="bg-slate-950 border border-slate-800 text-emerald-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg">
                    Full-Stack Web Engineering
                  </span>
                  <span className="bg-slate-950 border border-slate-800 text-amber-400 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg">
                    Quantitative Data Analytics
                  </span>
                </div>
              </div>
            </div>

            {/* Narrative About Me (Not a resume) */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <h3 className="text-base font-black text-white border-b border-slate-800/80 pb-2.5 font-serif flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-500" /> About the Founder
              </h3>
              <p>
                <strong className="text-white">Kelly Muthomi Kinoti</strong> is a forward-thinking educator, software developer, and analytical researcher dedicated to bridging technology, educational empowerment, and digital transformation across Kenya and East Africa. As the founder and Chairman of <strong className="text-red-400">Knews254</strong>, Kelly conceptualized and built this enterprise media ecosystem to provide citizens with fast, verified, and unbiased news across all 47 counties.
              </p>
              <p>
                Holding a Bachelor of Arts in Education (Business Studies & Mathematics) from Moi University, Kelly combines over six years of educational leadership with deep expertise in software engineering and data analytics. His background spans full-stack software development, database design, REST API architecture, statistical modeling (SPSS, SAS, STATA), and AI-assisted application building.
              </p>
              <p>
                Through Knews254 and independent technical ventures such as <strong className="text-slate-200">StyledKid</strong> and <strong className="text-slate-200">WildLens Adventure</strong>, Kelly continues to champion digital literacy, data-driven journalism, and cutting-edge web infrastructure, shaping the future of digital media and technology integration in East Africa.
              </p>

              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
                <div className="flex flex-wrap items-center gap-4">
                  <span>Email: <strong className="text-slate-200">kellymuthomi22@gmail.com</strong></span>
                  <span>Direct: <strong className="text-slate-200">+254 708 220 323</strong></span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://kelly-muthomi-kinoti.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs font-sans inline-flex items-center gap-1.5 transition shadow-lg"
                  >
                    <Globe className="w-3.5 h-3.5" /> Official Portfolio <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://styledkid.co.ke" target="_blank" rel="noreferrer" className="text-red-400 hover:underline flex items-center gap-1">
                    StyledKid <ExternalLink className="w-3 h-3" />
                  </a>
                  <span>•</span>
                  <a href="https://wildlensadventure.com" target="_blank" rel="noreferrer" className="text-red-400 hover:underline flex items-center gap-1">
                    WildLens Adventure <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center space-y-2">
              <Award className="w-8 h-8 text-red-500 mx-auto" />
              <h3 className="font-extrabold text-sm text-white">47 County Bureaus</h3>
              <p className="text-xs text-slate-400">Direct correspondents on the ground across every county.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
              <h3 className="font-extrabold text-sm text-white">Forensic Verification</h3>
              <p className="text-xs text-slate-400">Dedicated Knews254 Verify unit combating viral misinformation.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="font-extrabold text-sm text-white">AI &amp; Supabase Innovation</h3>
              <p className="text-xs text-slate-400">Integrated server-side Gemini AI &amp; Supabase Cloud Storage for verified news media.</p>
            </div>
          </div>

          {/* Dynamic Editorial Board & Authors Directory */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] bg-red-600/90 text-white font-black px-2.5 py-0.5 rounded uppercase tracking-widest inline-block mb-1">
                  KNEWS254 EDITORIAL TEAM
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white font-serif">
                  Journalists, Editors &amp; Correspondents
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Our team of dedicated reporters across East Africa. Staff can edit their profile data and images in the CMS.
                </p>
              </div>

              <button
                onClick={() => onSelectCategory('cms' as NewsCategory)}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition inline-flex items-center gap-2 cursor-pointer shrink-0"
              >
                <UserCheck className="w-4 h-4" /> Edit Profile &amp; Upload Images
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {authorsList.map((author) => (
                <div
                  key={author.id}
                  onClick={() => setSelectedAuthor(author)}
                  className="bg-slate-950/80 border border-slate-800 hover:border-red-500/60 p-4 rounded-2xl transition cursor-pointer flex items-start gap-4 group"
                >
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-700 group-hover:border-red-500"
                  />
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-extrabold text-sm text-white truncate group-hover:text-red-400">{author.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                        {author.articlesCount} Articles
                      </span>
                    </div>
                    <p className="text-[11px] text-red-400 font-bold truncate">{author.role}</p>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{author.bio}</p>

                    {author.website && (
                      <a
                        href={author.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[11px] text-sky-400 font-mono font-bold hover:underline pt-1"
                      >
                        <Globe className="w-3 h-3" /> Portfolio <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4 leading-relaxed text-sm text-slate-300">
            <h2 className="text-xl font-bold text-white">Our Editorial Mission</h2>
            <p>
              Founded in Nairobi, Knews254 was created to serve the modern East African reader with uncompromising integrity, speed, and analytical depth. We operate free from political or commercial bias, upholding strict editorial independence.
            </p>
            <p>
              Our newsroom leverages cutting-edge web infrastructure, real-time data visualizers, and interactive civic tools to empower citizens ahead of the 2027 General Election and beyond.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Render Contact Us Page
  if (category === 'contact') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="border-b border-slate-800 pb-6 text-center space-y-2">
            <span className="text-[10px] bg-red-600 text-white font-black px-2.5 py-1 rounded uppercase tracking-widest inline-block">
              GET IN TOUCH
            </span>
            <h1 className="text-3xl font-black text-white">Contact the Knews254 Editorial Desk</h1>
            <p className="text-slate-400 text-sm">Have a breaking news tip, press release, or inquiry for our newsroom?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <MapPin className="w-5 h-5 text-red-500" />
              <h3 className="font-extrabold text-sm text-white">Nairobi Headquarters</h3>
              <p className="text-xs text-slate-400">Knews254 Media Towers, Kimathi Street, Nairobi CBD.</p>
            </div>
            
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 space-y-2.5 shadow-lg relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span className="bg-emerald-950 text-emerald-400 font-mono text-[9px] font-extrabold px-2 py-0.5 rounded border border-emerald-800">
                  24/7 DIRECT DESK
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Call / WhatsApp Newsroom</h3>
                <p className="text-xs text-slate-400 mt-0.5">Click below to open direct chat with our editorial team</p>
              </div>
              <a
                href="https://wa.me/254711837011?text=Hello%20Knews254%20Newsroom,%20I%20have%20a%20breaking%20news%20tip/inquiry:"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 px-3 rounded-xl transition flex items-center justify-center gap-2 shadow-md"
              >
                Open WhatsApp Chat
              </a>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <Mail className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-sm text-white">Official Email Address</h3>
              <a href="mailto:knews254ke@gmail.com" className="text-xs text-amber-400 hover:underline font-bold block">
                knews254ke@gmail.com
              </a>
              <p className="text-[11px] text-slate-500">24/7 Editorial Inbox &amp; Official Press Desk</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            {contactSubmitted ? (
              <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 p-6 rounded-xl text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <h3 className="font-bold text-base">Message Sent Successfully!</h3>
                <p className="text-xs text-emerald-400">Our duty editor has received your dispatch and will respond promptly.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactData.name}
                      onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                      placeholder="e.g., Jane Wanjiru"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      placeholder="jane@example.co.ke"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Subject / Beat</label>
                  <input
                    type="text"
                    required
                    value={contactData.subject}
                    onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                    placeholder="e.g., News Tip regarding County Allocations"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Message Details</label>
                  <textarea
                    required
                    rows={4}
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    placeholder="Provide relevant facts, locations, and context..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-6 py-2.5 rounded-lg transition shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  Submit Dispatch
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render Advertise Page
  if (category === 'advertise') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="border-b border-slate-800 pb-6 text-center space-y-2">
            <span className="text-[10px] bg-red-600 text-white font-black px-2.5 py-1 rounded uppercase tracking-widest inline-block">
              ADVERTISE & SPONSORSHIPS
            </span>
            <h1 className="text-3xl font-black text-white">Reach 4.2 Million Monthly Readers Across Kenya</h1>
            <p className="text-slate-400 text-sm">Target high-intent audiences across business, tech, politics, and 47 county hubs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
              <h3 className="font-extrabold text-base text-white">Header Leaderboard</h3>
              <p className="text-2xl font-black text-emerald-400">Ksh 45,000 <span className="text-xs text-slate-500 font-normal">/ day</span></p>
              <p className="text-xs text-slate-400">High-visibility top banner (728x90 & 320x100 mobile).</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3 border-red-500/50">
              <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">POPULAR</span>
              <h3 className="font-extrabold text-base text-white">Sponsored Article & Newsletter</h3>
              <p className="text-2xl font-black text-red-400">Ksh 85,000 <span className="text-xs text-slate-500 font-normal">/ campaign</span></p>
              <p className="text-xs text-slate-400">Permanent custom article with newsletter distribution to 120,000 subscribers.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
              <h3 className="font-extrabold text-base text-white">In-Feed Sidebar MPU</h3>
              <p className="text-2xl font-black text-emerald-400">Ksh 30,000 <span className="text-xs text-slate-500 font-normal">/ day</span></p>
              <p className="text-xs text-slate-400">Targeted 300x250 ad placement alongside trending news.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render Careers Page with Interactive Application Modal
  if (category === 'careers') {
    return <CareersPage />;
  }

  // Render Reviews & Ratings Page
  if (category === 'reviews') {
    return <ReviewsPage />;
  }

  // Render How We Review Page
  if (category === 'how-we-review') {
    return <HowWeReviewPage />;
  }

  // Render FAQ Centre Page
  if (category === 'faq') {
    return <FaqCentrePage />;
  }

  // Render Help & Support Page
  if (category === 'help-center') {
    return <HelpSupportPage />;
  }

  // Render Policy Pages (Editorial, Ethics, AI, Fact-Check, Anonymous Sources, Privacy, Terms, Corrections, etc.)
  const getPolicyContent = () => {
    switch (category) {
      case 'editorial-policy':
        return {
          title: 'Editorial Standards & Code of Practice',
          updated: 'Updated July 2026 • Verified by Knews254 Standards Board',
          intro: `Knews254 operates under absolute editorial independence. We serve the East African public with accurate, non-partisan, and accountable journalism across all 47 counties.`,
          sections: [
            {
              heading: '1. Truthfulness & Dual Verification',
              content: 'Every factual assertion published by Knews254 must be corroborated by at least two independent primary sources. We do not publish unverified social media rumors or uncredited third-party claims without explicit caveats and secondary verification.'
            },
            {
              heading: '2. Independence & Conflicts of Interest',
              content: 'Journalists and editors are strictly prohibited from accepting financial gifts, sponsored trips, or political favors. All editorial content is firewalled from commercial and advertising departments.'
            },
            {
              heading: '3. Fairness & Right of Reply',
              content: 'Individuals or institutions subject to critical investigative findings are provided reasonable time (minimum 24 hours) to offer a formal right of reply prior to publication.'
            }
          ]
        };
      case 'ethics-policy':
        return {
          title: 'Journalistic Code of Ethics',
          updated: 'Updated July 2026 • Media Council of Kenya Compliant',
          intro: `Our ethical code governs every reporter, photographer, and editor operating under the Knews254 brand.`,
          sections: [
            {
              heading: '1. Minimizing Harm & Vulnerable Groups',
              content: 'We exercise extreme care when reporting on victims of crime, children, and traumatized individuals. Names and identities of minors involved in legal proceedings are protected by default.'
            },
            {
              heading: '2. Integrity of Visual Media',
              content: 'Photographs and video footage are never digitally altered or manipulated to mislead viewers. Staged photojournalism is grounds for immediate editorial termination.'
            },
            {
              heading: '3. Plagiarism & Attribution',
              content: 'Knews254 enforces zero tolerance for plagiarism. Direct quotes, data points, and investigative leads from peer publications must be clearly cited.'
            }
          ]
        };
      case 'ai-policy':
        return {
          title: 'Responsible AI & Newsroom Tech Policy',
          updated: 'Updated July 2026 • AI Safety & Journalism Governance',
          intro: `Knews254 utilizes Artificial Intelligence (including Gemini models) solely to assist human journalists, optimize workflow speed, and enhance accessibility.`,
          sections: [
            {
              heading: '1. Human-in-the-Loop Oversight',
              content: 'AI models NEVER write or publish articles autonomously. Every piece of AI-assisted text, summary, or audio transcription undergoes rigorous review and approval by a senior editor before going live.'
            },
            {
              heading: '2. Prohibition of Synthetic Media Fraud',
              content: 'Knews254 strictly forbids deepfakes or generated synthetic images in news coverage. Any AI-generated conceptual graphic or chart is explicitly labeled with clear disclosure tags.'
            },
            {
              heading: '3. Data Privacy & Model Safety',
              content: 'Reader data, private tips, and whistleblower communications are completely excluded from public AI training models.'
            }
          ]
        };
      case 'factcheck-methodology':
        return {
          title: 'Knews254 Verify Fact-Checking Methodology',
          updated: 'Updated July 2026 • IFCN Standard Alignment',
          intro: `Knews254 Verify is our dedicated forensic fact-checking division combating viral misinformation in East Africa.`,
          sections: [
            {
              heading: '1. Selection of Claims',
              content: 'We prioritize claims made by public officials, political figures, viral social media accounts, and influential entities that impact public health, election integrity, or national stability.'
            },
            {
              heading: '2. Evidence Sourcing & Rating System',
              content: 'We cross-reference claims against official gazettes, parliamentary Hansards, satellite imagery, public budgets, and peer-reviewed studies. Claims are rated objectively: TRUE, PARTIALLY TRUE, MISLEADING, UNVERIFIED, or FALSE.'
            },
            {
              heading: '3. Open Methodology & Data Transparency',
              content: 'Every fact-check report provides links to primary datasets and documents used, allowing readers to audit our findings independently.'
            }
          ]
        };
      case 'anonymous-sources':
        return {
          title: 'Anonymous Sources & Whistleblower Policy',
          updated: 'Updated July 2026 • Shield Protection Protocol',
          intro: `Anonymous sources are essential for investigative journalism that exposes corruption and abuse of power.`,
          sections: [
            {
              heading: '1. Sourcing Threshold',
              content: 'Anonymity is granted only when the information is vital to the public interest, cannot be obtained through on-the-record channels, and exposing the source puts their safety, employment, or liberty at risk.'
            },
            {
              heading: '2. Executive Editor Approval',
              content: 'No single reporter may grant total anonymity independently. The identity of the source must be disclosed confidentially to the Chief Editor for identity verification.'
            },
            {
              heading: '3. Encrypted Tip Channels',
              content: 'Whistleblowers are encouraged to utilize our secure, end-to-end encrypted dispatch portal or PGP key channels.'
            }
          ]
        };
      case 'transparency-report':
      case 'funding-policy':
        return {
          title: 'Ownership, Funding & Transparency Report',
          updated: 'Updated July 2026 • Annual Disclosure Report',
          intro: `Knews254 Media Group Ltd believes transparency regarding ownership and financial model is vital for public trust.`,
          sections: [
            {
              heading: '1. Corporate Structure & Ownership',
              content: 'Knews254 Media Group Ltd is an independent Kenyan digital media enterprise. We are 100% privately owned with no government shareholding or political party ownership.'
            },
            {
              heading: '2. Revenue Streams',
              content: 'Our operations are funded through digital programmatic advertising, branded content partnerships, institutional research grants, and reader subscriptions.'
            },
            {
              heading: '3. Grant Sourcing Governance',
              content: 'All philanthropic or media development grants are accepted strictly on condition of non-interference with editorial decision-making.'
            }
          ]
        };
      case 'community-guidelines':
        return {
          title: 'Community & Commenting Guidelines',
          updated: 'Updated July 2026 • Citizen Discussion Standards',
          intro: `We encourage vibrant, civil debate across our article comment sections, forums, and live election feeds.`,
          sections: [
            {
              heading: '1. Zero Tolerance for Hate Speech',
              content: 'Comments containing ethnic slurs, incitement to violence, sexism, religious hate speech, or personal harassment are automatically filtered and permanently removed.'
            },
            {
              heading: '2. Commercial Spam & Links',
              content: 'Promotional spam, affiliate links, and automated bot accounts are blocked by our real-time AI moderation engine.'
            },
            {
              heading: '3. Moderation & Appeal Process',
              content: 'Users whose comments are flagged may appeal decisions directly through our moderation desk.'
            }
          ]
        };
      case 'takedown-policy':
        return {
          title: 'Copyright, Takedown & User Content Policy',
          updated: 'Updated July 2026 • Intellectual Property Compliance',
          intro: `Knews254 respects intellectual property rights and adheres to international copyright laws and Kenyan copyright statutes.`,
          sections: [
            {
              heading: '1. Filing a Takedown Request',
              content: 'If you believe your copyrighted work, photography, or trademark has been published without authorization, submit a notice containing proof of ownership to legal@knews254.co.ke.'
            },
            {
              heading: '2. Processing Timeframes',
              content: 'Valid copyright takedown notices are processed within 24 business hours following legal review.'
            }
          ]
        };
      case 'corrections-policy':
        return {
          title: 'Corrections & Transparency Policy',
          updated: 'Updated July 2026 • Accuracy & Accountability',
          intro: `Accuracy is our absolute commitment. When factual errors occur, we correct them swiftly and transparently.`,
          sections: [
            {
              heading: '1. Prominent Corrections Note',
              content: 'When an article is updated to correct a factual error, a clear note detailing what was changed and why is appended to the top or bottom of the article with a precise timestamp.'
            },
            {
              heading: '2. Major vs Minor Clarifications',
              content: 'Minor typographical errors are corrected quietly, while substantive changes to facts, names, or figures are explicitly highlighted in our public corrections log.'
            }
          ]
        };
      case 'privacy-policy':
        return {
          title: 'Privacy Policy & Data Protection',
          updated: 'Updated July 2026 • Kenya Data Protection Act Compliant',
          intro: `We safeguard your personal data with enterprise-grade security standards.`,
          sections: [
            {
              heading: '1. Information We Collect',
              content: 'We collect minimal user information necessary to deliver newsletters, save bookmarks, and provide localized news recommendations.'
            },
            {
              heading: '2. No Data Monetization',
              content: 'We never sell, rent, or trade reader personal data or browsing histories to third-party ad brokers.'
            }
          ]
        };
      case 'cookie-policy':
        return {
          title: 'Cookie & Local Storage Policy',
          updated: 'Updated July 2026',
          intro: `Knews254 uses minimal functional cookies and browser storage to optimize reader experience.`,
          sections: [
            {
              heading: '1. Functional Cookies',
              content: 'Used to store active theme settings, selected county preferences, and language choices.'
            },
            {
              heading: '2. Analytics Cookies',
              content: 'Anonymized performance metrics used strictly to evaluate site traffic and server load.'
            }
          ]
        };
      case 'terms-of-service':
      default:
        return {
          title: 'Terms of Service',
          updated: 'Updated July 2026 • Knews254 Digital Media',
          intro: `Welcome to Knews254. By accessing our platform, website, mobile apps, or API endpoints, you agree to these Terms.`,
          sections: [
            {
              heading: '1. Intellectual Property',
              content: 'All published news stories, graphics, interactive visualizers, and brand marks are copyrighted property of Knews254 Media Group Ltd.'
            },
            {
              heading: '2. Acceptable Sourcing & Fair Use',
              content: 'Brief excerpts with direct hyperlinked attribution to Knews254 are permitted for non-commercial commentary and academic research.'
            }
          ]
        };
    }
  };

  const policy = getPolicyContent();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 space-y-8 shadow-2xl">
        <div className="border-b border-slate-800 pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-red-600 text-white font-black px-2.5 py-1 rounded uppercase tracking-widest inline-block">
              OFFICIAL COMPLIANCE & POLICY
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded">
              ISO/IEC 27001
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{policy.title}</h1>
          <p className="text-xs text-slate-400 font-mono">{policy.updated}</p>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-normal bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          {policy.intro}
        </p>

        <div className="space-y-6">
          {policy.sections.map((sec, i) => (
            <div key={i} className="space-y-2 border-b border-slate-800/60 pb-5 last:border-0">
              <h3 className="font-extrabold text-base text-white text-red-400">{sec.heading}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{sec.content}</p>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <span>Knews254 Editorial Governance & Legal Division</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectCategory('contact')}
              className="text-red-400 font-bold hover:underline flex items-center gap-1"
            >
              Contact Legal Desk
            </button>
            <span>•</span>
            <button
              onClick={() => onSelectCategory('editorial-policy')}
              className="text-slate-300 font-bold hover:underline"
            >
              All Editorial Standards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* CAREERS PAGE SUB-COMPONENT WITH LIVE APPLICATION FORM                     */
/* -------------------------------------------------------------------------- */
const CareersPage: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [applied, setApplied] = useState(false);
  const [appForm, setAppForm] = useState({ name: '', email: '', phone: '', portfolio: '', cover: '', cvName: '' });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-6 text-center space-y-2">
          <span className="text-[10px] bg-red-600 text-white font-black px-2.5 py-1 rounded uppercase tracking-widest inline-block">
            CAREERS AT KNEWS254
          </span>
          <h1 className="text-3xl font-black text-white">Join Our Independent Newsroom</h1>
          <p className="text-slate-400 text-sm">We are expanding our team of investigative journalists, video producers, and data engineers.</p>
        </div>

        <div className="space-y-4">
          {JOB_LISTINGS.map((job) => (
            <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-extrabold text-lg text-white">{job.title}</h3>
                <span className="bg-red-950 text-red-400 font-bold text-xs px-2.5 py-1 rounded border border-red-800">
                  {job.type}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">{job.department} • {job.location}</p>
              <p className="text-xs text-slate-300">{job.description}</p>
              <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-200 mb-1">Key Requirements:</p>
                  <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                    {job.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => { setSelectedJob(job); setApplied(false); }}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2 rounded-lg transition shrink-0"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Application Modal */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 relative text-slate-100 shadow-2xl">
              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>

              {applied ? (
                <div className="text-center space-y-3 py-6">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <h3 className="text-xl font-black text-white">Application Received!</h3>
                  <p className="text-xs text-slate-300">
                    Thank you for applying for <strong>{selectedJob.title}</strong>. Your reference ID is <code className="bg-slate-950 px-2 py-0.5 rounded text-red-400">KN254-APP-{(Math.random()*10000).toFixed(0)}</code>.
                  </p>
                  <p className="text-[11px] text-slate-400">Our HR Recruitment desk will review your submission and contact shortlisted candidates via email.</p>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="bg-slate-800 text-white font-bold text-xs px-5 py-2 rounded-lg"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-[10px] text-red-400 font-mono uppercase">HR Application Portal</span>
                    <h2 className="text-lg font-black">{selectedJob.title}</h2>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={appForm.name}
                      onChange={e => setAppForm({ ...appForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      placeholder="e.g. David Mwangi"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={appForm.email}
                        onChange={e => setAppForm({ ...appForm, email: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        placeholder="david@example.co.ke"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Phone</label>
                      <input
                        type="tel"
                        required
                        value={appForm.phone}
                        onChange={e => setAppForm({ ...appForm, phone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                        placeholder="+254 700 000000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Attach CV / Resume (PDF, DOCX)</label>
                    <input
                      type="file"
                      required
                      onChange={e => setAppForm({ ...appForm, cvName: e.target.files?.[0]?.name || '' })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-400 file:bg-slate-800 file:border-0 file:text-white file:text-xs file:px-2 file:py-1 file:rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Portfolio / Work Links</label>
                    <input
                      type="url"
                      value={appForm.portfolio}
                      onChange={e => setAppForm({ ...appForm, portfolio: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Cover Note</label>
                    <textarea
                      rows={3}
                      required
                      value={appForm.cover}
                      onChange={e => setAppForm({ ...appForm, cover: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      placeholder="Briefly state why you are a good fit..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-500 font-bold text-xs py-2.5 rounded-lg text-white transition"
                  >
                    Submit Job Application
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* REVIEWS & TESTIMONIALS PAGE SUB-COMPONENT                                 */
/* -------------------------------------------------------------------------- */
const ReviewsPage: React.FC = () => {
  const [reviewsList, setReviewsList] = useState([
    { id: 'r1', author: 'Dr. Joseph Kimani', role: 'Subscriber & Policy Researcher', rating: 5, date: 'Yesterday', category: 'Website Experience', comment: 'Knews254 provides the most accurate county budget breakdowns and election tracking in Kenya. Highly recommended.', helpful: 42, verified: true },
    { id: 'r2', author: 'Sarah Otieno', role: 'Nairobi Business Executive', rating: 5, date: '3 days ago', category: 'Newsletters', comment: 'The daily morning briefing is my go-to news summary before heading into meetings. Clean, objective, and fast.', helpful: 28, verified: true },
    { id: 'r3', author: 'Mark Mwangi', role: 'Tech Founder', rating: 4, date: '1 week ago', category: 'Mobile App', comment: 'Great offline reading feature and real-time push alerts on central bank interest rates.', helpful: 19, verified: false },
  ]);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', role: '', rating: 5, category: 'Website Experience', comment: '' });
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewsList([
      {
        id: `r-${Date.now()}`,
        author: newReview.name,
        role: newReview.role || 'Reader',
        rating: Number(newReview.rating),
        date: 'Just now',
        category: newReview.category,
        comment: newReview.comment,
        helpful: 0,
        verified: true,
      },
      ...reviewsList,
    ]);
    setSubmittedMessage(true);
    setTimeout(() => {
      setShowReviewModal(false);
      setSubmittedMessage(false);
      setNewReview({ name: '', role: '', rating: 5, category: 'Website Experience', comment: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-6 text-center space-y-2">
          <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2.5 py-1 rounded uppercase tracking-widest inline-block">
            READER & PARTNER REVIEWS
          </span>
          <h1 className="text-3xl font-black text-white">Community Reviews & Trust Score</h1>
          <p className="text-slate-400 text-sm">Read verified feedback from subscribers, advertisers, researchers, and daily readers.</p>
        </div>

        {/* Rating Score Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-center md:text-left space-y-1">
            <span className="text-4xl font-black text-amber-400">4.9 / 5.0</span>
            <div className="flex items-center justify-center md:justify-start text-amber-400 text-sm">
              ★★★★★
            </div>
            <p className="text-xs text-slate-400">Based on 1,480 verified reader & partner reviews</p>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-md"
          >
            Submit a Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviewsList.map((rev) => (
            <div key={rev.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                    {rev.author}
                    {rev.verified && <span className="bg-emerald-950 text-emerald-400 text-[10px] px-2 py-0.5 rounded border border-emerald-800">Verified Reader</span>}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">{rev.role} • {rev.category}</p>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 text-sm">{'★'.repeat(rev.rating)}</span>
                  <p className="text-[10px] text-slate-500 font-mono">{rev.date}</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">"{rev.comment}"</p>
            </div>
          ))}
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 relative text-slate-100 shadow-2xl">
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>

              {submittedMessage ? (
                <div className="text-center space-y-2 py-4">
                  <p className="text-emerald-400 font-bold text-lg">✓ Review Submitted!</p>
                  <p className="text-xs text-slate-400">Thank you for sharing your feedback with the Knews254 newsroom.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <h3 className="text-base font-black border-b border-slate-800 pb-2">Submit Your Review</h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={newReview.name}
                      onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      placeholder="e.g. Grace Wanjiku"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Occupation / Role</label>
                    <input
                      type="text"
                      value={newReview.role}
                      onChange={e => setNewReview({ ...newReview, role: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      placeholder="e.g. Reader, Advertiser, Journalist"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Star Rating</label>
                    <select
                      value={newReview.rating}
                      onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-amber-400 font-bold"
                    >
                      <option value={5}>★★★★★ (5/5 Excellent)</option>
                      <option value={4}>★★★★☆ (4/5 Very Good)</option>
                      <option value={3}>★★★☆☆ (3/5 Average)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Review Comments</label>
                    <textarea
                      rows={3}
                      required
                      value={newReview.comment}
                      onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      placeholder="Share your experience reading Knews254..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 text-slate-950 font-extrabold text-xs py-2.5 rounded-lg transition"
                  >
                    Post Review
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* HOW WE REVIEW PRODUCTS, SERVICES AND CLAIMS                               */
/* -------------------------------------------------------------------------- */
const HowWeReviewPage: React.FC = () => (
  <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
    <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-[10px] bg-red-600 text-white font-black px-2.5 py-1 rounded uppercase tracking-widest inline-block mb-2">
          EDITORIAL METHODOLOGY
        </span>
        <h1 className="text-2xl font-black text-white">How We Review Products, Services & Claims</h1>
        <p className="text-slate-400 text-xs">Uncompromising Independence • Hands-on Testing • No Purchased Favorable Coverage</p>
      </div>

      <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
        <h3 className="font-extrabold text-sm text-white">1. Independence & Zero Sponsored Favoritism</h3>
        <p>Knews254 produces rigorous product tests, financial tool reviews, and claim verification reports. We never accept payment, free gadgets, or political considerations in exchange for favorable reviews.</p>

        <h3 className="font-extrabold text-sm text-white">2. Testing Standards</h3>
        <p>Every product or platform reviewed is tested independently by specialized journalists and technical experts over a minimum 14-day evaluation period.</p>

        <h3 className="font-extrabold text-sm text-white">3. Separation from Commercial Ads</h3>
        <p>Editorial review teams operate completely firewalled from advertising sales. Advertisers have zero advance sight or veto power over review scores or publication dates.</p>
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* FAQ CENTRE SUB-COMPONENT                                                   */
/* -------------------------------------------------------------------------- */
const FaqCentrePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    { q: 'How do I submit a confidential news tip or document?', a: 'You can submit tips via our encrypted whistleblower portal or email tips@knews254.co.ke. All tips are reviewed by senior editors under strict whistleblower protection protocols.' },
    { q: 'Is Knews254 free to read?', a: 'Yes! Knews254 provides free access to breaking news, election trackers, and county coverage. Premium features include ad-free viewing and specialized investigative data downloads.' },
    { q: 'How does Knews254 verify election results?', a: 'Our Election Intelligence Centre aggregates official Form 34A and 34B data directly from the IEBC, verified by on-the-ground correspondents across all 47 counties.' },
    { q: 'How do I advertise or request a media kit?', a: 'Visit our Advertise page or contact advertise@knews254.co.ke to receive our complete rate card and audience demographics report.' },
  ];

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(searchTerm.toLowerCase()) || f.a.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2 border-b border-slate-800 pb-6">
          <span className="text-[10px] bg-red-600 text-white font-black px-2.5 py-1 rounded uppercase tracking-widest inline-block">
            HELP & KNOWLEDGE BASE
          </span>
          <h1 className="text-3xl font-black text-white">Frequently Asked Questions</h1>
          <p className="text-slate-400 text-sm">Find instant answers regarding subscriptions, news tips, elections, and app usage.</p>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search questions or keywords..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-red-500"
        />

        <div className="space-y-3">
          {filteredFaqs.map((faq, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full text-left p-4 font-bold text-xs text-white flex items-center justify-between hover:bg-slate-800/50 transition"
              >
                <span>{faq.q}</span>
                <span>{openIdx === i ? '−' : '+'}</span>
              </button>
              {openIdx === i && (
                <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* HELP & SUPPORT CENTRE SUB-COMPONENT                                        */
/* -------------------------------------------------------------------------- */
const HelpSupportPage: React.FC = () => {
  const [ticketSent, setTicketSent] = useState(false);
  const [ticketForm, setTicketForm] = useState({ name: '', email: '', category: 'Account Issue', description: '' });

  const handleTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2 border-b border-slate-800 pb-6">
          <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2.5 py-1 rounded uppercase tracking-widest inline-block">
            24/7 SUPPORT DESK
          </span>
          <h1 className="text-3xl font-black text-white">Help & Support Centre</h1>
          <p className="text-slate-400 text-sm">Need help with your account, newsletter delivery, or app troubleshooting?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="font-extrabold text-base text-white">Common Technical Guides</h3>
            <ul className="text-xs text-slate-400 space-y-2">
              <li className="hover:text-red-400 cursor-pointer">→ Resetting your reader account password</li>
              <li className="hover:text-red-400 cursor-pointer">→ Managing county push notification alerts</li>
              <li className="hover:text-red-400 cursor-pointer">→ Subscribing & unsubscribing from newsletters</li>
              <li className="hover:text-red-400 cursor-pointer">→ Data privacy & account deletion requests</li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            {ticketSent ? (
              <div className="text-center space-y-2 py-6">
                <p className="text-emerald-400 font-bold text-base">✓ Support Ticket Submitted</p>
                <p className="text-xs text-slate-400">Ticket ID: <code className="bg-slate-950 px-2 py-0.5 text-white">#TKT-{(Math.random()*10000).toFixed(0)}</code></p>
                <p className="text-[11px] text-slate-500">Our technical support agent will respond via email within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleTicket} className="space-y-3">
                <h3 className="font-extrabold text-sm text-white">Submit Support Request</h3>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={ticketForm.name}
                    onChange={e => setTicketForm({ ...ticketForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={ticketForm.email}
                    onChange={e => setTicketForm({ ...ticketForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Issue Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={e => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option>Account Access</option>
                    <option>Newsletter Delivery</option>
                    <option>Mobile App Bug</option>
                    <option>Privacy / Data Request</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Describe Problem</label>
                  <textarea
                    rows={3}
                    required
                    value={ticketForm.description}
                    onChange={e => setTicketForm({ ...ticketForm, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 font-extrabold text-xs py-2 rounded-lg text-white"
                >
                  Submit Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

