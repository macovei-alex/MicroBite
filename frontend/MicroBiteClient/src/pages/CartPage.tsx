import { useCartContext } from "../cart/context/useCartContext";
import PageTitle from "../components/PageTitle";

export default function CartPage() {
  const { state, dispatch } = useCartContext();

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
    <div className="p-5 max-w-200 mx-auto">
      <PageTitle text="My Cart" />

      {state.cartItems.length === 0 ? (
        <p>The cart is empty.</p>
      ) : (
        <div>
          {state.cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-4">
              <div className="flex-2">
                <h3 className="font-bold text-blue-500 text-lg">{item.name}</h3>
                <p className="mt-1">Unit price: {item.price} RON</p>
              </div>

              <div className="flex flex-1 items-center g-2">
                <button
                  onClick={() => handleAdjustQuantity(item.id, -1)}
                  className="hover:bg-blue-100 bg-gray-100 transition duration-500 px-3 py-1 rounded-md cursor-pointer text-blue-500"
                >
                  -
                </button>

                <span className="min-w-8 text-center text-blue-500 font-bold">{item.quantity}</span>

                <button
                  onClick={() => handleAdjustQuantity(item.id, 1)}
                  className="hover:bg-blue-100 bg-gray-100 transition duration-500 px-3 py-1 rounded-md cursor-pointer text-blue-500"
                >
                  +
                </button>
              </div>

              <div className="flex-1 text-right font-bold text-blue-500">
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

          <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-blue-500">
            <h3 className="text-blue-500 font-bold text-lg">Total:</h3>
            <h3 className="text-blue-500 font-bold text-lg">{totalPrice.toFixed(2)} RON</h3>
          </div>
        </div>
      )}
    </div>
  );
}
