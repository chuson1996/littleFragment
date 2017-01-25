import React, { Component, PropTypes } from 'react';
import c from 'classnames';
import random from 'lodash/random';
import { Motion, spring } from 'react-motion';
import setStateWithTimeline, { runTimeline } from '../../helpers/setStateWithTimeline';
import log from '../../helpers/log';
import update from 'react-addons-update';
import {TypewriterText} from '../';

export default class LittleFragment extends Component {
  static propTypes = {
    quote: PropTypes.string.isRequired,
    fragmentAmount: PropTypes.number,
    className: PropTypes.string,
    quoteClassName: PropTypes.string,
    author: PropTypes.string
  };

  static defaultProps = {
    fragmentAmount: 20
  };

  constructor(props) {
    super(props);
    this.state = {
      perspectiveOrigin: {
        top: 50,
        left: 50
      },
      visibleOrders: [
        ['fragments', true],
        ['quote', false],
        ['author', false]
      ]
    };
  }

  componentWillMount() {
    const _fragments = Array(this.props.fragmentAmount)
      .fill(null)
      .map(this.generateFragment);

    this.state = {
      ...this.state,
      _fragments,
      fragments: Array(this.props.fragmentAmount)
        .fill(null)
        .map((_, index) => ({
          ..._fragments[index],
          translateZ: 0
        })),
    };
  }

  componentDidMount() {
    const { fragments, _fragments } = this.state;
    const timeline = fragments.map((fragment, index) => {
      return [index === 0 ? '0' : '+100', () => {
        if (index === fragments.length - 1) {
          this.showNext();
        }
        this.setState(update(this.state, {
          fragments: {
            [index]: {
              $merge: {
                translateZ: spring(_fragments[index].translateZ)
              }
            }
          }
        }));
      }];
    });

    runTimeline(timeline);
  }

  showNext = () => {
    const { visibleOrders } = this.state;
    const newVisibleOrder = visibleOrders.map(([part, isShow], index) => {
      if (index === 0) return [part, isShow];
      if (isShow) return [part, isShow];
      if (!isShow && visibleOrders[index - 1][1]) return [part, true];
      return [part, isShow];
    });
    this.setState({ visibleOrders: log('newVisibleOrder: ', newVisibleOrder) });
  }

  generateFragment() {
    const top = random(30, 100);
    const left = random(40, 100);
    const isWidth = !!random(0, 1);
    const width = isWidth ? random(30, 100 - left) : random(1, 2);
    const height = isWidth ? random(1, 2) : random(30, 100 - top);
    const translateZ = random(70, 150);
    return { top, left, width, height, translateZ };
  }

  convertToClipPathPolygon({ top, left, width, height }) {
    return `polygon(${left}% ${top}%, ${left + width}% ${top}%, ${left + width}% ${top + height}%, ${left}% ${top + height}%)`
  }

  onMouseMove = (e) => {
    const left = 100 - Math.floor(e.screenX / window.innerWidth * 100);
    const top = 100 - Math.floor(e.screenY / window.innerHeight * 100);
    this.setState({
      perspectiveOrigin: {
        top: spring(top),
        left: spring(left)
      }
    });
  };

  render() {
    const {
      quote,
      className,
      quoteClassName,
      author,
    } = this.props;
    const { fragments, perspectiveOrigin, visibleOrders } = this.state;
    const s = require('./LittleFragment.scss');
    const isFragmentVisible = visibleOrders[0][1];
    const isQuoteVisible = visibleOrders[1][1];
    const isAuthorVisible = visibleOrders[2][1];

    const backgroundStyle = {
      backgroundImage: `url(${require('../../assets/gary1-2.png')})`
    };

    return (
      <Motion style={perspectiveOrigin}>
        { (_perspectiveOrigin) =>
          <div
            onMouseMove={this.onMouseMove}
            className={c(s.container, className)}
            style={{
              perspectiveOrigin: `${_perspectiveOrigin.left}% ${_perspectiveOrigin.top}%`
            }}>
            <div className={s.image} style={{...backgroundStyle}}></div>
            { isFragmentVisible && fragments.map((fragmentStyle, i) =>
              <Motion key={i} style={fragmentStyle}>
                {(_fragmentStyle) =>
                  <div
                    className={s.fragment}
                    style={{
                      ...backgroundStyle,
                      clipPath: this.convertToClipPathPolygon(_fragmentStyle),
                      transform: `translateZ(${_fragmentStyle.translateZ}px)`
                    }}></div>
                }
              </Motion>
            )}
            <div className={s.quoteContainer}>
              <div>
                { isQuoteVisible &&
                  <p className={c(s.quote)}>
                    <TypewriterText
                      pausesSign={[
                        [/,/, 200, true],
                        [/[\.\?]/, 500, true]
                      ]}
                      onRest={() => setTimeout(this.showNext, 1000)}
                      className={quoteClassName}
                      text={quote}/>
                  </p>
                }

                { isAuthorVisible &&
                  <p className={s.author}>
                    <TypewriterText
                      speed={100}
                      pausesSign={[[/ /, 1000, false]]}
                      text={author} />
                  </p>
                }
              </div>
            </div>
          </div>
        }
      </Motion>
    );
  }
}
