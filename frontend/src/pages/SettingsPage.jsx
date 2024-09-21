// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import axios from 'axios';

const SettingsPage = () => {
  const [albumTitle, setAlbumTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [greetingText, setGreetingText] = useState('');
  const [guestInfo, setGuestInfo] = useState('');
  const [disableGuestUploads, setDisableGuestUploads] = useState(false);
  const [hidePhotoChallenge, setHidePhotoChallenge] = useState(false);
  const [hideLivestream, setHideLivestream] = useState(false);
  const [disableDownloadOption, setDisableDownloadOption] = useState(false);
  const [countdown, setCountdown] = useState(null);


  // Fetch settings when the component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/settings'); // Adjust the URL based on your backend setup
        if (res.data) {
          setAlbumTitle(res.data.albumTitle || '');
          setEventDate(res.data.eventDate || '');
          setEventTime(res.data.eventTime || '');
          setGreetingText(res.data.greetingText || '');
          setGuestInfo(res.data.guestInfo || '');
          setDisableGuestUploads(res.data.disableGuestUploads || false);
          setHidePhotoChallenge(res.data.hidePhotoChallenge || false);
          setHideLivestream(res.data.hideLivestream || false);
          setDisableDownloadOption(res.data.disableDownloadOption || false);
        }
      } catch (err) {
        console.error("Error fetching settings: ", err);
      }
    };

    fetchSettings();
  }, []); // Empty dependency array ensures the effect runs only once



  // Countdown logic (kept as it is)
  useEffect(() => {
    if (eventDate) {
      const interval = setInterval(() => {
        const eventDateTime = eventTime ? `${eventDate}T${eventTime}` : eventDate;
        const eventTimeMs = new Date(eventDateTime).getTime();
        const currentTimeMs = new Date().getTime();
        const timeLeft = eventTimeMs - currentTimeMs;

        if (timeLeft > 0) {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

          setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
          setCountdown('The Event is Live!');
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [eventDate, eventTime]);


  // Handle Save Settings function
  const handleSaveSettings = async () => {
    const settings = {
      albumTitle,
      eventDate,
      eventTime,
      greetingText,
      guestInfo,
      disableGuestUploads,
      hidePhotoChallenge,
      hideLivestream,
      disableDownloadOption,
    };

    try {
      const res = await axios.post('/api/settings', settings);
      console.log('Settings saved successfully:', res.data);
    } catch (err) {
      console.error('Error saving settings:', err);
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
        {/* Intro Section */}
        <div className="text-center max-w-2xl mx-auto mb-8 mt-10">
          <h1 className="text-4xl font-extrabold mb-6 text-gradient bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Album Settings
          </h1>
          <p className="text-lg text-gray-300">
            Customize your album settings and manage the details for your event.
          </p>
        </div>

        {/* Combined Form Block */}
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl text-gray-200 font-bold mb-6">Event and Album Details</h2>

          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">Title</label>
            <input
              type="text"
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
              className="w-full py-3 px-4 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter album title"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">Event Date</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full py-3 px-4 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">Event Time (optional)</label>
            <input
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-full py-3 px-4 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Countdown Section */}
          {eventDate && (
            <div className="mb-6">
              <h3 className="text-lg text-gray-400 mb-2">Countdown to Event</h3>
              <div className="py-3 px-4 bg-gray-700 text-white rounded-lg">
                {countdown || 'Enter an event date to start the countdown'}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-400 text-sm mb-2">Greeting Text</label>
            <textarea
              value={greetingText}
              onChange={(e) => setGreetingText(e.target.value)}
              className="w-full py-3 px-4 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a greeting text for your guests"
              rows="3"
            />
          </div>
        </div>

        {/* Settings Checkboxes */}
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg max-w-3xl mx-auto">
          <h2 className="text-2xl text-gray-200 font-bold mb-6">Additional Album Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Disable guest photo uploads</span>
              <input
                type="checkbox"
                checked={disableGuestUploads}
                onChange={() => setDisableGuestUploads(!disableGuestUploads)}
                className="form-checkbox h-6 w-6 text-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Hide Photo Challenge for guests</span>
              <input
                type="checkbox"
                checked={hidePhotoChallenge}
                onChange={() => setHidePhotoChallenge(!hidePhotoChallenge)}
                className="form-checkbox h-6 w-6 text-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Hide Livestream for guests</span>
              <input
                type="checkbox"
                checked={hideLivestream}
                onChange={() => setHideLivestream(!hideLivestream)}
                className="form-checkbox h-6 w-6 text-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Disable download option for guests</span>
              <input
                type="checkbox"
                checked={disableDownloadOption}
                onChange={() => setDisableDownloadOption(!disableDownloadOption)}
                className="form-checkbox h-6 w-6 text-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleSaveSettings}
            className="py-3 px-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300"
          >
            Save Settings
          </button>
        </div>
      </motion.div>
    </Layout>
  );
};

export default SettingsPage;
