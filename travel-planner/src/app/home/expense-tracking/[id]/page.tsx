"use client"
import ExpenseTable from '@/components/BudgetComponent/ExpenseTable'
import { useParams } from 'next/navigation'
import React from 'react'

type Props = {}

const page = (props: Props) => {
    const {id} = useParams();
  return (
    <ExpenseTable planId={id}/>
  )
}

export default page