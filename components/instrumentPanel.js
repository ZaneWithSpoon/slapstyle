var InstrumentPanel = React.createClass({
  render: function() {
    return (
      <div style={editorStyle}>
        <p style={logo}>Instrument Panel</p>
    </div>
    )
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