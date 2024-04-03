class UserMedia {
  mediaInstance: MediaStream | null = null; // Initialize to null for clarity

  constructor() {
    // this.openAudioStream(); // Fetch audio stream in the constructor
    // this.mediaInstance = null
    console.log("userMediaIntance initiated...");
  }

  async openVideoStream() {
    if (!this.mediaInstance) {
      this.mediaInstance = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
    }
    if (!this.mediaInstance.getVideoTracks().length) {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        const videoTrack = videoStream.getVideoTracks()[0];
        this.mediaInstance.addTrack(videoTrack);
        try {
          videoStream.getTracks().forEach((track) => track.stop());
        } catch (error) {
          console.error("Error stopping video stream:", error);
        }
      } catch (error) {
        console.error("Error opening video stream:", error);
      }
      if (!this.mediaInstance.getAudioTracks().length) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          const audioTrack = audioStream.getVideoTracks()[0];
          this.mediaInstance.addTrack(audioTrack);
          try {
            audioStream.getTracks().forEach((track) => track.stop());
          } catch (error) {
            console.error("Error stopping audio stream:", error);
          }
        } catch (error) {
          console.error("Error opening video stream:", error);
        }
      }
    } else {
      console.log("Video stream already exists", this.mediaInstance.getVideoTracks());
    }
  }

  async closeVideoStream() {
    console.log("out");
    if (this.mediaInstance) {
      console.log("in");
      const videoTracks = this.mediaInstance.getVideoTracks();
      for (const track of videoTracks) {
        try {
          console.log(track, "closing track");
          track.stop();
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
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const audioTrack = audioStream.getAudioTracks()[0];
        this.mediaInstance.addTrack(audioTrack);
        try {
          audioStream.getTracks().forEach((track) => track.stop());
        } catch (error) {
          console.error("Error stopping audio stream:", error);
        }
      }
      if (this.mediaInstance.getVideoTracks().length) {
        console.log(
          this.mediaInstance.getVideoTracks().length,
          "video track length"
        );
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
        } catch (error) {
          console.error("Error stopping audio track:", error);
        }
      }
    }
  }

  // async openAudioVideoStream() {
  //   if (!this.mediaInstance?.getVideoTracks().length) {
  //     await this.openVideoStream();
  //   }
  //   if (!this.mediaInstance?.getAudioTracks().length) {
  //     await this.openAudioStream();
  //   }
  // }

  async closeAllStreams() {
    if (this.mediaInstance) {
      for (const track of this.mediaInstance.getTracks()) {
        try {
          track.stop();
        } catch (error) {
          console.error("Error stopping track:", error);
        }
      }
      this.mediaInstance = null; // Clear the stream reference
    }
  }

  getMediaStream() {
    if (this.mediaInstance) {
      return  this.mediaInstance.getTracks().map((track) => track);
    }
    return "No media stream available";
  }
}

export const userMediaIntance = new UserMedia();
