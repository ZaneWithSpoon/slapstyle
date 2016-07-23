import GoogleLogin from 'react-google-login'
import FacebookLogin from 'react-facebook-login'
import validator from 'validator'

var Overlay = React.createClass({
  render: function() {
    if (this.props.visible && !this.state.newUser) {
      return (
        <div id='overlay' style={overlayStyle} onClick={this.props.toggleOverlay}>
          <div id='signIn' style={popUp} onClick={(e) => e.stopPropagation()}>
            <h2>Sign in to start making beautiful music with friends!</h2>
            <div id='signInButtons'>
              <GoogleLogin
                clientId='71814263033-7qt6smjgj0pt8itgtmtcaffns0csqdg9.apps.googleusercontent.com'
                callback={this.responseGoogle}
                cssClass='googleStyle' />

              <FacebookLogin
                appId="1612283222395868"
                autoLoad={true}
                fields="name,email,picture"
                callback={this.responseFacebook} 
                cssClass="fbStyle" 
                size='metro' />
            </div>
            {/* created css classes in index.html */}
            <p onClick={this.props.toggleOverlay}>
              No thanks, I hate music
            </p>
          </div>
        </div>
      )
    } else if (this.props.visible && this.state.newUser) {
      return (
        <div id='overlay' style={overlayStyle} onClick={this.props.toggleOverlay}>
          <div id='signIn' style={popUp} onClick={(e) => e.stopPropagation()}>
            <h2>Pick a username</h2>
            <div style={middleStyle} >
              <img src={this.state.userInfo.picture} alt='prof' style={picStyle} />
              <div style={formStyle}>
                <input id='username' type='text' 
                  onKeyUp={this.findAvailability} 
                  onKeyPress={(e) => function (e) { if (e.key === 'Enter') {this.signUp} }}
                  autofocus={true} 
                  placeholder='username' 
                  style={inputStyle} />
                <input id='firstName' type='text' defaultValue={this.state.userInfo.firstName} style={inputStyle} />
                <input id='lastName' type='text' defaultValue={this.state.userInfo.lastName} style={inputStyle} />
                <input id='email' type='text' defaultValue={this.state.userInfo.email} style={inputStyle} />              
              </div>
              <div id='usernameChecker' style={uCheckerStyle} >
                {this.reportAvailability()}
              </div>
            </div>

            <div style={submitStyle} onClick={this.signUp}>
              <p 
                style={{
                  verticalAlign: 'middle', 
                  display: 'inline-block'}} >Sign Up</p>
            </div>
            <p onClick={this.props.toggleOverlay} style={{marginTop: '10px'}}>
              Sorry. I&#39;m scared of commitment.
            </p>
          </div>
        </div>
      )
    } else {
      return null
    }
  },
  getInitialState: function() {
    return {
      validUsername: false,
      newUser: false,
      userInfo: {},
      username: ''
    }
  },
  reportAvailability: function() {
    if (this.state.validUsername) {
      return <span>{this.state.username} is available</span>
    } else if (this.isValidUsername( this.state.username )) {
      return <span>{this.state.username} is not available</span>
    } else {
      return <span>A valid username must be at least 3 characters and contain only letters and numbers</span>
    }
  },
  responseFacebook: function(response) { //TODO: sign in with google fucking cookies
    if(response.status !== 'unknown') {
      var profile = {}
      var names = response.name.split(' ')
      profile.firstName = names[0]
      profile.lastName = names[names.length-1]
      profile.email = response.email
      profile.picture = 'http://graph.facebook.com/' + response.id +'/picture?type=large'

      this.findUser(profile)
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
    $.ajax({
      url: this.props.ip + "/user",
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
        console.log('broke')
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
  left: '0px',
  top: '0px',
  width: '100%',
  height: '100%',
  textAlign: 'center',
  zIndex: '1000',
  backgroundColor: 'rgba(0,0,0,0.5)'
}

var hiddenOverlayStyle = {
  visibility: 'visible',
  position: 'absolute',
  left: '0px',
  top: '0px',
  width: '100%',
  height: '100%',
  textAlign: 'center',
  zIndex: '1000',
  backgroundColor: 'rgba(0,0,0,0.3)'
}

var popUp = {
  width: '500px',
  height: '300px',
  backgroundColor: '#30353a',
  padding: '15px',
  margin: 'auto',
  marginTop: '100px',
  textAlign: 'center',
  verticalAlign: 'middle',
  borderRadius: '5px',
  display:'flex',
  flexDirection: 'column',
  justifyContent: 'space-around'
}

export default Overlay