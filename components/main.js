/* @flow */
import Overlay from './overlay'
import Header from './header'
import Toolbar from './toolbar'
import Editor from './editor'
import InstrumentPanel from './instrumentPanel'

//creating empty measure for rendering editor view
let division = 8
let testMeasure = []
for (let i = 0; i < division; i++)
  testMeasure.push([])
for (let i = 0; i < division; i+=8)
  testMeasure[i].push('kick')


class Main extends React.Component {
  render() {
    console.log(this.state)
    return (
      <site>
        <Overlay 
          visible = {this.state.overlay} />
        <Header 
          toggleOverlay={this.toggleOverlay.bind(this)} />
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
    'overlay': 'hidden',
    'testMeasure': testMeasure,
    'division': division,
    'range': ['kick', 'snare', 'tom', 'hat']
  }
  toggleOverlay() {
    this.setState({ overlay: (this.state.overlay === 'visible') ? 'hidden' : 'visible'})
  }
}

export default Main