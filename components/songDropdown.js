var SongDropdown = React.createClass({
  render: function() {
    console.log(this.props.songList)
    if (this.props.active) {
      var rows = []
      var currentSong = []

      this.props.songList.forEach(function (song) {
        if (song.songid !== this.props.songId)
          rows.push(this.drawSongs(song))
        else
          currentSong.push(this.drawSongs(song))
      }.bind(this))

      return (
        <div id='songDropdown' tabIndex='-1' style={dropdownStyle}> 
          <div style={songStyle.label}>Edit Song</div>
          <songOptions style={songOptions}>   
            <renameSong style={songOptions.button} onClick={() => console.log('Rename song')} >
              Rename
            </renameSong>
            <deleteSong style={songOptions.button} onClick={() => console.log('delete song')} >
              Delete
            </deleteSong>
          </songOptions>
          <div style={songStyle.label}>Other songs</div>
          {rows}
          <div style={songStyle.addSong} onClick={() => {this.props.newSong(); this.props.hideSongs();}}>
                <img src='../assets/png/plus.png' alt='new song' style={{height:'1em'}}/>
          </div>
        </div>
      )
    } else {
      return null
    }
  },
  drawSongs: function(song) {
    return (
      <div key={song.songid} style={songStyle} onClick={() => {
        //this.props.hideSongs()
        this.props.changeSongs(song.songid)
      }}>
        <span style={songStyle.title}>{song.name} <br /></span>
        <span style={songStyle.owner}>{song.firstname} {song.lastname}</span>
      </div>
    )
  },
  componentDidUpdate: function() {
    var dropdown = document.getElementById('songDropdown')
    if (dropdown !== null) {
      dropdown.focus()
    }
  }
})

var dropdownStyle = {
  zIndex: 99,
  position: 'fixed',
  float:'right',
  top: '3em',
  right: '0em',
  minWidth: '10em',
  outlineWidth: '0px',
  backgroundColor: '#30353a',
  border: 'solid',
  borderColor: '#23272A',
  borderWidth: '1px',
  borderTop: '0px',
  boxShadow: '1px 1px 2px black',
}
var songOptions = {
  display: 'flex',
  minHeight: '1.5em',
  button: {
    width: '50%',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  }
}
var songStyle = {
  borderTop: 'grey',
  paddingLeft: '5px',
  borderTop: '1px solid #23272A',
  cursor: 'pointer',
  padding: '.5em',
  title: {
    fontSize: '16px',
    fontWeight: 'bold'
  },
  owner: {
    fontSize: '12px'
  },
  label: {
    borderTop: 'grey',
    paddingLeft: '5px', 
    backgroundColor: '#23272A',
    display: 'flex',
    justifyContent: 'center'    
  },
  addSong: {
    borderTop: 'grey',
    paddingLeft: '5px', 
    backgroundColor: '#23272A',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center'
  }
}

export default SongDropdown