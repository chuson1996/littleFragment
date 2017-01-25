import React, { Component } from 'react';
import { LittleFragment } from './components';

class App extends Component {
  render() {
    const s = require('./App.scss');
    return (
      <div>
        <LittleFragment
          fragmentAmount={15}
          className={s.card1}
          quoteClassName={s.quote}
          author="Gary Vaynerchuck"
          quote={`"The steps it takes to actually get to the biggest places in the world, before you get a meeting with, you know, Zucks or Cuban, or Barry, Diller, or whoever you’re trying to have a meeting with in the business world, well you’ve got a lot of little meetings to build up your cadence. People are always like, man, you’ve been on Conan, and Ellen, and the Today Show and CNN, and Fox, how do I get that? And I’m like well, I also did a thousand interviews, it feels like, on a video that got one or 19 or 137 views."`} />
      </div>
    );
  }
}

export default App;
