import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FaPlus } from 'react-icons/fa';

const spinnerStyles = {
  border: '4px solid rgba(255, 255, 255, 0.3)',
  borderLeftColor: '#ffffff',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  animation: 'spin 1s linear infinite',
};

const AlbumPage = () => {
  const { user } = useAuthStore();
  const userId = user ? user._id : null;
  const [title, setTitle] = useState('');
  const [greetingText, setGreetingText] = useState('Willkommen auf meiner Hochzeit!');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const cachedSettings = JSON.parse(localStorage.getItem('albumSettings'));
    
    // If cached settings exist, load them
    if (cachedSettings) {
      setTitle(cachedSettings.albumTitle || '');
      setGreetingText(cachedSettings.greetingText || '');
    }

    const fetchAlbumSettings = async () => {
      try {
        if (userId) {
          const response = await axios.get(`http://localhost:5000/api/settings/${userId}`);
          const settingsData = response.data;

          // Set and cache the fetched data
          setTitle(settingsData.albumTitle || '');
          setGreetingText(settingsData.greetingText || '');
          
          localStorage.setItem('albumSettings', JSON.stringify({
            albumTitle: settingsData.albumTitle,
            greetingText: settingsData.greetingText
          }));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    if (!cachedSettings) {
      fetchAlbumSettings();
    }
  }, [userId]);

  const handleAddPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const newId = photos.length + 1;
      const newPhoto = {
        id: newId,
        url: URL.createObjectURL(file),
        title: `Photo ${newId}`,
      };
      setTimeout(() => {
        setPhotos([newPhoto, ...photos]);
        setLoading(false);
      }, 2000);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 md:p-8 pb-20"
      >
        <div className="text-center max-w-2xl mx-auto mb-8 mt-10">
          <div className="relative w-32 h-32 mx-auto mb-6">
            {profilePic ? (
              <img src={profilePic} className="w-32 h-32 rounded-full object-cover border-4 border-white" />
            ) : (
              <label className="relative flex flex-col items-center justify-center w-full cursor-pointer aspect-square bg-purple-200 rounded-full border-2 border-dashed border-purple-600">
                <input
                  type="file"
                  className="absolute z-10 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleProfilePicChange}
                />
                <FaPlus className="text-3xl text-purple-600" />
                <div className="mt-1 text-xs text-purple-600">Profilbild hinzufügen</div>
              </label>
            )}
          </div>

          <h1 className="text-4xl font-extrabold mb-2 text-gradient bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text uppercase">
            {title ? title : ''}
          </h1>
          <p className="text-lg text-purple-400">{greetingText}</p>
        </div>

        <div className="grid grid-cols-3 gap-1 md:grid-cols-6 h-fit">
          <label className="relative flex flex-col items-center justify-center w-full cursor-pointer aspect-square bg-purple-200 rounded-lg border-2 border-dashed border-purple-600">
            <input
              type="file"
              accept="image/*"
              className="absolute z-10 w-full h-full opacity-0 cursor-pointer"
              onChange={handleAddPhoto}
            />
            {loading ? (
              <div style={spinnerStyles} className="spinner" />
            ) : (
              <>
                <FaPlus className="text-5xl text-purple-600" />
                <div className="mt-1 text-xs text-purple-600">Bilder hinzufügen</div>
              </>
            )}
          </label>

          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              className="relative w-full cursor-pointer aspect-square bg-gray-800 rounded-lg"
              whileHover={{ scale: 1.01 }}
            >
              <img loading="lazy" src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Layout>
  );
};

export default AlbumPage;
