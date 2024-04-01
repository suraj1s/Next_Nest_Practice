webRTC: Real Time Communication
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
3. A signals the offer somehow to B (whatsapp)
   here b tacke that offer and sets it to localdescription and created its sdp
4. B creates the "answer" after setting A's offer
5. B signals the "answer" to A
6. Connection is created
