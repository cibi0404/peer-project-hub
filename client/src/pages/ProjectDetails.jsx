import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
        userName: currentUser.email,
        text: commentText.trim(),
      });
      setCommentText('');
      const commentsRes = await api.get(`/comments/${id}`);
      setComments(commentsRes.data);
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
      alert('Failed to update project.');
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
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to delete project.');
      setDeleting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error || !project)
    return <p className="text-center mt-10 text-red-600">{error || 'Project not found'}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Feed
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="Tags (comma separated)"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                value={editGithubLink}
                onChange={(e) => setEditGithubLink(e.target.value)}
                placeholder="GitHub Repo Link"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="url"
                value={editLiveDemoLink}
                onChange={(e) => setEditLiveDemoLink(e.target.value)}
                placeholder="Live Demo Link (optional)"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
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
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold">{project.title}</h1>
                {isOwner && (
                  <div className="flex gap-2 shrink-0 ml-4">
                    <button
                      onClick={startEditing}
                      className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="text-sm bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-md transition disabled:opacity-50"
                    >
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-sm text-gray-400 mb-3">by {project.userName}</p>

              <div className="flex gap-4">
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm hover:underline"
                >
                  View on GitHub
                </a>
                {project.liveDemoLink && (
                  <a
                    href={project.liveDemoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm hover:underline"
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
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Leave a comment..."
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <button
                type="submit"
                disabled={posting || !commentText.trim()}
                className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {posting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-500 mb-6">
              <Link to="/auth" className="text-blue-600 hover:underline">
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
                  <p className="text-sm text-gray-600">{comment.text}</p>
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