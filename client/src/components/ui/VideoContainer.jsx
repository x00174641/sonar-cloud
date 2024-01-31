const containerStyle = {
    margin: '0 auto',
    maxWidth: '1800px',
    marginTop: '200px',
};

const VideoContainer = ({ children }) => {
    return (
      <div style={containerStyle}>
        {children}
      </div>
    );
  };
  
export default VideoContainer;
  