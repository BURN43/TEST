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
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch album settings, profile picture, and media on page load
  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        if (userId) {
          // Fetch album title and greeting text
          const settingsResponse = await axios.get(`http://localhost:5000/api/settings/${userId}`, {
            withCredentials: true,
          });
          const settingsData = settingsResponse.data;
          setTitle(settingsData.albumTitle || '');
          setGreetingText(settingsData.greetingText || '');

          // Fetch profile picture (with userId included in URL)
          const profilePicResponse = await axios.get(`http://localhost:5000/api/profile-picture/${userId}`, {
            withCredentials: true,
          });
          setProfilePic(profilePicResponse.data.profilePicUrl);

          // Fetch album media
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

 
  // Handle Profile Picture Upload (Admin Override)
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
  
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (file && !validTypes.includes(file.type)) {
      setErrorMessage('Invalid file type. Please upload a JPEG or PNG image.');
      return;
    }
    if (file && file.size > 10 * 1024 * 1024) {
      setErrorMessage('File is too large. Maximum size is 10MB.');
      return;
    }
  
    setErrorMessage(null);
  
    if (file) {
      const formData = new FormData();
      formData.append('profilePic', file);
      formData.append('userId', userId); // Include the userId of the profile being updated
  
      axios.post('http://localhost:5000/api/profile-picture/upload-profile-pic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      })
      .then(response => {
        const baseURL = 'http://localhost:5000';
        const profilePicUrl = response.data.profilePicUrl.startsWith('/uploads/')
          ? `${baseURL}${response.data.profilePicUrl}`
          : response.data.profilePicUrl;
  
        setProfilePic(profilePicUrl); // Update the displayed profile picture
      })
      .catch(error => {
        setErrorMessage('Error uploading profile picture.');
        console.error('Error uploading profile picture:', error);
      });
    }
  };

  // Handle Media Upload (Images/Videos)
  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    console.log('Media file selected:', file);

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/avi'];

    if (file && !validImageTypes.includes(file.type) && !validVideoTypes.includes(file.type)) {
      setErrorMessage('Invalid file type. Please upload a JPEG, PNG image, or a MP4/WebM/AVI video.');
      return;
    }
    if (file && file.size > 100 * 1024 * 1024) {
      setErrorMessage('File is too large. Maximum size for media is 100MB.');
      return;
    }

    setErrorMessage(null);

    if (file) {
      const formData = new FormData();
      formData.append('mediaFile', file);
      formData.append('albumId', userId); // Add albumId to the formData

      setLoading(true);
      console.log('Uploading media...');
      axios.post('http://localhost:5000/api/album-media/upload-media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      })
      .then(response => {
        console.log('Media upload response:', response.data);
        const newMedia = {
          id: media.length + 1,
          url: response.data.mediaUrl,
          title: `Media ${media.length + 1}`,
        };
        setMedia([newMedia, ...media]);
        setLoading(false);
      })
      .catch(error => {
        setErrorMessage('Error uploading media.');
        console.error('Error uploading media:', error);
        setLoading(false);
      });
    }
  };

  // Render Media (Images/Videos)
  const renderMedia = (mediaItem) => {
    console.log('Rendering media item:', mediaItem); // Log the entire media item
    
    if (!mediaItem || !mediaItem.mediaUrl) {
      return <div className="text-red-500">Invalid media item</div>; // Placeholder for invalid media
    }
  
    const baseURL = 'http://localhost:5000';
    const fullURL = mediaItem.mediaUrl.startsWith('/uploads/') ? `${baseURL}${mediaItem.mediaUrl}` : mediaItem.mediaUrl;
  
    const isVideo = fullURL.endsWith('.mp4') || fullURL.endsWith('.webm') || fullURL.endsWith('.avi');
  
    if (isVideo) {
      return (
        <video className="w-full h-full object-cover" controls>
          <source src={fullURL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
  
    return (
      <img
        loading="lazy"
        src={fullURL}
        alt={mediaItem.title || 'Media'}
        className="w-full h-full rounded-lg object-cover object-center"
      />
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
        {/* Profile Picture Section */}
        <div className="relative w-40 h-40 mx-auto mb-6">
          {profilePic ? (
            <div className="relative">
              {/* Profile Picture */}
              <img
                src={profilePic}
                className="w-40 h-40 rounded-full object-cover object-center border-4 border-white"
                alt="Profile"
              />

              {/* Tooltip for Admin to Change Profile Picture */}
              {isAdmin && (
                <div className="absolute inset-0 flex items-center justify-center bg-purple-200 bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <span className="text-purple-600 text-sm">Profilbild ändern</span>
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleProfilePicChange}
                  />
                </div>
              )}
            </div>
          ) : (
            isAdmin ? (
              // Admin Upload UI when no profile picture exists
              <label className="relative flex flex-col items-center justify-center w-full cursor-pointer aspect-square bg-purple-200 rounded-full border-2 border-dashed border-purple-600">
                <input
                  type="file"
                  className="absolute z-10 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleProfilePicChange}
                />
                <FaPlus className="text-3xl text-purple-600" />
                <div className="mt-1 text-xs text-purple-600">Profilbild hinzufügen</div>
              </label>
            ) : (
              // Guest View when no profile picture exists
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center border-2 border-dashed border-purple-600">
                <p className="text-gray-500">Kein Profilbild</p>
              </div>
            )
          )}
        </div>

        {/* Title and Greeting */}
        <h1 className="text-4xl font-extrabold mb-2 text-gradient bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text uppercase">
          {title ? title : ''}
        </h1>
        <p className="text-lg text-purple-400">{greetingText}</p>
      </div>


        {/* Display Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">
            {errorMessage}
          </div>
        )}

        {/* Grid Layout for Media Upload (both images and videos) */}
        <div className="grid grid-cols-3 gap-1 md:grid-cols-6 h-fit">
          {/* Add Media (Images or Videos) */}
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

        {/* Display Media */}
        {media.length > 0 ? (
          media.map((mediaItem) => (
            <motion.div
              key={mediaItem._id} // Ensure that mediaItem._id (or another unique field) is used as the key
              className="relative w-full cursor-pointer aspect-square bg-gray-800 rounded-lg"
            >
              {renderMedia(mediaItem)}
            </motion.div>
          ))
        ) : (
          <div className="col-span-3 md:col-span-6 text-center text-gray-400">
            Keine Medien hochgeladen. Fügen Sie ein Bild oder Video hinzu!
          </div>
        )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default AlbumPage;
