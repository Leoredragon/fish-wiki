/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Scale,
  Ruler,
  Heart,
  MessageSquare,
  Send,
  Users,
  Loader2,
  ChevronDown,
  Package,
  User,
  Trophy,
  Search,
  Flame,
  Plus,
  ShoppingBag,
  BookOpen,
  X,
  Trash2,
  ShieldCheck,
  MessageCircle,
  PhoneCall,
  Edit,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import CatchCardExport from './CatchCardExport';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { compressImageToWebP } from '@/lib/image_compression';
import PullToRefresh from '@/components/PullToRefresh';
import { pickPhotoNative, isNativeApp, triggerHapticLight } from '@/lib/capacitorUtils';

const STORIES_LIMIT = 50;
const LEGACY_MOCK_STORY_IDS = new Set(['story-1', 'story-2']);

function normalizeStory(story: Record<string, any>) {
  return {
    ...story,
    caption: story.caption || story.location_note || undefined,
  };
}

function isStoryOwner(story: Record<string, any>, userId?: string | null) {
  return Boolean(userId && story.user_id && String(story.user_id) === String(userId));
}

function buildPublicProfilePath(locale: string, profileData: any, userId?: string | null) {
  if (userId) return `/${locale}/u/id-${userId}`;
  const username = profileData?.username ? String(profileData.username).trim() : '';
  if (username) return `/${locale}/u/${encodeURIComponent(username)}`;
  return null;
}

interface CommunityClientProps {
  catches: Record<string, any>[];
  initialStories?: Record<string, any>[];
  initialForumPosts?: Record<string, any>[];
  initialMarketplaceItems?: Record<string, any>[];
  initialCommunityTips?: Record<string, any>[];
}

