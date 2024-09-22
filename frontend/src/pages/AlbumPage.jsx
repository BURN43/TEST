import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FaPlus } from 'react-icons/fa';

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
  const [media, setMedia] = useState([]); // To handle both images and videos
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    // Fetch album settings including title and greeting
    const fetchAlbumSettings = async () => {
      try {
        if (userId) {
          const response = await axios.get(`http://localhost:5000/api/settings/${userId}`);
          const settingsData = response.data;

          setTitle(settingsData.albumTitle || '');
          setGreetingText(settingsData.greetingText || '');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchAlbumSettings();
  }, [userId]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
  
    // Client-side validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (file && !validTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a JPEG or PNG image.');
      return;
    }
    if (file && file.size > 10 * 1024 * 1024) {
      alert('File is too large. Maximum size is 10MB.');
      return;
    }
  
    // Proceed with upload if validation passes
    if (file) {
      const formData = new FormData();
      formData.append('profilePic', file);
  
      // Upload the file
      axios.post('http://localhost:5000/api/upload/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(response => {
        setProfilePic(response.data.profilePicUrl);
      })
      .catch(error => {
        console.error('Error uploading profile picture:', error);
      });
    }
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
  
    // Client-side validation for both images and videos
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4', 'video/webm', 'video/avi'];
    if (file && !validTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a JPEG, PNG, MP4, WebM, or AVI file.');
      return;
    }
    if (file && file.size > 100 * 1024 * 1024) {
      alert('File is too large. Maximum size for media files is 100MB.');
      return;
    }
  
    // Proceed with upload if validation passes
    if (file) {
      const formData = new FormData();
      formData.append('mediaFile', file); // Use 'mediaFile' to handle both videos and images
  
      setLoading(true);
      axios.post('http://localhost:5000/api/upload/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(response => {
        const newMedia = {
          id: media.length + 1,
          url: response.data.mediaUrl,
          title: `Media ${media.length + 1}`,
          type: file.type, // Store media type to differentiate between images and videos
        };
        setMedia([newMedia, ...media]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error uploading media file:', error);
        setLoading(false);
      });
    }
  };

  const renderMedia = (mediaItem) => {
    const isVideo = mediaItem.type.startsWith('video');
    if (isVideo) {
      return (
        <video className="w-full h-full object-cover" controls>
          <source src={mediaItem.url} type={mediaItem.type} />
          Your browser does not support the video tag.
        </video>
      );
    }
    // For images
    return <img loading="lazy" src={mediaItem.url} alt={mediaItem.title} className="w-full h-full object-cover" />;
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
          <div className="relative w-32 h-32 mx-auto mb-6">
            {profilePic ? (
              <img
                src={profilePic}
                className="w-32 h-32 rounded-full object-cover border-4 border-white"
              />
            ) : (
              isAdmin && (
                <label className="relative flex flex-col items-center justify-center w-full cursor-pointer aspect-square bg-purple-200 rounded-full border-2 border-dashed border-purple-600">
                  <input
                    type="file"
                    className="absolute z-10 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleProfilePicChange}
                  />
                  <FaPlus className="text-3xl text-purple-600" />
                  <div className="mt-1 text-xs text-purple-600">Profilbild hinzufügen</div>
                </label>
              )
            )}
          </div>

          <h1 className="text-4xl font-extrabold mb-2 text-gradient bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text uppercase">
            {title ? title : ''}
          </h1>
          <p className="text-lg text-purple-400">{greetingText}</p>
        </div>

        {/* Grid Layout for Media (Images and Videos) */}
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
                <div className="mt-1 text-xs text-purple-600">Medien hinzufügen</div>
              </>
            )}
          </label>

          {media.length > 0 ? (
            media.map((mediaItem) => (
              <motion.div
                key={mediaItem.id}
                className="relative w-full cursor-pointer aspect-square bg-gray-800 rounded-lg"
              >
                {renderMedia(mediaItem)}
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 md:col-span-6 text-center text-gray-400">
              Keine Medien hochgeladen. Fügen Sie ein Bild oder ein Video hinzu!
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default AlbumPage;
