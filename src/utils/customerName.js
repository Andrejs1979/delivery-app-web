export default function customerName(customer) {
  if (customer)
    if (customer.firstName && customer.lastName) {
      return `${customer.firstName} ${customer.lastName}`;
    } else return customer.email;
}
