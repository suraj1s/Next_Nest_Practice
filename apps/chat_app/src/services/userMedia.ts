class UserMedia {
  mediaInstance: MediaStream | null = null; // Initialize to null for clarity

  constructor() {
    this.openEmptyStream(); // Fetch audio stream in the constructor
  }
  async openEmptyStream() {
    this.mediaInstance = await navigator.mediaDevices.getUserMedia();
  }

  async openVideoStream() {
    if (!this.mediaInstance) {
      this.mediaInstance = new MediaStream(); // Create a new stream if needed
    }
    if (!this.mediaInstance.getVideoTracks().length) {
      if (!this.mediaInstance.getAudioTracks().length) {
        await this.openAudioStream();
      }
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
    } else {
      console.log("Video stream already exists");
    }
  }

  async closeVideoStream() {
    if (this.mediaInstance) {
      const videoTracks = this.mediaInstance.getVideoTracks();
      for (const track of videoTracks) {
        try {
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
        this.closeVideoStream();
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
      return this.mediaInstance.getTracks().map((track) => track);
    }
    return "No media stream available";
  }
}

export default new UserMedia();
