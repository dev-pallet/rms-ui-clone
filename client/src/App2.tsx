import React from 'react';
import Styles from './App.module.css';

interface Props {
  name: string;
}

class App extends React.Component<Props> {
  render() {
    const { name } = this.props;
    return (
      <>
        <h1>Welcome to {name}</h1>
        <p className={Styles.header}>Stay tuned for more updated</p>
      </>
    );
  }
}

export default App;
