const containerStyle = {
  margin: '0 auto',
  marginTop: '100px',
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
