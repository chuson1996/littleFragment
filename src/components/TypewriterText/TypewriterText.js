import React, { Component, PropTypes } from 'react';
import c from 'classnames';
import {runTimeline} from '../../helpers/setStateWithTimeline';

export default class TypewriterText extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
    onRest: PropTypes.func
  };

  static defaultProps = {
    speed: 50
  };

  constructor(props) {
    super(props);
    this.state = { counter: 0 };
  }

  isPauseSign(tester, preChar, char, followingBySpace) {
    if (followingBySpace) return tester.test(preChar) && char === ' ';
    return tester.test(preChar);
  }

  componentDidMount() {
    const { text, pausesSign, speed } = this.props;
    const timeline = text.split('')
      .map((char, i) => {
        let time = `+${speed}`;
        if (i === 0) time = '0';
        for (let [tester, _time, followingBySpace] of pausesSign) {
          if (this.isPauseSign(tester, text[i - 1], char, followingBySpace)) {
            time = '+' + _time;
          }
        }

        return [time, () => {
          this.setState({ counter: i });
          if (i === text.length - 1) {
            if (this.props.onRest) this.props.onRest();
          }
        }];
      });
    runTimeline(timeline);
  }

  render() {
    const s = require('./TypewriterText.scss');
    const {text, className} = this.props;
    return (
      <span className={c(s.typewriterText, className)}>
        {text.substr(0, this.state.counter + 1)}
      </span>
    );
  }
}
