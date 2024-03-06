"use client"
import { getBookById } from '@/graphql/Queries'
import { useQuery } from '@apollo/client'
import React, { useEffect } from 'react'

const AllTodo = () => {
  const {error , loading , data } = useQuery(getBookById)
  console.log(data, 'outside use effect')  
  return (
    <div>AllTodo</div>
  )
}

export default AllTodo