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

export function formatNumber(price) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
  
  return formattedPrice
}




