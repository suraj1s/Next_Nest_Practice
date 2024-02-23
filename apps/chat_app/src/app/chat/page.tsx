import { Button } from '@repo/ui/Button'
import React from 'react'

const page = () => {
  return (
    <div>
    <div>Contacts</div>
    <div>
      chat 
      <div>
        <input type="text"  />
        <Button appName='send'>Send</Button>
      </div>
    </div>
    </div>
  )
}

export default page