import React from 'react'

interface INewCallProps {
  caller: string;
  receiver: string;
}

const NewCall = ({caller, receiver} : INewCallProps) => {
  return (
    <div>NewCall</div>
  )
}

export default NewCall