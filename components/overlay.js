import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login'


var Overlay = React.createClass({
  render: function() {
    if (this.props.visible) {
      return (
        <div id='overlay' style={overlayStyle}>
          <div id='signIn' style={popUp}>
            <p onClick={this.props.toggleOverlay}>x</p>
            <h2>Sign in to start making beautiful music</h2>
            <GoogleLogin
              clientId='71814263033-7qt6smjgj0pt8itgtmtcaffns0csqdg9.apps.googleusercontent.com'
              callback={this.props.responseGoogle}
              cssClass='googleStyle' />

            <FacebookLogin
              appId="1612283222395868"
              autoLoad={true}
              fields="name,email,picture"
              callback={this.props.responseFacebook} 
              cssClass="fbStyle" 
              size='metro'  />

            {/* created css classes in index.html */}
            <p onClick={this.props.toggleOverlay} style={{marginTop: '75px'}}>
              No thanks, I hate music
            </p>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
})

var overlayStyle = {
  visibility: 'visible',
  position: 'absolute',
  left: '0px',
  top: '0px',
  width: '100%',
  height: '100%',
  textAlign: 'center',
  zIndex: '1000',
  backgroundColor: 'rgba(0,0,0,0.5)'
}

var popUp = {
  width: '500px',
  height: '300px',
  backgroundColor: '#30353a',
  padding: '15px',
  margin: 'auto',
  marginTop: '100px',
  textAlign: 'center',
  verticalAlign: 'middle'
}

export default Overlay