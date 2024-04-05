class WebRTCService {
  private static instance: WebRTCService;
  public peer: RTCPeerConnection | null = null;

  // Private constructor to prevent instantiation from outside the class
  private constructor() {
    // to make sure that this is initialized only in the browser
    if (typeof window !== "undefined" && window.RTCPeerConnection) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }
  // Static method to get the singleton instance of WebRTCService
  public static getInstance(): WebRTCService {
    if (!WebRTCService.instance) {
      WebRTCService.instance = new WebRTCService();
    }
    return WebRTCService.instance;
  }
  // first we will create a offer and set it to setLocalDescription
  async createOffer() {
    if (this.peer) {
      try {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);
        return offer;
      } catch (error) {
        console.error("Error creating offer:", error);
        return null; // Return null or some other default value on error
      }
    }
    throw new Error("RTCPeerConnection is not available");
  }

  // once created we need to send offer to other peer
  // set it to their setRemoteDescription and create answer and set it to setLocalDescription
  async createAnswer(offer: RTCSessionDescriptionInit) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);
      return answer;
    }
    throw new Error("RTCPeerConnection is not available");
  }
  // once we get the answer we will set it to setRemoteDescription of the peer who created the offer
  async setAnswer(answer: RTCSessionDescriptionInit) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }
}
// Export a single instance of WebRTCService
export const webRTCServiceInstance = WebRTCService.getInstance();

// class WebRTCService {
//   peer: RTCPeerConnection | null = null;
//   constructor() {
//     this.peer = new RTCPeerConnection({
//       iceServers: [
//         {
//           urls: [
//             "stun:stun.l.google.com:19302",
//             "stun:global.stun.twilio.com:3478",
//           ],
//         },
//       ],
//     });
//   }

//   async createOffer() {
//     if (this.peer) {
//       const offer = await this.peer.createOffer();
//       await this.peer.setLocalDescription(new RTCSessionDescription(offer));
//       return offer;
//     }
//   }

//   async createAnswer(offer: RTCSessionDescriptionInit) {
//     if (this.peer) {
//       await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
//       const answer = await this.peer.createAnswer();
//       await this.peer.setLocalDescription(new RTCSessionDescription(answer));
//       return answer;
//     }
//   }

// }

// export const webRTCServiceInstance = new WebRTCService();
