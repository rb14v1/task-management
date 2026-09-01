import React from 'react';
import Button from '../components/Button';

const About: React.FC = () => {
  const handleClick = () => {
    window.history.back();
  };

  return (
    <div>
      <h1>About</h1>
      <Button onClick={handleClick} variant="primary">
        Go Back
      </Button>
    </div>
  );
};

export default About;