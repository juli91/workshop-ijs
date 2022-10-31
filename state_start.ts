abstract class AbstractVideoState {
  protected videoPlayer: VideoPlayer;

  // this class represents the state
  setContext(context: VideoPlayer) {
    this.videoPlayer = context;
    this.init();
  }

  abstract init(): void;
  abstract play(): void;
  abstract stop(): void;
}

// States (you can add as many as you like)
//probably separate to multiple files
class Ready extends AbstractVideoState {
  init(): void {
    this.videoPlayer.position = 0;
    this.videoPlayer.isPlaying = false;
    console.log('Enter Ready State');
  }

  play(): void {
    this.videoPlayer.setState(new Play());
  }

  stop(): void {}
}

class Play extends AbstractVideoState {
  init(): void {
    this.videoPlayer.isPlaying = true;
    console.log('Enter Play State');
  }

  play(): void {
    console.log('Already playing do nothing');
  }

  stop(): void {
    this.videoPlayer.setState(new Paused());
  }
}

class Paused extends AbstractVideoState {
  init(): void {
    this.videoPlayer.isPlaying = false;
    console.log('Enter Pause State');
  }

  play(): void {
    this.videoPlayer.setState(new Play());
  }

  stop(): void {
    this.videoPlayer.setState(new Ready());
  }
}

class VideoPlayer {
  private videoState: AbstractVideoState;

  position: number;
  isPlaying: boolean;

  constructor(initialState: AbstractVideoState) {
    this.setState(initialState);
  }

  setState(state: AbstractVideoState) {
    this.videoState = state;
    this.videoState.setContext(this);
  }

  public play() {
    this.videoState.play();
  }

  public stop() {
    this.videoState.stop();
  }
}

// todo: video player starts with a video at position 0 ready to play
const videoPlayer = new VideoPlayer(new Ready());

// todo: if ready: play the video
videoPlayer.play();

// todo: if already playing: do nothing
videoPlayer.play();

// todo: if was playing: stop the video at current position (pause)
videoPlayer.stop();

// todo: if paused: return to start position
videoPlayer.stop();
