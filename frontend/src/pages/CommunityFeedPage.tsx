import React, { useEffect, useState } from 'react';
import {
  Users,
  PlusCircle,
  ThumbsUp,
  MapPin,
  Clock,
  ShieldCheck,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { communityApi } from '../services/api';
import { CommunityPost } from '../types';

export const CommunityFeedPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Poor Lighting');
  const [newLocation, setNewLocation] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState('ALL');

  const fetchPosts = async () => {
    try {
      const res = await communityApi.getAll();
      if (res.success) setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await communityApi.createPost({
        title: newTitle,
        content: newContent,
        category: newCategory,
        locationName: newLocation,
        latitude: 12.9716,
        longitude: 77.5946,
        anonymous: isAnonymous,
      });
      if (res.success) {
        setShowModal(false);
        setNewTitle('');
        setNewContent('');
        setNewLocation('');
        fetchPosts();
      }
    } catch (err) {
      alert('Failed to publish post.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async (id: number) => {
    try {
      const res = await communityApi.confirmPost(id);
      if (res.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, confirmationsCount: res.data.confirmationsCount } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = posts.filter((p) => {
    if (filterCategory === 'ALL') return true;
    return p.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Community Safety & Intelligence Network
          </h1>
          <p className="text-xs text-slate-500">
            Crowdsourced street hazards, safe zones, and local awareness with pseudonymous privacy
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-2xs self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" /> Share Community Hazard / Safe Zone
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="font-semibold text-slate-700">Filter Category:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-700"
          >
            <option value="ALL">All Categories</option>
            <option value="Poor Lighting">Poor Lighting</option>
            <option value="Suspicious Activity">Suspicious Activity</option>
            <option value="Safe Zone / Well Lit">Safe Zones</option>
            <option value="Harassment Zone">Harassment Reports</option>
          </select>
        </div>
        <span className="text-xs text-slate-500">{filtered.length} reports</span>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs hover:shadow-xs transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={post.status} size="sm" />
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
                <h3 className="mt-1 text-sm font-bold text-slate-900">{post.title}</h3>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0">
                <Clock className="inline h-3 w-3 mr-0.5" />
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-700 leading-relaxed">{post.content}</p>

            {post.locationName && (
              <p className="mt-3 text-xs text-slate-500 flex items-center gap-1 font-medium">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {post.locationName}
              </p>
            )}

            {/* Official Review Annotation if verified */}
            {post.status === 'VERIFIED' && (
              <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Official Verification:</strong> {post.officialReviewNote || 'Verified by municipal safety patrol.'}
                </span>
              </div>
            )}

            {/* Footer: Pseudonymous identity & Confirmations */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Shared by: <span className="font-medium text-slate-700">{post.authorDisplayName}</span>
              </span>

              <button
                onClick={() => handleConfirm(post.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs transition-colors"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>Confirm / Upvote ({post.confirmationsCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 pb-2 border-b border-slate-200">
              Share Community Safety Report
            </h3>
            <form onSubmit={handleCreatePost} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-semibold text-slate-800 block">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Broken streetlight causing pitch-black pathway"
                  className="mt-1 block w-full p-2.5 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="mt-1 block w-full p-2.5 border border-slate-300 rounded text-xs bg-white"
                  >
                    <option value="Poor Lighting">Poor Lighting</option>
                    <option value="Suspicious Activity">Suspicious Activity</option>
                    <option value="Safe Zone / Well Lit">Safe Zone / Well Lit</option>
                    <option value="Harassment Zone">Harassment Zone</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-800 block">Location Name</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Near Metro Pillar 12"
                    className="mt-1 block w-full p-2.5 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block">Observations / Report</label>
                <textarea
                  required
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe why this spot needs attention or why it's a helpful safe spot..."
                  className="mt-1 block w-full p-2.5 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900"
                  />
                  <span className="font-medium text-slate-800">
                    Post pseudonymously (Display as "Anonymous Community Member")
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded font-semibold text-slate-700 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold text-xs shadow-2xs"
                >
                  {submitting ? 'Publishing...' : 'Publish to Feed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
