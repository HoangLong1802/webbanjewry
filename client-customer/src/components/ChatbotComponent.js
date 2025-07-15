import React, { Component } from 'react';
import axios from 'axios';

class Chatbot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      messages: [
        {
          id: 1,
          text: "Xin chào! Tôi là trợ lý AI của PANJ. Tôi có thể giúp bạn tìm hiểu về sản phẩm trang sức. Bạn cần tư vấn gì không?",
          isBot: true,
          timestamp: new Date()
        }
      ],
      inputMessage: '',
      isTyping: false,
      products: []
    };
  }

  componentDidMount() {
    // Load products for recommendations
    this.loadProducts();
  }

  loadProducts = async () => {
    try {
      const response = await axios.get('/api/customer/products');
      this.setState({ products: response.data });
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  toggleChat = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  };

  handleInputChange = (e) => {
    this.setState({ inputMessage: e.target.value });
  };

  handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  };

  sendMessage = () => {
    const { inputMessage, messages } = this.state;
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    this.setState({
      messages: [...messages, userMessage],
      inputMessage: '',
      isTyping: true
    });

    // Simulate AI response
    setTimeout(() => {
      const botResponse = this.generateBotResponse(inputMessage);
      this.setState(prevState => ({
        messages: [...prevState.messages, botResponse],
        isTyping: false
      }));
    }, 1500);
  };

  generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    let responseText = '';
    let productRecommendations = [];

    // Simple AI logic for jewelry consultation
    if (input.includes('nhẫn') || input.includes('ring')) {
      responseText = "Tôi thấy bạn quan tâm đến nhẫn! PANJ có nhiều mẫu nhẫn đẹp từ nhẫn cưới, nhẫn kim cương đến nhẫn thời trang. Bạn muốn tìm nhẫn cho dịp gì?";
      productRecommendations = this.state.products.filter(p => 
        p.name.toLowerCase().includes('nhẫn') || p.name.toLowerCase().includes('ring')
      ).slice(0, 3);
    } else if (input.includes('dây chuyền') || input.includes('necklace')) {
      responseText = "Dây chuyền là lựa chọn tuyệt vời! Chúng tôi có dây chuyền vàng, bạc và đính đá quý. Bạn thích kiểu dáng nào?";
      productRecommendations = this.state.products.filter(p => 
        p.name.toLowerCase().includes('dây') || p.name.toLowerCase().includes('chuyền')
      ).slice(0, 3);
    } else if (input.includes('bông tai') || input.includes('earring')) {
      responseText = "Bông tai giúp tôn lên vẻ đẹp khuôn mặt! PANJ có từ bông tai nhỏ xinh đến bông tai dài quyến rũ. Bạn muốn xem loại nào?";
      productRecommendations = this.state.products.filter(p => 
        p.name.toLowerCase().includes('bông') || p.name.toLowerCase().includes('tai')
      ).slice(0, 3);
    } else if (input.includes('giá') || input.includes('price') || input.includes('tiền')) {
      responseText = "Về giá cả, PANJ có nhiều phân khúc phù hợp với mọi ngân sách. Từ 500k đến vài chục triệu. Bạn có ngân sách khoảng bao nhiêu?";
    } else if (input.includes('chất liệu') || input.includes('material')) {
      responseText = "PANJ sử dụng chất liệu cao cấp: vàng 18k, 14k, bạc 925, kim cương tự nhiên và đá quý. Tất cả đều có chứng nhận chất lượng.";
    } else if (input.includes('bảo hành') || input.includes('warranty')) {
      responseText = "Tất cả sản phẩm PANJ đều được bảo hành 12 tháng. Miễn phí làm sạch và bảo dưỡng trong thời gian bảo hành.";
    } else if (input.includes('giao hàng') || input.includes('shipping')) {
      responseText = "PANJ giao hàng miễn phí toàn quốc. Trong TP.HCM giao trong 2-4h, các tỉnh khác 1-3 ngày. Có dịch vụ giao hàng nhanh trong 1h.";
    } else if (input.includes('tư vấn') || input.includes('consult')) {
      responseText = "Tôi có thể tư vấn về: \n• Lựa chọn trang sức phù hợp \n• Chất liệu và giá cả \n• Cách bảo quản \n• Xu hướng thời trang \nBạn muốn tư vấn về vấn đề gì?";
    } else if (input.includes('cảm ơn') || input.includes('thank')) {
      responseText = "Rất vui được hỗ trợ bạn! Nếu cần thêm tư vấn, đừng ngần ngại nhắn tin. Chúc bạn tìm được sản phẩm ưng ý tại PANJ! 💎";
    } else {
      responseText = "Tôi hiểu bạn đang quan tâm đến trang sức. Có thể bạn muốn hỏi về:\n• Sản phẩm cụ thể (nhẫn, dây chuyền, bông tai)\n• Giá cả và chất liệu\n• Bảo hành và giao hàng\n\nHãy cho tôi biết bạn cần tư vấn gì nhé!";
      
      // Show some random products as suggestions
      productRecommendations = this.state.products.slice(0, 3);
    }

    return {
      id: this.state.messages.length + 2,
      text: responseText,
      isBot: true,
      timestamp: new Date(),
      products: productRecommendations
    };
  };

  formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  render() {
    const { isOpen, messages, inputMessage, isTyping } = this.state;

    return (
      <div className="chatbot-container">
        {/* Chat Button */}
        <button 
          className={`chat-toggle-btn ${isOpen ? 'active' : ''}`}
          onClick={this.toggleChat}
        >
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          )}
        </button>

        {/* Chat Window */}
        {isOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="bot-avatar">🤖</div>
                <div>
                  <h4>Trợ lý AI PANJ</h4>
                  <span className="status">Đang hoạt động</span>
                </div>
              </div>
              <button className="minimize-btn" onClick={this.toggleChat}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.isBot ? 'bot' : 'user'}`}>
                  {message.isBot && <div className="message-avatar">🤖</div>}
                  <div className="message-content">
                    <div className="message-text">{message.text}</div>
                    
                    {/* Product recommendations */}
                    {message.products && message.products.length > 0 && (
                      <div className="product-recommendations">
                        <p className="rec-title">Sản phẩm gợi ý:</p>
                        {message.products.map((product) => (
                          <div key={product._id} className="rec-product">
                            <img src={`data:image/jpg;base64,${product.image}`} alt={product.name} />
                            <div className="rec-product-info">
                              <h5>{product.name}</h5>
                              <p>{product.price.toLocaleString('vi-VN')} VNĐ</p>
                              <a href={`/product/${product._id}`} target="_blank" rel="noopener noreferrer">
                                Xem chi tiết
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="message-time">{this.formatTime(message.timestamp)}</div>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="message bot">
                  <div className="message-avatar">🤖</div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="chat-input">
              <div className="input-container">
                <textarea
                  value={inputMessage}
                  onChange={this.handleInputChange}
                  onKeyPress={this.handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  rows="1"
                />
                <button 
                  onClick={this.sendMessage}
                  disabled={!inputMessage.trim()}
                  className="send-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Chatbot;
