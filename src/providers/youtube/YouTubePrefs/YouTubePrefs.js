import PropTypes from 'prop-types'
import React from 'react'
import { SkyLightStateless } from 'react-skylight'
import ChannelItem from './ChannelItem'

export default class YouTubePrefs extends React.Component {
  static propTypes = {
    prefs: PropTypes.object.isRequired,
    setPrefs: PropTypes.func.isRequired,
    requestScan: PropTypes.func.isRequired,
  }

  state = {
    isAdding: false,
  }

  updateEnabled = (e) => {
    this.props.setPrefs('provider.youtube', { enabled: e.target.checked })
  }

  updateApiKey = (e) => {
    e.preventDefault()

    this.props.setPrefs('provider.youtube', {
      apiKey: this.refs.apiKey.value.toString(),
    })
  }

  handleAddClick = () => {
    const { channels } = this.props.prefs
    const name = this.refs.name.value

    if (!name.trim()) {
      alert('Invalid channel name')
      return
    }

    if (channels.includes(name)) {
      alert('Channel is already added')
      return
    }

    this.props.setPrefs('provider.youtube', { channels: [...channels, name] })
    this.setState({ isAdding: false })
  }

  handleRemoveClick = (name) => {
    const { channels } = this.props.prefs
    const idx = channels.indexOf(name)

    if (idx === -1) {
      // nothing to do
      return
    }

    if (confirm(`Remove this channel?\n\n${name}`)) {
      this.props.setPrefs('provider.youtube', { channels: channels.filter(c => c !== name) })
    }
  }

  handleOpenAdder = () => { this.setState({ isAdding: true }) }
  handleCloseAdder = () => { this.setState({ isAdding: false }) }

  handleRefresh = () => {
    this.props.requestScan('youtube')
  }

  render () {
    const { prefs } = this.props

    return (
      <div>
        <label>
          <input type='checkbox' checked={prefs.enabled} onChange={this.updateEnabled} />
          &nbsp;YouTube Channels
        </label>

        {prefs.enabled &&
          <div>
            <input type='text' ref='apiKey' placeholder='API key'
              defaultValue={prefs.apiKey}
              onBlur={this.updateApiKey}
            />

            {prefs.channels.map((name, i) =>
              <ChannelItem key={i} name={name} onRemoveClick={() => this.handleRemoveClick(name)} />
            )}

            <div style={{ display: 'flex' }}>
              <button style={{ flex: 1, width: 'auto' }} onClick={this.handleOpenAdder}>Add Channel</button>
              {prefs.channels.length > 0 &&
                <button style={{ marginLeft: '.5em', width: 'auto' }} onClick={this.handleOpenChooser}>Refresh</button>
              }
            </div>
          </div>
        }

        <SkyLightStateless
          isVisible={this.state.isAdding}
          onCloseClicked={this.handleCloseAdder}
          onOverlayClicked={this.handleCloseAdder}
          title='Add Channel'
          dialogStyles={{
            width: '80%',
            height: 'auto',
            left: '10%',
            marginLeft: '0' }}
        >
          <input type='text' ref='name' placeholder='channel name' autoFocus />
          <br />
          <div style={{ display: 'flex' }}>
            <button style={{ flex: 1, width: 'auto' }} onClick={this.handleAddClick}>Add Channel</button>
            <button style={{ marginLeft: '.5em', width: 'auto' }} onClick={this.handleCloseAdder}>Cancel</button>
          </div>
        </SkyLightStateless>
      </div>
    )
  }
}
