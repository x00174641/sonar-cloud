const containerStyle = {
    margin: '0 auto',
    maxWidth: '1000px',
    marginTop: '200px',
    textAlign: 'center',
};

const Container = ({ children }) => {
    return (
      <div style={containerStyle}>
        {children}
      </div>
    );
  };
  
export default Container;
  