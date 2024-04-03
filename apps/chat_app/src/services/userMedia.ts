class UserMedia {
  mediaInstance: MediaStream | null = null;
  constructor() {
    console.log("userMediaIntance initiated...");
  }

  async addVideoTrack() {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const videoTrack = videoStream.getVideoTracks()[0];
      this.mediaInstance?.addTrack(videoTrack);
      // if we remove the teach and stop the stream it will not work as this is padded by reference
      // try {
      //   videoStream.getTracks().forEach((track) => {
      //     track.stop();
      //     videoStream.removeTrack(track);
      //   });
      // } catch (error) {
      //   console.error("Error stopping video stream:", error);
      // }
    } catch (error) {
      console.error("Error opening video stream:", error);
    }
  }

  async addAudioTrack() {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const audioTrack = audioStream.getAudioTracks()[0];
      this.mediaInstance?.addTrack(audioTrack);
    } catch (error) {
      console.error("Error opening audio stream:", error);
    }
  }

  async openVideoStream() {
    if (!this.mediaInstance) {
      this.mediaInstance = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
    } else if (!this.mediaInstance.getVideoTracks().length) {
      await this.addVideoTrack();
    }
    // this is not media instance already exists with audio track
    // if (!this.mediaInstance.getAudioTracks().length) {
    //   await this.openAudioStream();
    // }
  }

  async closeVideoStream() {
    if (this.mediaInstance) {
      const videoTracks = this.mediaInstance.getVideoTracks();
      for (const track of videoTracks) {
        try {
          console.log(track, "closing track");
          track.stop();
          this.mediaInstance.removeTrack(track); // Then remove it from the array
        } catch (error) {
          console.error("Error stopping video track:", error);
        }
      }
    }
  }

  async openAudioStream() {
    try {
      if (!this.mediaInstance) {
        this.mediaInstance = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      } else if (!this.mediaInstance.getAudioTracks().length) {
        await this.addAudioTrack();
      }
      if (this.mediaInstance.getVideoTracks().length) {
        await this.closeVideoStream();
      }
    } catch (error) {
      console.error("Error opening audio stream:", error);
    }
  }

  async closeAudioStream() {
    if (this.mediaInstance) {
      const audioTracks = this.mediaInstance.getAudioTracks();
      for (const track of audioTracks) {
        try {
          track.stop();
          this.mediaInstance.removeTrack(track);
        } catch (error) {
          console.error("Error stopping audio track:", error);
        }
      }
    }
  }

  async closeAllStreams() {
    if (this.mediaInstance) {
      for (const track of this.mediaInstance.getTracks()) {
        try {
          track.stop();
          this.mediaInstance.removeTrack(track);
        } catch (error) {
          console.error("Error stopping track:", error);
        }
      }
      this.mediaInstance = null; // Clear the stream reference
    }
  }

  getMediaStream() {
    if (this.mediaInstance) {
      return this.mediaInstance.getTracks().map((track) => track);
    }
    return "No media stream available";
  }

}
export const userMediaIntance = new UserMedia();
