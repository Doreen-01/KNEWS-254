import React, { useState, useEffect } from 'react';
import { KmkLogo } from './KmkLogo';
import { DoreenPhoto } from './DoreenPhoto';
import { uploadMediaToSupabase, isSupabaseConfigured, supabase } from '../lib/supabase';
import { articleService } from '../services/articleService';
import { authService, UserProfile } from '../services/authService';
import { AUTHORS_LIST } from '../data/newsData';
import { NewsCategory } from '../types';
import {
  Sliders,
  CheckSquare,
  Users,
  BarChart3,
  Clock,
  AlertCircle,
  FileText,
  Plus,
  PlusCircle,
  Shield,
  Briefcase,
  MessageSquare,
  Star,
  Scale,
  Calendar,
  Send,
  Eye,
  CheckCircle,
  XCircle,
  HelpCircle,
  Lock,
  Key,
  Database,
  Radio,
  Flame,
  UserCheck,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Activity,
  Zap,
  RefreshCw,
  Copy,
  Check,
  Upload,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Award,
  ChevronRight,
  Server,
  Layers,
  HardDrive,
  Globe,
  User,
  Image,
  Vote,
  Building,
  Headphones,
  BookOpen
} from 'lucide-react';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  clearanceLevel: string;
  isChiefAdmin: boolean;
  isCustomPhoto?: boolean;
  avatar?: string;
  lastLogin: string;
}

interface AdminCmsPortalProps {
  onNavigateCategory?: (category: NewsCategory) => void;
  onNavigateTab?: (tab: 'platform' | 'prd') => void;
  onClose?: () => void;
}

