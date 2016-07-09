import { connect } from 'react-redux'
import { queueSong, removeItem } from '../modules/queue'
import { requestPlay, requestPlayNext, requestPause } from '../../Player/modules/player'
import QueueView from '../components/QueueView'

//  Object of action creators (can also be function that returns object).
const mapActionCreators = {
  queueSong,
  removeItem,
  requestPlay,
  requestPlayNext,
  requestPause,
}

const mapStateToProps = (state) => ({
  queueIds: state.queue.result.queueIds,
  uids: state.queue.result.uids,
  items: state.queue.entities,
  errorMessage: state.queue.errorMessage,
  // library
  artistIds: state.library.artists.result,
  artists: state.library.artists.entities,
  songUIDs: state.library.songs.result,
  songs: state.library.songs.entities,
  // user
  user: state.account.user,
  // player
  isPlaying: state.player.isPlaying,
  currentId: state.player.currentId,
  currentTime: state.player.currentTime,
  duration: state.player.duration,
})

export default connect(mapStateToProps, mapActionCreators)(QueueView)
