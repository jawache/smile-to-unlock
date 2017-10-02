import {
  Component,
  Prop,
  Element,
  Event,
  EventEmitter,
  Method
} from "@stencil/core";

@Component({
  tag: "smile-to-unlock-hider",
  styleUrl: "smile-to-unlock-hider.scss"
})
export class SmileToUnlockHider {
  @Prop() callToAction: string = "Want to watch this video? Then give me a smile!";
  @Element() el: HTMLElement;
  @Event() readyToSmile: EventEmitter;

  @Method()
  hide() {
    this.el.style.display = "none";
  }

  startSmiling() {
    this.readyToSmile.emit({});  
  }

  render() {
    return ([
      <p class="top"></p>,
      <p class="middle">
        {this.callToAction}
        <br />
        <i class="material-icons">arrow_downward</i>
        <br />
        <button class="unlock btn btn-primary"
                onClick={this.startSmiling.bind(this)}>
                Smile to Unlock
        </button>
      </p>,
      <div class="bottom">
      </div>
    ]);
  } 
}
