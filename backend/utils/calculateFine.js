const calculateFine = (dueDate, returnDate) => {
  const due = new Date(dueDate);
  const returned = returnDate ? new Date(returnDate) : new Date();
  
  const diffTime = returned.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const lateDays = Math.max(0, diffDays);
  const finePerDay = parseInt(process.env.FINE_PER_DAY) || 5;
  const totalFine = lateDays * finePerDay;
  
  return {
    lateDays,
    finePerDay,
    totalFine,
  };
};

module.exports = calculateFine;
