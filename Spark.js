import React, { useState, useEffect } from 'react';
import { Flame, User, Calendar, Award } from 'lucide-react';

export default function ChatSpark() {
  const [sparkData, setSparkData] = useState({
    user1: { name: 'Alice', clickedToday: false, lastClick: null },
    user2: { name: 'Bob', clickedToday: false, lastClick: null },
    sparkCount: 0,
    currentStreak: 0,
    longestStreak: 0,
    startDate: new Date().toISOString()
  });

  const [currentDate, setCurrentDate] = useState(new Date().toDateString());

  // Check if it's a new day and reset daily clicks
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toDateString();
      if (today !== currentDate) {
        setCurrentDate(today);
        setSparkData(prev => ({
          ...prev,
          user1: { ...prev.user1, clickedToday: false },
          user2: { ...prev.user2, clickedToday: false }
        }));
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [currentDate]);

  const handleUserClick = (userKey) => {
    const today = new Date().toDateString();
    
    setSparkData(prev => {
      const user = prev[userKey];
      
      // Prevent clicking if already clicked today
      if (user.clickedToday) return prev;

      const updatedUser = {
        ...user,
        clickedToday: true,
        lastClick: new Date().toISOString()
      };

      const otherUserKey = userKey === 'user1' ? 'user2' : 'user1';
      const otherUser = prev[otherUserKey];
      
      // Check if both users clicked today
      const bothClicked = updatedUser.clickedToday && otherUser.clickedToday;
      
      let newSparkCount = prev.sparkCount;
      let newCurrentStreak = prev.currentStreak;
      let newLongestStreak = prev.longestStreak;

      if (bothClicked) {
        newSparkCount += 1;
        newCurrentStreak += 1;
        newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
      }

      return {
        ...prev,
        [userKey]: updatedUser,
        sparkCount: newSparkCount,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak
      };
    });
  };

  const resetSpark = () => {
    setSparkData({
      user1: { name: 'Alice', clickedToday: false, lastClick: null },
      user2: { name: 'Bob', clickedToday: false, lastClick: null },
      sparkCount: 0,
      currentStreak: 0,
      longestStreak: sparkData.longestStreak,
      startDate: new Date().toISOString()
    });
  };

  const getSparkIntensity = () => {
    if (sparkData.currentStreak === 0) return 'text-gray-400';
    if (sparkData.currentStreak < 3) return 'text-orange-400';
    if (sparkData.currentStreak < 7) return 'text-orange-500';
    if (sparkData.currentStreak < 14) return 'text-red-500';
    return 'text-pink-500';
  };

  const getSparkSize = () => {
    if (sparkData.currentStreak === 0) return 'w-16 h-16';
    if (sparkData.currentStreak < 7) return 'w-20 h-20';
    if (sparkData.currentStreak < 14) return 'w-24 h-24';
    return 'w-32 h-32';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-purple-800">
          Chat Spark
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Keep your connection alive! Both users click daily to grow the spark 🔥
        </p>

        {/* Spark Display */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex flex-col items-center">
            <div className={`${getSparkSize()} transition-all duration-500 mb-4`}>
              <Flame 
                className={`w-full h-full ${getSparkIntensity()} ${sparkData.currentStreak > 0 ? 'animate-pulse' : ''}`}
                strokeWidth={1.5}
              />
            </div>
            
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-purple-800 mb-2">
                {sparkData.sparkCount}
              </div>
              <div className="text-gray-600">Total Sparks</div>
            </div>

            <div className="grid grid-cols-2 gap-8 w-full max-w-md">
              <div className="text-center bg-purple-50 rounded-xl p-4">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-800">
                  {sparkData.currentStreak}
                </div>
                <div className="text-sm text-gray-600">Current Streak</div>
              </div>
              
              <div className="text-center bg-pink-50 rounded-xl p-4">
                <Award className="w-6 h-6 mx-auto mb-2 text-pink-600" />
                <div className="text-2xl font-bold text-pink-800">
                  {sparkData.longestStreak}
                </div>
                <div className="text-sm text-gray-600">Longest Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* User Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {['user1', 'user2'].map((userKey) => {
            const user = sparkData[userKey];
            return (
              <button
                key={userKey}
                onClick={() => handleUserClick(userKey)}
                disabled={user.clickedToday}
                className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                  user.clickedToday
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-xl hover:scale-105 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <User className="w-8 h-8 text-purple-600" />
                    <span className="text-xl font-semibold text-gray-800">
                      {user.name}
                    </span>
                  </div>
                  {user.clickedToday && (
                    <span className="text-2xl">✓</span>
                  )}
                </div>
                
                <div className={`text-sm font-medium ${
                  user.clickedToday ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {user.clickedToday ? '✨ Clicked today!' : 'Click to spark!'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Status Message */}
        {sparkData.user1.clickedToday && sparkData.user2.clickedToday && (
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-xl p-4 mb-6 text-center">
            <p className="font-semibold text-lg">
              🎉 Both users clicked today! Spark increased! 🔥
            </p>
          </div>
        )}

        {/* Reset Button */}
        <button
          onClick={resetSpark}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-xl transition-colors"
        >
          Reset Spark (Keep Longest Streak)
        </button>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>💡 Both users must click once daily to increase the spark count!</p>
          <p className="mt-1">The streak grows when both users click on the same day.</p>
        </div>
      </div>
    </div>
  );
}