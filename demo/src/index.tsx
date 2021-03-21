import React from 'react';
import { render } from 'react-dom';

// parcel hot module replacement
if ((module as any)?.hot) {
  (module as any)?.hot?.accept();
}

const App = () => {
  return <div>Write demo here...</div>;
};

render(<App />, document.getElementById('root'));
