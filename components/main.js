/* @flow */
import Overlay from './overlay'
import Header from './header'
import Toolbar from './toolbar'
import Editor from './editor'
import InstrumentPanel from './instrumentPanel'
// import GoogleLogin from 'react-google-login'

//creating empty measure for rendering editor view
let division = 4
let testMeasure = []
for (let i = 0; i < division; i++)
  testMeasure.push([])
for (let i = 0; i < division; i+=8)
  testMeasure[i].push('kick')


class Main extends React.Component {
  render() {
    return (
      <site>
        <Overlay 
          visible={this.state.isModal} 
          toggleOverlay={this.toggleOverlay.bind(this)} 
          responseGoogle={this.responseGoogle.bind(this)}
          responseFacebook={this.responseFacebook.bind(this)} />
        <Header 
          toggleOverlay={this.toggleOverlay.bind(this)} 
          isLoggedIn={this.state.isLoggedIn} />
        <Toolbar />
        <Editor 
          range={this.state.range}
          measure={this.state.testMeasure} 
          division={this.state.division} />
        <InstrumentPanel />
      </site>
    )
  }
  state = {
    'isLoggedIn': false,
    'isModal': false,
    'testMeasure': testMeasure,
    'division': division,
    'range': ['kick', 'snare', 'tom', 'hat']
  }
  toggleOverlay() {
    this.setState({ isModal: (this.state.isModal) ? false : true})
  }
  responseFacebook(response) {
    if(response.status !== 'unknown') {
      this.toggleOverlay()
      this.setState({isLoggedIn: true})
    }
    console.log(response)
  }
  responseGoogle(response) {
    if(response.status !== 'unknown') {
      this.toggleOverlay()
      this.setState({isLoggedIn: true})
    }
    console.log(response)
  }
}

export default Main