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

  // Fetch album settings including title and greeting
  useEffect(() => {
    const fetchAlbumSettings = async () => {
      console.log('Fetching album settings...');
      try {
        if (userId) {
          const response = await axios.get(`http://localhost:5000/api/settings/${userId}`, {
            withCredentials: true, // Make sure to send the token cookies
          });
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

  // Handle Profile Picture Upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    console.log('Profile picture file selected:', file);
  
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
  
      axios.post('http://localhost:5000/api/upload-profile-pic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      })
      .then(response => {
        console.log('Profile picture upload response:', response.data); // Log response for debugging
        
        const baseURL = 'http://localhost:5000'; // Define the base URL
        const profilePicUrl = response.data.profilePicUrl.startsWith('/uploads/') 
          ? `${baseURL}${response.data.profilePicUrl}` 
          : response.data.profilePicUrl;
  
        console.log('Full Profile Picture URL:', profilePicUrl); // Log the full URL for debugging
        setProfilePic(profilePicUrl); // Set the full URL to the state
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

    // Client-side validation for media (images and videos)
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

    // Proceed with media upload if validation passes
    if (file) {
      const formData = new FormData();
      formData.append('mediaFile', file);

      setLoading(true);
      console.log('Uploading media...');
      axios.post('http://localhost:5000/api/upload-media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true, // Ensure to send the token cookies
      })
      .then(response => {
        console.log('Media upload response:', response.data); // Log response for debugging
        const newMedia = {
          id: media.length + 1,
          url: response.data.mediaUrl,  // Check if URL is correct
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
        
        if (!mediaItem || !mediaItem.url) {
          return <div className="text-red-500">Invalid media item</div>;  // Placeholder for invalid media
        }
      
        // Ensure the URL is fully qualified by adding the base URL
        const baseURL = 'http://localhost:5000';
        const fullURL = mediaItem.url.startsWith('/uploads/') ? `${baseURL}${mediaItem.url}` : mediaItem.url;
      
        const isVideo = fullURL.endsWith('.mp4') || fullURL.endsWith('.webm') || fullURL.endsWith('.avi');
      
        if (isVideo) {
          return (
            <video className="w-full h-full object-cover" controls>
              <source src={fullURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          );
        }
      
        // Log the fully qualified image URL for debugging
        console.log('Full Image URL:', fullURL);
      
        // Render the image, focusing on the top
        return (
          <img
            loading="lazy"
            src={fullURL}
            alt={mediaItem.title}
            className="w-full h-full rounded-lg object-cover object-center" // Ensures image focuses on top and fits the square
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
        <div className="relative w-40 h-40 mx-auto mb-6"> {/* Bigger size */}
        {profilePic ? (
          <img
            src={profilePic}
            className="w-full h-full rounded-full object-cover object-top border-4 border-white" // Focus image on top
            alt="Profile"
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

        {/* Display Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">
            {errorMessage}
          </div>
        )}

        {/* Grid Layout for Media Upload (both images and videos) */}
        <div className="grid grid-cols-3 gap-1 md:grid-cols-6  h-fit">
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
                key={mediaItem.id}
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
