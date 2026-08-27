import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SkillMatchBadge from '../components/SkillMatchBadge';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api';

function ProjectDetails() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editGithubLink, setEditGithubLink] = useState('');
  const [editLiveDemoLink, setEditLiveDemoLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const [projectRes, commentsRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/comments/${id}`),
      ]);
      setProject(projectRes.data);
      setComments(commentsRes.data);
    } catch (err) {
      setError('Failed to load project.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || !commentText.trim()) return;

    setPosting(true);
    try {
      await api.post('/comments', {
        projectId: id,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        text: commentText.trim(),
      });
      setCommentText('');
      const commentsRes = await api.get(`/comments/${id}`);
      setComments(commentsRes.data);
      toast.success('Comment posted!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to post comment.');
    } finally {
      setPosting(false);
    }
  };

  const isOwner = currentUser && project && currentUser.uid === project.userId;

  const startEditing = () => {
    setEditTitle(project.title);
    setEditDescription(project.description);
    setEditTags(project.tags.join(', '));
    setEditGithubLink(project.githubLink);
    setEditLiveDemoLink(project.liveDemoLink || '');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await api.put(`/projects/${id}`, {
        title: editTitle,
        description: editDescription,
        tags: editTags.split(',').map((t) => t.trim()).filter(Boolean),
        githubLink: editGithubLink,
        liveDemoLink: editLiveDemoLink,
      });
      setProject(response.data);
      setIsEditing(false);
      toast.success('Project updated!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this project? This cannot be undone.');
    if (!confirmed) return;

    setDeleting(true);
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete project.');
      setDeleting(false);
    }
  };

  // Helper function to sanitize text for display
  const sanitizeText = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error || !project)
    return <p className="text-center mt-10 text-red-600">{error || 'Project not found'}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Link 
          to="/projects" 
          className="text-sm text-blue-700 hover:underline mb-4 inline-block"
          aria-label="Back to Projects"
        >
          ← Back to Projects
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4" aria-label="Edit project form">
              <div>
                <label htmlFor="edit-title" className="sr-only">Title</label>
                <input
                  id="edit-title"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
                  placeholder="Project title"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-description" className="sr-only">Description</label>
                <textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
                  placeholder="Project description"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-tags" className="sr-only">Tags</label>
                <input
                  id="edit-tags"
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="Tags (comma separated)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>
              <div>
                <label htmlFor="edit-github" className="sr-only">GitHub Link</label>
                <input
                  id="edit-github"
                  type="url"
                  value={editGithubLink}
                  onChange={(e) => setEditGithubLink(e.target.value)}
                  placeholder="GitHub Repo Link"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-demo" className="sr-only">Live Demo Link</label>
                <input
                  id="edit-demo"
                  type="url"
                  value={editLiveDemoLink}
                  onChange={(e) => setEditLiveDemoLink(e.target.value)}
                  placeholder="Live Demo Link (optional)"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-900 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-800 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-md hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold mb-1.5">{project.title}</h1>
                  <span className="bg-blue-50 text-blue-900 text-xs px-2 py-1 rounded-md">
                    {project.category}
                  </span>
                </div>
                {isOwner && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={startEditing}
                      className="flex items-center gap-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition"
                      aria-label="Edit project"
                    >
                      <FiEdit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex items-center gap-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-md transition disabled:opacity-50"
                      aria-label="Delete project"
                    >
                      <FiTrash2 size={14} />
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>

              {/* Fixed: Added proper XSS sanitization */}
              <p className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: sanitizeText(project.description) }} />

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mb-3">
                <SkillMatchBadge tags={project.tags} />
              </div>

              <p className="text-sm text-gray-400 mb-3">by {project.userName}</p>

              {/* Fixed: Added proper opening <a> tags */}
              <div className="flex gap-4">
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 text-sm hover:underline"
                  aria-label="View on GitHub"
                >
                  View on GitHub
                </a>
                {project.liveDemoLink && (
                  <a
                    href={project.liveDemoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 text-sm hover:underline"
                    aria-label="View Live Demo"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            Comments ({comments.length})
          </h2>

          {currentUser ? (
            <form onSubmit={handleCommentSubmit} className="mb-6" aria-label="Comment form">
              <label htmlFor="comment-text" className="sr-only">Comment</label>
              <textarea
                id="comment-text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Leave a comment..."
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 mb-2"
                maxLength={1000}
              />
              <button
                type="submit"
                disabled={posting || !commentText.trim()}
                className="bg-blue-900 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-800 transition disabled:opacity-50"
              >
                {posting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-500 mb-6">
              <Link to="/auth" className="text-blue-700 hover:underline">
                Log in
              </Link>{' '}
              to leave a comment.
            </p>
          )}

          {comments.length === 0 ? (
            <p className="text-sm text-gray-400">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="border-b border-gray-100 pb-3">
                  <p className="text-sm font-medium text-gray-700">
                    {comment.userName}
                  </p>
                  {/* Fixed: Added XSS sanitization for comments */}
                  <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: sanitizeText(comment.text) }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;