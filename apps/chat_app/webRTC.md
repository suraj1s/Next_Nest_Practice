webRTC: Real Time Communication

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
session traversal utilities for nat (tell me my public port and ip through nat )

ICE
SDP
signaling the SDP
