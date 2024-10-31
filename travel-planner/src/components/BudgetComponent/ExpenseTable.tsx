"use client";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AddExpense from "./AddExpense";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getTravelsById } from "@/redux/TravelSlice/TravelSlice";

type Props = {
  planId: string | string[];
};

const ExpenseTable = ({ planId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const travel = useSelector((state: RootState) => state.travel.travel);
  useEffect(() => {
    if (typeof planId === "string") dispatch(getTravelsById(planId));
  }, [dispatch, planId, travel]);

  const expenses = travel?.expenses || [];
  const totalExpense = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  return (
    <div>
      <div className="mt-4 ml-4">
        <AddExpense planId={planId} />
      </div>
      <div className="flex justify-end mr-4">
        <div className="p-4 border-2 w-fit border-[#50b3ea]">
          Total Spent: ${totalExpense}
        </div>
      </div>
      <div className="mt-4">
        <Table className="text-black">
          <TableCaption>A list of your recent Budgets.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Catergory</TableHead>
              <TableHead>Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {travel.expenses?.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExpenseTable;
