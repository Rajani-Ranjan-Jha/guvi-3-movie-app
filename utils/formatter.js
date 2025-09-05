export function formatMinutes(input) {
  let hour = 0;
  let minute = 0;
  while (input >= 60) {
    input -= 60;
    hour += 1;
  }
  minute = input;
  return `${hour}h ${minute}m`;
}

export function formatCurrency(price) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
  
  return formattedPrice
}

export function formatNumber(number) {
  if(number < 1000){
    return number
  }
  return `${(number/1000).toFixed(1)}k`
}




