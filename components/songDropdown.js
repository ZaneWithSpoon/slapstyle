var SongDropdown = React.createClass({
  render: function() {
    if (this.props.active) {
      var rows = []
      this.props.songList.forEach(function (song) {
        rows.push(this.drawSongs(song))
      }.bind(this))
      return (
        <div id='songDropdown' tabIndex='-1' onBlur={this.props.hideSongs} style={dropdownStyle}> 
          {rows}
        </div>
      )
    } else {
      return null
    }
  },
  drawSongs: function(song) {
    return (
      <div key={song.songid} style={songStyle} onClick={() => {
        this.props.hideSongs()
        this.props.changeSongs(song.songid)
      }}>
        <span style={songStyle.title}>{song.name} <br /></span>
        <span style={songStyle.owner}>{song.songid} <br /></span>
        <span style={songStyle.owner}>{song.username}</span>
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
  position: 'fixed',
  float:'right',
  top: '3em',
  right: '0em',
  minWidth: '10em',
  outlineWidth: '0px',
  backgroundColor: '#30353a',
  border: 'solid',
  borderColor: 'black',
  borderWidth: '1px',
  borderTop: '0px',
  borderBottomLeftRadius: '15px',
  borderBottomRightRadius: '15px'
}
var songStyle = {
  borderTop: 'grey',
  paddingLeft: '5px',
  borderTop: '1px solid #23272A',
  title: {
    fontSize: '20px'
  },
  owner: {
    fontSize: '12px'
  }
}

export default SongDropdown