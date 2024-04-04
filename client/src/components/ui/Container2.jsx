const containerStyle = {
    margin: '0 auto',
    textAlign: 'center',
    minHeight: '100vh'

  };
  
  const Container2 = ({ children }) => {
    return (
      <div style={containerStyle}>
        {children}
      </div>
    );
  };
  
  export default Container2;