import axios from 'axios';
import React, { Component } from 'react';
class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtToken: ''
    };
  }
  render() {
    return (
      <div className="align-center">
        <h2 className="text-center">ACTIVE ACCOUNT</h2>
        <form className='css_table--wrap'>
          <table className="table__content--wrap">
            <tbody>
              <tr>
                <td>ID</td>
                <td className='input__css--wrap'><input type="text" value={this.state.txtID} onChange={(e) => { this.setState({ txtID: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td>Token</td>
                <td className='input__css--wrap'><input type="text" value={this.state.txtToken} onChange={(e) => { this.setState({ txtToken: e.target.value }) }} /></td>
              </tr>
              <tr>
                <td></td>
                <td className='inbtn__css--wrap'><input type="submit" value="ACTIVE" onClick={(e) => this.btnActiveClick(e)} /></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }
  // event-handlers
  btnActiveClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const token = this.state.txtToken;
    if (id && token) {
      this.apiActive(id, token);
    } else {
      alert('Please input id and token');
    }
  }
  // apis
  apiActive(id, token) {
    const body = { id: id, token: token };
    axios.post('/api/customer/active', body).then((res) => {
      const result = res.data;
      if (result) {
        alert('YOUR ACCOUNT HAVE BEEN ACTIVED!');
      } else {
        alert('WRONG ID OR TOKEN!\n PLEASE CHECK MAIL AGAIN!');
      }
    });
  }
}
export default Active;