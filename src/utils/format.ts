export const formatCurrency = (amount: number) => {
  // Format without currency style to avoid any currency symbols
  const formatted = new Intl.NumberFormat('en-KE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true, // This enables thousand separators
  }).format(Math.abs(amount));
  
  // Add KSH prefix and handle negative numbers
  return amount < 0 ? `-KSH ${formatted}` : `KSH ${formatted}`;
};
