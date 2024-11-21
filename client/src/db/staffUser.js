// Utility function to generate a unique order ID
let orderIdCounter = 1;

function generateUniqueOrderId() {
  return orderIdCounter++;
}

export const staff = [
  {
    id: 1,
    name: "Alice",
    email: "alice@domain.com",
    role: "Staff",
    orderHistory: [
      { id: generateUniqueOrderId(), items: "Pizza, Soda", totalAmount: 15.99, paymentMethod: "Credit Card", date: "10-01-2024" },
      { id: generateUniqueOrderId(), items: "Burger, Fries", totalAmount: 9.49, paymentMethod: "Cash", date: "5-05-2024" },
      { id: generateUniqueOrderId(), items: "Salad, Water", totalAmount: 7.99, paymentMethod: "Credit Card", date: "10-10-2024" },
      { id: generateUniqueOrderId(), items: "Pasta, Juice", totalAmount: 12.49, paymentMethod: "Debit Card", date: "10-12-2024" },
      { id: generateUniqueOrderId(), items: "Sandwich, Coffee", totalAmount: 8.99, paymentMethod: "Cash", date: "11-15-2024" },
      { id: generateUniqueOrderId(), items: "Steak, Wine", totalAmount: 24.99, paymentMethod: "Credit Card", date: "9-18-2024" },
      { id: generateUniqueOrderId(), items: "Sushi, Green Tea", totalAmount: 18.99, paymentMethod: "Debit Card", date: "9-20-2024" },
      { id: generateUniqueOrderId(), items: "Burger, Soda", totalAmount: 6.99, paymentMethod: "Cash", date: "10-30-2024" }
    ]
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@domain.com",
    role: "Staff",
    orderHistory: [
      { id: generateUniqueOrderId(), items: "Coffee, Muffin", totalAmount: 4.99, paymentMethod: "Cash", date: "10-02-2024" },
      { id: generateUniqueOrderId(), items: "Wrap, Juice", totalAmount: 8.99, paymentMethod: "Credit Card", date: "8-07-2024" },
      { id: generateUniqueOrderId(), items: "Pasta, Salad", totalAmount: 10.49, paymentMethod: "Debit Card", date: "7-14-2024" },
      { id: generateUniqueOrderId(), items: "Tacos, Soda", totalAmount: 11.49, paymentMethod: "Cash", date: "5-18-2024" },
      { id: generateUniqueOrderId(), items: "Brownie, Ice Cream", totalAmount: 6.99, paymentMethod: "Credit Card", date: "10-25-2024" },
      { id: generateUniqueOrderId(), items: "Chicken Wings, Fries", totalAmount: 13.99, paymentMethod: "Debit Card", date: "10-29-2024" }
    ]
  },
  {
    id: 3,
    name: "Charlie",
    email: "charlie@domain.com",
    role: "Staff",
    orderHistory: [
      { id: generateUniqueOrderId(), items: "Salad, Soup", totalAmount: 9.99, paymentMethod: "Debit Card", date: "1-03-2024" },
      { id: generateUniqueOrderId(), items: "Grilled Chicken, Rice", totalAmount: 14.99, paymentMethod: "Credit Card", date: "09-09-2024" },
      { id: generateUniqueOrderId(), items: "Ice Cream, Waffle", totalAmount: 7.49, paymentMethod: "Cash", date: "1-16-2024" },
      { id: generateUniqueOrderId(), items: "Pasta Alfredo, Breadsticks", totalAmount: 11.99, paymentMethod: "Debit Card", date: "10-19-2024" },
      { id: generateUniqueOrderId(), items: "Nachos, Guacamole", totalAmount: 10.49, paymentMethod: "Credit Card", date: "8-24-2024" },
      { id: generateUniqueOrderId(), items: "Salmon, Mashed Potatoes", totalAmount: 18.49, paymentMethod: "Debit Card", date: "10-28-2024" }
    ]
  },
  {
    id: 4,
    name: "Diana",
    email: "diana@domain.com",
    role: "Staff",
    orderHistory: [
      { id: generateUniqueOrderId(), items: "Cheeseburger, Fries", totalAmount: 11.49, paymentMethod: "Cash", date: "10-01-2024" },
      { id: generateUniqueOrderId(), items: "Spaghetti, Meatballs", totalAmount: 12.99, paymentMethod: "Credit Card", date: "4-06-2024" },
      { id: generateUniqueOrderId(), items: "Fruit Salad, Yogurt", totalAmount: 5.99, paymentMethod: "Debit Card", date: "2-11-2024" },
      { id: generateUniqueOrderId(), items: "Chicken Wings, Beer", totalAmount: 15.99, paymentMethod: "Cash", date: "1-14-2024" },
      { id: generateUniqueOrderId(), items: "Pancakes, Maple Syrup", totalAmount: 8.49, paymentMethod: "Credit Card", date: "5-21-2024" },
      { id: generateUniqueOrderId(), items: "Lobster Roll, Fries", totalAmount: 22.99, paymentMethod: "Debit Card", date: "6-26-2024" }
    ]
  },
  {
    id: 5,
    name: "Edward",
    email: "edward@domain.com",
    role: "Staff",
    orderHistory: [
      { id: generateUniqueOrderId(), items: "Vegetable Stir Fry, Rice", totalAmount: 9.49, paymentMethod: "Credit Card", date: "1-03-2024" },
      { id: generateUniqueOrderId(), items: "Quiche, Salad", totalAmount: 10.49, paymentMethod: "Debit Card", date: "7-08-2024" },
      { id: generateUniqueOrderId(), items: "Fish Tacos, Salsa", totalAmount: 12.99, paymentMethod: "Cash", date: "10-15-2024" },
      { id: generateUniqueOrderId(), items: "Lamb Chops, Mashed Potatoes", totalAmount: 18.99, paymentMethod: "Credit Card", date: "10-19-2024" },
      { id: generateUniqueOrderId(), items: "Cobb Salad, Dressing", totalAmount: 7.99, paymentMethod: "Debit Card", date: "5-23-2024" },
      { id: generateUniqueOrderId(), items: "Chicken Caesar Salad", totalAmount: 11.49, paymentMethod: "Credit Card", date: "3-30-2024" }
    ]
  },
  {
    id: 6,
    name: "Fiona",
    email: "fiona@domain.com",
    role: "Staff",
    orderHistory: [
      { id: generateUniqueOrderId(), items: "Veggie Burger, Fries", totalAmount: 12.49, paymentMethod: "Debit Card", date: "10-10-2024" },
      { id: generateUniqueOrderId(), items: "Pasta, Garlic Bread", totalAmount: 9.99, paymentMethod: "Credit Card", date: "5-12-2024" },
      { id: generateUniqueOrderId(), items: "Caesar Salad, Breadsticks", totalAmount: 8.99, paymentMethod: "Cash", date: "8-18-2024" },
      { id: generateUniqueOrderId(), items: "Pizza, Garlic Knots", totalAmount: 14.49, paymentMethod: "Debit Card", date: "6-23-2024" },
      { id: generateUniqueOrderId(), items: "Tacos, Nachos", totalAmount: 11.99, paymentMethod: "Cash", date: "9-29-2024" }
    ]
  },
  {
    id: "507f191e810c19729de860eb",
    name: "TestAPI",
  }
];
