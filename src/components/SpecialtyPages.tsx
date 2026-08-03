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
import { supabase } from '../lib/supabase';

interface SpecialtyPagesProps {
  category: NewsCategory;
  onSelectCategory: (cat: NewsCategory) => void;
}

export const SpecialtyPages: React.FC<SpecialtyPagesProps> = ({
  category,
  onSelectCategory,
}) => {
  // Dynamic Authors list synced with localStorage (filtering removed non-staff)
  const [authorsList, setAuthorsList] = useState<Author[]>(() => {
    const saved = localStorage.getItem('knews254_authors_list');
    if (saved) {
      try {
        const parsed: Author[] = JSON.parse(saved);
        const filtered = parsed.filter(a => !['David Ochieng', 'Wanjiru Mwangi', 'Kelvin Mutua', 'Brian Otieno', 'Sarah Kimani'].includes(a.name));
        return filtered.length > 0 ? filtered : AUTHORS_LIST;
      } catch (e) { /* fallback */ }
    }
    return AUTHORS_LIST;
  });

  // Re-sync if localStorage changes
  React.useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('knews254_authors_list');
      if (saved) {
        try {
          const parsed: Author[] = JSON.parse(saved);
          const filtered = parsed.filter(a => !['David Ochieng', 'Wanjiru Mwangi', 'Kelvin Mutua', 'Brian Otieno', 'Sarah Kimani'].includes(a.name));
          setAuthorsList(filtered.length > 0 ? filtered : AUTHORS_LIST);
        } catch (e) {}
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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email || !contactData.message) return;

    if (supabase) {
      try {
        await supabase.from('contact_messages').insert({
          name: contactData.name,
          email: contactData.email,
          subject: contactData.subject || 'General Inquiry',
          message: contactData.message,
          status: 'unread'
        });
      } catch (err) {
        console.warn('Supabase contact message error:', err);
      }
    }

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactData.name,
          email: contactData.email,
          subject: contactData.subject || 'Website General Contact',
          message: contactData.message,
          type: 'General Contact'
        })
      });
    } catch (err) {
      console.warn('Backend contact notice:', err);
    }

    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactData({ name: '', email: '', subject: '', message: '' });
    }, 6000);
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
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Header Banner */}
          <div className="border-b border-slate-800 pb-8 text-center space-y-3 relative overflow-hidden">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 text-white text-[10px] font-mono font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
              <Sparkles className="w-3.5 h-3.5" /> ABOUT KNEWS254 MEDIA GROUP
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-serif">
              Kenya's Premier Digital News &amp; Data Enterprise
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Empowering 47 counties with uncompromised, verified, fast-breaking journalism, live electoral tracking, and deep analytical reporting.
            </p>

            {/* Live Metrics Counter */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-3xl mx-auto">
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl text-center space-y-0.5 shadow-md">
                <span className="text-xl font-black text-red-500 font-mono">47 / 47</span>
                <p className="text-[11px] font-bold text-slate-300">County Bureaus</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl text-center space-y-0.5 shadow-md">
                <span className="text-xl font-black text-emerald-400 font-mono">24 / 7</span>
                <p className="text-[11px] font-bold text-slate-300">Live Newsroom Desk</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl text-center space-y-0.5 shadow-md">
                <span className="text-xl font-black text-amber-400 font-mono">100%</span>
                <p className="text-[11px] font-bold text-slate-300">Editorial Independence</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl text-center space-y-0.5 shadow-md">
                <span className="text-xl font-black text-sky-400 font-mono">Verified</span>
                <p className="text-[11px] font-bold text-slate-300">Infotrak & Media Feeds</p>
              </div>
            </div>
          </div>

          {/* Founder & Chairman Spotlight Profile: Kelly Muthomi Kinoti */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/40 border-2 border-red-600/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-mono font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest shadow-md">
              FOUNDER &amp; CHAIRMAN SPOTLIGHT
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pt-2">
              <div className="relative shrink-0 w-48 sm:w-56 shadow-2xl rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-white">
                <KmkLogo variant="card" showName={false} className="w-full bg-white p-4" />
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
                    Creator, Chairman &amp; Super Administrator • Knews254 Media Group
                  </p>
                  <p className="text-[11px] text-slate-300 font-mono mt-1">
                    Nairobi, Kenya • Educator • Lead Full-Stack Architect &amp; Data Researcher
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                  <span className="bg-slate-950 border border-slate-800 text-slate-200 text-[10px] font-mono font-bold px-3 py-1 rounded-lg">
                    Mathematics &amp; Business Education (Moi University)
                  </span>
                  <span className="bg-slate-950 border border-slate-800 text-emerald-400 text-[10px] font-mono font-bold px-3 py-1 rounded-lg">
                    Full-Stack Web Engineering
                  </span>
                  <span className="bg-slate-950 border border-slate-800 text-amber-400 text-[10px] font-mono font-bold px-3 py-1 rounded-lg">
                    Quantitative Data Analytics
                  </span>
                </div>

                {/* Founder Vision Callout Quote */}
                <div className="bg-slate-950/90 border-l-4 border-red-500 p-3 rounded-r-xl text-xs text-slate-300 italic">
                  "Our vision for Knews254 is to build a sovereign digital newsroom that pairs grassroots investigative journalism across all 47 counties with cutting-edge analytical speed and unyielding truth."
                </div>
              </div>
            </div>

            {/* Detailed Narrative Biography */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <h3 className="text-base font-black text-white border-b border-slate-800/80 pb-2.5 font-serif flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-500" /> Executive Biography &amp; Technical Vision
              </h3>
              <p>
                <strong className="text-white">Kelly Muthomi Kinoti</strong> is a forward-thinking educator, software developer, and analytical researcher dedicated to bridging technology, educational empowerment, and digital transformation across Kenya and East Africa. As the founder and Chairman of <strong className="text-red-400">Knews254</strong>, Kelly conceptualized and built this enterprise media ecosystem to provide citizens with fast, verified, and unbiased news across all 47 counties.
              </p>
              <p>
                Holding a Bachelor of Arts in Education (Business Studies &amp; Mathematics) from Moi University, Kelly combines over six years of educational leadership with deep expertise in software engineering and data analytics. His background spans full-stack software development, database design, REST API architecture, statistical modeling (SPSS, SAS, STATA), and AI-assisted application building.
              </p>
              <p>
                Through Knews254 and independent technical ventures such as <strong className="text-slate-200">StyledKid</strong> and <strong className="text-slate-200">WildLens Adventure</strong>, Kelly continues to champion digital literacy, data-driven journalism, and cutting-edge web infrastructure, shaping the future of digital media and technology integration in East Africa.
              </p>

              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-300">
                <div className="flex flex-wrap items-center gap-4">
                  <span>Email: <strong className="text-slate-100">kellymuthomi22@gmail.com</strong></span>
                  <span>Direct Desk: <strong className="text-slate-100">+254 708 220 323</strong></span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://kelly-muthomi-kinoti.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs font-sans inline-flex items-center gap-1.5 transition shadow-lg"
                  >
                    <Globe className="w-3.5 h-3.5" /> Official Portfolio <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://styledkid.co.ke" target="_blank" rel="noreferrer" className="text-red-400 hover:underline flex items-center gap-1 font-bold">
                    StyledKid <ExternalLink className="w-3 h-3" />
                  </a>
                  <span>•</span>
                  <a href="https://wildlensadventure.com" target="_blank" rel="noreferrer" className="text-red-400 hover:underline flex items-center gap-1 font-bold">
                    WildLens Adventure <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Core Institutional Pillars */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-white font-serif flex items-center gap-2">
              <Award className="w-5 h-5 text-red-500" /> Four Pillars of Knews254 Media
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-red-500/50 transition">
                <MapPin className="w-7 h-7 text-red-500" />
                <h3 className="font-extrabold text-sm text-white">47 County Bureaus</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Direct correspondents and citizen reporters active in all 47 counties of Kenya.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-emerald-500/50 transition">
                <ShieldCheck className="w-7 h-7 text-emerald-500" />
                <h3 className="font-extrabold text-sm text-white">Forensic Verification</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Dedicated Knews254 Verify unit auditing claims and debunking viral misinformation.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-sky-500/50 transition">
                <Users className="w-7 h-7 text-sky-400" />
                <h3 className="font-extrabold text-sm text-white">Media Syndication</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Cross-referenced reports with Citizen TV, NTV Kenya, TV47, and Infotrak opinion polls.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-amber-500/50 transition">
                <Sparkles className="w-7 h-7 text-amber-500" />
                <h3 className="font-extrabold text-sm text-white">AI &amp; Data Engine</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Server-side Gemini AI summarization and quantitative polls visualizer.</p>
              </div>
            </div>
          </div>

          {/* Dynamic Editorial Board & Authors Directory */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] bg-red-600/90 text-white font-black px-2.5 py-0.5 rounded uppercase tracking-widest inline-block mb-1">
                  KNEWS254 EDITORIAL BOARD
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white font-serif">
                  Verified Newsroom Leadership &amp; Key Staff
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Meet the key journalists and editorial officers driving Knews254.
                </p>
              </div>

              <button
                onClick={() => onSelectCategory('cms' as NewsCategory)}
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition inline-flex items-center gap-2 cursor-pointer shrink-0"
              >
                <UserCheck className="w-4 h-4" /> Editorial CMS Portal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {authorsList.map((author) => (
                <div
                  key={author.id}
                  onClick={() => setSelectedAuthor(author)}
                  className="bg-slate-950/80 border border-slate-800 hover:border-red-500/60 p-4 rounded-2xl transition cursor-pointer flex items-start gap-4 group shadow-md"
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

          {/* Editorial Mission & Code of Integrity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 leading-relaxed text-sm text-slate-300">
              <h2 className="text-xl font-black text-white font-serif flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-500" /> Editorial Charter
              </h2>
              <p>
                Founded in Nairobi, <strong className="text-white">Knews254</strong> operates under a strict code of editorial integrity. We prioritize field reporting from county correspondents and verified public records.
              </p>
              <p>
                Our newsroom remains entirely non-partisan, independent of political influence, and dedicated to upholding accountability for public institutions.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 text-sm text-slate-300">
              <h2 className="text-xl font-black text-white font-serif flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-400" /> Direct Desk &amp; News Tips
              </h2>
              <p className="text-xs text-slate-400">
                Have breaking news, confidential documents, or whistleblower details? Connect with our duty editor directly on WhatsApp or Email.
              </p>
              <div className="space-y-2.5 pt-2">
                <a
                  href="https://wa.me/254711837011?text=Hello%20Knews254%20Newsroom,%20I%20have%20a%20breaking%20news%20tip/inquiry:"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <Phone className="w-4 h-4" /> Open 24/7 WhatsApp Newsroom Chat
                </a>
                <a
                  href="mailto:knews254ke@gmail.com"
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Mail className="w-4 h-4 text-amber-400" /> Email: knews254ke@gmail.com
                </a>
              </div>
            </div>
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

  // Render Sitemap Page
  if (category === 'sitemap') {
    return <SitemapPage onSelectCategory={onSelectCategory} />;
  }

  // Render Policy Pages (Editorial, Ethics, AI, Fact-Check, Anonymous Sources, Privacy, Terms, Corrections, etc.)
  const getPolicyContent = () => {
    switch (category) {
      case 'editorial-policy':
        return {
          title: 'Knews254 Editorial Charter & Standards of Journalism',
          updated: 'Updated August 2026 • Verified by Knews254 Standards Board & Media Council of Kenya',
          intro: `Knews254 operates under absolute editorial independence, constitutional press freedom guarantees (Article 34 of the Constitution of Kenya 2010), and the Media Council of Kenya Code of Conduct. We serve all 47 counties of Kenya and the broader East African region with non-partisan, accurate, and accountable news reporting.`,
          sections: [
            {
              heading: '1. Dual-Source Verification & Fact Integrity',
              content: 'Every factual statement published by Knews254 must be verified by at least two independent primary sources. Field reports from our 47 county correspondents are cross-referenced with official public records, Hansard transcripts, legal filings, and sworn affidavits before publication. Social media posts, unverified viral video clips, or anonymous commentary are never reported as factual without explicit disclaimers and independent secondary confirmation.'
            },
            {
              heading: '2. Non-Partisan Independence & Commercial Firewall',
              content: 'Knews254 is an independent news organization. Our newsroom operates behind a strict firewall separate from commercial advertising, corporate sponsors, and political entities. Editors and reporters are strictly forbidden from accepting financial gifts, sponsored trips, honorariums, or political favors. Commercial advertisers and brand sponsors hold zero advance sight, veto power, or editorial control over any published story.'
            },
            {
              heading: '3. Fairness & Right of Reply Protocol',
              content: 'Whenever Knews254 investigates or reports on allegations involving an individual, corporation, state department, or public official, we adhere to the statutory Right of Reply. Affected parties are provided a fair and reasonable opportunity (minimum 24 hours notice for non-breaking investigative exposes) to respond to specific findings prior to publication. Their responses are published with equal prominence.'
            },
            {
              heading: '4. Devolution & 47 County Financial Oversight',
              content: 'Devolution under Chapter 11 of the Constitution of Kenya is central to our mission. Knews254 prioritizes reporting on County Assembly bills, Public Accounts Committee (PAC) audits, Equitable Share allocations by the National Treasury, and public infrastructure delivery in all 47 counties to foster grassroots citizen accountability.'
            },
            {
              heading: '5. Sourcing Levels & On-the-Record Default',
              content: 'Our default standard is on-the-record reporting. When sources require protection due to genuine threats of retaliation, loss of employment, or physical danger, we adhere to strictly defined rules: On Background (attributable to general official role), Deep Background (information usable without attribution), or Off the Record (for lead generation only, requiring secondary verification).'
            },
            {
              heading: '6. Editorial Escalation & Public Ombudsman',
              content: 'Should a reader or entity believe a story violates our Editorial Charter, a formal grievance may be lodged with our Public Ombudsman Desk. Editorial disputes are escalated directly to Editor-in-Chief Muchui Mwirigi and Executive Chairman Kelly Muthomi Kinoti for binding review.'
            }
          ]
        };
      case 'ethics-policy':
        return {
          title: 'Code of Ethics & Professional Conduct',
          updated: 'Updated August 2026 • Fully Compliant with MCK Act 2013',
          intro: `This Code of Ethics governs every journalist, editor, visual producer, and county correspondent representing Knews254. It sets the benchmark for moral integrity, dignity, and public accountability across digital and broadcast platforms.`,
          sections: [
            {
              heading: '1. Protection of Vulnerable Groups & Minors',
              content: 'Adhering to the Kenya Children Act Cap 141 and international conventions, Knews254 strictly protects the identities of children under 18 involved in court proceedings, abuse investigations, or trauma. We avoid publishing intrusive imagery or full names of victims of sexual violence, crime victims, or mentally distressed individuals without explicit legal consent.'
            },
            {
              heading: '2. Integrity of Photography, Video & Digital Media',
              content: 'We uphold absolute visual truth. Photojournalists and digital editors are forbidden from manipulating, altering, staging, or fabricating news photographs or video footage. Basic technical adjustments (cropping, color balance) are permitted only if they do not misrepresent the original context. Staged photojournalism is grounds for immediate termination.'
            },
            {
              heading: '3. Zero Tolerance for Paid Coverage ("Brown Envelope" Journalism)',
              content: 'Knews254 maintains zero tolerance for unscripted commercial payments, cash envelopes, travel allowances, or undisclosed gifts from sources or newsmakers. Any reporter found accepting consideration in exchange for favorable coverage, suppression of news, or selective reporting faces immediate dismissal and revocation of press credentials.'
            },
            {
              heading: '4. Election Reporting & NCIC Anti-Incitement Directives',
              content: 'During election cycles (including the 2027 General Election), Knews254 journalists adhere strictly to the National Cohesion and Integration Commission (NCIC) guidelines. We actively censor ethnic slurs, hate speech, inflammatory political rhetoric, or unsubstantiated claims of poll rigging designed to incite public unrest.'
            },
            {
              heading: '5. Personal Financial Disclosures & Conflicts of Interest',
              content: 'Reporters covering business, stock markets (NSE), or corporate dockets must declare any financial holdings, share ownership, or personal ties to companies they report on. No journalist may trade securities based on non-public material information obtained during newsgathering.'
            }
          ]
        };
      case 'ai-policy':
        return {
          title: 'Responsible AI & Newsroom Tech Policy',
          updated: 'Updated August 2026 • AI Safety & Journalism Governance Standard',
          intro: `At Knews254, Artificial Intelligence (powered by Google Gemini models) is deployed as a productivity aid for human journalists. We uphold clear boundary rules to ensure AI enhances analytical speed without eroding human accountability or editorial integrity.`,
          sections: [
            {
              heading: '1. Mandatory Human-in-the-Loop Verification',
              content: 'AI systems NEVER write, edit, or publish news articles autonomously at Knews254. Every AI-assisted summary, transcript, translation, or data breakdown undergoes mandatory manual review, fact-checking, and final approval by a senior human editor before reaching our audience.'
            },
            {
              heading: '2. Absolute Ban on Synthetic Media Fraud & Deepfakes',
              content: 'Knews254 strictly prohibits the generation or publication of synthetic deepfake images, voice clones, or manipulated videos presented as authentic news. Where AI is used to produce conceptual illustrations, charts, or visual infographics, clear visual disclosure tags (e.g., "[AI Generated Infographic]") are permanently embedded.'
            },
            {
              heading: '3. Data Privacy & Whistleblower Exclusion',
              content: 'Confidential whistleblower leaks, off-the-record notes, legal documents, and reader personal data are strictly firewalled and excluded from public AI training datasets. All server-side API interactions with generative AI models utilize enterprise zero-retention security protocols.'
            },
            {
              heading: '4. Algorithmic Neutrality & 47-County Bias Mitigation',
              content: 'We audit custom prompt templates and AI models continuously to prevent regional, political, ethnic, or socio-economic bias. News summarization engines are calibrated to reflect nuanced realities across both urban hubs (Nairobi, Mombasa) and rural county frontiers.'
            },
            {
              heading: '5. Reader Transparency & Disclosure Badges',
              content: 'Whenever a feature utilizes generative AI—such as our interactive "Ask Gemini AI" reader tool or automated bullet summaries—it is clearly marked with a visible AI badge so readers can distinguish between raw reporter dispatches and AI-assisted summaries.'
            }
          ]
        };
      case 'factcheck-methodology':
        return {
          title: 'Knews254 Verify Forensic Fact-Checking Methodology',
          updated: 'Updated August 2026 • Aligned with International Fact-Checking Network (IFCN) Standards',
          intro: `Knews254 Verify is our dedicated forensic fact-checking unit. We analyze viral rumors, political speeches, state statements, and social media claims to protect the East African public from deliberate disinformation and digital manipulation.`,
          sections: [
            {
              heading: '1. Claim Selection Framework',
              content: 'We select claims based on public impact, reach, and risk to public interest. Priority is given to statements by elected officials, viral claims regarding public health or safety, economic statistics, and electoral integrity statements surrounding the 2027 General Election.'
            },
            {
              heading: '2. Multi-Layer Sourcing & Primary Record Examination',
              content: 'We do not rely on secondary commentary. Our fact-checkers consult primary record repositories including official Kenya Gazettes, Parliamentary Hansards, National Treasury Budget Statements, Kenya National Bureau of Statistics (KNBS) censuses, Central Bank of Kenya (CBK) directives, and satellite data.'
            },
            {
              heading: '3. Standardized 5-Tier Verification Rating Scale',
              content: 'Each fact-checked claim is assigned an unambiguous rating: VERIFIED TRUE (100% accurate with primary proof), MOSTLY TRUE (accurate with minor context omissions), MIXED / NEEDS CONTEXT (contains partial truth but misleadingly framed), MISLEADING (selectively manipulated to deceive), or FALSE / FABRICATED (completely unsupported by evidence or demonstrably false).'
            },
            {
              heading: '4. Open Evidence Transparency & Reader Auditability',
              content: 'Every published fact-check report contains direct links to primary documents, raw datasets, archived web pages, and methodology notes, enabling any citizen or researcher to audit our conclusions independently.'
            },
            {
              heading: '5. Reader Claim Submission & Re-Evaluation Process',
              content: 'Readers can submit suspicious claims directly to verify@knews254.co.ke or via our WhatsApp desk. If new primary evidence emerges after a rating is published, our team conducts a formal re-evaluation and logs any grade adjustment transparently.'
            }
          ]
        };
      case 'anonymous-sources':
        return {
          title: 'Anonymous Sourcing & Whistleblower Protection Charter',
          updated: 'Updated August 2026 • Encrypted Shield Protection Standard',
          intro: `Investigative journalism relies on courageous whistleblowers who expose corruption, procurement fraud, and human rights violations. Knews254 provides rigorous legal and technological safeguards to shield confidential sources.`,
          sections: [
            {
              heading: '1. High Threshold for Granting Anonymity',
              content: 'Anonymity is never granted for convenience or casual commentary. It is reserved exclusively for situations where the information is of vital public interest, cannot be obtained through official public records, and revealing the source exposes them to physical harm, loss of employment, or criminal retaliation.'
            },
            {
              heading: '2. Senior Editorial Authorization Protocol',
              content: 'No individual field reporter may grant total legal anonymity unilaterally. The true identity of an anonymous source must be disclosed in strict confidence to Editor-in-Chief Muchui Mwirigi or Executive Chairman Kelly Muthomi Kinoti to verify credibility and motives.'
            },
            {
              heading: '3. Encrypted Technical Whistleblower Portal',
              content: 'Whistleblowers are advised to communicate via our dedicated secure tipoff endpoint (/api/tipoff), which strips IP addresses, metadata, and browser fingerprints. We also support end-to-end encrypted messaging via Signal and PGP key channels.'
            },
            {
              heading: '4. Shield Safeguards under Kenyan Evidence Law',
              content: 'Knews254 vigorously defends source confidentiality in court proceedings, invoking journalistic privilege under Article 34(5) of the Constitution of Kenya 2010, which guarantees that journalists shall not be compelled to disclose confidential sources of information.'
            },
            {
              heading: '5. Annual Sourcing Audit',
              content: 'Our editorial board conducts an annual internal audit to review the frequency and justification of anonymous attributions across all investigative desks, ensuring source reliance remains disciplined and transparent.'
            }
          ]
        };
      case 'transparency-report':
      case 'funding-policy':
        return {
          title: 'Ownership, Funding & Financial Transparency Report',
          updated: 'Updated August 2026 • Annual Public Integrity Disclosure',
          intro: `Public trust demands financial and operational transparency. Knews254 Media Group Ltd provides full disclosure of our corporate structure, ownership, revenue models, and grant governance principles.`,
          sections: [
            {
              heading: '1. Corporate Ownership & Independence',
              content: 'Knews254 Media Group Ltd is a 100% privately owned, independent Kenyan media enterprise founded by educator and software engineer Kelly Muthomi Kinoti. We have no shareholding by government agencies, state corporations, or political parties.'
            },
            {
              heading: '2. Revenue Model Breakdown',
              content: 'Our media operations are sustained through four primary revenue channels: (a) Programmatic display and video advertising, (b) Clearly labeled commercial sponsored content, (c) Reader digital subscriptions & premium features, and (d) Competitive media development grants.'
            },
            {
              heading: '3. Philanthropic & Grant Governance',
              content: 'Grants from media development organizations or non-profit foundations are accepted strictly on condition of non-interference. Donors hold zero influence over story selection, investigative targets, editorial stance, or hiring decisions.'
            },
            {
              heading: '4. Statutory Regulatory Compliance',
              content: 'Knews254 is fully registered with the Kenya Revenue Authority (KRA), compliant with the Media Council of Kenya (MCK) digital publisher requirements, and adheres to statutory labor and tax laws of the Republic of Kenya.'
            },
            {
              heading: '5. Public Financial Accountability Summaries',
              content: 'We publish an annual summary detailing institutional resource allocations across county news bureaus, investigative grants, data infrastructure, and staff development.'
            }
          ]
        };
      case 'community-guidelines':
        return {
          title: 'Community Rules & Citizen Discussion Standards',
          updated: 'Updated August 2026 • NCIC & Public Discussion Guidelines',
          intro: `We welcome passionate, diverse, and robust debate across our article comment feeds, county discussion forums, and live election commentary channels. These rules ensure our platform remains safe, civil, and constructive for all readers.`,
          sections: [
            {
              heading: '1. Zero Tolerance for Tribalism, Hate Speech & Harassment',
              content: 'Comments containing ethnic slurs, tribal incitement, religious bigotry, misogyny, homophobia, threats of violence, or personal intimidation are prohibited. Violations are automatically flagged and permanently purged under NCIC guidelines.'
            },
            {
              heading: '2. Civil Debate & Fact-Based Criticism',
              content: 'Criticism of public officials, policies, and ideas is strongly encouraged, but must remain focused on public records, actions, and evidence. Personal abuse, slander, or publishings of private contact details ("doxxing") will lead to immediate account ban.'
            },
            {
              heading: '3. Commercial Spam, Financial Scams & Bot Detection',
              content: 'Our real-time security systems automatically block promotional link spam, cryptocurrency schemes, pyramid scheme recruitment, or automated bot posts.'
            },
            {
              heading: '4. Automated & Human Moderation Workflow',
              content: 'User comments pass through a hybrid filtering engine combining real-time keyword filters with human moderation by our Community Editor team.'
            },
            {
              heading: '5. Account Warnings, Suspensions & Appeal Process',
              content: 'Users facing comment moderation actions receive automated notices. Account suspensions can be formally appealed by contacting community@knews254.co.ke with your account ID.'
            }
          ]
        };
      case 'takedown-policy':
        return {
          title: 'Copyright, Takedown & Intellectual Property Policy',
          updated: 'Updated August 2026 • Copyright Act Cap 130 (Kenya) Compliant',
          intro: `Knews254 respects intellectual property rights and expects its readers and content partners to do the same. We adhere to the Copyright Act Cap 130 of the Laws of Kenya and international copyright standards.`,
          sections: [
            {
              heading: '1. Filing a Formal Takedown Request',
              content: 'If you believe your copyrighted photograph, video clip, article text, or brand asset has been published on Knews254 without authorization, please submit a written DMCA / Copyright Takedown Notice to legal@knews254.co.ke containing: (a) Identification of the copyrighted work, (b) Direct URL of the material on Knews254, (c) Contact details, and (d) A statement under penalty of perjury that you are the rightful copyright owner or authorized agent.'
            },
            {
              heading: '2. 24-Hour Review & Processing Protocol',
              content: 'Upon receipt of a valid copyright notice, our legal compliance team reviews the claim within 24 business hours. If infringement is verified, the material is immediately removed or disabled.'
            },
            {
              heading: '3. Counter-Notification Procedure',
              content: 'Content contributors or editors who believe material was removed by mistake may file a formal Counter-Notification detailing fair use or licensing proof.'
            },
            {
              heading: '4. Fair Use & Academic Commentary Exemptions',
              content: 'Brief quotations, low-resolution screenshots, or official government documents utilized for non-commercial news reporting, commentary, or academic review are published under established Fair Dealing provisions of Kenyan copyright law.'
            }
          ]
        };
      case 'corrections-policy':
        return {
          title: 'Corrections, Errata & Transparency Policy',
          updated: 'Updated August 2026 • Accountability Standard',
          intro: `Accuracy is the cornerstone of Knews254. When errors occur, we correct them promptly, transparently, and unreservedly. We believe admitting and correcting mistakes strengthens public trust.`,
          sections: [
            {
              heading: '1. Prominent Corrections Box Protocol',
              content: 'When a substantive factual error is identified in a published story, the article is corrected immediately. A clear, high-contrast Correction Note is appended to the article stating exactly what was corrected, why, and the exact timestamp of the update.'
            },
            {
              heading: '2. Substantive Errors vs Typographical Edits',
              content: 'Minor spelling or formatting fixes that do not alter the factual meaning of a story are updated silently. Any change involving names, figures, dates, quotes, or allegations requires a logged correction note.'
            },
            {
              heading: '3. Public Corrections Log Archive',
              content: 'All major corrections are compiled into a public monthly Errata Log, available for audit by media researchers, press councils, and readers.'
            },
            {
              heading: '4. Reporting Errors to Editorial Desk',
              content: 'Readers who notice a potential error are urged to contact errors@knews254.co.ke or click "Report Error" on any article page for expedited review by our desk editor.'
            }
          ]
        };
      case 'privacy-policy':
        return {
          title: 'Privacy Policy & Data Rights (ODPC Kenya Compliant)',
          updated: 'Updated August 2026 • Full Compliance with Kenya Data Protection Act 2019',
          intro: `Knews254 is committed to protecting your personal data and respecting your privacy rights. This policy outlines how we collect, store, and process your information under the Data Protection Act 2019 (Office of the Data Protection Commissioner - ODPC Kenya).`,
          sections: [
            {
              heading: '1. Information We Collect',
              content: 'We collect minimal personal data necessary to deliver our news services: (a) Account info (name, email), (b) Newsletter subscriptions, (c) Optional location data for county news localization, and (d) Anonymized telemetry for platform speed optimization.'
            },
            {
              heading: '2. Lawful Grounds for Processing',
              content: 'We process your data strictly under valid legal grounds: user consent (subscribing to newsletters), contract performance (delivering reader features), and legitimate newsroom operational interests.'
            },
            {
              heading: '3. Zero Sale of Personal Data',
              content: 'Knews254 NEVER sells, rents, trades, or monetizes reader personal data or browsing histories to third-party ad brokers or data aggregators.'
            },
            {
              heading: '4. Statutory Data Subject Rights',
              content: 'Under the Kenya Data Protection Act 2019, you hold fundamental rights: (a) Right to access your data, (b) Right to rectification of inaccurate records, (c) Right to complete erasure ("Right to be Forgotten"), and (d) Right to object to automated profiling. Submit data requests to privacy@knews254.co.ke.'
            },
            {
              heading: '5. Enterprise Security Standards',
              content: 'All user communications, password hashes, and subscription records are encrypted using TLS 1.3 in transit and AES-256 at rest across secure cloud infrastructure.'
            }
          ]
        };
      case 'cookie-policy':
        return {
          title: 'Cookie, Analytics & Local Storage Policy',
          updated: 'Updated August 2026 • Reader Control Standard',
          intro: `Knews254 utilizes cookies and browser local storage to provide a seamless, customized news browsing experience without compromising your privacy.`,
          sections: [
            {
              heading: '1. Essential Functional Storage',
              content: 'Used to store your dark/light theme preference, active 47-county filter, reading list bookmarks, and logged-in reader session states.'
            },
            {
              heading: '2. Analytics & Performance Cookies',
              content: 'Anonymized session metrics enable our engineering team to monitor server response times, bandwidth distribution across Kenya, and popular news category trends.'
            },
            {
              heading: '3. Managing & Clearing Storage',
              content: 'You can modify or clear cookies at any time via your web browser settings. Note that disabling essential storage may reset your bookmarked articles and saved county preferences.'
            },
            {
              heading: '4. Third-Party Embedded Content Widgets',
              content: 'Certain news articles include embedded content (YouTube videos, Twitter/X dispatches, Infotrak polling charts). These embedded services may set independent cookies governed by their respective privacy policies.'
            }
          ]
        };
      case 'terms-of-service':
      default:
        return {
          title: 'Terms of Service & Reader Agreement',
          updated: 'Updated August 2026 • Knews254 Digital Media Network',
          intro: `Welcome to Knews254. By accessing our website, mobile application, RSS feeds, or API endpoints, you agree to comply with and be bound by these Terms of Service.`,
          sections: [
            {
              heading: '1. Intellectual Property & Brand Rights',
              content: 'All content, original reporting, audio broadcasts, custom infographics, logo marks, and code published on Knews254 are the protected intellectual property of Knews254 Media Group Ltd.'
            },
            {
              heading: '2. Permissible News Syndication & Fair Citation',
              content: 'Non-commercial excerpts (up to 150 words) may be republished by academic researchers, bloggers, or news aggregators, provided clear hyperlinked attribution to Knews254.co.ke is included. Automated scraping or full-text republication without written licensing is prohibited.'
            },
            {
              heading: '3. Reader Account Security & Acceptable Use',
              content: 'Users registering accounts or using our CMS/commenting tools are responsible for maintaining credentials confidentiality. You agree not to attempt security breaches, unauthorized API calls, or platform disruption.'
            },
            {
              heading: '4. Disclaimer of Warranties & High Court Jurisdiction',
              content: 'While Knews254 strives for 100% accuracy, content is provided "as is". These terms are governed by the Laws of the Republic of Kenya, with exclusive legal jurisdiction vested in the High Court of Kenya at Nairobi.'
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
              MCK Accredited
            </span>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2.5 py-1 rounded border border-emerald-800">
              ODPC Kenya Verified
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-serif">{policy.title}</h1>
          <p className="text-xs text-slate-400 font-mono">{policy.updated}</p>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed font-normal bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
          {policy.intro}
        </p>

        <div className="space-y-6">
          {policy.sections.map((sec, i) => (
            <div key={i} className="space-y-2 border-b border-slate-800/60 pb-5 last:border-0">
              <h3 className="font-extrabold text-base text-white text-red-400 font-serif">{sec.heading}</h3>
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

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (supabase) {
      try {
        await supabase.from('vetting_requests').insert({
          name: appForm.name,
          email: appForm.email,
          phone: appForm.phone,
          position: selectedJob?.title || 'General Newsroom Application',
          portfolio_url: appForm.portfolio,
          cover_letter: appForm.cover,
          status: 'pending'
        });
      } catch (err) {
        console.warn('Supabase career vetting insert error:', err);
      }
    }
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

/* -------------------------------------------------------------------------- */
/* INTERACTIVE HTML SITEMAP COMPONENT                                         */
/* -------------------------------------------------------------------------- */
const SitemapPage: React.FC<{ onSelectCategory: (cat: NewsCategory) => void }> = ({ onSelectCategory }) => {
  const categoriesList: { name: string; cat: NewsCategory; desc: string }[] = [
    { name: 'Breaking News & Top Stories', cat: 'breaking' as NewsCategory, desc: 'Real-time 24/7 bulletins from across Kenya and East Africa.' },
    { name: 'Politics & Governance', cat: 'politics' as NewsCategory, desc: 'State House, National Assembly, Senate, and cabinet affairs.' },
    { name: '2027 General Election Centre', cat: 'elections2027' as NewsCategory, desc: 'IEBC updates, presidential race tracking, voter education & polls.' },
    { name: 'Business, Markets & NSE', cat: 'business' as NewsCategory, desc: 'Nairobi Securities Exchange, inflation, CBK interest rates, tax news.' },
    { name: 'Silicon Savannah Technology', cat: 'technology' as NewsCategory, desc: 'Fintech, M-Pesa innovations, AI startups, and telecom updates.' },
    { name: 'Kenya AI & Innovation Hub', cat: 'ai' as NewsCategory, desc: 'Generative AI news, research, machine learning in East Africa.' },
    { name: 'Sports & Athletics', cat: 'sports' as NewsCategory, desc: 'KPL football, marathon champions, Rugby Sevens, Safari Rally.' },
    { name: '47 Counties Devolution Hub', cat: 'county' as NewsCategory, desc: 'County assembly budget audits, local infrastructure, governor dispatches.' },
    { name: 'Investigative Exposés', cat: 'investigations' as NewsCategory, desc: 'Deep investigative reports on corruption, procurement, state accountability.' },
    { name: 'Global Kenya Diaspora', cat: 'diaspora' as NewsCategory, desc: 'Kenyans in UK, US, Gulf states, diaspora remittances and consular dispatches.' },
    { name: 'Opinion & Editorial Columns', cat: 'opinion' as NewsCategory, desc: 'Perspectives from leading policy analysts, economists, and scholars.' },
  ];

  const portalsList: { name: string; cat: NewsCategory; desc: string }[] = [
    { name: 'Knews254 Live TV & Radio Stream', cat: 'live' as NewsCategory, desc: 'HD live stream broadcasting breaking news and county debates.' },
    { name: 'Video Bulletins & Documentaries', cat: 'videos' as NewsCategory, desc: 'Short video clips, ground reports, and mini-documentaries.' },
    { name: 'Audio Podcasts & Interviews', cat: 'podcasts' as NewsCategory, desc: 'On-demand audio shows, analyst dispatches, and daily morning briefings.' },
    { name: 'Knews254 Verify Fact-Check Unit', cat: 'fact-checking' as NewsCategory, desc: 'Forensic fact-checks debunking political myths and social media rumors.' },
    { name: 'Ask Gemini AI Newsroom Assistant', cat: 'ai' as NewsCategory, desc: 'AI-powered instant article summarization and Q&A engine.' },
    { name: 'Newsroom CMS Portal', cat: 'cms' as NewsCategory, desc: 'Internal editorial portal for reporter accreditation and story drafting.' },
  ];

  const standardsList: { name: string; cat: NewsCategory }[] = [
    { name: 'Editorial Charter & Standards', cat: 'editorial-policy' as NewsCategory },
    { name: 'Journalistic Code of Ethics', cat: 'ethics-policy' as NewsCategory },
    { name: 'Knews254 Verify Fact-Check Method', cat: 'factcheck-methodology' as NewsCategory },
    { name: 'Anonymous Sources & Whistleblower Shield', cat: 'anonymous-sources' as NewsCategory },
    { name: 'Responsible AI & Tech Governance', cat: 'ai-policy' as NewsCategory },
    { name: 'Corrections, Errata & Public Log', cat: 'corrections-policy' as NewsCategory },
    { name: 'Ownership, Funding & Transparency', cat: 'transparency-report' as NewsCategory },
    { name: 'Community Discussion Guidelines', cat: 'community-guidelines' as NewsCategory },
    { name: 'Copyright & Takedown Policy (Cap 130)', cat: 'takedown-policy' as NewsCategory },
    { name: 'Privacy Policy (ODPC Kenya Compliant)', cat: 'privacy-policy' as NewsCategory },
    { name: 'Cookie & Local Storage Policy', cat: 'cookie-policy' as NewsCategory },
    { name: 'Terms of Service & Reader Agreement', cat: 'terms-of-service' as NewsCategory },
  ];

  const companyList: { name: string; cat: NewsCategory }[] = [
    { name: 'About Knews254 & Chairman Profile', cat: 'about' as NewsCategory },
    { name: 'Editorial Board & Authors Directory', cat: 'authors' as NewsCategory },
    { name: 'Contact Newsroom & Bureau Desks', cat: 'contact' as NewsCategory },
    { name: 'Careers & Journalism Fellowships', cat: 'careers' as NewsCategory },
    { name: 'Advertise & Brand Partnerships', cat: 'advertise' as NewsCategory },
    { name: 'Reader Reviews & Community Score', cat: 'reviews' as NewsCategory },
    { name: 'How We Review Claims & Products', cat: 'how-we-review' as NewsCategory },
    { name: 'FAQ & Knowledge Base Centre', cat: 'faq' as NewsCategory },
    { name: 'Help & 24/7 Technical Support', cat: 'help-center' as NewsCategory },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="border-b border-slate-800 pb-6 text-center space-y-3">
          <span className="text-[10px] bg-red-600 text-white font-black px-2.5 py-1 rounded uppercase tracking-widest inline-block">
            KNEWS254 MEDIA DIRECTORY
          </span>
          <h1 className="text-3xl font-black text-white font-serif">Comprehensive HTML Sitemap</h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto">
            Complete index of all news categories, county bureaus, specialized portals, editorial standards, and legal compliance dispatches across Knews254.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono">
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="bg-slate-900 border border-slate-800 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> XML Sitemap Feed (/sitemap.xml)
            </a>
            <a href="/rss.xml" target="_blank" rel="noopener noreferrer" className="bg-slate-900 border border-slate-800 text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-lg flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> RSS News Feed (/rss.xml)
            </a>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="bg-slate-900 border border-slate-800 text-sky-400 hover:text-sky-300 px-3 py-1.5 rounded-lg flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Robots Directives (/robots.txt)
            </a>
          </div>
        </div>

        {/* Section 1: Editorial Categories */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-white font-serif flex items-center gap-2 border-b border-slate-800 pb-2">
            <FileText className="w-5 h-5 text-red-500" /> News Categories &amp; Editorial Beats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoriesList.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectCategory(item.cat)}
                className="bg-slate-900 border border-slate-800 hover:border-red-500/60 p-4 rounded-xl cursor-pointer transition group space-y-1"
              >
                <h3 className="font-extrabold text-sm text-white group-hover:text-red-400 flex items-center justify-between">
                  {item.name} <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Specialized Portals & Features */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-white font-serif flex items-center gap-2 border-b border-slate-800 pb-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> Specialized Media Portals &amp; Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portalsList.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectCategory(item.cat)}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 p-4 rounded-xl cursor-pointer transition group space-y-1"
              >
                <h3 className="font-extrabold text-sm text-white group-hover:text-amber-400 flex items-center justify-between">
                  {item.name} <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Editorial Standards & Legal Governance */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-white font-serif flex items-center gap-2 border-b border-slate-800 pb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Editorial Standards &amp; Legal Compliance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {standardsList.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectCategory(item.cat)}
                className="bg-slate-900 border border-slate-800 hover:border-emerald-500/60 p-3.5 rounded-xl cursor-pointer transition group flex items-center justify-between text-xs font-bold text-slate-200 hover:text-emerald-400"
              >
                <span>{item.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Company & Reader Services */}
        <div className="space-y-4">
          <h2 className="text-xl font-black text-white font-serif flex items-center gap-2 border-b border-slate-800 pb-2">
            <Users className="w-5 h-5 text-sky-400" /> Company, Leadership &amp; Reader Support
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {companyList.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectCategory(item.cat)}
                className="bg-slate-900 border border-slate-800 hover:border-sky-500/60 p-3.5 rounded-xl cursor-pointer transition group flex items-center justify-between text-xs font-bold text-slate-200 hover:text-sky-400"
              >
                <span>{item.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-sky-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

