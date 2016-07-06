var Overlay = React.createClass({
  render: function() {
    console.log('overlay is ' + this.props.visible)
    if (this.props.visible === 'visible') {
      return (
        <div id='overlay' style={overlayStyle}>
          <div id='signIn' style={popUp}>
            <p>whatever</p>
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
  zIndex: '1000'
}

// var popUp = {
//   width = "300px",
//   backgroundColor: '#fff',
//   border: 'solid',
//   borderWidth: '1px',
//   borderColor: '#000',
//   padding: '15px',
//   textAlign: 'center'
// }
// var logo = {
//   margin: 0,
//   fontSize: '1.75em'
// }

var popUp = {
  width: '500px',
  height: '300px',
  backgroundColor: 'white',
  padding: '15px',
  margin: 'auto',
  textAlign: 'center'
}

export default Overlay