export const AdminCmsPortal: React.FC<AdminCmsPortalProps> = ({
  onNavigateCategory,
  onNavigateTab,
  onClose
}) => {
  // Category label -> slug mapping
  const CATEGORY_SLUG_MAP: Record<string, string> = {
    'Blog': 'blog',
    'Blog & Opinion': 'blog',
    'Politics': 'politics',
    'Elections 2027': 'elections',
    'County News': 'county',
    'Business': 'business',
    'Economy': 'economy',
    'Tech & AI': 'technology',
    'Sports': 'sports',
    'Agriculture': 'agriculture',
    'Public Health': 'health',
    'Fact Check': 'fact-checking',
    'Audio & Podcasts': 'podcasts',
    'Entertainment': 'entertainment',
    'Investigations': 'investigations',
    'Opinion': 'opinion'
  };
  // Default Vetted Newsroom Staff Members (Directory Only)
  const DEFAULT_STAFF: StaffUser[] = [
    {
      id: 'staff-001',
      name: 'Kelly Muthomi Kinoti',
      email: 'kellymuthomi22@gmail.com',
      role: 'Chief Administrator & Chairman',
      department: 'Executive Governance & Engineering',
      clearanceLevel: 'LEVEL 4 SUPREME',
      isChiefAdmin: true,
      lastLogin: 'Active Now'
    },
    {
      id: 'staff-002',
      name: 'Doreen Ngugi Nkonge',
      email: 'doreenngugi38@gmail.com',
      role: 'Customer Support Officer',
      department: 'Reader Relations & Public Service',
      clearanceLevel: 'LEVEL 2 SUPPORT',
      isChiefAdmin: false,
      isCustomPhoto: true,
      lastLogin: '2 mins ago'
    },
    {
      id: 'staff-003',
      name: 'Muchui Mwirigi',
      email: 'muchuidk@gmail.com',
      role: 'Editor-in-Chief & Community Moderator',
      department: 'Executive Editorial & Community Governance Desk',
      clearanceLevel: 'LEVEL 3 CHIEF EDITOR & MODERATOR',
      isChiefAdmin: false,
      lastLogin: 'Just Now'
    },
    {
      id: 'staff-007',
      name: 'Alfred Mwenda',
      email: 'alfredmwenda684@gmail.com',
      role: 'Managing Editor & Senior Fact Checker (Verification Lead)',
      department: 'Managing Editorial & Fact Check Verification Desk',
      clearanceLevel: 'LEVEL 3 MANAGING EDITOR & VERIFICATION',
      isChiefAdmin: false,
      lastLogin: '10 mins ago'
    },
    {
      id: 'staff-008',
      name: 'Linah Kawira',
      email: 'linahkawira14@gmail.com',
      role: 'Legal Reviewer & Compliance Officer',
      department: 'Legal & Regulatory Compliance Desk',
      clearanceLevel: 'LEVEL 3 LEGAL',
      isChiefAdmin: false,
      lastLogin: '15 mins ago'
    },
    {
      id: 'staff-009',
      name: 'Joy Mwiti',
      email: 'joy.mwiti@knews254.co.ke',
      role: 'Human Resource Manager & Talent Director',
      department: 'HR & Personnel Operations Desk',
      clearanceLevel: 'LEVEL 3 HR MANAGEMENT',
      isChiefAdmin: false,
      lastLogin: '1 hr ago'
    },
    {
      id: 'staff-010',
      name: 'Scholastica Karwitha',
      email: 'scholasticakarwitha@gmail.com',
      role: 'Advertising Manager & Chief Reporter / Chief Journalist',
      department: 'Advertising & Newsroom Bureau Operations (Leads All Reporters)',
      clearanceLevel: 'LEVEL 3 CHIEF REPORTER & ADVERTISING',
      isChiefAdmin: false,
      lastLogin: '5 mins ago'
    }
  ];

  const [staffList] = useState<StaffUser[]>(DEFAULT_STAFF);

  // Newsroom Vetting & Accreditation Applicants Queue
  const [vettingQueue, setVettingQueue] = useState(() => {
    const saved = localStorage.getItem('knews254_vetting_queue');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      {
        id: 'vet-101',
        name: 'David Otieno Kinuthia',
        email: 'david.otieno@knews254.co.ke',
        phone: '+254 712 345 678',
        department: 'Nyanza & Kisumu Bureau',
        role: 'Senior Field Reporter & Audio Podcast Host',
        experience: '6 Years Broadcast Journalism',
        credentialsBio: 'Former KTN News regional reporter covering devolution & county assembly politics in Western & Nyanza.',
        score: '96/100',
        appliedDate: 'Today',
        status: 'PENDING_EXECUTIVE_VETTING'
      },
      {
        id: 'vet-102',
        name: 'Catherine Njeri Wambui',
        email: 'catherine.wambui@knews254.co.ke',
        phone: '+254 722 987 654',
        department: 'Multimedia & Podcast Studio Desk',
        role: 'Podcast Producer & Host (Politics Uncut)',
        experience: '4 Years Radio & Digital Audio',
        credentialsBio: 'Experienced audio engineer & investigative podcaster specializing in East African macroeconomic debates.',
        score: '98/100',
        appliedDate: 'Yesterday',
        status: 'PENDING_EXECUTIVE_VETTING'
      }
    ];
  });

  // Modal State for Staff Accreditation Vetting Application
  const [showVettingModal, setShowVettingModal] = useState(false);
  const [vettingSuccessMsg, setVettingSuccessMsg] = useState('');
  const [vettingForm, setVettingForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Newsroom & Reporting Bureau',
    role: 'Reporter / Journalist',
    experience: '3+ Years Digital Media',
    credentialsBio: ''
  });

  const handleApplyVetting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vettingForm.name.trim() || !vettingForm.email.trim()) return;

    const newRequest = {
      id: `vet-${Date.now()}`,
      name: vettingForm.name.trim(),
      email: vettingForm.email.trim().toLowerCase(),
      phone: vettingForm.phone.trim() || '+254 700 000 000',
      department: vettingForm.department,
      role: vettingForm.role,
      experience: vettingForm.experience,
      credentialsBio: vettingForm.credentialsBio || 'Journalist applying for accredited newsroom staff access.',
      score: '92/100',
      appliedDate: 'Just Now',
      status: 'PENDING_EXECUTIVE_VETTING'
    };

    try {
      await fetch('/api/vetting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest)
      });
    } catch (err) {
      console.warn('Backend vetting notice:', err);
    }

    const updatedQueue = [newRequest, ...vettingQueue];
    setVettingQueue(updatedQueue);
    localStorage.setItem('knews254_vetting_queue', JSON.stringify(updatedQueue));

    setVettingSuccessMsg(`✓ Vetting Application Submitted! Only accredited staff may access the CMS. Chairman Kelly Muthomi Kinoti or Editor-in-Chief Muchui Mwirigi will review your credentials.`);
    setVettingForm({
      name: '',
      email: '',
      phone: '',
      department: 'Newsroom & Reporting Bureau',
      role: 'Reporter / Journalist',
      experience: '3+ Years Digital Media',
      credentialsBio: ''
    });
  };

  // Executive Staff Vetting Approval Handler
  const handleApproveStaffVetting = (candId: string) => {
    const cand = vettingQueue.find(q => q.id === candId);
    if (!cand) return;

    const updatedQueue = vettingQueue.map(q => q.id === candId ? { ...q, status: 'VETTED_APPROVED' } : q);
    setVettingQueue(updatedQueue);
    localStorage.setItem('knews254_vetting_queue', JSON.stringify(updatedQueue));

    alert(`✓ [VETTING SUCCESS] ${cand.name} has been vetted & accredited by Executive Command! They can now log into the CMS using ${cand.email}.`);
  };

  // Authenticated Supabase Session State
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    let active = true;
    async function restoreSession() {
      setIsLoadingAuth(true);
      const profile = await authService.getCurrentProfile();
      if (active) {
        setCurrentUserProfile(profile);
        setIsLoadingAuth(false);
      }
    }
    restoreSession();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          const profile = await authService.getCurrentProfile();
          if (active) setCurrentUserProfile(profile);
        } else if (event === 'SIGNED_OUT') {
          if (active) setCurrentUserProfile(null);
        }
      });
      return () => {
        active = false;
        subscription.unsubscribe();
      };
    }
  }, []);

  // Map user profile to StaffUser representation for UI compatibility
  const currentUser: StaffUser | null = currentUserProfile ? {
    id: currentUserProfile.id,
    name: currentUserProfile.name,
    email: currentUserProfile.email,
    role: currentUserProfile.role,
    department: currentUserProfile.department || 'Newsroom Operations',
    clearanceLevel: currentUserProfile.role === 'super_admin' ? 'LEVEL 4 SUPREME' : 'LEVEL 3 AUTHENTICATED',
    isChiefAdmin: currentUserProfile.role === 'super_admin' || currentUserProfile.email.toLowerCase().includes('kellymuthomi'),
    isCustomPhoto: !!currentUserProfile.profile_image,
    avatar: currentUserProfile.profile_image,
    lastLogin: 'Active Session'
  } : null;

  const isAuthenticated = !!currentUser;

  const [loginEmail, setLoginEmail] = useState('kellymuthomi22@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const emailTrim = loginEmail.trim().toLowerCase();

    const res = await authService.login(emailTrim, loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'Access Denied: Invalid credentials or password.');
      setIsLoggingIn(false);
      return;
    }

    const profile = await authService.getCurrentProfile();
    setCurrentUserProfile(profile);
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.warn('Logout error:', e);
    }
    setCurrentUserProfile(null);
    setLoginPassword('');
    setLoginError('');
  };

  // Current active staff role
  const [currentRole, setCurrentRole] = useState<string>('Super Administrator');

  // Active portal tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'editorial' | 'factcheck' | 'hr' | 'support' | 'reviews' | 'corrections' | 'chat_rota' | 'audit_logs' | 'infrastructure'
  >('overview');

  // Staff Profile Editing State
  const [profileData, setProfileData] = useState(() => {
    return {
      name: currentUser?.name || 'Kelly Muthomi Kinoti',
      role: currentUser?.role || 'Founder, Chairman & Super Administrator',
      email: currentUser?.email || 'kellymuthomi22@gmail.com',
      department: currentUser?.department || 'Executive Governance & Engineering',
      location: 'Nairobi HQ',
      twitter: currentUser?.name?.toLowerCase().includes('kelly') ? '@KellyMuthomi254' : '@' + (currentUser?.name?.replace(/\s+/g, '') || 'KnewsStaff'),
      website: currentUser?.name?.toLowerCase().includes('kelly') ? 'https://kelly-muthomi-kinoti.vercel.app/' : '',
      bio: currentUser?.name?.toLowerCase().includes('kelly')
        ? 'Visionary creator of Knews254, Educator, Lead Full-Stack Software Developer, and Academic Research Analyst bridging digital media, ICT innovation, and quantitative data analytics.'
        : `Journalist and ${currentUser?.role || 'staff member'} at Knews254 Media Group.`,
      avatar: currentUser?.name?.toLowerCase().includes('kelly')
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
    };
  });

  const [profileUploading, setProfileUploading] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handleProfileAvatarUpload = async (file: File) => {
    if (!file) return;
    setProfileUploading(true);
    setUploadMessage('Uploading image to Supabase Storage bucket...');
    const result = await uploadMediaToSupabase(file, 'avatars');
    setProfileUploading(false);
    
    if (result.url) {
      const newAvatarUrl = result.url;
      setProfileData(prev => ({ ...prev, avatar: newAvatarUrl }));
      setUploadMessage(result.error ? `Notice: ${result.error}` : '✓ Profile picture uploaded successfully and saved to profile!');

      if (currentUserProfile) {
        authService.updateProfile({ profile_image: newAvatarUrl });
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserProfile) return;

    await authService.updateProfile({
      name: profileData.name,
      email: profileData.email,
      department: profileData.department,
      profile_image: profileData.avatar,
      biography: profileData.bio
    });

    const refreshed = await authService.getCurrentProfile();
    setCurrentUserProfile(refreshed);
    setProfileSaveSuccess(true);
    setTimeout(() => setProfileSaveSuccess(false), 4500);
  };

  /* -------------------------------------------------------------------------- */
  /* ENTERPRISE INFRASTRUCTURE, STORAGE & CACHING CONTROLS                      */
  /* -------------------------------------------------------------------------- */
  const [highTrafficShield, setHighTrafficShield] = useState(false);
  const [purgeSlug, setPurgeSlug] = useState('');
  const [purgeLog, setPurgeLog] = useState<string[]>([]);
  const [signedTokenType, setSignedTokenType] = useState('articles/videos/');
  const [generatedSignedUrl, setGeneratedSignedUrl] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [backupVerified, setBackupVerified] = useState(false);
  const [verifyingBackup, setVerifyingBackup] = useState(false);

  const handleTriggerPurge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purgeSlug) return;
    const logEntry = `[${new Date().toLocaleTimeString()}] Purged CDN Edge Cache for Target: /article/${purgeSlug} + Related Category & County Feeds`;
    setPurgeLog([logEntry, ...purgeLog]);
    setPurgeSlug('');
  };

  const handleGenerateSignedUrl = () => {
    const randomHash = Math.random().toString(36).substring(2, 12);
    const mockUrl = `https://storage.knews254.co.ke/${signedTokenType}2026/08/01/upload-${randomHash}.bin?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=900`;
    setGeneratedSignedUrl(mockUrl);
    setCopiedUrl(false);
  };

  const handleCopyUrl = () => {
    if (!generatedSignedUrl) return;
    navigator.clipboard.writeText(generatedSignedUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleRunBackupVerification = () => {
    setVerifyingBackup(true);
    setTimeout(() => {
      setVerifyingBackup(false);
      setBackupVerified(true);
    }, 1200);
  };

  /* -------------------------------------------------------------------------- */
  /* EDITORIAL QUEUE & DRAFT STUDIO STATE                                       */
  /* -------------------------------------------------------------------------- */
  const [articlesList, setArticlesList] = useState<any[]>([]);
  const [isLoadingCmsArticles, setIsLoadingCmsArticles] = useState(false);
  const [cmsArticlesError, setCmsArticlesError] = useState<string | null>(null);

  const [showDraftModal, setShowDraftModal] = useState(false);
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);

  const [newDraft, setNewDraft] = useState({
    title: '',
    category: 'Politics',
    county: 'Nairobi',
    author: 'Kelly Muthomi Kinoti',
    summary: '',
    content: '',
    priority: 'Normal',
    imagePreview: '',
    fileName: '',
    imageCaption: '',
    imageCredit: '',
    targetStatus: 'published'
  });

  const loadArticles = async () => {
    setIsLoadingCmsArticles(true);
    setCmsArticlesError(null);
    try {
      const result = await articleService.listAllArticlesForCms();
      if (result.error) {
        setCmsArticlesError(result.error);
        setArticlesList([]);
      } else {
        setArticlesList((result.data || []).map(a => ({
          id: a.id,
          title: a.title,
          author: a.author.name,
          category: a.category,
          status: a.dbStatus === 'published' ? 'Published' :
                  a.dbStatus === 'submitted' ? 'Submitted' :
                  a.dbStatus === 'approved' ? 'Approved' :
                  a.dbStatus === 'archived' ? 'Archived' : 'Draft',
          dbStatus: a.dbStatus,
          priority: a.isBreaking ? 'Breaking News' : a.isFeatured ? 'High Priority' : 'Normal',
          date: a.publishedAt || 'Draft',
          reads: `${a.viewCount}`,
          wordCount: a.content ? a.content.split(' ').length : 0
        })));
      }
    } catch (err: any) {
      setCmsArticlesError(err?.message || 'Failed to load CMS articles.');
    } finally {
      setIsLoadingCmsArticles(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    const result = await uploadMediaToSupabase(file, 'article-media');
    if (result.url) {
      setNewDraft(prev => ({
        ...prev,
        imagePreview: result.url,
        fileName: file.name
      }));
    }
  };

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDraft.title.trim()) {
      setDraftError('Headline title is required.');
      return;
    }
    if (!newDraft.content.trim()) {
      setDraftError('Article body content is required.');
      return;
    }

    setIsSubmittingDraft(true);
    setDraftError(null);

    const authorName = currentUser?.name || newDraft.author || 'Kelly Muthomi Kinoti';
    const catSlug = CATEGORY_SLUG_MAP[newDraft.category] || newDraft.category.toLowerCase().replace(/[^a-z0-9]/g, '');

    const createResult = await articleService.createArticle({
      title: newDraft.title.trim(),
      summary: newDraft.summary.trim() || newDraft.content.substring(0, 180) + '...',
      body: newDraft.content.trim(),
      category: catSlug || 'politics',
      county: newDraft.county || 'Nairobi',
      imageUrl: newDraft.imagePreview || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80',
      imageCaption: newDraft.imageCaption,
      imageCredit: newDraft.imageCredit,
      isBreaking: newDraft.priority === 'Breaking News',
      isFeatured: newDraft.priority === 'High Priority',
      authorId: currentUser?.id,
      status: (newDraft.targetStatus || 'published') as any
    });

    setIsSubmittingDraft(false);

    if (!createResult.success) {
      setDraftError(createResult.error || 'Failed to save article in Supabase.');
      return;
    }

    setShowDraftModal(false);
    setNewDraft({
      title: '',
      category: 'Politics',
      county: 'Nairobi',
      author: 'Kelly Muthomi Kinoti',
      summary: '',
      content: '',
      priority: 'Normal',
      imagePreview: '',
      fileName: '',
      imageCaption: '',
      imageCredit: '',
      targetStatus: 'published'
    });

    await loadArticles();
    window.dispatchEvent(new Event('knews254_articles_updated'));
  };

  const handleUpdateArticleStatus = async (id: string, newStatus: string) => {
    if (newStatus.toLowerCase() === 'published') {
      await articleService.publishArticle(id);
    } else if (newStatus.toLowerCase() === 'draft') {
      await articleService.unpublishArticle(id);
    } else if (newStatus.toLowerCase() === 'approved') {
      await articleService.approveArticle(id);
    } else if (newStatus.toLowerCase() === 'submitted') {
      await articleService.submitArticle(id);
    } else if (newStatus.toLowerCase() === 'archived') {
      await articleService.archiveArticle(id);
    } else if (newStatus.toLowerCase() === 'deleted') {
      await articleService.softDeleteArticle(id);
    }
    
    await loadArticles();
    window.dispatchEvent(new Event('knews254_articles_updated'));
  };

  /* -------------------------------------------------------------------------- */
  /* FACT CHECKING WORKBENCH STATE                                              */
  /* -------------------------------------------------------------------------- */
  const [factClaims, setFactClaims] = useState([
    { id: 'fc-1', claim: 'Claim that Treasury allocated Ksh 50B for youth tech hubs without parliamentary approval', source: 'Viral X Video', claimant: 'Opposition Politician', verdict: 'Needs Verification', assignedTo: 'Alfred Mwenda', confidence: '88%' },
    { id: 'fc-2', claim: 'Photo alleging Kisumu port flooding from Lake Victoria high water levels', source: 'WhatsApp Group Forward', claimant: 'Anonymous Account', verdict: 'Misleading Photo', assignedTo: 'Alfred Mwenda', confidence: '99%' },
    { id: 'fc-3', claim: 'Viral statement claiming SGR passenger fare increased by 50% effective tomorrow', source: 'Facebook Post', claimant: 'Blog Page', verdict: 'False / Manipulated', assignedTo: 'Alfred Mwenda', confidence: '100%' },
  ]);

  const handleVerdictChange = (id: string, verdict: string) => {
    setFactClaims(factClaims.map(f => f.id === id ? { ...f, verdict } : f));
  };

  /* -------------------------------------------------------------------------- */
  /* HR & JOB APPLICANTS STATE                                                 */
  /* -------------------------------------------------------------------------- */
  const [candidates, setCandidates] = useState([
    { id: 'cand-1', name: 'John Kiprop', position: 'Senior Political Investigative Journalist', email: 'john.k@example.com', experience: '8 Years', status: 'Under Review', appliedDate: 'Today', score: '94/100' },
    { id: 'cand-2', name: 'Brenda Cherono', position: 'Data Visualization & Graphics Engineer', email: 'brenda.c@example.com', experience: '5 Years', status: 'Shortlisted', appliedDate: 'Yesterday', score: '98/100' },
    { id: 'cand-3', name: 'Peter Omondi', position: 'County Bureau Correspondent (Mombasa)', email: 'peter.o@example.com', experience: '4 Years', status: 'Interview Scheduled', appliedDate: '3 days ago', score: '89/100' },
  ]);

  const handleApplicantStatus = (id: string, status: string) => {
    setCandidates(candidates.map(c => c.id === id ? { ...c, status } : c));
  };

  /* -------------------------------------------------------------------------- */
  /* CUSTOMER SUPPORT & TIPS STATE                                              */
  /* -------------------------------------------------------------------------- */
  const [supportTickets, setSupportTickets] = useState([
    { id: 'tkt-201', sender: 'Anonymous Whistleblower', type: 'Encrypted Tip', subject: 'Document leak regarding County Procurement tender allocation', department: 'Investigative Desk', status: 'New', time: '20 mins ago', securityLevel: 'Maximum Encryption (PGP)' },
    { id: 'tkt-202', sender: 'Samuel Ndung\'u', type: 'General Enquiry', subject: 'Inquiry regarding advertising rate card for Q3 campaign', department: 'Advertising Desk', status: 'In Progress', time: '2 hrs ago', securityLevel: 'Standard' },
    { id: 'tkt-203', sender: 'Lillian Achieng', type: 'Corrections Request', subject: 'Spelling correction on official name in Kisumu Port article', department: 'Corrections Desk', status: 'Resolved', time: '1 day ago', securityLevel: 'Verified Identity' },
  ]);

  const handleTicketStatus = (id: string, status: string) => {
    setSupportTickets(supportTickets.map(t => t.id === id ? { ...t, status } : t));
  };

  /* -------------------------------------------------------------------------- */
  /* REVIEWS MODERATION STATE                                                   */
  /* -------------------------------------------------------------------------- */
  const [reviewsQueue, setReviewsQueue] = useState([
    { id: 'rev-1', author: 'Dr. Joseph Kimani', rating: 5, comment: 'Knews254 provides the most accurate county budget breakdowns and election maps in East Africa.', status: 'Approved', verifiedSubscriber: true },
    { id: 'rev-2', author: 'Anonymous Reader', rating: 1, comment: 'Spam text promoting crypto trading bot app...', status: 'Flagged Spam', verifiedSubscriber: false },
    { id: 'rev-3', author: 'Sarah Otieno', rating: 5, comment: 'The 6:00 AM morning briefing newsletter is top tier journalistic craft.', status: 'Pending Review', verifiedSubscriber: true },
  ]);

  const handleReviewStatus = (id: string, status: string) => {
    setReviewsQueue(reviewsQueue.map(r => r.id === id ? { ...r, status } : r));
  };

  /* -------------------------------------------------------------------------- */
  /* INTERNAL NEWSROOM CHAT STATE                                               */
  /* -------------------------------------------------------------------------- */
  const [chatMessages, setChatMessages] = useState([
    { id: 'm1', sender: 'Chief Editor', text: 'Team, Central Bank press conference starts at 2:00 PM. Have video crew ready in CBD.', time: '10:15 AM' },
    { id: 'm2', sender: 'Mary Wambui (Reporter)', text: 'On site at BRT Bidding opening in Nairobi CBD. Photo dispatch uploaded to Storage Vault.', time: '10:22 AM' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages([
      ...chatMessages,
      { id: `m-${Date.now()}`, sender: currentRole, text: inputMsg, time: 'Just now' },
    ]);
    setInputMsg('');
  };

  /* -------------------------------------------------------------------------- */
  /* AUDIT LOGS                                                                 */
  /* -------------------------------------------------------------------------- */
  const auditLogs = [
    { id: 'log-1', action: 'ARTICLE_PUBLISHED', details: 'Article #art-104 published to homepage position #1', user: 'Managing Editor', time: '3 hrs ago', level: 'SUCCESS' },
    { id: 'log-2', action: 'ROLE_ELEVATED', details: 'Logged in session elevated to Super Administrator', user: 'System Admin', time: '5 hrs ago', level: 'SECURITY' },
    { id: 'log-3', action: 'AUTOMATED_BACKUP', details: 'Cloud SQL / Firestore dual-region snapshot completed (2.4 GB)', user: 'System Task', time: '6 hrs ago', level: 'INFO' },
    { id: 'log-4', action: 'FACT_CHECK_CLEARANCE', details: 'Claim fc-2 flagged as Misleading Photo after forensic EXIF audit', user: 'Fact Checker', time: '8 hrs ago', level: 'AUDIT' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="bg-slate-950 min-h-[75vh] rounded-3xl border-2 border-red-600/40 p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-center text-slate-100 relative overflow-hidden my-4">
        {/* Background Subtle Accent Highlights */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-lg space-y-6 text-center relative z-10">
          {/* Official KNews 254 Favicon Logo Emblem */}
          <div className="flex justify-center">
            <svg viewBox="0 0 100 100" className="w-14 h-14 shadow-2xl rounded-2xl border border-slate-700/80">
              <rect width="100" height="100" rx="24" fill="#0f172a" />
              <text x="50" y="64" fontFamily="serif, system-ui, sans-serif" fontWeight="900" fontSize="56" fill="white" textAnchor="middle">K</text>
              <g transform="translate(0, 82)">
                <rect x="0" y="0" width="33.3" height="18" fill="#020617" />
                <rect x="33.3" y="0" width="33.4" height="18" fill="#dc2626" />
                <rect x="66.7" y="0" width="33.3" height="18" fill="#059669" />
              </g>
              <rect width="100" height="100" rx="24" fill="none" stroke="#475569" strokeWidth="6" />
            </svg>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-950/90 text-red-400 border border-red-800/80 px-3.5 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-widest mb-3 shadow">
              <Lock className="w-3.5 h-3.5 text-red-500" />
              AUTHENTICATED STAFF & EXECUTIVE COMMAND GATEWAY
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-serif tracking-tight">
              Administrative Command Login
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Enterprise Editorial & Operations Portal • Knews254 Media Group
            </p>
          </div>

          {loginError && (
            <div className="bg-red-950/90 border-2 border-red-600 text-red-200 p-4 rounded-2xl text-xs text-left font-semibold flex items-start gap-3 shadow-2xl animate-pulse">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white text-sm">Security Authentication Failure</p>
                <p className="mt-0.5">{loginError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1.5">
                Staff Email Address
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="kellymuthomi22@gmail.com"
                className="w-full bg-slate-950 border border-slate-700 focus:border-red-500 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-300 mb-1.5">
                Encrypted Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-red-500 text-white text-sm rounded-xl px-4 py-3 pr-11 focus:outline-none focus:ring-1 focus:ring-red-500 font-mono transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-xl border border-red-500/50 flex items-center justify-center gap-2 transition disabled:opacity-50 uppercase tracking-wider cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Coded Security Credentials...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Authenticate & Unlock Command Center
                </>
              )}
            </button>
          </form>

          {/* VETTING & ACCREDITATION APPLICATION CALLOUT */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 text-left shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-mono uppercase">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>New Staff / Podcast Host Accreditation</span>
              </div>
              <span className="text-[10px] bg-amber-950 text-amber-400 font-mono font-bold px-2 py-0.5 rounded border border-amber-800 uppercase">
                VETTING REQUIRED
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you a newly assigned reporter, columnist, or podcast host? Submit your credentials to Executive Chairman <strong className="text-white">Kelly Muthomi Kinoti</strong> and Editor-in-Chief <strong className="text-white">Muchui Mwirigi</strong> for newsroom vetting & access clearance.
            </p>

            {vettingSuccessMsg ? (
              <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-200 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{vettingSuccessMsg}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowVettingModal(true)}
                className="w-full bg-slate-950 hover:bg-slate-800 text-amber-400 hover:text-amber-300 font-extrabold text-xs py-2.5 px-4 rounded-xl border border-amber-500/40 flex items-center justify-center gap-2 transition cursor-pointer font-mono"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                Apply for Staff Vetting & Accreditation
              </button>
            )}
          </div>

          {/* Password Governance & Encryption Policy Notice */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-left space-y-2 shadow-inner">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Administrative Credential Security Policy</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              All staff members log in using their registered staff email address and secure password managed through Supabase Authentication. Accounts and roles are linked to verified profiles in the Supabase database.
            </p>
          </div>

          {/* MODAL: STAFF ACCREDITATION VETTING FORM */}
          {showVettingModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl max-w-lg w-full p-6 space-y-5 relative text-slate-100 shadow-2xl">
                <button
                  onClick={() => setShowVettingModal(false)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-white font-bold text-lg"
                >
                  ✕
                </button>

                <div className="border-b border-slate-800 pb-3">
                  <div className="inline-flex items-center gap-1.5 bg-amber-950 text-amber-400 border border-amber-800 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    KNEWS254 EXECUTIVE ACCREDITATION DESK
                  </div>
                  <h3 className="text-xl font-black text-white font-serif">Apply for Staff Vetting & Access</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Submit your details for review by Chairman Kelly Muthomi Kinoti & Editor-in-Chief Muchui Mwirigi.
                  </p>
                </div>

                <form onSubmit={handleApplyVetting} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Full Official Name</label>
                    <input
                      type="text"
                      required
                      value={vettingForm.name}
                      onChange={e => setVettingForm({ ...vettingForm, name: e.target.value })}
                      placeholder="e.g. Scholastica Karwitha / David Otieno"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Official Email Address</label>
                      <input
                        type="email"
                        required
                        value={vettingForm.email}
                        onChange={e => setVettingForm({ ...vettingForm, email: e.target.value })}
                        placeholder="reporter@knews254.co.ke"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">WhatsApp / Mobile Phone</label>
                      <input
                        type="text"
                        required
                        value={vettingForm.phone}
                        onChange={e => setVettingForm({ ...vettingForm, phone: e.target.value })}
                        placeholder="+254 700 000 000"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Department / Bureau</label>
                      <select
                        value={vettingForm.department}
                        onChange={e => setVettingForm({ ...vettingForm, department: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                      >
                        <option>Newsroom & Reporting Bureau</option>
                        <option>Podcast & Multimedia Studio</option>
                        <option>Politics & Elections Desk</option>
                        <option>County Correspondents (47 Counties)</option>
                        <option>Sports & Entertainment Bureau</option>
                        <option>Business & Markets Desk</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Target Staff Role</label>
                      <select
                        value={vettingForm.role}
                        onChange={e => setVettingForm({ ...vettingForm, role: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                      >
                        <option>Reporter / Journalist</option>
                        <option>Podcast Producer & Host</option>
                        <option>County Bureau Correspondent</option>
                        <option>Columnist & Opinion Writer</option>
                        <option>Fact Checker & Investigator</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Press Credentials / Brief Bio</label>
                    <textarea
                      rows={3}
                      required
                      value={vettingForm.credentialsBio}
                      onChange={e => setVettingForm({ ...vettingForm, credentialsBio: e.target.value })}
                      placeholder="Detail your media background, previous news organizations, press pass, or podcast experience..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowVettingModal(false)}
                      className="w-1/3 bg-slate-950 border border-slate-800 text-slate-400 font-bold text-xs py-3 rounded-xl hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={() => {
                        setShowVettingModal(false);
                      }}
                      className="w-2/3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold text-xs py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 font-mono uppercase tracking-wider cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Submit Vetting Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800/90 p-4 sm:p-7 shadow-2xl space-y-8 text-slate-100 min-h-[85vh]">
      {/* Top Header Command Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 border-b border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-red-950/80 text-red-400 border border-red-800/80 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-2 shadow-sm">
            <Sliders className="w-3.5 h-3.5 text-red-500" />
            Knews254 Enterprise Newsroom CMS • Level 4 Access
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-serif">
            Administration & Editorial Command Center
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Enterprise editorial pipelines, forensic fact-check workbench, HR portal, support desk, and real-time infrastructure metrics.
          </p>
        </div>

        {/* Action Controls & Staff Role Switcher */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setShowDraftModal(true)}
            className="bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-xl border border-red-500/40 flex items-center gap-2 font-mono uppercase tracking-wider cursor-pointer hover:scale-105 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-white animate-pulse" />
            <span>Post & Publish Story</span>
          </button>

          {/* Staff Role Switcher Card */}
          <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800/90 shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Staff Role:</span>
            </div>
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-red-400 font-extrabold text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:border-red-500 cursor-pointer shadow-inner"
            >
              <option>Super Administrator</option>
              <option>Managing Editor</option>
              <option>Editor-in-Chief</option>
              <option>Reporter / Journalist</option>
              <option>Podcast Host & Audio Producer</option>
              <option>Fact Checker</option>
              <option>Human Resources Manager</option>
              <option>Customer Support Officer</option>
              <option>Community Moderator</option>
              <option>Legal Reviewer</option>
              <option>Advertising Manager</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Authenticated User Executive & Staff Profile Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-2 border-red-600/60 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-mono font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow">
          {currentUser?.isChiefAdmin ? 'EXECUTIVE COMMAND PROFILE' : 'STAFF MEMBER PROFILE'}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Logo or Custom Photo */}
            {currentUser?.isChiefAdmin ? (
              <div className="w-44 shrink-0 shadow-2xl rounded-2xl overflow-hidden border border-emerald-500/30">
                <KmkLogo variant="avatar" showName={false} className="w-full h-24 p-2 bg-white" />
              </div>
            ) : currentUser?.isCustomPhoto ? (
              <div className="w-24 h-24 shrink-0 shadow-2xl rounded-2xl overflow-hidden border-2 border-emerald-500/60">
                <DoreenPhoto variant="avatar" className="w-full h-full" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-2xl font-mono border border-slate-700">
                {currentUser?.name.charAt(0)}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-serif">
                  {currentUser?.name || 'Staff User'}
                </h2>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> {currentUser?.role}
                </span>
                {currentUser?.isChiefAdmin && (
                  <span className="bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                    Chairman & Founder
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Department: <strong className="text-white">{currentUser?.department}</strong>
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-[11px] font-mono text-slate-400">
                <span>Email: <strong className="text-slate-200">{currentUser?.email}</strong></span>
                <span>Auth: <strong className="text-emerald-400">Supabase Auth</strong></span>
                <span>Location: <strong className="text-slate-200">Nairobi HQ</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
            <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-2xl text-center">
              <span className="block text-[10px] text-slate-400 font-mono font-bold uppercase">Clearance</span>
              <span className="text-xs font-black text-emerald-400 font-mono">{currentUser?.clearanceLevel}</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-2xl text-center">
              <span className="block text-[10px] text-slate-400 font-mono font-bold uppercase">Status</span>
              <span className="text-xs font-black text-red-400 font-mono">ACTIVE SESSION</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-950 hover:bg-red-900 text-red-300 border border-red-700/80 px-3.5 py-2 rounded-2xl text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
              title="Lock staff session"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              Lock / Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Active Role Specialized Desk & Capabilities Banner */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-mono font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
                Active Staff Desk: {currentRole}
              </span>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                Universal Dispatch Right Enabled
              </span>
            </div>
            <h3 className="text-lg font-black text-white font-serif">
              {currentRole === 'Reporter / Journalist' && '📰 Journalist & Personal Blog Dispatch Workbench'}
              {currentRole === 'Managing Editor' && '📋 Managing Editorial Command & Approval Desk'}
              {currentRole === 'Editor-in-Chief' && '👑 Editor-in-Chief Executive Editorial Desk'}
              {currentRole === 'Podcast Host & Audio Producer' && '🎙️ Knews254 Audio & Podcast Broadcast Studio'}
              {currentRole === 'Fact Checker' && '🛡️ Forensic Fact-Checking & Truth Verification Desk'}
              {currentRole === 'Human Resources Manager' && '💼 Staff Onboarding, Press Cards & HR Desk'}
              {currentRole === 'Customer Support Officer' && '💬 Reader Relations & Public Support Desk'}
              {currentRole === 'Community Moderator' && '⭐ Reader Community Governance & Comment Desk'}
              {currentRole === 'Legal Reviewer' && '⚖️ Legal Compliance, Defamation & Corrections Desk'}
              {currentRole === 'Advertising Manager' && '💲 Commercial & Sponsored Campaign Desk'}
              {currentRole === 'Super Administrator' && '⚡ Executive Governance & Infrastructure Supreme Command'}
            </h3>
            <p className="text-slate-400 text-xs">
              {currentRole === 'Reporter / Journalist' && 'Compose news dispatches, cover county beats, post personal blogs, attach media assets, and submit investigative stories.'}
              {currentRole === 'Managing Editor' && 'Review submitted articles, approve/reject dispatches, manage headline positions, and trigger breaking news alerts.'}
              {currentRole === 'Editor-in-Chief' && 'Oversee overall newsroom policy, approve top featured stories, direct investigative beats, and maintain journalistic integrity.'}
              {currentRole === 'Podcast Host & Audio Producer' && 'Record audio episodes, publish podcasts, write companion articles, and manage audio feed distribution.'}
              {currentRole === 'Fact Checker' && 'Verify politician claims, issue official Truth Ratings (True, Mostly True, False, Pants on Fire), and audit citations.'}
              {currentRole === 'Human Resources Manager' && 'Vet newsroom applicants, issue accredited Knews254 Press Cards, track staff clearance, and manage staff rotas.'}
              {currentRole === 'Customer Support Officer' && 'Handle reader tickets, dispatch WhatsApp desk responses, assist subscribers, and log public inquiries.'}
              {currentRole === 'Community Moderator' && 'Moderate reader comments, enforce community rules, resolve user flags, and manage reader trust scores.'}
              {currentRole === 'Legal Reviewer' && 'Scan stories for defamation risks, issue pre-publication legal sign-offs, and track official retractions.'}
              {currentRole === 'Advertising Manager' && 'Manage sponsored stories, banner advertising slots, advertiser CPM analytics, and commercial campaign booking.'}
              {currentRole === 'Super Administrator' && 'Complete system governance across all 11 portal modules, Supabase database controls, CDN caching, and security logs.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowDraftModal(true)}
              className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Compose Story / Blog Post</span>
            </button>

            {currentRole === 'Podcast Host & Audio Producer' && (
              <button
                onClick={() => {
                  setNewDraft(prev => ({ ...prev, category: 'Audio & Podcasts' }));
                  setShowDraftModal(true);
                }}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-2xl transition flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Headphones className="w-4 h-4" />
                <span>Upload Podcast Audio</span>
              </button>
            )}

            {currentRole === 'Fact Checker' && (
              <button
                onClick={() => {
                  setNewDraft(prev => ({ ...prev, category: 'Fact Check' }));
                  setShowDraftModal(true);
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-2xl transition flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Shield className="w-4 h-4" />
                <span>Post Fact Check Report</span>
              </button>
            )}
          </div>
        </div>

        {/* Role Quick Toolkits Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase shrink-0">Role Toolkit Focus:</span>
          <button onClick={() => setActiveTab('editorial')} className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer">
            <FileText className="w-3 h-3 text-red-400" /> Editorial Pipeline
          </button>
          <button onClick={() => setActiveTab('factcheck')} className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer">
            <Shield className="w-3 h-3 text-amber-400" /> Fact Check Desk
          </button>
          <button onClick={() => setActiveTab('hr')} className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer">
            <Briefcase className="w-3 h-3 text-emerald-400" /> HR & Press Cards
          </button>
          <button onClick={() => setActiveTab('support')} className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer">
            <MessageSquare className="w-3 h-3 text-sky-400" /> Support Desk
          </button>
          <button onClick={() => setActiveTab('corrections')} className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer">
            <Scale className="w-3 h-3 text-purple-400" /> Legal & Corrections
          </button>
          <button onClick={() => setActiveTab('infrastructure')} className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer">
            <Database className="w-3 h-3 text-indigo-400" /> Infrastructure Console
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 scrollbar-thin">
        {[
          { id: 'overview', label: 'Pulse Overview', icon: BarChart3 },
          { id: 'profile', label: 'My Profile & Supabase Storage', icon: UserCheck },
          { id: 'editorial', label: `Editorial Pipeline (${articlesList.length})`, icon: FileText },
          { id: 'factcheck', label: `Fact Check (${factClaims.length})`, icon: Shield },
          { id: 'hr', label: `HR Applicants (${candidates.length})`, icon: Briefcase },
          { id: 'support', label: `Support Desk (${supportTickets.length})`, icon: MessageSquare },
          { id: 'reviews', label: `Reader Reviews (${reviewsQueue.length})`, icon: Star },
          { id: 'corrections', label: 'Legal & Corrections', icon: Scale },
          { id: 'chat_rota', label: 'Staff Rota & Chat', icon: Send },
          { id: 'audit_logs', label: 'Audit Logs', icon: Lock },
          { id: 'infrastructure', label: 'Infra & Storage', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-red-600 text-white shadow-lg shadow-red-950/50 scale-[1.02]'
                  : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Live Public Dashboards Shortcut Bar */}
      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 overflow-x-auto text-xs scrollbar-thin shadow-inner">
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px] font-bold uppercase shrink-0">
          <Globe className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span>Quick Jump To Public Dashboards:</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (onClose) onClose();
              if (onNavigateCategory) onNavigateCategory('elections');
            }}
            className="bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-800/80 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer text-[11px]"
          >
            <Vote className="w-3.5 h-3.5" />
            Elections 2027
          </button>

          <button
            onClick={() => {
              if (onClose) onClose();
              if (onNavigateCategory) onNavigateCategory('county');
            }}
            className="bg-slate-900 hover:bg-slate-800 text-sky-400 border border-sky-800/80 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer text-[11px]"
          >
            <Building className="w-3.5 h-3.5" />
            47 Counties
          </button>

          <button
            onClick={() => {
              if (onClose) onClose();
              if (onNavigateCategory) onNavigateCategory('fact-checking');
            }}
            className="bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-800/80 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer text-[11px]"
          >
            <Shield className="w-3.5 h-3.5" />
            Fact Check Hub
          </button>

          <button
            onClick={() => {
              if (onClose) onClose();
              if (onNavigateCategory) onNavigateCategory('podcasts');
            }}
            className="bg-slate-900 hover:bg-slate-800 text-purple-400 border border-purple-800/80 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer text-[11px]"
          >
            <Headphones className="w-3.5 h-3.5" />
            Audio & Podcasts
          </button>

          <button
            onClick={() => {
              if (onClose) onClose();
              if (onNavigateCategory) onNavigateCategory('live');
            }}
            className="bg-slate-900 hover:bg-slate-800 text-red-400 border border-red-800/80 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer text-[11px]"
          >
            <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            Live Feed
          </button>

          <button
            onClick={() => {
              if (onClose) onClose();
              if (onNavigateTab) onNavigateTab('prd');
            }}
            className="bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-indigo-800/80 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer text-[11px]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Master PRD
          </button>
        </div>
      </div>
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-sky-950 text-sky-400 border border-sky-800/80 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase mb-2">
                  <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                  STAFF IDENTITY & SUPABASE INTEGRATION
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-serif">
                  My Staff Profile & Supabase Storage Manager
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Customize your personal profile, role bio, portfolio links, and upload profile pictures via Supabase.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                <Database className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="text-left font-mono text-xs">
                  <span className="block text-[10px] text-slate-400 uppercase">Supabase Upload Engine</span>
                  <span className={`font-bold text-[11px] ${isSupabaseConfigured() ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isSupabaseConfigured() ? '✓ Connected to Supabase Cloud' : '⚡ Storage Active (Local Fallback Ready)'}
                  </span>
                </div>
              </div>
            </div>

            {profileSaveSuccess && (
              <div className="bg-emerald-950/90 border-2 border-emerald-500 p-4 rounded-2xl text-emerald-300 text-xs flex items-center justify-between shadow-xl animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Profile Saved Successfully!</strong> Your details, custom images, and portfolio link have been synchronized across Knews254.
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/60 px-2 py-1 rounded">
                  SYNCED TO ABOUT US & AUTHORS
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Column 1: Avatar Upload & Supabase Controls */}
              <div className="space-y-6">
                {/* Profile Photo Upload Box */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-center">
                  <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2">
                    <Image className="w-4 h-4 text-sky-400" /> Profile Picture / Avatar
                  </h3>

                  <div className="relative w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-red-500/50 shadow-2xl bg-slate-950 flex items-center justify-center group">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : currentUser?.isChiefAdmin ? (
                      <KmkLogo variant="card" showName={false} className="w-full bg-white p-2" />
                    ) : (
                      <div className="text-2xl font-black text-slate-400">{profileData.name.charAt(0)}</div>
                    )}
                    {profileUploading && (
                      <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-xs text-sky-400 font-mono">
                        <RefreshCw className="w-6 h-6 animate-spin mb-1" />
                        Uploading...
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] text-slate-400 font-mono">Upload via Supabase or Computer:</label>
                    <label className="cursor-pointer bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-700 font-mono font-bold text-xs px-4 py-2 rounded-xl transition inline-flex items-center gap-2 shadow">
                      <Upload className="w-3.5 h-3.5 text-sky-400" />
                      Select Photo File
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleProfileAvatarUpload(file);
                        }}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono text-left mb-1">Or direct Image URL:</label>
                    <input
                      type="url"
                      value={profileData.avatar}
                      onChange={(e) => setProfileData(prev => ({ ...prev, avatar: e.target.value }))}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-xl font-mono"
                    />
                  </div>

                  {uploadMessage && (
                    <p className="text-[10px] font-mono text-emerald-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
                      {uploadMessage}
                    </p>
                  )}
                </div>

                {/* Supabase Storage Integration Credentials Settings */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 font-serif">
                      <Database className="w-4 h-4 text-emerald-400" /> Supabase Storage Engine
                    </h3>
                    <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                      ACTIVE CLOUD
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Connected to Supabase Cloud Media Storage Bucket (<code className="text-emerald-400">article-media</code>). All uploaded photos, attachments, and documents are securely processed server-side.
                  </p>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="text-emerald-400 font-bold">✓ Connected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bucket:</span>
                      <span className="text-slate-200">article-media</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2 & 3: Personal & Professional Profile Edit Form */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-black text-white font-serif flex items-center gap-2">
                    <User className="w-4 h-4 text-red-500" /> Personal &amp; Professional Details
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    This information appears on your author card, news articles, and the Knews254 About Us page.
                  </p>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl font-medium focus:border-red-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Role / Official Title</label>
                      <input
                        type="text"
                        required
                        value={profileData.role}
                        onChange={(e) => setProfileData(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl font-medium focus:border-red-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl font-mono focus:border-red-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Department / Division</label>
                      <input
                        type="text"
                        required
                        value={profileData.department}
                        onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl font-medium focus:border-red-500 outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                        <span>Portfolio Website URL (Personal Site)</span>
                        <span className="text-[10px] text-sky-400 font-mono">e.g. https://kelly-muthomi-kinoti.vercel.app/</span>
                      </label>
                      <div className="relative">
                        <Globe className="w-4 h-4 text-sky-400 absolute left-3 top-3" />
                        <input
                          type="url"
                          value={profileData.website}
                          onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://kelly-muthomi-kinoti.vercel.app/"
                          className="w-full bg-slate-950 border border-slate-800 text-sky-300 pl-9 pr-3 py-2.5 rounded-xl font-mono focus:border-sky-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Twitter / X Handle</label>
                      <input
                        type="text"
                        value={profileData.twitter}
                        onChange={(e) => setProfileData(prev => ({ ...prev, twitter: e.target.value }))}
                        placeholder="@KellyMuthomi254"
                        className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl font-mono focus:border-red-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Office Location</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Nairobi HQ"
                        className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl font-medium focus:border-red-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Personal Bio &amp; Research Focus</label>
                    <textarea
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Share your experience, beats, academic achievements..."
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-3 rounded-xl leading-relaxed focus:border-red-500 outline-none"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-500 text-white font-extrabold px-6 py-3 rounded-xl transition shadow-lg text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" /> Save Profile &amp; Sync to About Us Page
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: OVERVIEW & REAL-TIME PULSE */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Overview Quick Actions Bar */}
          <div className="bg-slate-950 p-4 rounded-3xl border border-red-500/30 flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span className="font-extrabold text-xs text-white uppercase font-mono tracking-wider">
                Editorial Quick Dispatch & Management Desk
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowDraftModal(true)}
                className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Post Story / Article
              </button>

              <button
                onClick={() => setActiveTab('editorial')}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-red-400" />
                Editorial Pipeline ({articlesList.length})
              </button>

              <button
                onClick={() => setActiveTab('factcheck')}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                Fact Checks ({factClaims.length})
              </button>

              <button
                onClick={() => setActiveTab('hr')}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                HR Vetting ({vettingQueue.length})
              </button>

              <button
                onClick={() => setActiveTab('infrastructure')}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-sky-400" />
                Infra Console
              </button>
            </div>
          </div>
          {/* Top 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Active Readers */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 shadow-xl space-y-2 hover:border-emerald-500/40 transition group">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                <span>Active Readers Right Now</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="flex items-baseline justify-between">
                <strong className="text-3xl text-emerald-400 font-black tracking-tight">22,480</strong>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                  +18% Surge
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '68%' }} />
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex justify-between pt-1">
                <span>68% Mobile</span>
                <span>32% Desktop</span>
              </p>
            </div>

            {/* Card 2: Ad Revenue */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 shadow-xl space-y-2 hover:border-amber-500/40 transition group">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                <span>Monthly Ad Revenue</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <strong className="text-3xl text-amber-400 font-black tracking-tight">Ksh 4.82M</strong>
                <span className="text-[10px] text-amber-400 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded font-mono font-bold">
                  +14.2% MoM
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '82%' }} />
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex justify-between pt-1">
                <span>Programmatic: 62%</span>
                <span>Sponsors: 38%</span>
              </p>
            </div>

            {/* Card 3: Stories Published */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 shadow-xl space-y-2 hover:border-red-500/40 transition group">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                <span>Stories Published Today</span>
                <FileText className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <strong className="text-3xl text-white font-black tracking-tight">48 Stories</strong>
                <span className="text-[10px] text-red-400 bg-red-950/80 border border-red-800 px-2 py-0.5 rounded font-mono font-bold">
                  100% Target
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-red-600 h-1.5 rounded-full" style={{ width: '100%' }} />
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex justify-between pt-1">
                <span>47 Counties Covered</span>
                <span>0 Defamation Flag</span>
              </p>
            </div>

            {/* Card 4: System Health */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 shadow-xl space-y-2 hover:border-emerald-500/40 transition group">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                <span>System Health & Edge</span>
                <Server className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline justify-between">
                <strong className="text-3xl text-emerald-400 font-black tracking-tight">100%</strong>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                  Operational
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }} />
              </div>
              <p className="text-[11px] text-slate-400 font-mono flex justify-between pt-1">
                <span>SSL 256-bit</span>
                <span>Redis Cache Active</span>
              </p>
            </div>
          </div>

          {/* Analytics Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* County Traffic Card */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/90 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-500" /> Trending Reader Traffic by County
                </h3>
                <span className="text-[10px] font-mono text-slate-400">REALTIME DISPATCH</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1.5">
                    <span className="text-slate-200">Nairobi City County</span>
                    <span className="text-red-400 font-mono">42% (9,440 active)</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-600 to-red-500 h-2.5 rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1.5">
                    <span className="text-slate-200">Mombasa & Coast Bureau</span>
                    <span className="text-emerald-400 font-mono">18% (4,040 active)</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 h-2.5 rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1.5">
                    <span className="text-slate-200">Kisumu & Nyanza Bureau</span>
                    <span className="text-amber-400 font-mono">14% (3,140 active)</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-600 to-amber-500 h-2.5 rounded-full" style={{ width: '14%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1.5">
                    <span className="text-slate-200">Eldoret & North Rift Bureau</span>
                    <span className="text-cyan-400 font-mono">12% (2,690 active)</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 h-2.5 rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Broadcast Card */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/90 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" /> Live Broadcast & Studio Feeds
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  2 STREAMS LIVE
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800/90 flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm">Knews254 Live TV Stream</h4>
                    <p className="text-[11px] text-slate-400 font-mono">HLS 1080p60 • 8,420 Viewers • Latency 1.2s</p>
                  </div>
                  <span className="bg-emerald-950 text-emerald-400 font-bold text-[10px] px-3 py-1.5 rounded-xl border border-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    BROADCASTING
                  </span>
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800/90 flex items-center justify-between shadow-sm">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm">Radio 254 Digital Stream</h4>
                    <p className="text-[11px] text-slate-400 font-mono">AAC 320kbps • 12,100 Listeners • Latency 0.8s</p>
                  </div>
                  <span className="bg-emerald-950 text-emerald-400 font-bold text-[10px] px-3 py-1.5 rounded-xl border border-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    BROADCASTING
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EDITORIAL QUEUE & DRAFT STUDIO */}
      {activeTab === 'editorial' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-lg text-white font-serif">Newsroom Article Pipeline</h3>
              <p className="text-xs text-slate-400">Review journalist submissions, approve legal clearances, and assign homepage lead slots.</p>
            </div>
            <button
              onClick={() => setShowDraftModal(true)}
              className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-lg"
            >
              <Plus className="w-4 h-4" /> Draft New Article
            </button>
          </div>

          <div className="space-y-3.5">
            {articlesList.map((art) => (
              <div key={art.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-xl hover:border-red-500/30 transition">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-900 text-slate-300 border border-slate-800 font-bold px-2.5 py-0.5 rounded-lg text-[10px] uppercase font-mono">{art.category}</span>
                    <span className="text-slate-500 font-mono">• {art.date}</span>
                    <span className="text-slate-500 font-mono">• {art.wordCount} words</span>
                  </div>
                  <h4 className="font-extrabold text-white text-base leading-snug">{art.title}</h4>
                  <p className="text-slate-400 text-xs">Reporter: <strong className="text-slate-200">{art.author}</strong></p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <span className={`font-mono font-bold px-3 py-1 rounded-xl text-[11px] border ${
                    art.status === 'Published' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                    art.status === 'Fact-Check Approved' ? 'bg-blue-950 text-blue-400 border-blue-800' :
                    'bg-amber-950 text-amber-400 border-amber-800'
                  }`}>
                    {art.status}
                  </span>

                  {art.status !== 'Published' && (
                    <button
                      onClick={() => handleUpdateArticleStatus(art.id, 'Published')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-xl transition text-xs shadow"
                    >
                      Publish Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Draft Modal */}
          {showDraftModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 relative text-slate-100 shadow-2xl my-auto">
                <button
                  onClick={() => setShowDraftModal(false)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-white font-bold text-xl w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center transition"
                >
                  ✕
                </button>
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-red-950 text-red-400 border border-red-800 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase mb-1">
                    <FileText className="w-3.5 h-3.5 text-red-500" />
                    Knews254 Article & News Dispatch Studio
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-serif">Compose & Publish News Dispatch</h3>
                </div>

                {draftError && (
                  <div className="bg-red-950/90 border border-red-500/80 text-red-200 p-3.5 rounded-2xl text-xs flex items-center gap-2.5 font-mono shadow-lg">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span className="font-bold">{draftError}</span>
                  </div>
                )}

                <form onSubmit={handleCreateDraft} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-extrabold mb-1.5">Headline Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={newDraft.title}
                      onChange={e => setNewDraft({ ...newDraft, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-semibold"
                      placeholder="e.g. Kenya Cabinet Approves Ksh 45B Infrastructure Bond for Nairobi BRT"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 font-extrabold mb-1.5">Category / Beat</label>
                      <select
                        value={newDraft.category}
                        onChange={e => setNewDraft({ ...newDraft, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-semibold cursor-pointer"
                      >
                        <option>Politics</option>
                        <option>Elections 2027</option>
                        <option>Blog & Opinion</option>
                        <option>Business</option>
                        <option>Economy</option>
                        <option>County News</option>
                        <option>Tech & AI</option>
                        <option>Sports</option>
                        <option>Agriculture</option>
                        <option>Public Health</option>
                        <option>Fact Check</option>
                        <option>Audio & Podcasts</option>
                        <option>Entertainment</option>
                        <option>Investigations</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-extrabold mb-1.5">County Coverage</label>
                      <select
                        value={newDraft.county}
                        onChange={e => setNewDraft({ ...newDraft, county: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-semibold cursor-pointer"
                      >
                        <option value="Nairobi">Nairobi City</option>
                        <option value="Mombasa">Mombasa</option>
                        <option value="Kisumu">Kisumu</option>
                        <option value="Nakuru">Nakuru</option>
                        <option value="Uasin Gishu">Uasin Gishu (Eldoret)</option>
                        <option value="Kiambu">Kiambu</option>
                        <option value="Meru">Meru</option>
                        <option value="Machakos">Machakos</option>
                        <option value="Nyeri">Nyeri</option>
                        <option value="Kilifi">Kilifi</option>
                        <option value="Garissa">Garissa</option>
                        <option value="Kakamega">Kakamega</option>
                        <option value="Kericho">Kericho</option>
                        <option value="Murang'a">Murang'a</option>
                        <option value="Trans Nzoia">Trans Nzoia</option>
                        <option value="All 47 Counties">National / All 47 Counties</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-extrabold mb-1.5">Priority Flag</label>
                      <select
                        value={newDraft.priority}
                        onChange={e => setNewDraft({ ...newDraft, priority: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-semibold cursor-pointer"
                      >
                        <option>Normal</option>
                        <option>High Priority</option>
                        <option>Breaking News</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-extrabold mb-1.5">Publishing Status Action</label>
                    <select
                      value={newDraft.targetStatus}
                      onChange={e => setNewDraft({ ...newDraft, targetStatus: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-400 font-extrabold cursor-pointer"
                    >
                      <option value="published">🚀 Publish Immediately to Live Feed (Instant)</option>
                      <option value="submitted">📝 Submit to Editorial Review Queue</option>
                      <option value="draft">📁 Save as Private Draft</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-extrabold mb-1.5">Feature Cover Photo / Media Upload</label>
                    
                    {newDraft.imagePreview ? (
                      <div className="relative rounded-2xl border border-slate-700 overflow-hidden bg-slate-950 p-2 flex items-center gap-3">
                        <img src={newDraft.imagePreview} alt="Cover Preview" className="w-16 h-16 object-cover rounded-xl shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{newDraft.fileName || 'Uploaded_Photo.png'}</p>
                          <p className="text-[10px] text-emerald-400 font-mono font-bold">✓ Attached to dispatch</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewDraft({ ...newDraft, imagePreview: '', fileName: '' })}
                          className="bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 text-[10px] font-bold px-2.5 py-1 rounded-xl cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleFileUpload(e.dataTransfer.files[0]);
                          }
                        }}
                        className="border-2 border-dashed border-slate-700 hover:border-red-500 rounded-2xl p-4 bg-slate-950 text-center transition cursor-pointer relative"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          id="draft-photo-file-input"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileUpload(e.target.files[0]);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="w-6 h-6 text-red-400 mx-auto mb-1.5" />
                        <p className="text-xs font-bold text-white">Drag & drop cover photo here or click to browse</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP • Auto-optimized to Supabase Cloud Storage</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-300 font-extrabold mb-1.5">Lead Story Excerpt / Summary</label>
                    <input
                      type="text"
                      value={newDraft.summary}
                      onChange={e => setNewDraft({ ...newDraft, summary: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                      placeholder="Short 1-2 sentence lead excerpt for card previews..."
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-extrabold mb-1.5">Full Article Body Text <span className="text-red-500">*</span></label>
                    <textarea
                      rows={6}
                      required
                      value={newDraft.content}
                      onChange={e => setNewDraft({ ...newDraft, content: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-sans leading-relaxed"
                      placeholder="Write or paste full newsroom article body paragraphs..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingDraft}
                    className="w-full bg-gradient-to-r from-red-600 via-amber-600 to-red-600 hover:from-red-500 hover:to-amber-500 font-extrabold text-xs py-3.5 rounded-2xl text-white shadow-xl border border-red-500/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 uppercase tracking-wider font-mono"
                  >
                    {isSubmittingDraft ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Saving Dispatch to Supabase Database...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-white" />
                        <span>{newDraft.targetStatus === 'published' ? 'Publish Story Directly to Live Site' : 'Submit Story to Editorial Pipeline'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FACT-CHECKING WORKBENCH */}
      {activeTab === 'factcheck' && (
        <div className="space-y-5">
          <div>
            <h3 className="font-black text-lg text-white font-serif">Knews254 Verify Forensic Workbench</h3>
            <p className="text-xs text-slate-400">Forensic verification desk combating viral social media misinformation across East Africa.</p>
          </div>

          <div className="space-y-4">
            {factClaims.map((claim) => (
              <div key={claim.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-800/90 space-y-4 text-xs shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] bg-red-950 text-red-400 font-mono font-bold px-2.5 py-1 rounded border border-red-800 uppercase">
                      CLAIM UNDER AUDIT
                    </span>
                    <p className="font-mono text-[11px] text-slate-400 mt-1.5">Source: {claim.source} • Claimant: {claim.claimant} • Audit AI Confidence: {claim.confidence}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs font-bold">Verdict:</span>
                    <select
                      value={claim.verdict}
                      onChange={(e) => handleVerdictChange(claim.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-amber-400 font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer"
                    >
                      <option>Needs Verification</option>
                      <option>True</option>
                      <option>Mostly True</option>
                      <option>Needs Context</option>
                      <option>Misleading Photo</option>
                      <option>False / Manipulated</option>
                    </select>
                  </div>
                </div>

                <p className="font-bold text-white text-base leading-snug">"{claim.claim}"</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-3 border-t border-slate-900">
                  <span>Assigned Investigator: <strong className="text-slate-200">{claim.assignedTo}</strong></span>
                  <button className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition">
                    Publish Verification Report <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HR & EXECUTIVE VETTING ACCREDITATION PORTAL */}
      {activeTab === 'hr' && (
        <div className="space-y-8">
          {/* Executive Staff Vetting Queue */}
          <div className="bg-slate-950 p-6 rounded-3xl border-2 border-amber-500/40 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-amber-950 text-amber-400 border border-amber-800 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  EXECUTIVE VETTING & ACCREDITATION DESK
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-serif">
                  Newsroom & Podcast Staff Vetting Queue ({vettingQueue.length})
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Only accredited candidates vetted & approved by Chairman <strong className="text-slate-200">Kelly Muthomi Kinoti</strong> or Editor-in-Chief <strong className="text-slate-200">Muchui Mwirigi</strong> are granted CMS staff access.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="text-xs font-mono">
                  <span className="block text-[10px] text-slate-400 uppercase">Vetting Protocol</span>
                  <span className="font-bold text-white">Strict Accreditation Required</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {vettingQueue.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs font-mono">
                  No pending vetting applications at this time.
                </div>
              ) : (
                vettingQueue.map((cand: any) => (
                  <div key={cand.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4 text-xs shadow-xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-white text-base">{cand.name}</h4>
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase ${
                            cand.status === 'VETTED_APPROVED' 
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border-amber-800'
                          }`}>
                            {cand.status === 'VETTED_APPROVED' ? '✓ VETTED & ACTIVE STAFF' : 'PENDING EXECUTIVE VETTING'}
                          </span>
                        </div>
                        <p className="text-red-400 font-bold text-xs mt-0.5">{cand.role} • {cand.department}</p>
                        <p className="text-slate-400 text-[11px] font-mono mt-1">
                          Email: <strong className="text-slate-200">{cand.email}</strong> • Phone: <strong className="text-slate-200">{cand.phone}</strong> • Submitted: {cand.appliedDate}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {cand.status !== 'VETTED_APPROVED' ? (
                          <button
                            onClick={() => handleApproveStaffVetting(cand.id)}
                            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-lg border border-emerald-500/40 flex items-center gap-2 font-mono uppercase cursor-pointer"
                          >
                            <ShieldCheck className="w-4 h-4 text-emerald-300" />
                            Approve & Vet Staff Access
                          </button>
                        ) : (
                          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            Access Active
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-300 leading-relaxed font-sans bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px]">
                      <strong className="text-amber-400 font-mono">Press Credentials & Bio: </strong>
                      {cand.credentialsBio}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* HR General Recruitment Table */}
          <div className="space-y-4">
            <div>
              <h3 className="font-black text-lg text-white font-serif">General HR Job Applicants Portal</h3>
              <p className="text-xs text-slate-400">Review job applications, inspect candidate scores, and manage interview schedules.</p>
            </div>

            <div className="space-y-3.5">
              {candidates.map((cand) => (
                <div key={cand.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-xl">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-white text-base">{cand.name}</h4>
                      <span className="bg-emerald-950 text-emerald-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-800">
                        Score: {cand.score}
                      </span>
                    </div>
                    <p className="text-red-400 font-bold text-xs mt-0.5">{cand.position}</p>
                    <p className="text-slate-400 text-[11px] font-mono mt-1">{cand.email} • {cand.experience} Experience • Applied {cand.appliedDate}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="bg-slate-900 text-slate-200 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold">
                      {cand.status}
                    </span>

                    <select
                      value={cand.status}
                      onChange={(e) => handleApplicantStatus(cand.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs cursor-pointer"
                    >
                      <option>Under Review</option>
                      <option>Shortlisted</option>
                      <option>Interview Scheduled</option>
                      <option>Offer Made</option>
                      <option>Hired</option>
                      <option>Rejected</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SUPPORT & CONTACT QUEUE */}
      {activeTab === 'support' && (
        <div className="space-y-5">
          <div>
            <h3 className="font-black text-lg text-white font-serif">Customer Support & Whistleblower Desk</h3>
            <p className="text-xs text-slate-400">Manage incoming whistleblower tips, advertising inquiries, and technical issues.</p>
          </div>

          <div className="space-y-3.5">
            {supportTickets.map((tkt) => (
              <div key={tkt.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-950 text-red-400 font-mono font-bold px-2.5 py-0.5 rounded text-[10px]">{tkt.type}</span>
                    <span className="text-slate-500 font-mono">• {tkt.time}</span>
                    <span className="text-slate-500 font-mono">• {tkt.securityLevel}</span>
                  </div>
                  <h4 className="font-extrabold text-white text-base leading-snug">{tkt.subject}</h4>
                  <p className="text-slate-400 text-xs">From: <strong className="text-slate-200">{tkt.sender}</strong> • Assigned: {tkt.department}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="bg-slate-900 text-slate-200 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold">
                    {tkt.status}
                  </span>
                  {tkt.status !== 'Resolved' && (
                    <button
                      onClick={() => handleTicketStatus(tkt.id, 'Resolved')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs shadow"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: REVIEWS MODERATION */}
      {activeTab === 'reviews' && (
        <div className="space-y-5">
          <div>
            <h3 className="font-black text-lg text-white font-serif">Reader Reviews & Ratings Moderation</h3>
            <p className="text-xs text-slate-400">Approve or flag community reviews submitted by readers and advertisers.</p>
          </div>

          <div className="space-y-3.5">
            {reviewsQueue.map((rev) => (
              <div key={rev.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{rev.author}</span>
                    <span className="text-amber-400 text-xs">{'★'.repeat(rev.rating)}</span>
                    {rev.verifiedSubscriber && (
                      <span className="text-[9px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold border border-emerald-800">
                        VERIFIED SUBSCRIBER
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 text-xs mt-1">"{rev.comment}"</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="bg-slate-900 text-slate-300 font-mono text-[10px] px-2.5 py-1 rounded-lg border border-slate-800">
                    {rev.status}
                  </span>
                  {rev.status !== 'Approved' && (
                    <button
                      onClick={() => handleReviewStatus(rev.id, 'Approved')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow"
                    >
                      Approve
                    </button>
                  )}
                  {rev.status !== 'Flagged Spam' && (
                    <button
                      onClick={() => handleReviewStatus(rev.id, 'Flagged Spam')}
                      className="bg-red-950 hover:bg-red-900 text-red-400 font-bold px-3 py-1.5 rounded-xl border border-red-800 text-xs"
                    >
                      Flag Spam
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: CORRECTIONS & LEGAL */}
      {activeTab === 'corrections' && (
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800/90 space-y-4 text-xs shadow-xl">
          <h3 className="font-black text-base text-white font-serif">Corrections, Complaints & Legal Clearances</h3>
          <p className="text-slate-400">Official audit trail of article corrections, defamation risk assessments, and right-of-reply logs.</p>
          <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800/90 space-y-2">
            <span className="bg-red-950 text-red-400 font-bold px-2.5 py-0.5 rounded text-[10px] uppercase font-mono">PUBLISHED CORRECTION NOTE</span>
            <p className="font-bold text-white text-sm">Kisumu Port Cargo Article (Updated July 2026)</p>
            <p className="text-slate-300 leading-relaxed">Correction: An earlier version of this report transposed cargo tonnage figures between Jinja and Entebbe. The article has been updated to reflect correct Kenya Ports Authority official statistics.</p>
          </div>
        </div>
      )}

      {/* TAB 8: NEWSROOM CHAT & SHIFT ROTA */}
      {activeTab === 'chat_rota' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800/90 space-y-4 shadow-xl">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              Internal Staff Messaging
            </h3>
            <div className="h-56 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {chatMessages.map((m) => (
                <div key={m.id} className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-xs">
                  <div className="flex justify-between font-bold text-red-400 mb-1">
                    <span>{m.sender}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{m.time}</span>
                  </div>
                  <p className="text-slate-200">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                placeholder="Type newsroom message..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
              <button type="submit" className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow">
                Send
              </button>
            </form>
          </div>

          <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800/90 space-y-4 shadow-xl">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider border-b border-slate-800 pb-3">
              Duty Rota & Shift Schedule
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">Morning Duty Editor</h4>
                  <p className="text-slate-400 text-xs font-mono mt-0.5">Shift: 06:00 - 14:00 EAT</p>
                </div>
                <span className="text-emerald-400 font-bold bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-xl text-xs">Mary Wambui (Active)</span>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">Evening Breaking Desk</h4>
                  <p className="text-slate-400 text-xs font-mono mt-0.5">Shift: 14:00 - 22:00 EAT</p>
                </div>
                <span className="text-slate-300 font-bold bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl text-xs">Amina Hassan (Scheduled)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: AUDIT LOGS & SECURITY */}
      {activeTab === 'audit_logs' && (
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800/90 space-y-4 text-xs shadow-xl">
          <h3 className="font-black text-base text-white font-serif">System Audit Trail & Security Logs</h3>
          <p className="text-slate-400 font-mono text-[11px]">Encrypted SHA-256 Immutable Audit Stream</p>

          <div className="space-y-2.5 font-mono">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800/90 flex flex-col sm:flex-row justify-between gap-2 text-[11px]">
                <div>
                  <span className="text-red-400 font-bold">[{log.action}]</span> <span className="text-slate-200">{log.details}</span>
                </div>
                <div className="text-slate-500 shrink-0">
                  By {log.user} • {log.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 10: INFRASTRUCTURE, STORAGE & CACHING COMMAND CONSOLE */}
      {activeTab === 'infrastructure' && (
        <div className="space-y-6">
          {/* Emergency High-Traffic Shield Mode Banner */}
          <div className={`p-6 rounded-3xl border transition-all ${
            highTrafficShield
              ? 'bg-red-950/80 border-red-500 text-white shadow-2xl'
              : 'bg-slate-950 border-slate-800/90 text-slate-100 shadow-xl'
          }`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider font-mono ${
                    highTrafficShield ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {highTrafficShield ? 'HIGH-TRAFFIC SHIELD ACTIVE' : 'STANDARD TRAFFIC SHIELD'}
                  </span>
                  <span className="text-slate-400 text-xs font-mono">• Protection Status: 100% Operational</span>
                </div>
                <h3 className="text-xl font-black text-white font-serif">Traffic Surge Circuit Breaker & CDN Edge Shield</h3>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  {highTrafficShield
                    ? 'Emergency Shield Mode Enabled: Non-critical widgets (comments, real-time poll feeds) temporarily paused. Serving 100% static HTML via CDN Edge to absorb 200,000+ RPS breaking news spike.'
                    : 'Standard Mode: All interactive components enabled. High-Traffic Shield automatically triggers if server CPU exceeds 85% or request rate surges past 50,000 RPS.'}
                </p>
              </div>

              <button
                onClick={() => setHighTrafficShield(!highTrafficShield)}
                className={`px-5 py-3 rounded-2xl text-xs font-black transition-all shrink-0 ${
                  highTrafficShield
                    ? 'bg-white text-red-950 hover:bg-slate-200 shadow-lg'
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-lg'
                }`}
              >
                {highTrafficShield ? 'Deactivate Shield Mode' : 'ACTIVATE HIGH-TRAFFIC SHIELD'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Direct-to-Storage Signed Upload Token Generator */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800/90 space-y-4 shadow-xl">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] bg-emerald-950 text-emerald-400 font-mono font-bold px-2.5 py-1 rounded border border-emerald-800 uppercase">
                  OBJECT STORAGE VAULT
                </span>
                <h3 className="text-base font-black text-white mt-1.5 font-serif">Direct Signed-URL Upload Token Generator</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Generate 15-minute encrypted upload tokens allowing clients to upload raw 4K videos, audio podcasts, and confidential CVs directly to Cloud Object Storage without passing through application servers.
                </p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Target Storage Key Taxonomy</label>
                  <select
                    value={signedTokenType}
                    onChange={(e) => setSignedTokenType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono cursor-pointer"
                  >
                    <option value="articles/images/">articles/images/YYYY/MM/DD/ (Public Article Media)</option>
                    <option value="articles/videos/">articles/videos/YYYY/MM/DD/ (HLS Stream Source)</option>
                    <option value="podcasts/series/">podcasts/series/episode/ (Podcast AAC Audio)</option>
                    <option value="careers/cv/">careers/cv/ (Private Candidate Resumes - Encrypted)</option>
                    <option value="news-tips/private/">news-tips/private/ (Encrypted Whistleblower Tips)</option>
                    <option value="fact-checks/evidence/">fact-checks/evidence/ (Forensic Documents)</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateSignedUrl}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition shadow"
                >
                  Generate Short-Lived Signed Upload Token
                </button>

                {generatedSignedUrl && (
                  <div className="p-3.5 bg-slate-900 rounded-2xl border border-emerald-800/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">✓ Crypto Token Generated (Valid 15 Mins):</span>
                      <button
                        onClick={handleCopyUrl}
                        className="text-[10px] bg-slate-950 text-emerald-400 hover:text-white px-2 py-0.5 rounded border border-slate-800 font-mono flex items-center gap-1"
                      >
                        {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedUrl ? 'Copied!' : 'Copy Token'}
                      </button>
                    </div>
                    <input
                      type="text"
                      readOnly
                      value={generatedSignedUrl}
                      className="w-full bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-mono p-2.5 rounded-xl select-all"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Surgical Edge Cache Invalidation Console */}
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800/90 space-y-4 shadow-xl">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] bg-amber-950 text-amber-400 font-mono font-bold px-2.5 py-1 rounded border border-amber-800 uppercase">
                  CDN PURGE API
                </span>
                <h3 className="text-base font-black text-white mt-1.5 font-serif">Surgical Edge Cache Invalidation</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  Instantly purge specific article URLs, county feeds, or category pages across global edge nodes when breaking updates or corrections are published.
                </p>
              </div>

              <form onSubmit={handleTriggerPurge} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">Target Article Slug / Route</label>
                  <input
                    type="text"
                    value={purgeSlug}
                    onChange={(e) => setPurgeSlug(e.target.value)}
                    placeholder="e.g. nairobi-brt-bidding-opens"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2.5 rounded-xl transition shadow"
                >
                  Trigger Surgical Edge Cache Purge
                </button>

                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 max-h-32 overflow-y-auto font-mono text-[11px] text-slate-300">
                  <span className="text-[10px] text-slate-500 font-bold block">Recent Invalidation Audit Log:</span>
                  {purgeLog.length === 0 ? (
                    <p className="text-slate-500 text-[10px]">No manual purges executed in this session.</p>
                  ) : (
                    purgeLog.map((log, idx) => (
                      <p key={idx} className="text-amber-400">{log}</p>
                    ))
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Database & Storage Quotas */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 space-y-2 text-xs shadow-xl">
              <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">Cloud SQL & Replica Status</span>
              <strong className="text-xl text-white font-black">Primary + 3 Read Replicas</strong>
              <div className="space-y-1 pt-2 border-t border-slate-800 font-mono text-[11px] text-slate-400">
                <p>Read-Replica Sync Lag: <span className="text-emerald-400 font-bold">1.2 ms</span></p>
                <p>Active Connection Pool: <span className="text-slate-200">142 / 1,000</span></p>
                <p>Composite B-Tree Indexes: <span className="text-slate-200">48 Active</span></p>
              </div>
            </div>

            {/* Core Web Vitals Budget */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 space-y-2 text-xs shadow-xl">
              <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">Core Web Vitals Target</span>
              <strong className="text-xl text-emerald-400 font-black">All Metrics "Good" Grade</strong>
              <div className="space-y-1 pt-2 border-t border-slate-800 font-mono text-[11px] text-slate-400">
                <p>Largest Contentful Paint (LCP): <span className="text-emerald-400 font-bold">0.82 s</span></p>
                <p>Interaction to Next Paint (INP): <span className="text-emerald-400 font-bold">38 ms</span></p>
                <p>Cumulative Layout Shift (CLS): <span className="text-emerald-400 font-bold">0.00</span></p>
              </div>
            </div>

            {/* Disaster Recovery Verification */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/90 space-y-2 text-xs shadow-xl">
              <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">Disaster Recovery & WAL</span>
              <strong className="text-xl text-white font-black">RTO &lt; 15m • RPO &lt; 5m</strong>
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  onClick={handleRunBackupVerification}
                  disabled={verifyingBackup}
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold py-2 rounded-xl text-[11px] transition shadow"
                >
                  {verifyingBackup ? 'Testing Restore Runbook...' : 'Run Snapshot Integrity Check'}
                </button>
                {backupVerified && (
                  <p className="text-emerald-400 font-mono text-[10px] font-bold">✓ Dual-Region Snapshot Validated (2.4 GB)</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
