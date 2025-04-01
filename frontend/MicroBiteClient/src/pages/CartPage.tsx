import { useCart } from "../cart/context/useCartContext";

export default function CartPage() {
  const { state, dispatch } = useCart();

  const totalPrice = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleAdjustQuantity = (id: string, adjustment: number) => {
    const item = state.cartItems.find((item) => item.id === id);
    if (!item) return;

    const newQuantity = item.quantity + adjustment;

    if (newQuantity < 1) {
      dispatch({ type: "REMOVE_ITEM", payload: id });
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, quantity: newQuantity },
      });
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Your Shopping Cart</h2>

      {state.cartItems.length === 0 ? (
        <p>The cart is empty.</p>
      ) : (
        <div>
          {state.cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px",
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ flex: 2 }}>
                <h3 style={{ margin: 0 }}>{item.name}</h3>
                <p style={{ margin: "5px 0" }}>Unit price: {item.price} RON</p>
              </div>

              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  onClick={() => handleAdjustQuantity(item.id, -1)}
                  style={{
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                    padding: "5px 10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  -
                </button>

                <span style={{ minWidth: "30px", textAlign: "center" }}>{item.quantity}</span>

                <button
                  onClick={() => handleAdjustQuantity(item.id, 1)}
                  style={{
                    backgroundColor: "#f0f0f0",
                    color: "#333",
                    padding: "5px 10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  +
                </button>
              </div>

              <div style={{ flex: 1, textAlign: "right" }}>
                <p style={{ margin: 0 }}>{(item.price * item.quantity).toFixed(2)} RON</p>
              </div>

              <div>
                <button
                  onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                  style={{
                    backgroundColor: "#ff4444",
                    color: "white",
                    padding: "8px 12px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginLeft: "15px",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "2px solid #333",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>Total:</h3>
            <h3>{totalPrice.toFixed(2)} RON</h3>
          </div>
        </div>
      )}
    </div>
  );
}
