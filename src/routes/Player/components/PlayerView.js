import React, { PropTypes } from 'react'
import AppLayout from 'layouts/AppLayout'
import Providers from 'components/providers'
import screenfull from 'screenfull'

class PlayerView extends React.Component {
  static propTypes = {
    // queue
    queueId: PropTypes.number.isRequired,
    volume: PropTypes.number.isRequired,
    song: PropTypes.object,
    isPlaying: PropTypes.bool.isRequired,
    isAtQueueEnd: PropTypes.bool.isRequired,
    isErrored:  PropTypes.bool.isRequired,
    // actions
    requestPlayNext: PropTypes.func.isRequired,
    getMedia: PropTypes.func.isRequired,
    getMediaSuccess: PropTypes.func.isRequired,
    emitStatus: PropTypes.func.isRequired,
    emitError: PropTypes.func.isRequired,
  }

  toggleFullscreen = this.toggleFullscreen.bind(this)

  componentDidMount() {
    // emit initial state
    this.props.emitStatus({
      queueId: this.props.queueId,
      position: 0,
      volume: this.props.volume,
      isPlaying: this.props.isPlaying,
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.isPlaying && !prevProps.isPlaying) {
      // playing for first time, after queue end, or after error
      if (this.props.queueId === -1 || this.props.isAtQueueEnd || this.props.isErrored) {
        this.props.requestPlayNext()
      }
    }
  }

  render () {
    const { song } = this.props
    let Component = 'div'
    let componentProps

    if (this.props.isAtQueueEnd) {
      // show 'add more songs' placeholder
    } else if (!song) {
      // show 'press play to begin' placeholder
    } else if (typeof Providers[song.provider] === 'undefined') {
      // show 'provider error' placeholder
      this.props.emitError(this.props.queueId, 'No provider for type: "'+song.provider+'"')
    } else {
      Component = Providers[song.provider].playerComponent
      componentProps = {
        song,
        volume: this.props.volume,
        isPlaying: this.props.isPlaying,
        getMedia: this.props.getMedia,
        getMediaSuccess: this.props.getMediaSuccess,
        onStatus: this.getStatusEmitter(this.props.queueId),
        onMediaError: this.getErrorEmitter(this.props.queueId),
        onMediaEnd: this.props.requestPlayNext,
      }
    }

    return (
      <AppLayout title="Player">
        {(style) => (
          <div
            ref={ref => {this.ref = ref}}
            onDoubleClick={this.toggleFullscreen}
            style={screenfull.isFullscreen ? {} : style}
            >
              <Component
                {...componentProps}
                width={style.width}
                height={style.height - (screenfull.isFullscreen ? 0 : (style.paddingTop + style.paddingBottom))}
              />
          </div>
        )}
      </AppLayout>
    )
  }

  toggleFullscreen() {
    screenfull.toggle(this.ref)
  }

  getStatusEmitter = (queueId) => {
    return (status) => {
      this.props.emitStatus({queueId, ...status})
    }
  }

  getErrorEmitter = (queueId) => {
    return (err) => {
      this.props.emitError(err)
    }
  }
}

export default PlayerView
