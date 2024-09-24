import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FaPlus, FaTimes, FaHeart, FaComment, FaShareAlt, FaEllipsisH, FaDownload } from 'react-icons/fa';

// Spinner CSS
const spinnerStyles = {
  border: '4px solid rgba(255, 255, 255, 0.3)',
  borderLeftColor: '#ffffff',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  animation: 'spin 1s linear infinite',
};

const AlbumPage = ({ isGuest }) => {
  const { user } = useAuthStore();
  const userId = user ? user._id : null;
  const isAdmin = user && user.role === 'admin';

  const [title, setTitle] = useState('');
  const [greetingText, setGreetingText] = useState('');
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null); // For modal
  const [isModalOpen, setIsModalOpen] = useState(false); // To track modal state
  const [likes, setLikes] = useState({}); // To track likes for each media item
  const [comments, setComments] = useState({}); // To track comments for each media item
  const [showComments, setShowComments] = useState(false); // Toggle comment view

  // Fetch album settings, profile picture, and media on page load
  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        if (userId) {
          const settingsResponse = await axios.get(`http://localhost:5000/api/settings/${userId}`, {
            withCredentials: true,
          });
          const settingsData = settingsResponse.data;
          setTitle(settingsData.albumTitle || '');
          setGreetingText(settingsData.greetingText || '');

          const profilePicResponse = await axios.get(`http://localhost:5000/api/profile-picture/${userId}`, {
            withCredentials: true,
          });
          setProfilePic(profilePicResponse.data.profilePicUrl);

          const mediaResponse = await axios.get(`http://localhost:5000/api/album-media/${userId}`, {
            withCredentials: true,
          });
          setMedia(mediaResponse.data.media);
        }
      } catch (error) {
        console.error('Error fetching album data:', error);
      }
    };

    fetchAlbumData();
  }, [userId]);

  // Handle Media Upload (Images/Videos)
  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    const tempId = `temp-${Date.now()}`;
    const previewUrl = URL.createObjectURL(file);

    const tempMedia = {
      id: tempId, // Temporary ID
      mediaUrl: previewUrl, // Local preview URL
      title: 'Uploading...',
    };

    setMedia([tempMedia, ...media]);

    const formData = new FormData();
    formData.append('mediaFile', file);
    formData.append('albumId', userId);

    setLoading(true);
    axios.post('http://localhost:5000/api/album-media/upload-media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })
      .then(response => {
        const newMedia = {
          id: response.data._id, // Use the real ID from the server
          mediaUrl: response.data.mediaUrl,
          title: file.name,
        };
        setMedia((prevMedia) => prevMedia.map((item) => (item.id === tempId ? newMedia : item)));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error uploading media:', error);
        setMedia((prevMedia) => prevMedia.filter((item) => item.id !== tempId));
        setErrorMessage('Error uploading media.');
        setLoading(false);
      });
  };

  // Open Modal to view media
  const openModal = (mediaItem) => {
    setSelectedMedia(mediaItem);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setSelectedMedia(null);
    setIsModalOpen(false);
    setShowComments(false);
  };

  // Handle like button toggle
  const handleLikeToggle = (mediaId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [mediaId]: !prevLikes[mediaId],
    }));
  };

  // Handle comments toggle
  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  // Render Media (Images/Videos)
  const renderMedia = (mediaItem) => {
    const baseURL = 'http://localhost:5000';
    const fullURL = mediaItem.mediaUrl.startsWith('/uploads/') ? `${baseURL}${mediaItem.mediaUrl}` : mediaItem.mediaUrl;
    const isVideo = fullURL.endsWith('.mp4') || fullURL.endsWith('.webm') || fullURL.endsWith('.avi');

    return (
      <motion.div
        key={mediaItem._id || mediaItem.id}
        className="relative w-full cursor-pointer aspect-square bg-gray-800 rounded-lg"
        onClick={() => openModal(mediaItem)}
      >
        {isVideo ? (
          <video className="w-full h-full object-cover" controls>
            <source src={fullURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            loading="lazy"
            src={fullURL}
            alt={mediaItem.title || 'Media'}
            className="w-full h-full rounded-lg object-cover object-center"
          />
        )}
      </motion.div>
    );
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 md:p-8 pb-20"
      >
        {/* Profile Picture, Title, and Greeting Text */}
        <div className="text-center max-w-2xl mx-auto mb-8 mt-10">
          <div className="relative w-40 h-40 mx-auto mb-6">
            {profilePic ? (
              <div className="relative">
                <img
                  src={profilePic}
                  className="w-40 h-40 rounded-full object-cover object-center border-4 border-white"
                  alt="Profile"
                />
                {isAdmin && (
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-200 bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-purple-600 text-sm">Profilbild ändern</span>
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleMediaUpload}
                    />
                  </div>
                )}
              </div>
            ) : (
              isAdmin && (
                <label className="relative flex flex-col items-center justify-center w-full cursor-pointer aspect-square bg-purple-200 rounded-full border-2 border-dashed border-purple-600">
                  <input
                    type="file"
                    className="absolute z-10 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleMediaUpload}
                  />
                  <FaPlus className="text-3xl text-purple-600" />
                  <div className="mt-1 text-xs text-purple-600">Profilbild hinzufügen</div>
                </label>
              )
            )}
          </div>

          <h1 className="text-4xl font-extrabold mb-2 text-gradient bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text uppercase">
            {title}
          </h1>
          <p className="text-lg text-purple-400">{greetingText}</p>
        </div>

        {/* Display Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">
            {errorMessage}
          </div>
        )}

        {/* Grid Layout for Media Upload */}
        <div className="grid grid-cols-3 gap-1 md:grid-cols-6 h-fit">
          <label className="relative flex flex-col items-center justify-center w-full cursor-pointer aspect-square bg-purple-200 rounded-lg border-2 border-dashed border-purple-600">
            <input
              type="file"
              accept="image/*,video/*"
              className="absolute z-10 w-full h-full opacity-0 cursor-pointer"
              onChange={handleMediaUpload}
            />
            {loading ? (
              <div style={spinnerStyles} className="spinner" />
            ) : (
              <>
                <FaPlus className="text-5xl text-purple-600" />
                <div className="mt-1 text-xs text-purple-600">Hinzufügen</div>
              </>
            )}
          </label>

          {media.map((mediaItem) => renderMedia(mediaItem))}
        </div>
      </motion.div>

      {/* Modal for Media */}
      {isModalOpen && selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md">
          <div className="relative w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg flex flex-col">
            {/* Back Button */}
            <button onClick={closeModal} className="absolute top-4 left-4 p-2 bg-gray-800 rounded-full text-white">
              <img src="/path-to-backbutton.png" alt="back" className="w-6 h-6" />
            </button>

            {/* Fullscreen Media Display */}
            <div className="w-full h-auto max-h-[70vh] overflow-hidden">
              {selectedMedia.mediaUrl.endsWith('.mp4') ? (
                <video className="w-full h-auto max-h-[70vh] object-cover" controls autoPlay>
                  <source src={selectedMedia.mediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={selectedMedia.mediaUrl} alt={selectedMedia.title} className="w-full h-auto max-h-[70vh] object-cover" />
              )}
            </div>

            {/* Icons: Like, Comment, Share */}
            <div className="flex flex-col items-center justify-center mt-4 absolute right-4">
              <button className="mb-4" onClick={() => handleLikeToggle(selectedMedia._id)}>
                <FaHeart className={likes[selectedMedia._id] ? 'text-red-500' : 'text-white'} />
                <p className="text-white">{likes[selectedMedia._id] ? 1 : 0}</p>
              </button>
              <button className="mb-4" onClick={toggleComments}>
                <FaComment className="text-white" />
                <p className="text-white">{(comments[selectedMedia._id] || []).length}</p>
              </button>
              <button className="mb-4" onClick={() => alert('Download functionality coming soon!')}>
                <FaDownload className="text-white" />
              </button>
              {isAdmin && (
                <button onClick={() => alert('Admin options coming soon!')}>
                  <FaEllipsisH className="text-white" />
                </button>
              )}
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mt-4 px-4">
                <div className="text-sm text-gray-600">Comments:</div>
                <ul className="list-disc list-inside">
                  {(comments[selectedMedia._id] || []).map((comment, idx) => (
                    <li key={idx}>{comment}</li>
                  ))}
                </ul>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="border p-2 w-full mt-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setComments((prev) => ({
                        ...prev,
                        [selectedMedia._id]: [...(comments[selectedMedia._id] || []), e.target.value],
                      }));
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AlbumPage;
