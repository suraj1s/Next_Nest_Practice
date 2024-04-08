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
  async createOffer({
    caller,
    reciever,
    type,
  }: {
    caller: string;
    reciever: string;
    type: "nego" | "call";
  }) {
    if (this.peer) {
      try {
        const offer = await this.peer.createOffer();
        await this.peer.setLocalDescription(offer);
        this.peer.localDescription
        console.log(
          "Create Offer :::::::::::  ",
          "type : ",
          type,
          "caller : ",
          caller,
          "reciever : ",
          reciever,
          "offer : ",
          offer
        );
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
  async createAnswer({
    offer,
    caller,
    reciever,
    type,
  }: {
    offer: RTCSessionDescriptionInit;
    caller: string;
    reciever: string;
    type: "nego" | "call";
  }) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(answer);
      console.log(
        "Create Answer :::::::::::  ",
        "type : ",
        type,
        "caller : ",
        caller,
        "reciever : ",
        reciever,
        "answer : ",
        answer,
        "offer : ",
        offer
      );
      return answer;
    }
    throw new Error("RTCPeerConnection is not available");
  }
  // once we get the answer we will set it to setRemoteDescription of the peer who created the offer
  async setAnswer({
    answer,
    caller,
    reciever,
    type,
  }: {
    answer: RTCSessionDescriptionInit;
    caller: string;
    reciever: string;
    type: "nego" | "call";
  }) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
      console.log(
        "Set Answer :::::::::::  ",
        "type : ",
        type,
        "caller : ",
        caller,
        "reciever : ",
        reciever,
        "answer : ",
        answer
      );
    }
  }
}
// Export a single instance of WebRTCService
export const webRTCServiceInstance = WebRTCService.getInstance();
