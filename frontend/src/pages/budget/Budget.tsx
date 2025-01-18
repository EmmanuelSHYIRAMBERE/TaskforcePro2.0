import React, { useState } from "react";

const Budget: React.FC = () => {
  const [budget, setBudget] = useState(1000);
  const [expense, setExpense] = useState(700);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Budget</h1>
      <p>Your set budget: ${budget}</p>
      <p>Total expenses: ${expense}</p>
      {expense > budget && (
        <p className="text-red-500">Warning: Budget exceeded!</p>
      )}
    </div>
  );
};

export default Budget;
