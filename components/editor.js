import { range } from 'lodash'

var pianoNotes = [ 'C', 'B', 'A#', 'A', 'G#', 'G', 'F#', 'F',  'E', 'D#', 'D', 'C#']

var Editor = React.createClass({
  render: function() {
    var looping = range(this.props.division * 4)
    if(this.props.measures[this.props.focusId].sampletype === 'drums') {
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
    } else {
      var octaves = range(7)
      return (
        <div style={editorStyle}>
          {pianoNotes.map(function(note, i) {
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

var editorStyle = {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: '1',
  minHeight: '210px',
  justifyContent: 'center',
  overflow: 'auto',
  marginTop: '1.5em',
  marginBottom: '1.5em',
  marginLeft: 'auto',
  marginRight: 'auto',
  textAlign: 'center',
  transition: 'height 2s'
}
var rowStyle = {
  display: 'flex',
  minHeight: '2em',
  margin: '.1em'
}
var noteStyle = {
  width: '4em',
  minHeight: '2em',
  margin: '.1em',
  borderRadius: '.3em',
  textAlign: 'left',
  float: 'left'
}
var selectedStyle = {
  width: '1.5em',
  minHeight: '2em',
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