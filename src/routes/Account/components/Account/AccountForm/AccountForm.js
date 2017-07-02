import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class AccountForm extends Component {
  static propTypes = {
    user: PropTypes.object,
    rooms: PropTypes.object.isRequired,
    requireRoom: PropTypes.bool.isRequired,
    // actions
    onSubmitClick: PropTypes.func.isRequired,
  }

  state = {
    name: this.props.user ? this.props.user.name : '',
    email: this.props.user ? this.props.user.email : '',
  }

  render () {
    const { user, requireRoom, rooms } = this.props

    let roomOpts = rooms.result.map(roomId => {
      const room = rooms.entities[roomId]

      return (
        <option key={roomId} value={roomId}>{room.name}</option>
      )
    })

    return (
      <div>
        <input type='text' ref='name' placeholder='name (visible to others)'
          value={this.state.name}
          onChange={this.handleNameChange}
          autoFocus={!user}
        />
        <input type='email' ref='email' placeholder='email (private)'
          value={this.state.email}
          onChange={this.handleEmailChange}
        />
        <input type='password' ref='newPassword'
          placeholder={user ? 'password' : 'new password (optional)'}
        />
        <input type='password' ref='newPasswordConfirm'
          placeholder={user ? 'confirm password' : 'new password confirm'}
        />

        {user &&
          <input type='password' ref='curPassword' placeholder='current password' />
        }

        {requireRoom &&
          <label>Choose Room
            <select ref='room'>{roomOpts}</select>
          </label>
        }

        <br />
        <button onClick={this.handleClick}>
          {user ? 'Update Account' : 'Create Account'}
        </button>
      </div>
    )
  }

  handleChange = (inputName, event) => {
    this.setState({ [inputName]: event.target.value })
  }
  handleNameChange = this.handleChange.bind(this, 'name')
  handleEmailChange = this.handleChange.bind(this, 'email')

  handleClick = (event) => {
    event.preventDefault()
    const { name, email, newPassword, newPasswordConfirm, curPassword } = this.refs
    const data = {
      name: name.value.trim(),
      email: email.value.trim(),
      password: curPassword ? curPassword.value : null,
      newPassword: newPassword.value,
      newPasswordConfirm: newPasswordConfirm.value
    }

    if (this.props.requireRoom) {
      data.roomId = parseInt(this.refs.room.value, 10)
    }

    this.props.onSubmitClick(data)
  }
}
