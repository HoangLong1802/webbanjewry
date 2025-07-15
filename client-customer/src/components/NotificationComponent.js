import React, { Component } from 'react';

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    if (this.props.show) {
      this.setState({ visible: true });
      if (this.props.autoHide !== false) {
        setTimeout(() => {
          this.setState({ visible: false });
          if (this.props.onHide) {
            setTimeout(() => this.props.onHide(), 300);
          }
        }, this.props.duration || 3000);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.show !== this.props.show && this.props.show) {
      this.setState({ visible: true });
      if (this.props.autoHide !== false) {
        setTimeout(() => {
          this.setState({ visible: false });
          if (this.props.onHide) {
            setTimeout(() => this.props.onHide(), 300);
          }
        }, this.props.duration || 3000);
      }
    }
  }

  handleClose = () => {
    this.setState({ visible: false });
    if (this.props.onHide) {
      setTimeout(() => this.props.onHide(), 300);
    }
  };

  render() {
    if (!this.props.show) return null;

    const { type = 'info', title, message } = this.props;
    
    const getIcon = () => {
      switch (type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'warning': return '⚠️';
        case 'info': return 'ℹ️';
        default: return 'ℹ️';
      }
    };

    return (
      <div className={`notification-overlay ${this.state.visible ? 'visible' : ''}`}>
        <div className={`notification-popup ${type} ${this.state.visible ? 'show' : ''}`}>
          <div className="notification-header">
            <div className="notification-icon">
              {getIcon()}
            </div>
            <div className="notification-content">
              {title && <h4 className="notification-title">{title}</h4>}
              <p className="notification-message">{message}</p>
            </div>
            <button 
              className="notification-close" 
              onClick={this.handleClose}
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
          {this.props.actions && (
            <div className="notification-actions">
              {this.props.actions}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Notification;