export default function CommunityClient({
  catches = [],
  initialStories = [],
  initialForumPosts = [],
  initialMarketplaceItems = [],
  initialCommunityTips = []
}: CommunityClientProps) {
  const locale = useLocale();
  const isTr = locale === 'tr';
  const supabase = createClient();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'feed' | 'forum' | 'market' | 'tips'>('feed');
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<any | null>(null);
  const isAdmin = Boolean(currentUserProfile?.is_admin);

  // Tab 1: Feed States
  const [catchesList, setCatchesList] = useState<any[]>(catches);
  useEffect(() => {
    setCatchesList(catches);
  }, [catches]);
  const [visibleCount, setVisibleCount] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'trophy' | 'following'>('all');
  const [followingUserIds, setFollowingUserIds] = useState<string[]>([]);
  const [selectedAuthorModal, setSelectedAuthorModal] = useState<{
    profile: Record<string, any>;
    tackleSet?: Record<string, any> | null;
    userCatches: Record<string, any>[];
    userId?: string | null;
  } | null>(null);

  // Tab 2: Forum States
  const [forumPosts, setForumPosts] = useState<any[]>(initialForumPosts);
  const [forumCategory, setForumCategory] = useState<string>('all');
  const [isForumModalOpen, setIsForumModalOpen] = useState(false);
  const [forumTitle, setForumTitle] = useState('');
  const [forumContent, setForumContent] = useState('');
  const [forumCatInput, setForumCatInput] = useState('Soru-Cevap');
  const [forumImageFile, setForumImageFile] = useState<File | null>(null);
  const [forumSubmitting, setForumSubmitting] = useState(false);

  // Tab 3: Marketplace States
  const [marketItems, setMarketItems] = useState<any[]>(initialMarketplaceItems);
  const [marketCategory, setMarketCategory] = useState<string>('all');
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [itemTitle, setItemTitle] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemType, setItemType] = useState('Kamış');
  const [itemCondition, setItemCondition] = useState('Az Kullanılmış');
  const [itemCity, setItemCity] = useState('');
  const [itemContact, setItemContact] = useState('');
  const [marketImageFile, setMarketImageFile] = useState<File | null>(null);
  const [marketSubmitting, setMarketSubmitting] = useState(false);

  // Marketplace Edit State
  const [editingMarketItem, setEditingMarketItem] = useState<any | null>(null);
  const [editItemTitle, setEditItemTitle] = useState('');
  const [editItemDesc, setEditItemDesc] = useState('');
  const [editItemPrice, setEditItemPrice] = useState('');
  const [editItemType, setEditItemType] = useState('Kamış');
  const [editItemCondition, setEditItemCondition] = useState('Az Kullanılmış');
  const [editItemCity, setEditItemCity] = useState('');
  const [editItemContact, setEditItemContact] = useState('');
  const [editItemIsSold, setEditItemIsSold] = useState(false);

  // Tab 4: Tips States
  const [tips, setTips] = useState<any[]>(initialCommunityTips);
  const [tipsCategory, setTipsCategory] = useState<string>('all');
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [tipTitle, setTipTitle] = useState('');
  const [tipCategoryInput, setTipCategoryInput] = useState('Düğüm & Bağlantı');
  const [tipContent, setTipContent] = useState('');
  const [tipImageFile, setTipImageFile] = useState<File | null>(null);
  const [tipSubmitting, setTipSubmitting] = useState(false);

  // Add Catch Modal State in Community Feed
  const [isAddCatchModalOpen, setIsAddCatchModalOpen] = useState(false);
  const [catchImageFile, setCatchImageFile] = useState<File | null>(null);
  const [catchWeight, setCatchWeight] = useState('');
  const [catchLength, setCatchLength] = useState('');
  const [catchLureUsed, setCatchLureUsed] = useState('');
  const [catchLocationNote, setCatchLocationNote] = useState('');
  const [catchSubmitting, setCatchSubmitting] = useState(false);

  const handleAddCommunityCatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return router.push(`/${locale}/login`);
    if (!catchImageFile) return alert(isTr ? 'Lütfen bir av fotoğrafı seçin.' : 'Please select a catch photo.');
    if (!catchLocationNote.trim()) return alert(isTr ? 'Lütfen mera / konum notu girin.' : 'Please enter location note.');

    setCatchSubmitting(true);
    try {
      const compressed = await compressImageToWebP(catchImageFile, 1200, 0.85);
      const filePath = `catches/${currentUser.id}_${Date.now()}.webp`;
      const { error: uploadError } = await supabase.storage.from('user_uploads').upload(filePath, compressed, { contentType: 'image/webp', cacheControl: '31536000' });

      let imageUrl = null;
      if (!uploadError) {
        const { data } = supabase.storage.from('user_uploads').getPublicUrl(filePath);
        imageUrl = data?.publicUrl || null;
      }

      const authorFullName = currentUserProfile?.full_name || currentUser.user_metadata?.full_name;
      const authorUsername = currentUserProfile?.username || currentUser.user_metadata?.username;
      const authorAvatar = currentUserProfile?.avatar_url || currentUser.user_metadata?.avatar_url;

      const catchId = `catch-${Date.now()}`;
      const newCatch = {
        id: catchId,
        user_id: currentUser.id,
        image_url: imageUrl || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        weight: parseFloat(catchWeight) || undefined,
        length: parseFloat(catchLength) || undefined,
        location_note: catchLocationNote.trim(),
        lure_used: catchLureUsed.trim() || undefined,
        created_at: new Date().toISOString(),
        profiles: {
          username: authorUsername || (authorFullName ? `@${authorFullName}` : 'Balıkçı'),
          full_name: authorFullName || (authorUsername ? `@${authorUsername}` : 'Balıkçı'),
          avatar_url: authorAvatar
        }
      };

      try {
        await supabase.from('catch_logs').insert({
          user_id: currentUser.id,
          image_url: newCatch.image_url,
          weight: newCatch.weight,
          length: newCatch.length,
          location_note: newCatch.location_note,
          lure_used: newCatch.lure_used
        });
      } catch (e) {
        console.warn('Catch logs insert notice:', e);
      }

      setCatchesList((prev: any[]) => [newCatch, ...prev]);
      setIsAddCatchModalOpen(false);
      setCatchImageFile(null);
      setCatchWeight('');
      setCatchLength('');
      setCatchLureUsed('');
      setCatchLocationNote('');
      alert(isTr ? '🎉 Avınız topluluk akışında başarıyla paylaşıldı!' : 'Catch shared successfully!');
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    } finally {
      setCatchSubmitting(false);
    }
  };

  // 24h Stories State with LocalStorage & Supabase Persistence
  const [stories, setStories] = useState<any[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isAddStoryModalOpen, setIsAddStoryModalOpen] = useState(false);
  const [storyImageFile, setStoryImageFile] = useState<File | null>(null);
  const [storyCaption, setStoryCaption] = useState('');
  const [storySubmitting, setStorySubmitting] = useState(false);
  const [storySuccessToast, setStorySuccessToast] = useState<string | null>(null);

  // Load & Sync Stories
  const loadStories = async () => {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Read deleted IDs from LocalStorage
    let deletedIds: string[] = [];
    try {
      deletedIds = JSON.parse(localStorage.getItem('oltaapp_deleted_story_ids') || '[]');
    } catch {}

    // Read user local stories from LocalStorage
    let localSavedStories: any[] = [];
    try {
      localSavedStories = JSON.parse(localStorage.getItem('oltaapp_user_stories') || '[]');
      const legacyIds = Array.from(LEGACY_MOCK_STORY_IDS);
      const filteredLocal = localSavedStories.filter((s: any) => !LEGACY_MOCK_STORY_IDS.has(s.id));
      if (filteredLocal.length !== localSavedStories.length) {
        localStorage.setItem('oltaapp_user_stories', JSON.stringify(filteredLocal));
        localSavedStories = filteredLocal;
      }
      const mergedDeleted = [...new Set([...deletedIds, ...legacyIds])];
      if (mergedDeleted.length !== deletedIds.length) {
        localStorage.setItem('oltaapp_deleted_story_ids', JSON.stringify(mergedDeleted));
        deletedIds = mergedDeleted;
      }
    } catch {}

    // Try fetching from Supabase
    let dbStories: any[] = [];
    try {
      const { data, error } = await supabase
        .from('community_stories')
        .select('*, profiles(username, full_name, avatar_url)')
        .gte('created_at', cutoff)
        .order('created_at', { ascending: false })
        .limit(STORIES_LIMIT);

      if (!error && data) {
        dbStories = data;
      }
    } catch {}

    // Combine & Deduplicate (no mock/demo stories)
    const combined = [...dbStories, ...initialStories, ...localSavedStories];
    const uniqueMap = new Map();

    combined.forEach((st) => {
      if (!st.id || LEGACY_MOCK_STORY_IDS.has(st.id) || deletedIds.includes(st.id)) return;
      // 24 hour cutoff check
      if (new Date(st.created_at).getTime() < Date.now() - 24 * 60 * 60 * 1000) return;
      if (!uniqueMap.has(st.id)) {
        uniqueMap.set(st.id, normalizeStory(st));
      }
    });

    setStories(Array.from(uniqueMap.values()));
  };

  useEffect(() => {
    if (!storySuccessToast) return;
    const timer = setTimeout(() => setStorySuccessToast(null), 2200);
    return () => clearTimeout(timer);
  }, [storySuccessToast]);

  const handleAddStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return router.push(`/${locale}/login`);
    if (!storyImageFile) return alert(isTr ? 'Lütfen bir hikaye fotoğrafı seçin.' : 'Please select a photo.');

    setStorySubmitting(true);
    try {
      const compressed = await compressImageToWebP(storyImageFile, 1200, 0.85);
      const filePath = `stories/${currentUser.id}_${Date.now()}.webp`;
      const { error: uploadError } = await supabase.storage.from('user_uploads').upload(filePath, compressed, { contentType: 'image/webp', cacheControl: '31536000' });

      let imageUrl = null;
      if (!uploadError) {
        const { data } = supabase.storage.from('user_uploads').getPublicUrl(filePath);
        imageUrl = data?.publicUrl || null;
      }

      const authorFullName = currentUserProfile?.full_name 
        || currentUser.user_metadata?.full_name;
      const authorUsername = currentUserProfile?.username 
        || currentUser.user_metadata?.username;
      const authorAvatar = currentUserProfile?.avatar_url 
        || currentUser.user_metadata?.avatar_url;

      const displayAuthorName = authorFullName 
        || (authorUsername ? `@${authorUsername}` : null) 
        || (currentUser.email ? `@${currentUser.email.split('@')[0]}` : 'Balıkçı');

      const validUuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-0000-4000-8000-000000000000`;
      const storyId = validUuid;
      const newStory = {
        id: storyId,
        user_id: currentUser.id,
        image_url: imageUrl || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        caption: storyCaption.trim() || undefined,
        created_at: new Date().toISOString(),
        profiles: {
          username: authorUsername || displayAuthorName,
          full_name: displayAuthorName,
          avatar_url: authorAvatar
        }
      };

      // 1. Try Supabase Insert
      try {
        const { error: storyInsErr } = await supabase.from('community_stories').insert({
          id: storyId,
          user_id: currentUser.id,
          image_url: newStory.image_url,
          location_note: newStory.caption
        });
        if (storyInsErr) {
          console.warn('community_stories insert notice:', storyInsErr.message);
        }
      } catch (e) {
        console.warn('community_stories insert exception:', e);
      }

      // 2. Save to LocalStorage
      try {
        const existing = JSON.parse(localStorage.getItem('oltaapp_user_stories') || '[]');
        localStorage.setItem('oltaapp_user_stories', JSON.stringify([newStory, ...existing]));
      } catch {}

      setStories((prev) => [newStory, ...prev]);
      setIsAddStoryModalOpen(false);
      setStoryImageFile(null);
      setStoryCaption('');
      setStorySuccessToast(isTr ? 'Hikayeniz paylaşıldı' : 'Story shared');
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    } finally {
      setStorySubmitting(false);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!currentUser) return router.push(`/${locale}/login`);
    const story = stories.find((s) => s.id === storyId);
    if (!story) return;
    if (!isAdmin && !isStoryOwner(story, currentUser.id)) {
      alert(isTr ? 'Bu hikayeyi silme yetkiniz yok.' : 'You cannot delete this story.');
      return;
    }
    if (!confirm(isTr ? 'Bu hikayeyi silmek istediğinize emin misiniz?' : 'Delete this story?')) return;

    triggerHapticLight();

    let dbError: string | null = null;
    try {
      let query = supabase.from('community_stories').delete().eq('id', storyId);
      if (!isAdmin) {
        query = query.eq('user_id', currentUser.id);
      }
      const { error } = await query;
      if (error) dbError = error.message;
    } catch (err: any) {
      dbError = err?.message || String(err);
    }

    try {
      const deletedIds = JSON.parse(localStorage.getItem('oltaapp_deleted_story_ids') || '[]');
      if (!deletedIds.includes(storyId)) {
        localStorage.setItem('oltaapp_deleted_story_ids', JSON.stringify([...deletedIds, storyId]));
      }
      const localSaved = JSON.parse(localStorage.getItem('oltaapp_user_stories') || '[]');
      const filteredLocal = localSaved.filter((s: any) => s.id !== storyId);
      localStorage.setItem('oltaapp_user_stories', JSON.stringify(filteredLocal));
    } catch {}

    setStories((prev) => {
      const next = prev.filter((s) => s.id !== storyId);
      setActiveStoryIndex((idx) => {
        if (idx === null) return null;
        if (next.length === 0) return null;
        return Math.min(idx, next.length - 1);
      });
      return next;
    });

    if (dbError) {
      console.warn('community_stories delete notice:', dbError);
    }
  };

  useEffect(() => {
    loadStories();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setCurrentUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, full_name, avatar_url, is_admin')
          .eq('id', user.id)
          .single();
        if (profile) setCurrentUserProfile(profile);

        try {
          const { data: followingRows } = await supabase
            .from('follows')
            .select('following_id')
            .eq('follower_id', user.id);
          setFollowingUserIds((followingRows || []).map((row: any) => row.following_id).filter(Boolean));
        } catch {
          setFollowingUserIds([]);
        }
      }
    });
  }, []);

  // Leaderboard Top 3 Trophies
  const topTrophies = useMemo(() => {
    return [...catchesList]
      .filter((c) => c.weight || c.length)
      .sort((a, b) => (b.weight || 0) - (a.weight || 0))
      .slice(0, 3);
  }, [catchesList]);

  // Filtered Catches
  const filteredCatches = useMemo(() => {
    return catchesList.filter((c) => {
      if (activeFilter === 'trophy' && (!c.weight || c.weight < 1.5)) return false;
      if (activeFilter === 'following') {
        if (!currentUser) return false;
        if (!followingUserIds.includes(c.user_id)) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const locationMatch = c.location_note?.toLowerCase().includes(q);
        const lureMatch = c.lure_used?.toLowerCase().includes(q);
        const usernameMatch = c.profiles?.username?.toLowerCase().includes(q);
        const nameMatch = c.profiles?.full_name?.toLowerCase().includes(q);
        return locationMatch || lureMatch || usernameMatch || nameMatch;
      }
      return true;
    });
  }, [catchesList, activeFilter, searchQuery, currentUser, followingUserIds]);

  const displayedCatches = filteredCatches.slice(0, visibleCount);

  // Forum Add Handler
  const handleAddForumPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return router.push(`/${locale}/login`);
    if (!forumTitle.trim() || !forumContent.trim()) return;

    setForumSubmitting(true);
    try {
      let imageUrl = null;
      if (forumImageFile) {
        const compressed = await compressImageToWebP(forumImageFile);
        const filePath = `forum/${currentUser.id}_${Date.now()}.webp`;
        const { error: uploadError } = await supabase.storage.from('user_uploads').upload(filePath, compressed, { contentType: 'image/webp', cacheControl: '31536000' });
        if (!uploadError) {
          const { data } = supabase.storage.from('user_uploads').getPublicUrl(filePath);
          imageUrl = data?.publicUrl || null;
        }
      }

      const { data, error } = await supabase
        .from('community_forum_posts')
        .insert({
          user_id: currentUser.id,
          title: forumTitle.trim(),
          content: forumContent.trim(),
          category: forumCatInput,
          image_url: imageUrl
        })
        .select(`*, profiles(username, full_name, avatar_url, city)`)
        .single();

      if (error) {
        console.error('Forum post error:', error);
        alert(isTr ? `Konu eklenemedi: ${error.message}\n\nLütfen Supabase panelinizde 'supabase_community_v2_setup.sql' dosyasını çalıştırdığınızdan emin olun.` : `Error: ${error.message}`);
      } else if (data) {
        setForumPosts((prev) => [data, ...prev]);
        setIsForumModalOpen(false);
        setForumTitle('');
        setForumContent('');
        setForumImageFile(null);
      }
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    } finally {
      setForumSubmitting(false);
    }
  };

  // Forum Post Delete Handler (Admin or Owner)
  const handleDeleteForumPost = async (postId: string) => {
    if (!confirm(isTr ? 'Bu forum konusunu silmek istediğinize emin misiniz?' : 'Delete this topic?')) return;
    try {
      const { error } = await supabase.from('community_forum_posts').delete().eq('id', postId);
      if (!error) {
        setForumPosts((prev) => prev.filter((p) => p.id !== postId));
      }
    } catch {}
  };

  // Marketplace Add Handler
  const handleAddMarketItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return router.push(`/${locale}/login`);
    if (!itemTitle.trim() || !itemDesc.trim() || !itemPrice) return;

    setMarketSubmitting(true);
    try {
      let imageUrl = null;
      if (marketImageFile) {
        const compressed = await compressImageToWebP(marketImageFile);
        const filePath = `market/${currentUser.id}_${Date.now()}.webp`;
        const { error: uploadError } = await supabase.storage.from('user_uploads').upload(filePath, compressed, { contentType: 'image/webp', cacheControl: '31536000' });
        if (!uploadError) {
          const { data } = supabase.storage.from('user_uploads').getPublicUrl(filePath);
          imageUrl = data?.publicUrl || null;
        }
      }

      const { data, error } = await supabase
        .from('community_marketplace_items')
        .insert({
          user_id: currentUser.id,
          title: itemTitle.trim(),
          description: itemDesc.trim(),
          price: parseFloat(itemPrice),
          item_type: itemType,
          condition: itemCondition,
          city: itemCity.trim() || null,
          contact_info: itemContact.trim() || null,
          image_url: imageUrl
        })
        .select(`*, profiles(username, full_name, avatar_url, city)`)
        .single();

      if (error) {
        console.error('Market item error:', error);
        alert(isTr ? `İlan eklenemedi: ${error.message}\n\nLütfen Supabase panelinizde 'supabase_community_v2_setup.sql' dosyasını çalıştırdığınızdan emin olun.` : `Error: ${error.message}`);
      } else if (data) {
        setMarketItems((prev) => [data, ...prev]);
        setIsMarketModalOpen(false);
        setItemTitle('');
        setItemDesc('');
        setItemPrice('');
        setItemCity('');
        setItemContact('');
        setMarketImageFile(null);
      }
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    } finally {
      setMarketSubmitting(false);
    }
  };

  // Toggle Marketplace Item Sold Status
  const handleToggleMarketItemSold = async (item: any) => {
    try {
      const newStatus = !item.is_sold;
      const { error } = await supabase
        .from('community_marketplace_items')
        .update({ is_sold: newStatus })
        .eq('id', item.id);

      if (!error) {
        setMarketItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, is_sold: newStatus } : i))
        );
      } else {
        alert(isTr ? `Güncellenemedi: ${error.message}` : `Error: ${error.message}`);
      }
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    }
  };

  // Open Edit Marketplace Item Modal
  const openEditMarketItemModal = (item: any) => {
    setEditingMarketItem(item);
    setEditItemTitle(item.title || '');
    setEditItemDesc(item.description || '');
    setEditItemPrice(item.price ? String(item.price) : '');
    setEditItemType(item.item_type || 'Kamış');
    setEditItemCondition(item.condition || 'Az Kullanılmış');
    setEditItemCity(item.city || '');
    setEditItemContact(item.contact_info || '');
    setEditItemIsSold(!!item.is_sold);
  };

  // Update Marketplace Item Handler
  const handleUpdateMarketItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMarketItem) return;

    setMarketSubmitting(true);
    try {
      const { error } = await supabase
        .from('community_marketplace_items')
        .update({
          title: editItemTitle.trim(),
          description: editItemDesc.trim(),
          price: parseFloat(editItemPrice),
          item_type: editItemType,
          condition: editItemCondition,
          city: editItemCity.trim() || null,
          contact_info: editItemContact.trim() || null,
          is_sold: editItemIsSold
        })
        .eq('id', editingMarketItem.id);

      if (error) {
        alert(isTr ? `Güncellenemedi: ${error.message}` : `Error: ${error.message}`);
      } else {
        setMarketItems((prev) =>
          prev.map((i) =>
            i.id === editingMarketItem.id
              ? {
                  ...i,
                  title: editItemTitle.trim(),
                  description: editItemDesc.trim(),
                  price: parseFloat(editItemPrice),
                  item_type: editItemType,
                  condition: editItemCondition,
                  city: editItemCity.trim() || null,
                  contact_info: editItemContact.trim() || null,
                  is_sold: editItemIsSold
                }
              : i
          )
        );
        setEditingMarketItem(null);
      }
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    } finally {
      setMarketSubmitting(false);
    }
  };

  // Marketplace Delete Handler (Admin or Owner)
  const handleDeleteMarketItem = async (itemId: string) => {
    if (!confirm(isTr ? 'Bu ilanı silmek istediğinize emin misiniz?' : 'Delete this item?')) return;
    try {
      const { error } = await supabase.from('community_marketplace_items').delete().eq('id', itemId);
      if (!error) {
        setMarketItems((prev) => prev.filter((i) => i.id !== itemId));
      }
    } catch {}
  };

  // Tip Add Handler
  const handleAddTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return router.push(`/${locale}/login`);
    if (!tipTitle.trim() || !tipContent.trim()) return;

    setTipSubmitting(true);
    try {
      let imageUrl = null;
      if (tipImageFile) {
        const compressed = await compressImageToWebP(tipImageFile);
        const filePath = `tips/${currentUser.id}_${Date.now()}.webp`;
        const { error: uploadError } = await supabase.storage.from('user_uploads').upload(filePath, compressed, { contentType: 'image/webp', cacheControl: '31536000' });
        if (!uploadError) {
          const { data } = supabase.storage.from('user_uploads').getPublicUrl(filePath);
          imageUrl = data?.publicUrl || null;
        }
      }

      const { data, error } = await supabase
        .from('community_tips')
        .insert({
          user_id: currentUser.id,
          title: tipTitle.trim(),
          category: tipCategoryInput,
          content: tipContent.trim(),
          image_url: imageUrl
        })
        .select(`*, profiles(username, full_name, avatar_url, city)`)
        .single();

      if (error) {
        console.error('Tip error:', error);
        alert(isTr ? `Tüyo eklenemedi: ${error.message}\n\nLütfen Supabase panelinizde 'supabase_community_v2_setup.sql' dosyasını çalıştırdığınızdan emin olun.` : `Error: ${error.message}`);
      } else if (data) {
        setTips((prev) => [data, ...prev]);
        setIsTipModalOpen(false);
        setTipTitle('');
        setTipContent('');
        setTipImageFile(null);
      }
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    } finally {
      setTipSubmitting(false);
    }
  };

  // Tip Delete Handler (Admin or Owner)
  const handleDeleteTip = async (tipId: string) => {
    if (!confirm(isTr ? 'Bu püf noktasını silmek istediğinize emin misiniz?' : 'Delete this tip?')) return;
    try {
      const { error } = await supabase.from('community_tips').delete().eq('id', tipId);
      if (!error) {
        setTips((prev) => prev.filter((t) => t.id !== tipId));
      }
    } catch {}
  };

  const handleOpenAuthorModal = (profileData: any, tackleSetData: any, userId: string) => {
    const userCatches = catches.filter((c) => c.user_id === userId);
    setSelectedAuthorModal({
      profile: profileData || { username: 'Oltapp Balıkçısı' },
      tackleSet: tackleSetData || null,
      userCatches,
      userId
    });
  };

  const handleGoToPublicProfile = (profileData: any, userId?: string | null) => {
    const path = buildPublicProfilePath(locale, profileData, userId);
    if (!path) return;
    setSelectedAuthorModal(null);
    setActiveStoryIndex(null);
    router.push(path);
  };

  return (
    <PullToRefresh
      onRefresh={async () => {
        await loadStories();
        router.refresh();
      }}
    >
      <div className="max-w-5xl mx-auto space-y-4 pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] md:pb-14 pt-3 px-3 sm:px-6">
      {/* Compact community header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
            {isTr ? 'Topluluk' : 'Community'}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
            {isTr ? 'Av akışı · Forum · Pazar · İpuçları' : 'Feed · Forum · Market · Tips'}
          </p>
        </div>
        {isAdmin && (
          <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center space-x-1 shadow-sm">
            <ShieldCheck className="w-3 h-3" />
            <span>ADMIN</span>
          </span>
        )}
      </div>

      {/* Modern Clean 4-Tab Navigation Bar (Grid fit for zero mobile scroll) */}
      <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-4 gap-1 w-full">
        <button
          onClick={() => { triggerHapticLight(); setActiveTab('feed'); }}
          className={`flex flex-col sm:flex-row items-center justify-center space-y-0.5 sm:space-y-0 sm:space-x-1.5 py-2 px-1 rounded-xl font-bold text-[11px] sm:text-xs transition-all text-center active:scale-95 ${
            activeTab === 'feed' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{isTr ? 'Av Akışı' : 'Feed'}</span>
        </button>

        <button
          onClick={() => { triggerHapticLight(); setActiveTab('forum'); }}
          className={`flex flex-col sm:flex-row items-center justify-center space-y-0.5 sm:space-y-0 sm:space-x-1.5 py-2 px-1 rounded-xl font-bold text-[11px] sm:text-xs transition-all text-center active:scale-95 ${
            activeTab === 'forum' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{isTr ? 'Soru & Forum' : 'Forum'}</span>
        </button>

        <button
          onClick={() => { triggerHapticLight(); setActiveTab('market'); }}
          className={`flex flex-col sm:flex-row items-center justify-center space-y-0.5 sm:space-y-0 sm:space-x-1.5 py-2 px-1 rounded-xl font-bold text-[11px] sm:text-xs transition-all text-center active:scale-95 ${
            activeTab === 'market' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{isTr ? '2. El Pazar' : 'Market'}</span>
        </button>

        <button
          onClick={() => { triggerHapticLight(); setActiveTab('tips'); }}
          className={`flex flex-col sm:flex-row items-center justify-center space-y-0.5 sm:space-y-0 sm:space-x-1.5 py-2 px-1 rounded-xl font-bold text-[11px] sm:text-xs transition-all text-center active:scale-95 ${
            activeTab === 'tips' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{isTr ? 'Püf Noktaları' : 'Tips'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: AV AKIŞI (CATCH FEED)                                             */}
      {/* ========================================================================= */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {/* 📸 INSTAGRAM / SNAPCHAT STYLE 24H FISHING STORIES BAR */}
          <div className="bg-white/80 p-2.5 sm:p-3 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                {isTr ? 'Av Hikayeleri' : 'Fishing Stories'}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {stories.length} {isTr ? 'Aktif' : 'Active'}
              </span>
            </div>

            <div className="flex items-center space-x-3 overflow-x-auto pb-1 no-scrollbar pt-1">
              {/* Add Story Circle Button (Instagram Style with User Avatar + Plus Badge) */}
              <div
                onClick={() => {
                  if (!currentUser) return router.push(`/${locale}/login`);
                  setIsAddStoryModalOpen(true);
                }}
                className="flex flex-col items-center space-y-1 cursor-pointer shrink-0 group"
              >
                <div className="relative p-0.5 rounded-full bg-slate-200 group-hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-white bg-[#0F172A] flex items-center justify-center text-emerald-400 font-extrabold text-sm">
                    {currentUserProfile?.avatar_url ? (
                      <Image src={currentUserProfile.avatar_url} alt="You" fill sizes="48px" className="object-cover" />
                    ) : (
                      <span>{(currentUserProfile?.full_name || currentUser?.email || 'S').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
                    <Plus className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-slate-700 max-w-[60px] truncate text-center">
                  {isTr ? 'Hikaye Ekle' : 'Add Story'}
                </span>
              </div>

              {/* Story Avatars with Gradient Rings */}
              {stories.map((st, idx) => {
                const authorName = st.profiles?.full_name || (st.profiles?.username ? `@${st.profiles.username}` : 'Balıkçı');
                const avatarImage = st.profiles?.avatar_url || st.image_url;

                return (
                  <div
                    key={st.id || idx}
                    onClick={() => setActiveStoryIndex(idx)}
                    className="flex flex-col items-center space-y-1 cursor-pointer shrink-0 group"
                  >
                    <div className="p-0.5 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 shadow-xs group-hover:scale-105 transition-transform">
                      <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-white bg-[#0F172A] flex items-center justify-center font-extrabold text-white text-xs">
                        {avatarImage ? (
                          <Image src={avatarImage} alt="Story" fill sizes="48px" className="object-cover" />
                        ) : (
                          <span>{authorName.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 max-w-[60px] truncate text-center">
                      {authorName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🏆 COMPACT HORIZONTAL TROPHY CATCHES SLIDER */}
          {topTrophies.length > 0 && (
            <div className="bg-gradient-to-r from-[#0F172A] via-slate-900 to-[#0F172A] text-white rounded-3xl p-4 shadow-md border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <h2 className="font-extrabold text-xs text-white uppercase tracking-wider">
                    {isTr ? 'Ayın Trofe Avları' : 'Trophy Leaderboard'}
                  </h2>
                </div>
                <span className="text-[10px] text-amber-400 font-bold">
                  {isTr ? 'Yatay Kayan Liderler' : 'Top Catches'}
                </span>
              </div>

              {/* Horizontal Scroll Track */}
              <div className="flex space-x-2.5 overflow-x-auto pb-1 no-scrollbar snap-x">
                {topTrophies.map((trophy, idx) => (
                  <div
                    key={trophy.id}
                    onClick={() => handleGoToPublicProfile(trophy.profiles, trophy.user_id)}
                    className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-2.5 flex items-center space-x-2.5 cursor-pointer transition-all shrink-0 min-w-[210px] snap-start"
                  >
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-700">
                      <Image src={trophy.image_url} alt="Trophy" fill sizes="44px" className="object-cover" />
                      <div
                        className={`absolute top-0 left-0 text-[9px] font-black px-1 py-0.2 rounded-br-md ${
                          idx === 0 ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-white'
                        }`}
                      >
                        #{idx + 1}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {trophy.profiles?.full_name || (trophy.profiles?.username ? `@${trophy.profiles.username}` : 'Balıkçı')}
                      </div>
                      <div className="text-xs font-black text-emerald-400">
                        {trophy.weight ? `${trophy.weight} kg` : ''} {trophy.length ? `• ${trophy.length} cm` : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isTr ? 'Mera adı, balıkçı veya kullanılan yem ara...' : 'Search spot, angler, or lure...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  if (!currentUser) return router.push(`/${locale}/login`);
                  setIsAddCatchModalOpen(true);
                }}
                className="w-full sm:w-auto bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                <span>{isTr ? 'Av Paylaş' : 'Share Catch'}</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-1">
              <button
                onClick={() => setActiveFilter('all')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeFilter === 'all' ? 'bg-[#0F172A] text-[#10B981] shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isTr ? 'Tüm Avlar' : 'All Catches'}</span>
              </button>

              <button
                onClick={() => setActiveFilter('trophy')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeFilter === 'trophy' ? 'bg-[#0F172A] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{isTr ? 'Trofe Avlar (>1.5kg)' : 'Trophy Catches'}</span>
              </button>

              <button
                onClick={() => {
                  if (!currentUser) return router.push(`/${locale}/login`);
                  setActiveFilter('following');
                }}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeFilter === 'following' ? 'bg-[#0F172A] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isTr ? 'Takip Ettiklerim' : 'Following'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {filteredCatches.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-500 space-y-2">
                <p className="font-bold text-slate-700">{isTr ? 'Aradığınız kriterlere uygun av bulunamadı.' : 'No catches match search.'}</p>
              </div>
            ) : (
              displayedCatches.map((log) => (
                <CatchPostItem
                  key={log.id}
                  log={log}
                  currentUser={currentUser}
                  currentUserProfile={currentUserProfile}
                  isAdmin={isAdmin}
                  isTr={isTr}
                  onRequireAuth={() => router.push(`/${locale}/login`)}
                  onOpenAuthor={() => handleGoToPublicProfile(log.profiles, log.user_id)}
                />
              ))
            )}
          </div>

          {visibleCount < filteredCatches.length && (
            <div className="pt-4 pb-2">
              <button
                type="button"
                onClick={() => {
                  triggerHapticLight();
                  setVisibleCount((prev) => prev + 10);
                }}
                className="w-full sm:w-auto sm:mx-auto flex items-center justify-center gap-2 bg-white border border-slate-200 shadow-md text-[#0F172A] font-extrabold px-6 py-3.5 min-h-[52px] rounded-2xl transition-all active:scale-[0.98] text-sm"
              >
                <span>{isTr ? 'Daha Fazla Av Göster' : 'Load More'}</span>
                <ChevronDown className="w-4 h-4 text-emerald-500" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FORUM & SORU-CEVAP                                               */}
      {/* ========================================================================= */}
      {activeTab === 'forum' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span className="font-extrabold text-sm text-[#0F172A]">{isTr ? 'Tartışmalar ve Sorular' : 'Forum Threads'}</span>
            </div>

            <button
              onClick={() => (currentUser ? setIsForumModalOpen(true) : router.push(`/${locale}/login`))}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isTr ? 'Yeni Soru / Konu Aç' : 'New Topic'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            {['all', 'Soru-Cevap', 'Mera Bilgisi', 'Ekipman Tavsiyesi', 'Genel'].map((cat) => (
              <button
                key={cat}
                onClick={() => setForumCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  forumCategory === cat ? 'bg-[#0F172A] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? (isTr ? 'Tüm Konular' : 'All Topics') : cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {forumPosts.filter((p) => forumCategory === 'all' || p.category === forumCategory).length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 space-y-2">
                <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-600">{isTr ? 'Henüz bu kategoride soru açılmamış.' : 'No topics yet.'}</p>
                <p className="text-xs">{isTr ? 'İlk soruyu siz sorun!' : 'Be the first to ask a question!'}</p>
              </div>
            ) : (
              forumPosts
                .filter((p) => forumCategory === 'all' || p.category === forumCategory)
                .map((post) => (
                  <ForumPostItem
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    currentUserProfile={currentUserProfile}
                    isAdmin={isAdmin}
                    isTr={isTr}
                    onDelete={() => handleDeleteForumPost(post.id)}
                    onRequireAuth={() => router.push(`/${locale}/login`)}
                  />
                ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: EKİPMAN PAZARI (MARKETPLACE)                                      */}
      {/* ========================================================================= */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <span className="font-extrabold text-sm text-[#0F172A]">{isTr ? '2. El ve Sıfır İkinci El Pazarı' : 'Tackle Marketplace'}</span>
            </div>

            <button
              onClick={() => (currentUser ? setIsMarketModalOpen(true) : router.push(`/${locale}/login`))}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isTr ? 'İlan Ver' : 'Sell Gear'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            {['all', 'Kamış', 'Makine', 'Sahte Yem', 'Misina/Aksesuar', 'Set'].map((cat) => (
              <button
                key={cat}
                onClick={() => setMarketCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  marketCategory === cat ? 'bg-[#0F172A] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? (isTr ? 'Tüm Ürünler' : 'All Gear') : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {marketItems.filter((i) => marketCategory === 'all' || i.item_type === marketCategory).length === 0 ? (
              <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 space-y-2">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-600">{isTr ? 'Henüz bu kategoride ilan bulunmuyor.' : 'No marketplace items yet.'}</p>
              </div>
            ) : (
              marketItems
                .filter((i) => marketCategory === 'all' || i.item_type === marketCategory)
                .map((item) => (
                  <MarketplaceItemCard
                    key={item.id}
                    item={item}
                    currentUser={currentUser}
                    currentUserProfile={currentUserProfile}
                    isAdmin={isAdmin}
                    isTr={isTr}
                    onToggleSold={() => handleToggleMarketItemSold(item)}
                    onEdit={() => openEditMarketItemModal(item)}
                    onDelete={() => handleDeleteMarketItem(item.id)}
                    onRequireAuth={() => router.push(`/${locale}/login`)}
                  />
                ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: FAYDALI BİLGİLER & PÜF NOKTALARI                                  */}
      {/* ========================================================================= */}
      {activeTab === 'tips' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span className="font-extrabold text-sm text-[#0F172A]">{isTr ? 'Balıkçılık Tüyoları ve Püf Noktaları' : 'Pro Angling Tips'}</span>
            </div>

            <button
              onClick={() => (currentUser ? setIsTipModalOpen(true) : router.push(`/${locale}/login`))}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isTr ? 'Tüyo Paylaş' : 'Share Tip'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
            {['all', 'Düğüm & Bağlantı', 'Merada Av Taktikleri', 'Kamış & Makine Bakımı', 'Yem Aksiyonu'].map((cat) => (
              <button
                key={cat}
                onClick={() => setTipsCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  tipsCategory === cat ? 'bg-[#0F172A] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? (isTr ? 'Tüm Tüyolar' : 'All Tips') : cat}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {tips.filter((t) => tipsCategory === 'all' || t.category === tipsCategory).length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 space-y-2">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-600">{isTr ? 'Henüz bu kategoride püf noktası paylaşılmamış.' : 'No tips shared yet.'}</p>
              </div>
            ) : (
              tips
                .filter((t) => tipsCategory === 'all' || t.category === tipsCategory)
                .map((tip) => (
                  <TipCardItem
                    key={tip.id}
                    tip={tip}
                    currentUser={currentUser}
                    currentUserProfile={currentUserProfile}
                    isAdmin={isAdmin}
                    isTr={isTr}
                    onDelete={() => handleDeleteTip(tip.id)}
                    onRequireAuth={() => router.push(`/${locale}/login`)}
                  />
                ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS                                                                   */}
      {/* ========================================================================= */}

      {/* EDIT MARKET ITEM MODAL */}
      <AnimatePresence>
        {editingMarketItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-100 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-[#0F172A]">{isTr ? 'İkinci El İlanını Düzenle' : 'Edit Listing'}</h3>
                <button onClick={() => setEditingMarketItem(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleUpdateMarketItem} className="space-y-3 text-xs font-medium max-h-[70vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Tür' : 'Type'}</label>
                    <select value={editItemType} onChange={(e) => setEditItemType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500">
                      <option value="Kamış">Kamış</option>
                      <option value="Makine">Makine</option>
                      <option value="Sahte Yem">Sahte Yem</option>
                      <option value="Misina/Aksesuar">Misina/Aksesuar</option>
                      <option value="Set">Set</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Durumu' : 'Condition'}</label>
                    <select value={editItemCondition} onChange={(e) => setEditItemCondition(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500">
                      <option value="Sıfır">Sıfır</option>
                      <option value="Çok İyi">Çok İyi</option>
                      <option value="Az Kullanılmış">Az Kullanılmış</option>
                      <option value="Yıpranmış">Yıpranmış</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Ürün Adı / Başlık' : 'Title'}</label>
                  <input type="text" value={editItemTitle} onChange={(e) => setEditItemTitle(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500" required />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Fiyat (TL)' : 'Price'}</label>
                    <input type="number" value={editItemPrice} onChange={(e) => setEditItemPrice(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500" required />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Şehir' : 'City'}</label>
                    <input type="text" value={editItemCity} onChange={(e) => setEditItemCity(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'İletişim / Tel veya Instagram' : 'Contact Info'}</label>
                  <input type="text" value={editItemContact} onChange={(e) => setEditItemContact(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500" />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Açıklama' : 'Description'}</label>
                  <textarea rows={3} value={editItemDesc} onChange={(e) => setEditItemDesc(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500" required />
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                  <input type="checkbox" id="is_sold_checkbox" checked={editItemIsSold} onChange={(e) => setEditItemIsSold(e.target.checked)} className="w-4 h-4 accent-rose-500 rounded" />
                  <label htmlFor="is_sold_checkbox" className="text-xs font-bold text-slate-700">{isTr ? 'Ürün Satıldı Olarak İşaretlensin' : 'Mark as Sold'}</label>
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button type="button" onClick={() => setEditingMarketItem(null)} className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">{isTr ? 'İptal' : 'Cancel'}</button>
                  <button type="submit" disabled={marketSubmitting} className="px-5 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold shadow-sm">{marketSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (isTr ? 'Kaydet' : 'Save')}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FORUM MODAL */}
      <AnimatePresence>
        {isForumModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-100 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-[#0F172A]">{isTr ? 'Yeni Soru / Konu Aç' : 'Create Forum Topic'}</h3>
                <button onClick={() => setIsForumModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddForumPost} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Kategori' : 'Category'}</label>
                  <select value={forumCatInput} onChange={(e) => setForumCatInput(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500">
                    <option value="Soru-Cevap">Soru-Cevap</option>
                    <option value="Mera Bilgisi">Mera Bilgisi</option>
                    <option value="Ekipman Tavsiyesi">Ekipman Tavsiyesi</option>
                    <option value="Genel">Genel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Konu / Soru Başlığı' : 'Topic Title'}</label>
                  <input type="text" value={forumTitle} onChange={(e) => setForumTitle(e.target.value)} placeholder={isTr ? 'Örn: LRF için hangi sahte yemi önerirsiniz?' : 'Enter title...'} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500" required />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Detay / Açıklama' : 'Content'}</label>
                  <textarea rows={4} value={forumContent} onChange={(e) => setForumContent(e.target.value)} placeholder={isTr ? 'Sorunuzu veya düşüncelerinizi detaylandırın...' : 'Describe your topic...'} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500" required />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Fotoğraf (Opsiyonel)' : 'Photo (Optional)'}</label>
                  <input type="file" accept="image/*" onChange={(e) => setForumImageFile(e.target.files?.[0] || null)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs" />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button type="button" onClick={() => setIsForumModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">{isTr ? 'İptal' : 'Cancel'}</button>
                  <button type="submit" disabled={forumSubmitting} className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold shadow-sm">{forumSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (isTr ? 'Yayınla' : 'Post')}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MARKET MODAL */}
      <AnimatePresence>
        {isMarketModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-100 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-[#0F172A]">{isTr ? 'Ekipman İlanı Ekle' : 'List Gear for Sale'}</h3>
                <button onClick={() => setIsMarketModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddMarketItem} className="space-y-3 text-xs font-medium max-h-[70vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Tür' : 'Type'}</label>
                    <select value={itemType} onChange={(e) => setItemType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500">
                      <option value="Kamış">Kamış</option>
                      <option value="Makine">Makine</option>
                      <option value="Sahte Yem">Sahte Yem</option>
                      <option value="Misina/Aksesuar">Misina/Aksesuar</option>
                      <option value="Set">Set</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Durumu' : 'Condition'}</label>
                    <select value={itemCondition} onChange={(e) => setItemCondition(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500">
                      <option value="Sıfır">Sıfır</option>
                      <option value="Çok İyi">Çok İyi</option>
                      <option value="Az Kullanılmış">Az Kullanılmış</option>
                      <option value="Yıpranmış">Yıpranmış</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Ürün Adı / Başlık' : 'Title'}</label>
                  <input type="text" value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} placeholder={isTr ? 'Örn: Daiwa Ninja LT 3000 Spin Makine' : 'Enter gear title...'} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500" required />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Fiyat (TL)' : 'Price'}</label>
                    <input type="number" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} placeholder="1500" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500" required />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Şehir' : 'City'}</label>
                    <input type="text" value={itemCity} onChange={(e) => setItemCity(e.target.value)} placeholder="İstanbul" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'İletişim / Tel veya Instagram' : 'Contact Info'}</label>
                  <input type="text" value={itemContact} onChange={(e) => setItemContact(e.target.value)} placeholder="05xx xxx xx xx / @username" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500" />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Açıklama' : 'Description'}</label>
                  <textarea rows={3} value={itemDesc} onChange={(e) => setItemDesc(e.target.value)} placeholder={isTr ? 'Ürün durumu, kutusu, kullanım geçmişi...' : 'Describe item...'} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold focus:outline-none focus:border-emerald-500" required />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Ürün Fotoğrafı' : 'Product Photo'}</label>
                  <input type="file" accept="image/*" onChange={(e) => setMarketImageFile(e.target.files?.[0] || null)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs" />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button type="button" onClick={() => setIsMarketModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">{isTr ? 'İptal' : 'Cancel'}</button>
                  <button type="submit" disabled={marketSubmitting} className="px-5 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold shadow-sm">{marketSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (isTr ? 'İlanı Yayınla' : 'Publish')}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TIP MODAL */}
      <AnimatePresence>
        {isTipModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-100 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-[#0F172A]">{isTr ? 'Püf Noktası / Tüyo Paylaş' : 'Share Pro Tip'}</h3>
                <button onClick={() => setIsTipModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleAddTip} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Kategori' : 'Category'}</label>
                  <select value={tipCategoryInput} onChange={(e) => setTipCategoryInput(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500">
                    <option value="Düğüm & Bağlantı">Düğüm & Bağlantı</option>
                    <option value="Merada Av Taktikleri">Merada Av Taktikleri</option>
                    <option value="Kamış & Makine Bakımı">Kamış & Makine Bakımı</option>
                    <option value="Yem Aksiyonu">Yem Aksiyonu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Başlık' : 'Title'}</label>
                  <input type="text" value={tipTitle} onChange={(e) => setTipTitle(e.target.value)} placeholder={isTr ? 'Örn: Rüzgarlı Havada Spin Atarken Misina Kuş Yuvasını Önleme' : 'Tip title...'} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500" required />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Püf Noktası / İçerik' : 'Content'}</label>
                  <textarea rows={4} value={tipContent} onChange={(e) => setTipContent(e.target.value)} placeholder={isTr ? 'Tecrübelerinizi ve önerinizi anlatın...' : 'Describe tip...'} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500" required />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Görsel (Opsiyonel)' : 'Photo (Optional)'}</label>
                  <input type="file" accept="image/*" onChange={(e) => setTipImageFile(e.target.files?.[0] || null)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs" />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button type="button" onClick={() => setIsTipModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">{isTr ? 'İptal' : 'Cancel'}</button>
                  <button type="submit" disabled={tipSubmitting} className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold shadow-sm">{tipSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (isTr ? 'Paylaş' : 'Share')}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ANGLER AUTHOR MODAL (INSTAGRAM-STYLE) */}
      <AnimatePresence>
        {selectedAuthorModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }} className="bg-white rounded-t-[32px] sm:rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                <div className="flex items-center space-x-2 text-[#0F172A] font-extrabold text-base">
                  <User className="w-5 h-5 text-emerald-600" />
                  <span>{isTr ? 'Balıkçı Profil Kartı' : 'Angler Profile'}</span>
                </div>
                <button onClick={() => setSelectedAuthorModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-[#0F172A] flex items-center justify-center text-emerald-400 font-black text-2xl shadow-md border border-slate-700 shrink-0 relative">
                    {selectedAuthorModal.profile?.avatar_url ? (
                      <Image src={selectedAuthorModal.profile.avatar_url} alt="User" fill sizes="64px" className="object-cover" />
                    ) : (
                      (selectedAuthorModal.profile?.full_name || selectedAuthorModal.profile?.username)?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-[#0F172A]">{selectedAuthorModal.profile?.full_name || (selectedAuthorModal.profile?.username ? `@${selectedAuthorModal.profile.username}` : 'Oltapp Balıkçısı')}</h3>
                    {selectedAuthorModal.profile?.username && <p className="text-xs font-bold text-emerald-600">@{selectedAuthorModal.profile.username}</p>}
                    {selectedAuthorModal.profile?.city && (
                      <p className="text-xs text-slate-500 font-semibold flex items-center">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                        {selectedAuthorModal.profile.city}
                      </p>
                    )}
                  </div>
                </div>

                {selectedAuthorModal.profile?.bio && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700 font-medium leading-relaxed">
                    {selectedAuthorModal.profile.bio}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleGoToPublicProfile(selectedAuthorModal.profile, selectedAuthorModal.userId)}
                  className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-3 rounded-2xl text-xs transition-all"
                >
                  {isTr ? 'Profili Görüntüle' : 'View Profile'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* 📱 FULL-SCREEN INSTAGRAM / SNAPCHAT STORY VIEWER POPUP */}
      <AnimatePresence>
        {activeStoryIndex !== null && stories[activeStoryIndex] && (
          <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full sm:max-w-md h-full sm:h-[780px] sm:max-h-[90vh] bg-slate-950 sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              {/* Top 10s Progress Bar */}
              <div className="absolute top-[calc(env(safe-area-inset-top,0px)+0.35rem)] left-3 right-3 z-30 flex gap-1">
                <div className="h-1 bg-white/30 rounded-full w-full overflow-hidden">
                  <motion.div
                    key={activeStoryIndex}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 10, ease: 'linear' }}
                    onAnimationComplete={() => {
                      if (activeStoryIndex < stories.length - 1) {
                        setActiveStoryIndex(activeStoryIndex + 1);
                      } else {
                        setActiveStoryIndex(null);
                      }
                    }}
                    className="h-full bg-emerald-400 rounded-full"
                  />
                </div>
              </div>

              {/* Story Header (Author Profile & Controls) */}
              <div className="absolute top-[calc(env(safe-area-inset-top,0px)+1rem)] left-4 right-4 z-30 flex items-center justify-between text-white">
                <button
                  type="button"
                  onClick={() => handleGoToPublicProfile(
                    stories[activeStoryIndex].profiles,
                    stories[activeStoryIndex].user_id
                  )}
                  className="flex items-center space-x-2.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-xs overflow-hidden">
                    {stories[activeStoryIndex].profiles?.avatar_url ? (
                      <Image src={stories[activeStoryIndex].profiles.avatar_url} alt="Avatar" width={28} height={28} className="object-cover" />
                    ) : (
                      <span>{(stories[activeStoryIndex].profiles?.full_name || 'B').charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-black leading-none">
                      {stories[activeStoryIndex].profiles?.full_name || (stories[activeStoryIndex].profiles?.username ? `@${stories[activeStoryIndex].profiles.username}` : 'Balıkçı')}
                    </div>
                    <div className="text-[9px] text-emerald-400 font-bold mt-0.5">
                      {new Date(stories[activeStoryIndex].created_at).toLocaleTimeString(isTr ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </button>

                <div className="flex items-center space-x-2">
                  {(isAdmin || isStoryOwner(stories[activeStoryIndex], currentUser?.id)) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStory(stories[activeStoryIndex].id);
                      }}
                      className="h-8 px-2.5 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white flex items-center justify-center gap-1 backdrop-blur-sm shadow-md text-[10px] font-bold"
                      title={isTr ? 'Hikayeyi Sil' : 'Delete story'}
                      aria-label={isTr ? 'Hikayeyi Sil' : 'Delete story'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isTr ? 'Sil' : 'Delete'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveStoryIndex(null)}
                    className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-sm border border-white/20"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Full-Screen Story Image */}
              <div className="relative w-full h-full pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] flex items-center justify-center bg-black">
                <Image
                  src={stories[activeStoryIndex].image_url}
                  alt="Story content"
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />

                {/* Left/Right Tap Zones to skip stories */}
                <div
                  onClick={() => setActiveStoryIndex(Math.max(0, activeStoryIndex - 1))}
                  className="absolute left-0 top-16 bottom-16 w-1/3 z-20 cursor-pointer"
                />
                <div
                  onClick={() => {
                    if (activeStoryIndex < stories.length - 1) {
                      setActiveStoryIndex(activeStoryIndex + 1);
                    } else {
                      setActiveStoryIndex(null);
                    }
                  }}
                  className="absolute right-0 top-16 bottom-16 w-2/3 z-20 cursor-pointer"
                />
              </div>

              {/* Story Caption at Bottom */}
              {(stories[activeStoryIndex].caption || stories[activeStoryIndex].location_note) && (
                <div className="absolute bottom-6 left-4 right-4 z-30 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white text-xs sm:text-sm font-semibold leading-relaxed text-center">
                  {stories[activeStoryIndex].caption || stories[activeStoryIndex].location_note}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 📤 ADD STORY MODAL */}
      <AnimatePresence>
        {isAddStoryModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="bg-white rounded-t-[32px] sm:rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="text-base font-extrabold text-[#0F172A]">
                  {isTr ? 'Yeni Av Hikayesi Paylaş (24 Saat)' : 'Share 24h Fishing Story'}
                </h3>
                <button onClick={() => setIsAddStoryModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold">✕</button>
              </div>

              <form onSubmit={handleAddStory} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{isTr ? 'Hikaye Fotoğrafı *' : 'Story Photo *'}</label>
                  <label
                    onClick={async (e) => {
                      if (isNativeApp()) {
                        e.preventDefault();
                        const file = await pickPhotoNative('photos');
                        if (file) setStoryImageFile(file);
                      }
                    }}
                    className="cursor-pointer border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-emerald-500 mb-2" />
                    <span className="text-xs font-bold text-slate-700">
                      {storyImageFile ? storyImageFile.name : (isTr ? 'Galeriden Seç veya Fotoğraf Çek' : 'Select Photo')}
                    </span>
                    <input type="file" accept="image/*" onChange={(e) => e.target.files && setStoryImageFile(e.target.files[0])} className="hidden" />
                  </label>
                  {isNativeApp() && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          const file = await pickPhotoNative('photos');
                          if (file) setStoryImageFile(file);
                        }}
                        className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold text-slate-700 py-2.5"
                      >
                        {isTr ? 'Galeriden Seç' : 'Pick from Gallery'}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const file = await pickPhotoNative('camera');
                          if (file) setStoryImageFile(file);
                        }}
                        className="rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-[11px] font-bold text-emerald-700 py-2.5"
                      >
                        {isTr ? 'Kamera ile Çek' : 'Use Camera'}
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{isTr ? 'Açıklama / Not (Opsiyonel)' : 'Caption (Optional)'}</label>
                  <input
                    type="text"
                    value={storyCaption}
                    onChange={(e) => setStoryCaption(e.target.value)}
                    placeholder={isTr ? 'Örn: Boğazda trofe lüfer suyu!' : 'Write a caption...'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={storySubmitting || !storyImageFile}
                  className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2 text-xs shadow-md"
                >
                  {storySubmitting ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <span>{isTr ? 'Hikayeyi Paylaş (24 Saat Yayında)' : 'Share Story'}</span>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🎣 ADD COMMUNITY CATCH LOG MODAL */}
      <AnimatePresence>
        {isAddCatchModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              className="bg-white rounded-t-[32px] sm:rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                <h3 className="text-base font-extrabold text-[#0F172A]">
                  {isTr ? 'Yeni Av Paylaş' : 'Share New Catch'}
                </h3>
                <button onClick={() => setIsAddCatchModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold">✕</button>
              </div>

              <form onSubmit={handleAddCommunityCatch} className="p-6 space-y-4 text-xs font-medium max-h-[75vh] overflow-y-auto">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">{isTr ? 'Av Fotoğrafı *' : 'Catch Photo *'}</label>
                  <label
                    onClick={async (e) => {
                      if (isNativeApp()) {
                        e.preventDefault();
                        const file = await pickPhotoNative('photos');
                        if (file) setCatchImageFile(file);
                      }
                    }}
                    className="cursor-pointer border-2 border-dashed border-slate-300 rounded-2xl p-5 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-emerald-500 mb-2" />
                    <span className="text-xs font-bold text-slate-700">
                      {catchImageFile ? catchImageFile.name : (isTr ? 'Fotoğraf Seç veya Çek' : 'Select Photo')}
                    </span>
                    <input type="file" accept="image/*" onChange={(e) => e.target.files && setCatchImageFile(e.target.files[0])} className="hidden" />
                  </label>
                  {isNativeApp() && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          const file = await pickPhotoNative('photos');
                          if (file) setCatchImageFile(file);
                        }}
                        className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold text-slate-700 py-2.5"
                      >
                        {isTr ? 'Galeriden Seç' : 'Pick from Gallery'}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const file = await pickPhotoNative('camera');
                          if (file) setCatchImageFile(file);
                        }}
                        className="rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-[11px] font-bold text-emerald-700 py-2.5"
                      >
                        {isTr ? 'Kamera ile Çek' : 'Use Camera'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Ağırlık (kg)' : 'Weight (kg)'}</label>
                    <input type="number" step="0.1" value={catchWeight} onChange={(e) => setCatchWeight(e.target.value)} placeholder="Örn: 2.5" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Boy (cm)' : 'Length (cm)'}</label>
                    <input type="number" step="1" value={catchLength} onChange={(e) => setCatchLength(e.target.value)} placeholder="Örn: 45" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Mera / Konum Notu *' : 'Location / Spot Note *'}</label>
                  <input type="text" value={catchLocationNote} onChange={(e) => setCatchLocationNote(e.target.value)} placeholder={isTr ? 'Örn: Sarayburnu Kıyısı' : 'Spot location...'} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500" required />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{isTr ? 'Kullanılan Yem / Takım' : 'Lure / Tackle Used'}</label>
                  <input type="text" value={catchLureUsed} onChange={(e) => setCatchLureUsed(e.target.value)} placeholder={isTr ? 'Örn: LRF 5g Jighead + Silikon' : 'Lure used...'} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold focus:outline-none focus:border-emerald-500" />
                </div>

                <button
                  type="submit"
                  disabled={catchSubmitting || !catchImageFile}
                  className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center space-x-2 text-xs shadow-md mt-2"
                >
                  {catchSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <span>{isTr ? 'Avı Toplulukta Paylaş' : 'Share Catch Log'}</span>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {storySuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed left-1/2 -translate-x-1/2 bottom-[calc(6rem+env(safe-area-inset-bottom,0px))] z-[130] bg-[#0F172A] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 text-xs font-extrabold"
          >
            {storySuccessToast}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </PullToRefresh>
  );
}

// =========================================================================
// SUB-COMPONENTS FOR TAB 1, 2, 3, 4 WITH REPLIES & ADMIN PERMISSIONS
// =========================================================================

// CATCH POST ITEM (FEED TAB)
function CatchPostItem({
  log,
  currentUser,
  currentUserProfile,
  isAdmin,
  isTr,
  onRequireAuth,
  onOpenAuthor
}: {
  log: Record<string, any>;
  currentUser: any;
  currentUserProfile: any;
  isAdmin: boolean;
  isTr: boolean;
  onRequireAuth: () => void;
  onOpenAuthor: () => void;
}) {
  const supabase = createClient();
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);

  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [newComment, setNewComment] = useState('');
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    fetchLikes();
    fetchComments();
  }, [log.id, currentUser]);

  const fetchLikes = async () => {
    const { data: likesData } = await supabase.from('catch_likes').select('user_id').eq('catch_id', log.id);
    if (likesData) {
      setLikes(likesData.length);
      if (currentUser) {
        setIsLiked(likesData.some((l) => l.user_id === currentUser.id));
      }
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await supabase
        .from('catch_comments')
        .select(`*, profiles(username, full_name, avatar_url)`)
        .eq('catch_id', log.id)
        .order('created_at', { ascending: true });
      if (data) {
        setComments(data);
      } else {
        const { data: raw } = await supabase.from('catch_comments').select('*').eq('catch_id', log.id).order('created_at', { ascending: true });
        if (raw) setComments(raw);
      }
    } catch {}
  };

  const handleToggleLike = async () => {
    if (!currentUser) return onRequireAuth();
    if (likeLoading) return;

    setLikeLoading(true);
    if (isLiked) {
      setIsLiked(false);
      setLikes((prev) => Math.max(0, prev - 1));
      await supabase.from('catch_likes').delete().eq('catch_id', log.id).eq('user_id', currentUser.id);
    } else {
      setIsLiked(true);
      setLikes((prev) => prev + 1);
      await supabase.from('catch_likes').insert({ catch_id: log.id, user_id: currentUser.id });
    }
    setLikeLoading(false);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return onRequireAuth();
    const commentText = newComment.trim();
    if (!commentText) return;

    setCommenting(true);
    setNewComment('');

    const username = currentUserProfile?.full_name 
      || (currentUserProfile?.username ? `@${currentUserProfile.username}` : null) 
      || currentUser.user_metadata?.full_name 
      || currentUser.user_metadata?.username 
      || 'Oltapp Üyesi';

    const tempId = `temp-${Date.now()}`;
    const optimisticComment = {
      id: tempId,
      catch_id: log.id,
      user_id: currentUser.id,
      username,
      comment: commentText,
      created_at: new Date().toISOString(),
      profiles: currentUserProfile || { username, full_name: username }
    };

    setComments((prev) => [...prev, optimisticComment]);

    try {
      const { data, error } = await supabase
        .from('catch_comments')
        .insert({
          catch_id: log.id,
          user_id: currentUser.id,
          username,
          comment: commentText
        })
        .select('*')
        .single();

      if (error) {
        console.warn('Comment insert notice:', error.message);
      } else if (data) {
        setComments((prev) => prev.map((c) => (c.id === tempId ? { ...data, profiles: currentUserProfile } : c)));
      }
    } catch (err: any) {
      console.error('Comment exception:', err);
    } finally {
      setCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Yorumu silmek istiyor musunuz?')) return;
    await supabase.from('catch_comments').delete().eq('id', commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100 bg-white">
        <button onClick={onOpenAuthor} className="flex items-center space-x-3 text-left group transition-all cursor-pointer">
          <div className="w-10 h-10 bg-[#0F172A] rounded-full overflow-hidden flex items-center justify-center text-emerald-400 font-bold border border-slate-700 group-hover:scale-105 transition-transform shrink-0 relative">
            {log.profiles?.avatar_url ? (
              <Image src={log.profiles.avatar_url} alt="Avatar" fill sizes="40px" className="object-cover" />
            ) : (
              (log.profiles?.full_name || log.profiles?.username)?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div>
            <div className="font-extrabold text-[#0F172A] text-sm group-hover:text-emerald-600 transition-colors flex items-center space-x-1.5">
              <span>{log.profiles?.full_name || (log.profiles?.username ? `@${log.profiles.username}` : 'Oltapp Balıkçısı')}</span>
              {log.tackle_sets && (
                <span className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-md border border-emerald-200 font-bold">
                  {log.tackle_sets.name}
                </span>
              )}
            </div>
            <div className="text-[11px] font-semibold text-slate-400">
              {new Date(log.created_at).toLocaleDateString(isTr ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </button>

        <CatchCardExport log={log} profileName={log.profiles?.full_name || (log.profiles?.username ? `@${log.profiles.username}` : 'Oltapp User')} />
      </div>

      {/* Image */}
      <div className="aspect-[4/5] sm:aspect-video bg-slate-100 w-full relative">
        <Image src={log.image_url} alt="Catch" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw" className="object-cover" />
      </div>

      {/* Action Bar */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-sm font-bold text-slate-700">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="line-clamp-1">{log.location_note || 'Mera belirtilmedi'}</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleLike}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all ${
                isLiked ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isLiked ? 'Tebrik Edildi' : 'Tebrik Et'}</span>
              {likes > 0 && <span className="ml-1 bg-white px-1.5 py-0.5 rounded-md text-[10px] text-slate-800 border border-slate-200">{likes}</span>}
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full border border-slate-200 text-xs font-bold transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>{comments.length}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {log.weight && (
            <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 font-bold">
              <Scale className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-slate-800">{log.weight} kg</span>
            </div>
          )}
          {log.length && (
            <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 font-bold">
              <Ruler className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-slate-800">{log.length} cm</span>
            </div>
          )}
        </div>

        {log.lure_used && (
          <div className="pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-bold uppercase">{isTr ? 'Kullanılan Yem: ' : 'Lure: '}</span>
            <span className="text-slate-800 font-bold">{log.lure_used}</span>
          </div>
        )}

        {/* Comments Drawer */}
        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-4 border-t border-slate-100 space-y-3 overflow-hidden">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Yorumlar ({comments.length})</h4>
              <form onSubmit={handleAddComment} className="flex items-center space-x-2">
                <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={currentUser ? 'Yorum yaz...' : 'Yorum yapmak için giriş yapın...'} disabled={!currentUser} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500 disabled:opacity-60" />
                <button type="submit" disabled={commenting || !newComment.trim()} className="bg-[#0F172A] hover:bg-slate-800 text-white p-2 rounded-xl transition-all disabled:opacity-50">
                  {commenting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 text-emerald-400" />}
                </button>
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {comments.map((c) => {
                  const authorName = c.profiles?.full_name || (c.profiles?.username ? `@${c.profiles.username}` : null) || c.username || 'Oltapp Üyesi';
                  return (
                    <div key={c.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs flex justify-between items-start">
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-[#0F172A]">{authorName}</span>
                          <span className="text-[10px] text-slate-400">{new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-600 font-medium">{c.comment}</p>
                      </div>
                      {(isAdmin || currentUser?.id === c.user_id) && (
                        <button onClick={() => handleDeleteComment(c.id)} className="text-slate-400 hover:text-rose-600 ml-2">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// FORUM POST ITEM WITH REPLIES (SORU & FORUM TAB)
function ForumPostItem({
  post,
  currentUser,
  currentUserProfile,
  isAdmin,
  isTr,
  onDelete,
  onRequireAuth
}: {
  post: Record<string, any>;
  currentUser: any;
  currentUserProfile: any;
  isAdmin: boolean;
  isTr: boolean;
  onDelete: () => void;
  onRequireAuth: () => void;
}) {
  const supabase = createClient();
  const [replies, setReplies] = useState<any[]>([]);
  const [showReplies, setShowReplies] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    fetchReplies();
  }, [post.id]);

  const fetchReplies = async () => {
    try {
      const { data } = await supabase
        .from('community_forum_replies')
        .select(`*, profiles(username, full_name, avatar_url)`)
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });
      if (data) {
        setReplies(data);
      } else {
        const { data: raw } = await supabase.from('community_forum_replies').select('*').eq('post_id', post.id).order('created_at', { ascending: true });
        if (raw) setReplies(raw);
      }
    } catch {}
  };

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return onRequireAuth();
    if (!newReply.trim()) return;

    setSubmittingReply(true);
    try {
      const username = currentUserProfile?.full_name 
        || (currentUserProfile?.username ? `@${currentUserProfile.username}` : null) 
        || currentUser.user_metadata?.full_name 
        || currentUser.user_metadata?.username 
        || 'Oltapp Balıkçısı';

      let payload: Record<string, any> = {
        post_id: post.id,
        user_id: currentUser.id,
        username,
        content: newReply.trim()
      };

      let { data, error } = await supabase
        .from('community_forum_replies')
        .insert(payload)
        .select(`*, profiles(username, full_name, avatar_url)`)
        .single();

      if (error) {
        const fallbackRes = await supabase
          .from('community_forum_replies')
          .insert(payload)
          .select('*')
          .single();
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (error && (error.message?.includes('username') || error.code === 'PGRST204')) {
        delete payload.username;
        const fallbackNoUserRes = await supabase
          .from('community_forum_replies')
          .insert(payload)
          .select('*')
          .single();
        data = fallbackNoUserRes.data;
        error = fallbackNoUserRes.error;
      }

      if (error) {
        console.error('Reply error:', error);
        alert(isTr 
          ? `Yanıt gönderilemedi: ${error.message}` 
          : `Failed to reply: ${error.message}`);
      } else if (data) {
        setReplies((prev) => [...prev, { ...data, username: data.username || username, profiles: data.profiles || currentUserProfile }]);
        setNewReply('');
      }
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!confirm('Yanıtı silmek istiyor musunuz?')) return;
    await supabase.from('community_forum_replies').delete().eq('id', replyId);
    setReplies((prev) => prev.filter((r) => r.id !== replyId));
  };

  const isPostOwner = currentUser?.id === post.user_id;

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-full bg-[#0F172A] text-emerald-400 flex items-center justify-center text-xs font-black overflow-hidden shrink-0 relative">
            {post.profiles?.avatar_url ? (
              <Image src={post.profiles.avatar_url} alt="Avatar" fill sizes="36px" className="object-cover" />
            ) : (
              (post.profiles?.full_name || post.profiles?.username || 'U').charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <div className="text-xs font-extrabold text-[#0F172A] flex items-center space-x-1.5">
              <span>{post.profiles?.full_name || (post.profiles?.username ? `@${post.profiles.username}` : 'Balıkçı')}</span>
            </div>
            <div className="text-[10px] text-slate-400">{new Date(post.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-200">
            {post.category}
          </span>
          {(isAdmin || isPostOwner) && (
            <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors" title="Sil (Admin/Sahip)">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-sm font-extrabold text-[#0F172A] leading-snug">{post.title}</h3>
        <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line">{post.content}</p>
      </div>

      {post.image_url && (
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 max-h-60">
          <Image src={post.image_url} alt="Forum attachment" fill sizes="100vw" className="object-cover" />
        </div>
      )}

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200"
        >
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <span>{isTr ? `Cevapla & Yanıtlar (${replies.length})` : `Reply (${replies.length})`}</span>
        </button>
      </div>

      <AnimatePresence>
        {showReplies && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-3 space-y-3 overflow-hidden">
            <form onSubmit={handleAddReply} className="flex items-center space-x-2">
              <input
                type="text"
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder={currentUser ? 'Cevabınızı veya görüşünüzü yazın...' : 'Cevap vermek için giriş yapın...'}
                disabled={!currentUser}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={submittingReply || !newReply.trim()}
                className="bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center space-x-1"
              >
                {submittingReply ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isTr ? 'Gönder' : 'Post'}</span>
              </button>
            </form>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {replies.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">Henüz cevap yazılmamış. İlk cevabı siz verin!</p>
              ) : (
                replies.map((reply) => {
                  const replyAuthorName = reply.profiles?.full_name 
                    || (reply.profiles?.username ? `@${reply.profiles.username}` : null) 
                    || reply.username 
                    || 'Balıkçı';

                  return (
                    <div key={reply.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1.5 font-extrabold text-[#0F172A]">
                          <span>{replyAuthorName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-slate-400">{new Date(reply.created_at).toLocaleDateString()}</span>
                          {(isAdmin || currentUser?.id === reply.user_id) && (
                            <button onClick={() => handleDeleteReply(reply.id)} className="text-slate-400 hover:text-rose-600">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-600 font-medium whitespace-pre-line">{reply.content}</p>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// MARKETPLACE ITEM CARD WITH COMMENTS/QUESTIONS & SOLD/EDIT CONTROLS (EKİPMAN PAZARI TAB)
function MarketplaceItemCard({
  item,
  currentUser,
  currentUserProfile,
  isAdmin,
  isTr,
  onToggleSold,
  onEdit,
  onDelete,
  onRequireAuth
}: {
  item: Record<string, any>;
  currentUser: any;
  currentUserProfile: any;
  isAdmin: boolean;
  isTr: boolean;
  onToggleSold: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRequireAuth: () => void;
}) {
  const supabase = createClient();
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [item.id]);

  const fetchComments = async () => {
    try {
      const { data } = await supabase
        .from('community_marketplace_comments')
        .select(`*, profiles(username, full_name, avatar_url)`)
        .eq('item_id', item.id)
        .order('created_at', { ascending: true });
      if (data) {
        setComments(data);
      } else {
        const { data: raw } = await supabase.from('community_marketplace_comments').select('*').eq('item_id', item.id).order('created_at', { ascending: true });
        if (raw) setComments(raw);
      }
    } catch {}
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return onRequireAuth();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const username = currentUserProfile?.full_name 
        || (currentUserProfile?.username ? `@${currentUserProfile.username}` : null) 
        || currentUser.user_metadata?.full_name 
        || currentUser.user_metadata?.username 
        || 'Oltapp Balıkçısı';

      let payload: Record<string, any> = {
        item_id: item.id,
        user_id: currentUser.id,
        username,
        comment: newComment.trim()
      };

      let { data, error } = await supabase
        .from('community_marketplace_comments')
        .insert(payload)
        .select(`*, profiles(username, full_name, avatar_url)`)
        .single();

      if (error) {
        const fallbackRes = await supabase
          .from('community_marketplace_comments')
          .insert(payload)
          .select('*')
          .single();
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (error && (error.message?.includes('username') || error.code === 'PGRST204')) {
        delete payload.username;
        const fallbackNoUserRes = await supabase
          .from('community_marketplace_comments')
          .insert(payload)
          .select('*')
          .single();
        data = fallbackNoUserRes.data;
        error = fallbackNoUserRes.error;
      }

      if (error) {
        console.error('Market comment error:', error);
        alert(isTr 
          ? `Yorum eklenemedi: ${error.message}` 
          : `Failed to post comment: ${error.message}`);
      } else if (data) {
        setComments((prev) => [...prev, { ...data, username: data.username || username, profiles: data.profiles || currentUserProfile }]);
        setNewComment('');
      }
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Yorumu silmek istiyor musunuz?')) return;
    await supabase.from('community_marketplace_comments').delete().eq('id', commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const isOwner = currentUser?.id === item.user_id;

  return (
    <div
      className={`bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col justify-between transition-all ${
        item.is_sold ? 'border-slate-200 bg-slate-50/70 opacity-85' : 'border-slate-200 hover:shadow-md'
      }`}
    >
      <div>
        {item.image_url ? (
          <div className="relative aspect-[4/3] bg-slate-100 w-full overflow-hidden">
            <Image src={item.image_url} alt={item.title} fill sizes="50vw" className="object-cover" />
            <div className="absolute top-3 right-3 bg-[#0F172A] text-emerald-400 font-black text-xs px-3 py-1 rounded-xl shadow-md">
              {item.price} {item.currency || 'TL'}
            </div>
            {item.is_sold ? (
              <div className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-xl shadow-md uppercase tracking-wider">
                SATILDI
              </div>
            ) : (
              <div className="absolute top-3 left-3 bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-xl shadow-md uppercase tracking-wider">
                YAYINDA
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {item.is_sold ? (
                <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">SATILDI</span>
              ) : (
                <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">YAYINDA</span>
              )}
              <span className="text-xs font-bold text-slate-500">{item.item_type}</span>
            </div>
            <span className="text-sm font-black text-emerald-600">{item.price} TL</span>
          </div>
        )}

        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span>{item.condition}</span>
            <div className="flex items-center space-x-2">
              {item.city && <span>📍 {item.city}</span>}
              {(isAdmin || isOwner) && (
                <div className="flex items-center space-x-1">
                  <button onClick={onEdit} className="text-slate-400 hover:text-emerald-600 p-1" title="İlanı Düzenle">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={onDelete} className="text-slate-400 hover:text-rose-600 p-1" title="İlanı Sil">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <h3 className="font-extrabold text-sm text-[#0F172A] leading-snug">{item.title}</h3>
          <p className="text-xs text-slate-600 font-medium line-clamp-3 leading-relaxed">{item.description}</p>
        </div>
      </div>

      <div className="p-4 pt-0 space-y-3 border-t border-slate-100 mt-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 pt-2">
          <span className="font-bold text-[#0F172A]">{item.profiles?.full_name || (item.profiles?.username ? `@${item.profiles.username}` : 'Satıcı')}</span>
          {item.contact_info && (
            <span className="text-emerald-600 font-bold flex items-center space-x-1">
              <PhoneCall className="w-3 h-3" />
              <span>{item.contact_info}</span>
            </span>
          )}
        </div>

        {/* Owner/Admin Quick Sold Toggle Button */}
        {(isAdmin || isOwner) && (
          <button
            onClick={onToggleSold}
            className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center justify-center space-x-1.5 ${
              item.is_sold
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{item.is_sold ? (isTr ? 'Tekrar Satışa Çıkar' : 'Mark Active') : (isTr ? 'Satıldı Olarak İşaretle' : 'Mark Sold')}</span>
          </button>
        )}

        {/* Comment/Question Toggle Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center justify-center space-x-1"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isTr ? `Soru & Yorumlar (${comments.length})` : `Questions (${comments.length})`}</span>
        </button>

        {/* Comments Drawer */}
        <AnimatePresence>
          {showComments && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-2 space-y-2 overflow-hidden">
              <form onSubmit={handleAddComment} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={currentUser ? 'Satıcıya soru sor veya yorum yap...' : 'Giriş yapın...'}
                  disabled={!currentUser}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-emerald-500 disabled:opacity-60"
                />
                <button type="submit" disabled={submittingComment || !newComment.trim()} className="bg-[#0F172A] hover:bg-slate-800 text-white p-1.5 rounded-xl disabled:opacity-50">
                  {submittingComment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              </form>

              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {comments.map((c) => {
                  const authorName = c.profiles?.full_name || (c.profiles?.username ? `@${c.profiles.username}` : null) || c.username || 'Oltapp Üyesi';
                  return (
                    <div key={c.id} className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-xs flex justify-between items-start">
                      <div className="space-y-0.5 flex-1">
                        <span className="font-extrabold text-[#0F172A]">{authorName}</span>
                        <p className="text-slate-600 font-medium">{c.comment}</p>
                      </div>
                      {(isAdmin || currentUser?.id === c.user_id) && (
                        <button onClick={() => handleDeleteComment(c.id)} className="text-slate-400 hover:text-rose-600 ml-1">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// TIP CARD ITEM WITH COMMENTS (FAYDALI BİLGİLER TAB)
function TipCardItem({
  tip,
  currentUser,
  currentUserProfile,
  isAdmin,
  isTr,
  onDelete,
  onRequireAuth
}: {
  tip: Record<string, any>;
  currentUser: any;
  currentUserProfile: any;
  isAdmin: boolean;
  isTr: boolean;
  onDelete: () => void;
  onRequireAuth: () => void;
}) {
  const supabase = createClient();
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [tip.id]);

  const fetchComments = async () => {
    try {
      const { data } = await supabase
        .from('community_tip_comments')
        .select(`*, profiles(username, full_name, avatar_url)`)
        .eq('tip_id', tip.id)
        .order('created_at', { ascending: true });
      if (data) {
        setComments(data);
      } else {
        const { data: raw } = await supabase.from('community_tip_comments').select('*').eq('tip_id', tip.id).order('created_at', { ascending: true });
        if (raw) setComments(raw);
      }
    } catch {}
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return onRequireAuth();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const username = currentUserProfile?.full_name 
        || (currentUserProfile?.username ? `@${currentUserProfile.username}` : null) 
        || currentUser.user_metadata?.full_name 
        || currentUser.user_metadata?.username 
        || 'Oltapp Balıkçısı';

      let payload: Record<string, any> = {
        tip_id: tip.id,
        user_id: currentUser.id,
        username,
        comment: newComment.trim()
      };

      let { data, error } = await supabase
        .from('community_tip_comments')
        .insert(payload)
        .select(`*, profiles(username, full_name, avatar_url)`)
        .single();

      if (error) {
        const fallbackRes = await supabase
          .from('community_tip_comments')
          .insert(payload)
          .select('*')
          .single();
        data = fallbackRes.data;
        error = fallbackRes.error;
      }

      if (error && (error.message?.includes('username') || error.code === 'PGRST204')) {
        delete payload.username;
        const fallbackNoUserRes = await supabase
          .from('community_tip_comments')
          .insert(payload)
          .select('*')
          .single();
        data = fallbackNoUserRes.data;
        error = fallbackNoUserRes.error;
      }

      if (error) {
        console.error('Tip comment error:', error);
        alert(isTr 
          ? `Yorum eklenemedi: ${error.message}` 
          : `Failed to post comment: ${error.message}`);
      } else if (data) {
        setComments((prev) => [...prev, { ...data, username: data.username || username, profiles: data.profiles || currentUserProfile }]);
        setNewComment('');
      }
    } catch (err: any) {
      alert(isTr ? `Hata: ${err?.message || err}` : `Error: ${err?.message || err}`);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Yorumu silmek istiyor musunuz?')) return;
    await supabase.from('community_tip_comments').delete().eq('id', commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const isOwner = currentUser?.id === tip.user_id;

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
          {tip.category}
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-400 font-medium">{tip.profiles?.full_name || (tip.profiles?.username ? `@${tip.profiles.username}` : 'Balıkçı')}</span>
          {(isAdmin || isOwner) && (
            <button onClick={onDelete} className="p-1 text-slate-400 hover:text-rose-600 transition-colors" title="Püf Noktasını Sil (Admin/Sahip)">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <h3 className="font-extrabold text-base text-[#0F172A] leading-snug">{tip.title}</h3>
      <p className="text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-line">{tip.content}</p>

      {tip.image_url && (
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 max-h-60">
          <Image src={tip.image_url} alt={tip.title} fill sizes="100vw" className="object-cover" />
        </div>
      )}

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isTr ? `Yorumlar (${comments.length})` : `Comments (${comments.length})`}</span>
        </button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-2 space-y-2 overflow-hidden">
            <form onSubmit={handleAddComment} className="flex items-center space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={currentUser ? 'Yorum yazın veya tecrübenizi ekleyin...' : 'Giriş yapın...'}
                disabled={!currentUser}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-emerald-500 disabled:opacity-60"
              />
              <button type="submit" disabled={submittingComment || !newComment.trim()} className="bg-[#0F172A] hover:bg-slate-800 text-white p-2 rounded-xl disabled:opacity-50">
                {submittingComment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {comments.map((c) => {
                const authorName = c.profiles?.full_name || (c.profiles?.username ? `@${c.profiles.username}` : null) || c.username || 'Oltapp Üyesi';
                return (
                  <div key={c.id} className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-xs flex justify-between items-start">
                    <div className="space-y-0.5 flex-1">
                      <span className="font-extrabold text-[#0F172A]">{authorName}</span>
                      <p className="text-slate-600 font-medium">{c.comment}</p>
                    </div>
                    {(isAdmin || currentUser?.id === c.user_id) && (
                      <button onClick={() => handleDeleteComment(c.id)} className="text-slate-400 hover:text-rose-600 ml-1">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
