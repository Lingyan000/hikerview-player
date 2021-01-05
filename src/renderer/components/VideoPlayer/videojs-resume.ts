import videojs from 'video.js'
import db from '#/datastore'

const Button = videojs.getComponent('Button')
const Component = videojs.getComponent('Component')
const ModalDialog = videojs.getComponent('ModalDialog')

class ResumeButton extends Button {
  resumeFromTime: any
  player_: any
  player: any
  controlText_: string | undefined
  options_: any
  constructor (player: any, options: any) {
    super(player, options)
    this.resumeFromTime = options.resumeFromTime
    this.player = player
  }

  buildCSSClass () {
    return 'vjs-resume'
  }

  createEl () {
    return super.createEl('button', {
      innerHTML: `${this.options_.buttonText}`
    })
  }

  handleClick () {
    this.player_.resumeModal.close()
    this.player.currentTime(this.resumeFromTime)
    this.player.play()
    this.player.trigger('resumevideo')
  }

  handleKeyPress (event:any) {
    // Check for space bar (32) or enter (13) keys
    if (event.which === 32 || event.which === 13) {
      if (this.player.paused()) {
        this.player.play()
      } else {
        this.player.pause()
      }
      event.preventDefault()
    }
  }
}

ResumeButton.prototype.controlText_ = 'Resume'

class ResumeCancelButton extends Button {
  player_: any
  options_: any
  buildCSSClass () {
    return 'vjs-no-resume'
  }

  createEl () {
    return super.createEl('button', {
      innerHTML: `${this.options_.buttonText}`
    })
  }

  handleClick () {
    this.player_.resumeModal.close()
    db.get(`resume[${this.options_.key.replace(/\./g, '_')}]`)
  }
}
ResumeButton.prototype.controlText_ = 'No Thanks'

class ModalButtons extends Component {
  player_: any
  options_: any
  constructor (player: any, options: any) {
    super(player, options)
    this.addChild('ResumeButton', {
      buttonText: options.resumeButtonText,
      resumeFromTime: options.resumeFromTime
    })
    this.addChild('ResumeCancelButton', {
      buttonText: options.cancelButtonText,
      key: options.key
    })
  }

  createEl () {
    return super.createEl('div', {
      className: 'vjs-resume-modal-buttons',
      innerHTML: `
        <p>${this.options_.title}</p>
      `
    })
  }
}

class ResumeModal extends ModalDialog {
  player_: any
  constructor (player: any, options: any) {
    super(player, options)
    this.player_.resumeModal = this
    this.open()
    this.addChild('ModalButtons', {
      title: options.title,
      resumeButtonText: options.resumeButtonText,
      cancelButtonText: options.cancelButtonText,
      resumeFromTime: options.resumeFromTime,
      key: options.key
    })
  }

  buildCSSClass () {
    return `vjs-resume-modal ${super.buildCSSClass()}`
  }
}
videojs.registerComponent('ResumeButton', ResumeButton)
videojs.registerComponent('ResumeCancelButton', ResumeCancelButton)
videojs.registerComponent('ModalButtons', ModalButtons)
videojs.registerComponent('ResumeModal', ResumeModal)

const Resume = function (this: any, options: any) {
  let videoId = options.uuid
  let title = options.title || 'Resume from where you left off?'
  let resumeButtonText = options.resumeButtonText || 'Resume'
  let cancelButtonText = options.cancelButtonText || 'No Thanks'
  let playbackOffset = options.playbackOffset || 0
  let key = 'videojs-resume:' + videoId

  this.on('timeupdate', function () {
    // @ts-ignore
    db.set(`resume[${key.replace(/\./g, '_')}]`, this.currentTime())
  })

  this.on('ended', function () {
    db.read().unset(`resume[${key.replace(/\./g, '_')}]`).write()
  })

  this.ready(function () {
    let resumeFromTime:number = db.get(`resume.${key.replace(/\./g, '_')}`) as number

    if (resumeFromTime) {
      if (resumeFromTime >= 5) {
        resumeFromTime -= playbackOffset
      }
      if (resumeFromTime <= 0) {
        resumeFromTime = 0
      }
      // @ts-ignore
      this.addChild('ResumeModal', {
        title,
        resumeButtonText,
        cancelButtonText,
        resumeFromTime,
        key
      })
    }
  })
}

videojs.plugin('Resume', Resume)
