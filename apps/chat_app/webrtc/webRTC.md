<!-- https://www.youtube.com/watch?v=FExZvpVvYxA -->

## WebRTC: Real-Time Communication

WebRTC (Web Real-Time Communication) is a powerful set of technologies that enable real-time communication directly between web browsers, bypassing the need for a central server. This facilitates features like video conferencing, voice chat, and data sharing within web applications.

**Key Points:**

- **UDP Protocol:** WebRTC primarily utilizes the UDP (User Datagram Protocol) for its low latency and real-time nature. UDP allows for faster data transfer but may lack some of the reliability features of TCP (Transmission Control Protocol).
- **Session Description (SDP):** WebRTC doesn't handle transferring SDPs directly. These descriptions contain crucial information about a peer's media capabilities (audio/video), security parameters, and public IP addresses (when available). Each peer generates and shares its SDP with the other party.

**NAT and WebRTC:**

- **Network Address Translation (NAT):** NAT is a common network configuration where routers hide devices behind a single public IP address. This can pose challenges for direct peer-to-peer communication.
- **NAT Types and WebRTC:** Different NAT types impact WebRTC connection establishment:
  - **One-to-One NAT:** Easiest case, public IP exposed directly to the device.
  - **Port-Restricted NAT:** WebRTC can often work with configuration adjustments.
  - **Address-Restricted NAT:** Requires additional steps to establish presence before connection attempts.
  - **Symmetric NAT:** Most secure, requires TURN servers (explained later).

**STUN and TURN Servers:**

- **Session Traversal Utilities for NAT (STUN):** These servers help peers discover their public IP addresses and ports behind NAT.
- **Traversal Using Relays around NAT (TURN):** When STUN fails (e.g., Symmetric NAT), TURN servers act as relays, facilitating communication even behind restrictive NATs.

**ICE (Interactive Connectivity Establishment):**

- This process gathers potential connection candidates (IP addresses and ports) from STUN and TURN servers, as well as local network interfaces.
- Collecting and evaluating these candidates can take some time.

**SDP (Session Description Protocol):**

- SDP is a standardized format (a string) that encapsulates all the collected ICE candidates, security protocols, media options, and other relevant information for the communication session.

**Signaling the SDP:**

- SDPs are typically exchanged through separate signaling channels outside WebRTC, such as WebSockets or dedicated signaling servers. These channels negotiate the connection and establish the appropriate communication paths.

**Connection Establishment (Simplified Example):**

1. **Initiation:** Peer A initiates a connection request to peer B.
2. **Offer Creation:** A generates an "offer" containing its ICE candidates, security preferences, media options, and creates an SDP string.
3. **SDP Exchange:** A signals the offer (SDP) to B through a signaling channel.
4. **Answer Creation:** B receives the offer, creates an answer containing its own ICE candidates and SDP, and sets A's offer as its remote session description.
5. **Answer Exchange:** B signals the answer (SDP) to A.
6. **Connection Established:** Both peers use the exchanged SDPs and ICE candidates to establish a direct peer-to-peer connection.

**Additional Considerations:**

- **Security:** WebRTC offers security features like encryption and authentication to protect communication channels.
- **Scalability:** While enabling peer-to-peer connections, WebRTC can also leverage central servers for tasks like signaling and media relaying in complex scenarios.

This breakdown aims to demystify the core concepts of WebRTC. For more in-depth exploration, consider referring to official documentation and tutorials.

<!-- webRTC: Real Time Communication
uses UDP protocal instead of regular TCP

webrtc doesnott handel transfering session description, we hanve to send it by other means
session description : it contains many useful info about the computer like public ip, security params and media divices
both peer should generate their session desc and share with eachother

## webrtc deminsified

NAT : network address translation
if public ip is exposed then there is not so many work for nat, : e.g for remort ec2 instance have its own public ip
we dont have our router have public ip and private ip (gate way)

    NAT translation methods:
    one to one NAT
    port restricted NAT
    address restricted NAT
    symmetric NAT: most secure one

STUN, TURN
session traversal utilities for nat (tell me my public port and ip through nat)
here both pear will have theri own public ip and port so they will share it with eachother and start communicatiog
in this point A rewuest B to connect and if B is full cone NAT it will allow
if B in address restricted NAT we first make presence in B and start connection req
if B is in Symmetric NAT , STUN wont work

Here comes Traversal using relays NAT (TURN) : a proxy layer or light weight server communicationg with B in behave of A

ICE
interactive connection establishment
it collects all avilabel canidates (stun and trun ones) called ice canidates
collecting ICE cannidates take time

SDP : session description protocal
it is simply the fromat (string) that describe all the ice cannidateds, security protocal/options, network options, meida divices and other information

signaling the SDP
sending the SPD we created other party we want to communcate with

- samy.pl, samyk

## WebRTC Demystified

1. A wants to connect to B
2. A creates an "offer", it finds all ICE candidates, security options, audio/video options and generates SDP, the offer is basically the
   SDP
   A sets thet offeer to local session descripotion
3. A signals the offer somehow to B (whatsapp)
   here B takes that offer and sets it to remote session description and created its SDP and set to local session descripotion and send to A through signals
4. B creates the "answer" after setting A's offer
5. B signals the "answer" to A
6. Connection is created -->
