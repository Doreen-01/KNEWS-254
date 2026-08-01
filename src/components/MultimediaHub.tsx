import React, { useState } from 'react';
import { VIDEO_CLIPS, PODCAST_EPISODES } from '../data/newsData';
import { VideoClip, PodcastEpisode } from '../types';
import { Tv, Headphones, Play, Pause, PlayCircle, Volume2, FastForward, Clock, Eye } from 'lucide-react';

export const MultimediaHub: React.FC = () => {
  const [activeMedia, setActiveMedia] = useState<'video' | 'podcast'>('video');
  const [selectedVideo, setSelectedVideo] = useState<VideoClip>(VIDEO_CLIPS[0]);
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastEpisode>(PODCAST_EPISODES[0]);
  const [isPlayingPodcast, setIsPlayingPodcast] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-red-600/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
            <Tv className="w-3.5 h-3.5" />
            Knews254 Broadcasting & Podcast Network
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Knews254 TV & On-Demand Audio Studio
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Watch investigative video releases, field reports, and stream flagship East African podcasts.
          </p>
        </div>

        {/* Media Switcher */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
          <button
            onClick={() => setActiveMedia('video')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeMedia === 'video' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            Video Desk (3)
          </button>
          <button
            onClick={() => setActiveMedia('podcast')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeMedia === 'podcast' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            Podcasts (2)
          </button>
        </div>
      </div>

      {activeMedia === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Video Player Box */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden space-y-4">
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
              <img 
                src={selectedVideo.thumbnailUrl} 
                alt={selectedVideo.title} 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <button className="absolute w-16 h-16 rounded-full bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl transition hover:scale-110">
                <Play className="w-8 h-8 fill-current ml-1" />
              </button>

              <span className="absolute bottom-3 right-3 bg-black/80 text-white font-mono text-xs px-2 py-0.5 rounded">
                {selectedVideo.duration}
              </span>
            </div>

            <div className="p-4 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/20">
                {selectedVideo.category}
              </span>
              <h3 className="text-xl font-bold text-white leading-tight">{selectedVideo.title}</h3>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {selectedVideo.views} views</span>
                <span>•</span>
                <span>Presenter: {selectedVideo.presenter}</span>
              </div>
            </div>
          </div>

          {/* Video List */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Featured Video Reports</span>
            {VIDEO_CLIPS.map((clip) => (
              <div
                key={clip.id}
                onClick={() => setSelectedVideo(clip)}
                className={`p-3 rounded-xl border transition cursor-pointer flex gap-3 ${
                  selectedVideo.id === clip.id ? 'bg-slate-950 border-red-500' : 'bg-slate-950/60 hover:bg-slate-950 border-slate-800'
                }`}
              >
                <div className="w-24 h-16 rounded-lg overflow-hidden shrink-0 relative bg-slate-900">
                  <img src={clip.thumbnailUrl} alt={clip.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] text-white font-mono px-1 rounded">{clip.duration}</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">{clip.title}</h4>
                  <span className="text-[10px] text-slate-500 block mt-1">{clip.presenter}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeMedia === 'podcast' && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img 
              src={selectedPodcast.coverUrl} 
              alt={selectedPodcast.title} 
              className="w-32 h-32 rounded-2xl object-cover border-2 border-red-500/50 shadow-xl"
            />
            <div className="space-y-2 flex-1 text-center md:text-left">
              <span className="text-xs font-mono font-bold text-red-400 uppercase">{selectedPodcast.showName} • Ep. {selectedPodcast.episodeNumber}</span>
              <h3 className="text-2xl font-black text-white">{selectedPodcast.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedPodcast.summary}</p>
            </div>
          </div>

          {/* Audio Controls Bar */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPlayingPodcast(!isPlayingPodcast)}
                className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition"
              >
                {isPlayingPodcast ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>
              <div>
                <span className="text-xs font-bold text-white block">{selectedPodcast.showName}</span>
                <span className="text-[10px] text-slate-400 font-mono">{selectedPodcast.duration}</span>
              </div>
            </div>

            {/* Playback Speed Selector */}
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 font-bold">Speed:</span>
              {[1, 1.25, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    playbackSpeed === spd ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
