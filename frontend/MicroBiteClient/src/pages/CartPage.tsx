import { useCallback } from "react";
import { useCartContext } from "../cart/context/useCartContext";
import Button from "../components/Button";
import NamedInput from "../components/NamedInput";
import PageTitle from "../components/PageTitle";

export default function CartPage() {
  const { state, dispatch } = useCartContext();

  const totalPrice = state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleAdjustQuantity = useCallback(
    (id: string, adjustment: number) => {
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
    },
    [state, dispatch]
  );

  const handlePaceOrder = useCallback(() => {}, []);

  return (
    <div className="p-5 max-w-200 mx-auto">
      <PageTitle text="My Cart" />

      {state.cartItems.length === 0 ? (
        <p>The cart is empty.</p>
      ) : (
        <div className="flex flex-col gap-10">
          <div className="border-1 border-blue-500 rounded-2xl p-4">
            {state.cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4">
                <div className="flex-2">
                  <h3 className="font-bold text-blue-500 text-lg">{item.name}</h3>
                  <p className="mt-1">Unit price: {item.price} RON</p>
                </div>

                <div className="flex flex-1 items-center">
                  <button
                    onClick={() => handleAdjustQuantity(item.id, -1)}
                    className="hover:bg-blue-200 bg-gray-100 transition duration-500 w-8 h-8 rounded-md cursor-pointer text-blue-500 border-1 border-blue-500 text-lg font-bold"
                  >
                    -
                  </button>

                  <span className="min-w-8 text-center text-blue-500 font-bold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => handleAdjustQuantity(item.id, 1)}
                    className="hover:bg-blue-200 bg-gray-100 transition duration-500 w-8 h-8 rounded-md cursor-pointer text-blue-500 border-1 border-blue-500 text-lg font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="flex-1 text-right font-bold text-blue-500">
                  <p>{(item.price * item.quantity).toFixed(2)} RON</p>
                </div>

                <div>
                  <button
                    onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                    className="bg-red-600 hover:bg-red-500 transition duration-500 text-white ml-4 rounded-lg cursor-pointer w-10 h-8"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center mt-4 pt-4 border-t-1 border-blue-500">
              <h3 className="text-blue-500 font-bold text-lg">Total:</h3>
              <h3 className="text-blue-500 font-bold text-lg">{totalPrice.toFixed(2)} RON</h3>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-1 border-blue-500 rounded-2xl p-4">
            <NamedInput
              label="Additional Notes"
              type="text"
              name="additionalNotes"
              value={state.additionalNotes}
              placeholder="Additional notes for your order (optional)"
              onChange={(e) =>
                dispatch({ type: "UPDATE_ADDITIONAL_NOTES", payload: e.target.value })
              }
              labelClassName="!text-blue-500 !font-bold !text-lg"
            />
            <NamedInput
              label="Address"
              type="text"
              name="address"
              value={state.address}
              placeholder="Enter your address"
              onChange={(e) => dispatch({ type: "UPDATE_ADDRESS", payload: e.target.value })}
              labelClassName="!text-blue-500 !font-bold !text-lg"
            />
          </div>
          <Button text="Place order" onClick={handlePaceOrder} />
        </div>
      )}
    </div>
  );
}
