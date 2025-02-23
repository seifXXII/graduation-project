import { createContext, useContext, useState, useEffect } from "react";

// Create the context
const OrderContext = createContext();

// Custom hook to use the OrderContext
export const useOrders = () => useContext(OrderContext);

// OrderProvider component
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Load orders from local storage on component mount
  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    if (storedOrders.length === 0) {
      // Add fake data if no orders exist
      const fakeOrders = [
        {
          id: 1,
          customerName: "John Doe",
          customerEmail: "john@example.com",
          customerAddress: "123 Main St",
          products: [{ name: "Laptop", quantity: 2 }],
        },
        {
          id: 2,
          customerName: "Jane Smith",
          customerEmail: "jane@example.com",
          customerAddress: "456 Elm St",
          products: [{ name: "Smartphone", quantity: 1 }],
        },
      ];
      localStorage.setItem("orders", JSON.stringify(fakeOrders));
      setOrders(fakeOrders);
    } else {
      setOrders(storedOrders);
    }
  }, []);

  // Save orders to local storage whenever orders state changes
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // Function to add a new order
  const addOrder = (order) => {
    const newOrder = { ...order, id: Date.now() }; // Add a unique ID
    const updatedOrders = [...orders, newOrder]; // Add the new order to the list
    setOrders(updatedOrders); // Update the state
  };

  // Function to edit an existing order
  const editOrder = (updatedOrder) => {
    const updatedOrders = orders.map((order) =>
      order.id === updatedOrder.id ? updatedOrder : order
    );
    setOrders(updatedOrders);
  };

  // Function to delete an order
  const deleteOrder = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== orderId)
    );
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, editOrder, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
