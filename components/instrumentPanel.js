import GoogleLogin from 'react-google-login'

const responseGoogle = (response) => {
  console.log(response);
}

var InstrumentPanel = React.createClass({
  render: function() {
    return (
      <div style={editorStyle}>
        <p style={logo}>Instrument Panel</p>
        
        <GoogleLogin
          clientId='71814263033-7qt6smjgj0pt8itgtmtcaffns0csqdg9.apps.googleusercontent.com'
          buttonText='Login'
          callback={responseGoogle} />
    </div>
    )
  },
  onSignIn: function(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
  }
})

var editorStyle = {
  width: '100%',
  height: '25em',
  backgroundColor: '#30353a'
}
var logo = {
  margin: 0,
  fontSize: '1.75em'
}

export default InstrumentPanel