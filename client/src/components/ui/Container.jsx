const containerStyle = {
  margin: '0 auto',
  marginTop: '50px',
  maxWidth: '80%',
  borderRadius: '25px',
  padding: '20px',
  display: 'flex',
  zIndex: '100',

};

const leftSectionStyle = {
  flex: '1 0 20%',
  zIndex: '100',
};

const middleSectionStyle = {
  flex: '1 0 80%',
  paddingLeft: '80px',
  paddingRight: '50px',
  zIndex: '100',
};


const Container = ({ children }) => {
  return (
    <div style={containerStyle} className="glass">
      <div style={leftSectionStyle}>
        {children[0]}
      </div>
      <div style={middleSectionStyle}>
        {children[1]}
      </div>
     
    </div>
  );
};

export default Container;
