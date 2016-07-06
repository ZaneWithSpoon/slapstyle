import { range } from 'lodash'

var Editor = React.createClass({
  render: function() {
    var looping = range(this.props.division * 4)
    var division = this.props.division //cheating the jsx
    return (
      <div style={editorStyle}>
        {this.props.range.map(function(note, i) {
          return (
            <row id={'row'+i} style={rowStyle}>
              <note style={noteStyle}>{note}</note>
              {looping.map(function(beat) {
                return (
                  <div style={Math.floor(beat/division) % 2 === 0 ? evenStyle: oddStyle}>{beat}</div>
                )
              })}
            </row>
          )
        })}
      </div>
    )
  }
})

var editorStyle = {
  overflow: 'hidden',
  marginTop: '1.5em',
  marginBottom: '1.5em',
  marginLeft: 'auto',
  marginRight: 'auto',
  textAlign: 'center'
}
var rowStyle = {
  display: 'inline-block',
  clear: 'both'
}
var noteStyle = {
  width: '4em',
  height: '2em',
  margin: '.1em',
  borderRadius: '.3em',
  textAlign: 'left',
  float: 'left'
}
var evenStyle = {
  width: '2em',
  height: '2em',
  margin: '.1em',
  borderRadius: '.3em',
  backgroundColor: '#30353a',
  float: 'left'
}
var oddStyle = {
  width: '2em',
  height: '2em',
  margin: '.1em',
  borderRadius: '.3em',
  backgroundColor: '#3c4348',
  float: 'left'
}
var testStyle = {
  width: '2em',
  height: '2em',
  margin: '.1em',
  borderRadius: '.3em',
  backgroundColor: '#3c4348',
  float: 'left'
}


export default Editor