import {
  Component,
  Prop,
  Element,
  State,
  Event,
  EventEmitter,
  Method
} from "@stencil/core";

enum Mode {
  Inactive = 1,
  CameraReady,
  Countdown,
  TakingPicture,
  CheckingPicture,
  Error,
  UserHappy,
  UserUnhappy
}

@Component({
  tag: "smile-to-unlock",
  styleUrl: "smile-to-unlock.scss"
})
export class SmileToUnlock {
  @Prop() apiKey: string;
  @Prop() apiUrl: string = "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize";

  @State() state: Mode;
  @State() countdown: number;
  @State() happiness: number;
  @State() errorMessage: string;

  @Element() el: HTMLElement;

  @Event() userSmiled: EventEmitter;

  video: HTMLVideoElement;
  canvas: HTMLCanvasElement;

  @Method()
  start() {
    this.init();
    this.startCamera();
    this.show();
  }

  @Method()
  end() {
    this.hide();
    this.endCamera();
  }

  hide() {
    this.el.style.display = "none";
  }

  show() {
    this.el.style.display = "block";
  }

  init() {
    this.state = Mode.Inactive; // This makes the overlay appear, once the video is setup the overlay with disappear
    this.video = this.el.querySelector("#video") as HTMLVideoElement;
    this.canvas = this.el.querySelector("canvas") as HTMLCanvasElement;
  }

  takeSnapshot() {
    let context = this.canvas.getContext("2d"),
      width = this.video.videoWidth,
      height = this.video.videoHeight;

    if (width && height) {
      // Setup a canvas with the same dimensions as the video.
      this.canvas.width = width;
      this.canvas.height = height;

      // Make a copy of the current frame in the video on the canvas.
      context.drawImage(this.video, 0, 0, width, height);

      this.calculateHappiness();
    }
  }

  startCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        this.video.src = window.URL.createObjectURL(stream);
        return this.video.play();
      })
      // Now the video is ready set this state so it's actually displayed
      .then(_ => (this.state = Mode.CameraReady))
      .catch(err => {
        console.error(err);
        this.state = Mode.Error;
        this.errorMessage = "There was a problem starting your camera";
      });
  }

  endCamera() {
    this.video.pause();
    this.video.src = "";
  }

  startCountdown(event) {
    event.preventDefault();
    this.state = Mode.Countdown; // This shows the numbers

    this.countdown = 3; // XXX: Move to setting
    const refreshId = setInterval(() => {
      this.countdown -= 1;
      if (this.countdown === 0) {
        clearInterval(refreshId);
        // Show the flash animation, this takes 0.5s
        this.state = Mode.TakingPicture;
        setTimeout(() => {
          // 0.25s into the Flash (at the white peak) take the snapshot
          this.takeSnapshot();
        }, 250);
      }
    }, 1000);
  }

  getImageBlob(): Promise<Blob> {
    return new Promise(resolve => {
      this.canvas.toBlob(blob => resolve(blob));
    });
  }

  async calculateHappiness() {
    this.state = Mode.CheckingPicture;
    let blob = await this.getImageBlob();
    let response = await fetch(this.apiUrl, {
      headers: {
        "Ocp-Apim-Subscription-Key": this.apiKey,
        "Content-Type": "application/octet-stream"
      },
      method: "POST",
      body: blob
    });
    let faces = await response.json();

    if (faces.length > 0) {
      let face = faces[0];
      this.happiness = face.scores.happiness;
      console.debug(this.happiness);
      this.state = this.isUserHappy ? Mode.UserHappy : Mode.UserUnhappy;
    } else {
      // Handle when no faces or error returned
      this.state = Mode.Error;
      this.errorMessage = "You don't seem to have a face? Try again!";
    }
  }

  unlockContent() {
    // Don't hide yourself, let the outer component decide what to do.
    this.userSmiled.emit({ score: this.happiness });
  }

  componentWillLoad() {
    if (!this.apiKey) {
      console.error("smile-to-unlock missing required attribute 'apiKey'");
      return false;
    }
  }

  get percentHappy() {
    return Math.floor(this.happiness * 100);
  }

  get isUserHappy() {
    return this.happiness && this.happiness > 0.9;
  }

  get showInactive() {
    return this.state === Mode.Inactive;
  }

  get showFlash() {
    return this.state === Mode.TakingPicture;
  }

  get showCamera() {
    return (
      this.state === Mode.Inactive ||
      this.state === Mode.CameraReady ||
      this.state === Mode.Countdown ||
      this.state === Mode.TakingPicture ||
      this.state === Mode.Error
    );
  }

  get showPicture() {
    return (
      this.state === Mode.CheckingPicture ||
      this.state === Mode.UserHappy ||
      this.state === Mode.UserUnhappy
    );
  }

  get emotionalDescription() {
    if (this.happiness > 0.9) {
      return `(${this.percentHappy}% Happy) 😁 There you go, wasn't so hard was it?`;
    } else if (this.happiness > 0.6) {
      return `(${this.percentHappy}% Happy) 😀 Almost, just a little more…`;
    } else if (this.happiness > 0.5) {
      return `(${this.percentHappy}% Happy) 🙂 Getting there… show me those teeth!`;
    } else if (this.happiness > 0.3) {
      return `(${this.percentHappy}% Happy) 😐 Well… at least it's not a frown`;
    } else if (this.happiness > 0.2) {
      return `(${this.percentHappy}% Happy) 😕 Maybe if you think of something funny?`;
    } else if (this.happiness > 0.1) {
      return `(${this.percentHappy}% Happy) 🙁 It's not called 'frown to unlock'`;
    } else if (this.happiness > 0.05) {
      return `(${this.percentHappy}% Happy) ☹️ Do you even know what a smile is?`;
    } else {
      return `(${this.percentHappy}% Happy) 😭 Do you want a tissue?`;
    }
  }

  render() {
    return (
      <div class="app">
        {/*<!-- The controls and header  -->*/}
        <div class="controls">
          <div class="header">
            <span class="promo">
            <a target="_blank" href="https://smiletounlock.com/">Smile to Unlock</a> | <a target="_blank" href="http://bit.ly/emotive-api-stu">Powered by Azure</a> 
            </span>
            <a onClick={this.end.bind(this)} 
               class="icon"
               href="#">
              <i class="material-icons">close</i>
            </a>
          </div>
          {(() => {
            switch (this.state) {
              case Mode.CameraReady:
                // This shows the instructions screen
                return (
                  <div class="message">
                    <span>
                      Smile and then press
                    </span>
                    <span class="arrow-icon">
                      <i class="material-icons">arrow_forward</i>
                    </span>
                    <a
                      href="#"
                      class="icon"
                      onClick={this.startCountdown.bind(this)}
                    >
                      <i class="material-icons">camera_alt</i>
                    </a>
                  </div>
                );
              case Mode.Countdown:
                // This shows the countdown screen
                return [
                  <div class="message">
                    <span class="countdown">{this.countdown}</span>
                  </div>,
                  <div class="spacer">&nbsp;</div>
                ];
              case Mode.CheckingPicture:
                // This shows the detecting message
                return (
                  <div class="message">
                    <span class="checking">
                      Detecting happiness <span class="spinner" />
                    </span>
                  </div>
                );
              case Mode.Error:
                // This shows the error message
                return (
                  <div class="message">
                    <span class="arrow-icon">
                      <i class="material-icons">error_outline</i>
                    </span>                    
                    <span class="error">&nbsp;{this.errorMessage}</span>
                    <span class="arrow-icon">
                      <i class="material-icons">arrow_forward</i>
                    </span>
                    <a
                      href="#"
                      class="icon"
                      onClick={this.startCountdown.bind(this)}
                    >
                      <i class="material-icons">camera_alt</i>
                    </a>
                  </div>
                );
              case Mode.UserUnhappy:
                return (
                  <div class="message">
                    <span>{this.emotionalDescription}</span>
                    <span class="arrow-icon">
                      <i class="material-icons">arrow_forward</i>
                    </span>
                    <a
                      href="#"
                      class="icon"
                      onClick={this.startCountdown.bind(this)}
                    >
                      <i class="material-icons">camera_alt</i>
                    </a>
                  </div>
                );
              case Mode.UserHappy:
                return (
                  <div class="message">
                    <span>{this.emotionalDescription}</span>
                    <span class="arrow-icon">
                      <i class="material-icons">arrow_forward</i>
                    </span>
                    <a
                      href="#"
                      class="icon"
                      onClick={this.unlockContent.bind(this)}
                    >
                      <i class="material-icons">lock_open</i>
                    </a>
                  </div>
                );
              default:
                return;
            }
          })()}
        </div>

        <div
          class="overlay"
          style={{ display: this.showInactive ? "block" : "none" }}
        />

        <div
          class="flash"
          style={{ display: this.showFlash ? "block" : "none" }}
        />

        <div
          class="video-wrapper"
          style={{ display: this.showCamera ? "block" : "none" }}
        >
          <video id="video">Video stream not available.</video>
        </div>

        <div
          class="picture-wrapper"
          style={{ display: this.showPicture ? "block" : "none" }}
        >
          <canvas id="picture">&nbsp;</canvas>
        </div>
      </div>
    );
  }
}
