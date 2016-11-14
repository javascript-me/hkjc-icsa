import React from 'react';
import classNames from 'classnames';

const isOpening = (s1, s2) => !s1.isVisible && s2.isVisible;
const isClosing = (s1, s2) => s1.isVisible && !s2.isVisible;

export default class Popup extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = { isVisible: false };
    }

    componentWillUpdate(nextProps, nextState) {
        if (isOpening(this.state, nextState) && this.props.beforeOpen) {
            this.props.beforeOpen();
        }

        if (isClosing(this.state, nextState) && this.props.beforeClose) {
            this.props.beforeClose();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (isOpening(prevState, this.state) && this.props.afterOpen) {
            this.props.afterOpen();
        }

        if (isClosing(prevState, this.state) && this.props.afterClose) {
            this.props.afterClose();
        }
    }

    show() {
        this.setState({ isVisible: true });
    }

    hide() {
        this.setState({ isVisible: false });
    }

    onOverlayClicked() {
        if (this.props.hideOnOverlayClicked) {
            this.hide();
        }

        if (this.props.onOverlayClicked) {
            this.props.onOverlayClicked();
        }
    }

    onCloseClicked() {
        this.hide();
   
        if (this.props.onCloseClicked) {
            this.props.onCloseClicked();
        }
    }

  render() {
    
    let overlay;
    if (this.props.showOverlay) {
      overlay = (
        <div className="popup-overlay" onClick={() => this.onOverlayClicked()} />
      );
    }

    return this.state.isVisible ? (
        <section className="popup-wrapper">
            {overlay}
            <div className="popup-dialog">
              <a role="button" className="popup-close-button" onClick={() => this.onCloseClicked()}>
                &times;
               </a>
              <h2 className="title">{this.props.title}</h2>
              {this.props.children}
            </div>
        </section>
    ) : <div />;
  }
}

Popup.displayName = 'Popup';

Popup.sharedPropTypes = {
  onCloseClicked: React.PropTypes.func,
  onOverlayClicked: React.PropTypes.func,
  showOverlay: React.PropTypes.bool,
  title: React.PropTypes.string,
};

Popup.propTypes = {
  ...Popup.sharedPropTypes,
  afterClose: React.PropTypes.func,
  afterOpen: React.PropTypes.func,
  beforeClose: React.PropTypes.func,
  beforeOpen: React.PropTypes.func,
  hideOnOverlayClicked: React.PropTypes.bool,
  isVisible: React.PropTypes.bool,
};

Popup.defaultProps = {
  title: '',
  showOverlay: true,
  hideOnOverlayClicked: false,
};