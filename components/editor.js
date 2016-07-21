import { range } from 'lodash'

var pianoNotes = [ 'C#6', 'C6', 'B5', 'A#5', 'A5', 'G#5', 'G5', 'F#5', 'F5',  'E5', 'D#5', 'D5', 'C#5', 'C5', 'B4', 'A#4', 'A4', 'G#4', 'G4', 'F#4', 'F4',  'E4', 'D#4', 'D4', 'C3']

var Editor = React.createClass({
  render: function() {
    var looping = range(this.props.division * 4)
    var sampleType = this.props.measures[this.props.focusId].sampletype
    if (sampleType === 'drums') {
      return (
        <div style={drumStyle}>
          {this.props.range.map(function(note, i) {
            return (
              <row key={'row'+i} style={rowStyle}>
                <note key={note} style={noteStyle} onClick={() => this.props.audio.playSample(note)}>{note}</note>
                {looping.map(function (beat) {
                  return (
                    <div key={note + beat} style={this.isSelected(note, beat)} onClick={() => this.props.isLoggedIn ? this.props.toggleNote(note, beat) : this.props.toggleOverlay()}></div>
                  )
                }.bind(this))}
              </row>
            )
          }.bind(this))}
        </div>
      )
    } else {
      var octaves = range(7)
      return (
        <div style={pianoStyle}>
          {pianoNotes.map(function(note, i) {
            return (
              <row key={'row'+i} style={rowStyle}>
                <note key={note} style={noteStyle} onClick={() => this.props.audio.playSample(note, sampleType)}>{note}</note>
                {looping.map(function (beat) {
                  return (
                    <div key={note + beat} style={this.isSelected(note, beat)} onClick={() => this.props.isLoggedIn ? this.props.toggleNote(note, beat) : this.props.toggleOverlay()}></div>
                  )
                }.bind(this))}
              </row>
            )
          }.bind(this))}
        </div>
      )
    }
  }, isSelected: function(note, beat) {
    var division = this.props.division //cheating the jsx
    for (var i=0; i < this.props.measures[this.props.focusId].notes[beat].length; i++){
      if (this.props.measures[this.props.focusId].notes[beat][i] === note){
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

var drumStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '200px',
  maxHeight: '200px',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'auto',
  transition: 'minHeight maxHeight 2s'
}
var pianoStyle = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '350px',
  maxHeight: '350px',
  alignItems: 'center',
  overflow: 'auto',
  transition: 'maxHeight minHeight 2s'
}
var rowStyle = {
  display: 'flex',
  flexShrink: 0
}
var noteStyle = {
  width: '4em',
  minHeight: '2em',
  margin: '.1em',
  borderRadius: '.3em',
  textAlign: 'left',
  cursor: 'pointer'
}
var selectedStyle = {
  width: '1.5em',
  minHeight: '2em',
  margin: '.1em',
  borderRadius: '.3em',
  backgroundColor: '#1CCAD8',
  cursor: 'pointer'
}
var evenStyle = {
  width: '1.5em',
  height: '2em',
  margin: '.1em',
  borderRadius: '.3em',
  backgroundColor: '#30353a',
  cursor: 'pointer'
}
var oddStyle = {
  width: '1.5em',
  height: '2em',
  margin: '.1em',
  borderRadius: '.3em',
  backgroundColor: '#3c4348',
  cursor: 'pointer'
}
var playingStyle = {
  width: '1.5em',
  height: '2em',
  margin: '.1em',
  borderRadius: '.3em',
  backgroundColor: 'white',
  cursor: 'pointer'
}


export default Editor