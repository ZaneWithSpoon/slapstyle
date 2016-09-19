import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login'
import validator from 'validator'

var Overlay = React.createClass({
  render: function() {
    if (this.props.visible) {
      return (
        <background>
          <div style={overlayStyle}>
            <box style={popUp}>
                <p style={{fontSize: 71, margin: 10}}>SlapStyle</p>
                <p style={{fontSize: 29, margin: 10, marginBottom: 50}}>Music is better made together</p>
                {/* Ugly npm buttons invisible on top of pretty ones */}
                <fbButton style={fbButton}>
                  <img src='../assets/png/fb-blue-50.png' alt='sample' style={{height:42, width:42, marginLeft: 5, marginRight: 5, float: 'left', position: 'relative'}}/>
                  <span style={{position:'relative', marginTop: 18, marginLeft: 5, float: 'left'}}>Sign in with Facebook</span>
                  <FacebookLogin
                    appId={this.props.fbAppId}
                    scope="public_profile,email,user_friends"
                    fields="name,email,picture,friends"
                    autoLoad={false}
                    callback={this.facebook} 
                    cssClass="fbStyle"
                    size='metro' />
                </fbButton>

                <bufferDiv style={{height:50}} />

                <gButton style={gButton}>
                  <img src='../assets/png/g-logo.png' alt='sample' style={{height:42, width:42, marginLeft: 10, marginRight: 0, marginTop: 4, float: 'left', position: 'relative'}}/>
                  <span style={{position:'relative', marginTop: 18, marginLeft: 5, float: 'left', color: 'black'}}>Sign in with Google</span>
                  <GoogleLogin
                    clientId='71814263033-7qt6smjgj0pt8itgtmtcaffns0csqdg9.apps.googleusercontent.com'
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                    className='googleStyle' />
                </gButton>
            </box>
          </div>
        </background>
      )
    } else {
      return null
    }
  },
  getInitialState: function() {
    return {
      userInfo: {}
    }
  },
  facebook: function(profile) {
    if (profile.status !== 'unknown') {
      $.ajax({
        url: this.props.ip + '/user',
        type: "get", //send it through get method
        data: {
          'email': profile.email, 
          'accessToken': profile.accessToken, 
          'fbid': profile.userID
        },
        success: function(response) {
          if(response.profile === null){ //new user
            var user = {}
            var names = profile.name.split(' ')
            user.firstname = names[0]
            user.lastname = names[names.length-1]
            user.email = profile.email
            user.photo = 'http://graph.facebook.com/' + profile.id +'/picture?type=large'
            user.fbid = profile.userID
            user.accessToken = profile.accessToken

            $.ajax({
              url: this.props.ip + "/addUser",
              type: "post",
              data: {user: user},
              success: function(response) {                
                this.props.signIn(response, profile.friends.data)
              }.bind(this),
              error: function(xhr) {
                console.log('broke')
                console.log(xhr)
              }
            })
            
          } else { //returning user (no cookie)
            console.log('user exisis')
            this.props.signIn(response, profile.friends.data)
          }
        }.bind(this),
        error: function(xhr) {
          console.log('couldn\'t sign in proprely')
          console.log(xhr)
        }
      })
    }
  },
  responseGoogle: function(profile) {
    console.log(profile)
    if (profile.status !== 'unknown') {
      var profile = profile.profileObj
      var email = profile.email
      $.ajax({
        url: this.props.ip + '/user',
        type: "get", //send it through get method
        data: {'email': email},
        success: function(response) {
          if(response.profile === null){ //new user
            var user = {}
            user.firstname = profile.givenName
            user.lastname = profile.familyName
            user.email = profile.email
            user.photo = profile.imageUrl
            user.fbid = null
            user.accessToken = null

            $.ajax({
              url: this.props.ip + "/addUser",
              type: "post",
              data: {user: user},
              success: function(response) {                
                this.props.signIn(response, null) 
              }.bind(this),
              error: function(xhr) {
                console.log('broke')
                console.log(xhr)
              }
            })
            
          } else { //returning user
            this.props.signIn(response, null)
          }
        }.bind(this),
        error: function(xhr) {
          console.log('couldn\'t sign in proprely')
          console.log(xhr)
        }
      })
    }
  }
})

var picStyle = {
  width: '25%',
  float: 'left',
  borderRadius: '5px'
}
var formStyle = {
  width: '50%',
  float: 'left'
}
var uCheckerStyle = {
  width: '25%',
  margin: '0px',
  float: 'left'
}
var submitStyle = {
  width: '35%',
  height: '3em',
  margin: 'auto',
  backgroundColor: '#4D948A',
  color: 'white',
  borderRadius: '5px',
  borderWidth: '0px',
  textAlign: 'center',
  verticalAlign: 'center'
}

var inputStyle = {
  width: '70%',
  height: '28px',
  margin: '1px',
  borderRadius: '5px',
  borderWidth: '0px',
  backgroundColor: 'gray',
  color: 'black'
}

var middleStyle = {
  height: '150px'
}

var overlayStyle = {
  visibility: 'visible',
  position: 'absolute',
  width: '100%',
  height: '100%',
  zIndex: '1000',
  backgroundColor: '#23272A',
  backgroundImage: 'url(../assets/dj.jpg)',
  backgroundSize: 'cover',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

var fbButton = {
  width: '225px',
  height: '50px',
  borderRadius: '10px',
  backgroundColor: '#3B5998'
}
var gButton = {
  width: '225px',
  height: '50px',
  borderRadius: '10px',
  backgroundColor: 'white'
}

var popUp = {
  display:'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center'
}

export default Overlay