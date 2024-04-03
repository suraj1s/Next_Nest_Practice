class WebRTCService {
  peer: RTCPeerConnection;
  constructor() {
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

  // first we will create a offer and set it to setLocalDescription
  async createOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }

  // once created we need to send offer to other peer
  // set it to their setRemoteDescription and create answer and set it to setLocalDescription
  async createAnswer(offer: RTCSessionDescriptionInit) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(answer));
      return answer;
    }
  }

  // once we get the answer we will set it to setRemoteDescription of the peer who created the offer
  async setAnswer(answer: RTCSessionDescriptionInit) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }
}

export const webRTCServiceInstance = new WebRTCService();
