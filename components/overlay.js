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
                <fbButton style={fbButton}>
                  <img src='../assets/png/fb-blue-50.png' alt='sample' style={{height:42, width:42, marginLeft: 5, marginRight: 5, float: 'left', position: 'relative'}}/>
                  <span style={{position:'relative', marginTop: 18, marginLeft: 5, float: 'left'}}>Sign in with Facebook</span>
                  <FacebookLogin
                    appId={this.props.fbAppId}
                    scope="public_profile,email,user_friends"
                    autoLoad={true}
                    callback={this.responseFacebook} 
                    cssClass="fbStyle" 
                    size='metro' />
                </fbButton>

                <bufferDiv style={{height:50}} />

                <gButton style={gButton}>
                  <img src='../assets/png/g-logo.png' alt='sample' style={{height:42, width:42, marginLeft: 10, marginRight: 0, marginTop: 4, float: 'left', position: 'relative'}}/>
                  <span style={{position:'relative', marginTop: 18, marginLeft: 5, float: 'left', color: 'black'}}>Sign in with Google</span>
                  <GoogleLogin
                    clientId='71814263033-7qt6smjgj0pt8itgtmtcaffns0csqdg9.apps.googleusercontent.com'
                    callback={this.responseGoogle}
                    cssClass='googleStyle' />
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
      newUser: false,
      userInfo: {}
    }
  },
  responseFacebook: function(response) { //TODO: sign in with google fucking cookies
    if(response.status !== 'unknown') {
      console.log(response)


      // var profile = {}
      // var names = response.name.split(' ')
      // profile.firstName = names[0]
      // profile.lastName = names[names.length-1]
      // profile.email = response.email
      // profile.picture = 'http://graph.facebook.com/' + response.id +'/picture?type=large'

      // this.findUser(profile)
    }
  },
  responseGoogle: function(response) {
    if(response.status !== 'unknown') {
      var profile = {}
      profile.email = response.wc.hg
      profile.firstName = response.wc.Za
      profile.lastName = response.wc.Na
      profile.picture = response.wc.Ph

      if (profile.picture === undefined){
        profile.picture = './assets/png/dolphin.png'
      }

      this.findUser(profile)
    }
  },
  findUser: function(profile) {
    var address = this.props.ip + "/user"
    console.log(address)
    $.ajax({
      url: address,
      type: "get", //send it through get method
      data: {'email': profile.email},
      success: function(response) {
        if(response.profile === null){
          this.setState({newUser: true, userInfo: profile})
        } else {
          this.props.signIn(response)
          this.setState({newUser: false})
        }
      }.bind(this),
      error: function(xhr) {
        console.log('couldn\'t sign in proprely')
        console.log(xhr)
      }
    })
  },
  isValidUsername: function(param) {
    console.log(param)
    console.log(/^\w+$/.test(param))
    if (param === undefined || param.length <= 2){
      return false
    } else {
      return /^\w+$/.test(param)
    }
  },
  findAvailability: function() {
    var username = document.getElementById('username').value.toLowerCase()

    if (this.isValidUsername(username)) {
      $.ajax({
        url: this.props.ip + "/username",
        type: "get", //send it through get method
        data: {'username': username},
        success: function(response) {
          if(response.available){
            this.setState({validUsername: true, username: username})
          } else {
            this.setState({validUsername: false, username: username})
          }
        }.bind(this),
        error: function(xhr) { 
          console.log('broke')
          console.log(xhr)
        }
      })
    } else {
      this.setState({validUsername: false, username: username})
    }
  },
  signUp: function() {
    var userInfo = {}
    userInfo.username = document.getElementById('username').value.toLowerCase()
    userInfo.firstName = document.getElementById('firstName').value.toLowerCase()
    userInfo.lastName = document.getElementById('lastName').value.toLowerCase()
    userInfo.email = document.getElementById('email').value.toLowerCase()
    userInfo.photo = this.state.userInfo.picture

    var err = ''

    //check all fields to for emptyness/validity
    for (var key in userInfo){
      if (userInfo[key] === ''){
        err = 'Don\'t be shy! Fill out all the information'
      } 
    }
    if (!validator.isEmail(userInfo.email)) {
      err = 'Looks like that email\s no good. Try another?'
    } 
    if (!this.isValidUsername(userInfo.username)) {
      err = 'Please enter a valid username'
    }

    if (err === '') {
      $.ajax({
        url: this.props.ip + "/addUser",
        type: "post",
        data: {user: userInfo},
        success: function(response) {
          this.props.signIn(response)
          this.setState({newUser: false})
        }.bind(this),
        error: function(xhr) {
          console.log('broke')
          console.log(xhr)
        }
      })
    } else {
      alert(err)
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