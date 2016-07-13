import { range } from 'lodash'

var Editor = React.createClass({
  render: function() {
    var looping = range(this.props.division * 4)
    return (
      <div style={editorStyle}>
        {this.props.range.map(function(note, i) {
          return (
            <row key={'row'+i} style={rowStyle}>
              <note key={note} style={noteStyle} onClick={() => this.props.audio.playSample(note)}>{note}</note>
              {looping.map(function(beat) {
                return (
                  <div key={note + beat} style={this.isSelected(note, beat)} onClick={() => this.props.toggleNote(note, beat)}></div>
                )
              }.bind(this))}
            </row>
          )
        }.bind(this))}
      </div>
    )
  }, isSelected: function(note, beat) {
    var division = this.props.division //cheating the jsx
    for (var i=0; i < this.props.measure.notes[beat].length; i++){
      if (this.props.measure.notes[beat][i] === note){
        return selectedStyle
      }
    }
    if (beat === this.props.playingBeat){
      return playingStyle
    } else {
      var result = Math.floor(beat/(division/2)) % 2 === 0 ? evenStyle: oddStyle
      return result
    }
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
var selectedStyle = {
  width: '1.5em',
  height: '2em',
  margin: '.1em',
  borderRadius: '.3em',
  backgroundColor: '#1CCAD8',
  float: 'left'
}
var evenStyle = {
  width: '1.5em',
  height: '2em',
  margin: '.1em',
  borderRadius: '.3em',
  backgroundColor: '#30353a',
  float: 'left'
}
var oddStyle = {
  width: '1.5em',
  height: '2em',
  margin: '.1em',
  borderRadius: '.3em',
  backgroundColor: '#3c4348',
  float: 'left'
}
var playingStyle = {
  width: '1.5em',
  height: '2em',
  margin: '.1em',
  borderRadius: '.3em',
  backgroundColor: 'white',
  float: 'left'
}


export default Editor