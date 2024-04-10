import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Button } from 'tamagui';
import { Plus } from '@tamagui/lucide-icons';
import { Video, ResizeMode } from 'expo-av';
import { color } from '@tamagui/themes';
import {
  useFonts,
  Montserrat_600SemiBold,
} from '@expo-google-fonts/montserrat';

const Controller = () => {
  const [videoList, setVideoList] = useState([]);
  const [videos, setVideos] = useState({});
  const [randomVideos, setRandomVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  let [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
  });
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('https://api.clipr.solutions/api/getVideos');
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      const data = await response.json();
      setVideoList(data.video_list);
      fetchVideoDetails(data.video_list);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const fetchVideoDetails = async (videoList) => {
    try {
      const videosWithDetails = await Promise.all(videoList.map(async (videoID) => {
        const response = await fetch(`https://api.clipr.solutions/videos/${videoID}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch video info for ${videoID}`);
        }
        const videoInfo = await response.json();
        return { videoID, ...videoInfo };
      }));
      const videosObject = videosWithDetails.reduce((acc, video) => {
        acc[video.videoID] = video;
        return acc;
      }, {});
      setVideos(videosObject);
      setRandomVideos(videosWithDetails);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleVideoPress = (videoId) => {
    console.log('Pressed video:', videoId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Videos</Text>
      {error ? (
        <Text style={styles.errorText}>Failed to fetch videos: {error}</Text>
      ) : (
        <FlatList
          data={randomVideos}
          renderItem={({ item }) => (
            
            <TouchableOpacity onPress={() => handleVideoPress(item.videoID)}>
              <Video
                source={{ uri: `https://cliprbucket.s3.amazonaws.com/videos/${item.videoID}` }}
                style={styles.videoThumbnail}
                onError={(error) => console.error('Error loading video thumbnail:', error)}
              />
             <Text style={styles.fontColour}>{item.title}</Text>
             <Text style={styles.statistics}>{item.username} | {item.total_views} Views | {item.uploaded_date}</Text>
            </TouchableOpacity>
            
          )}
          keyExtractor={(item) => item.videoID}
          contentContainerStyle={styles.videoList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    color: 'white',
    fontFamily: 'Roboto',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    marginLeft: 20,
    marginTop: 50,
  },
  videoList: {
    padding: 20,
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    marginTop: 20,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    marginTop: 10,
    marginLeft: 20,
  },
  submitButton: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    width: 64,
    height: 64,
    borderRadius: 64 / 2,
    backgroundColor: '#03DAC5',
  },
  fontColour: {
    color: 'white',
    fontFamily: 'Montserrat_600SemiBold',
  },
  statistics: {
    color: 'gray',
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: '10px',
  }
});

export default Controller;
