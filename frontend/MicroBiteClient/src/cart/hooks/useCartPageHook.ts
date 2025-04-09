import { useQueryClient } from "@tanstack/react-query";
import { useCartContext } from "../context/useCartContext";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { resApi } from "../../api";
import axios from "axios";

export function useCartPageHook() {
  const { state, dispatch } = useCartContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = useMemo(
    () => state.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.cartItems]
  );

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

  const handlePaceOrder = useCallback(async () => {
    if (state.cartItems.length === 0) return;
    setError(null);
    try {
      setIsSaving(true);
      await resApi.post("/Order", {
        address: state.address,
        additionalNotes: state.additionalNotes,
        orderItems: state.cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });
      dispatch({ type: "CLEAR_CART" });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate("/orders");
    } catch (error) {
      if (axios.isAxiosError(error) && typeof error.response?.data === "string") {
        setError(error.response.data);
      } else if (error instanceof Error) {
        setError(error.message);
      }
      setError("An unexpected error occurred. Check the console for more information.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }, [state, dispatch, navigate, queryClient]);

  return { state, dispatch, error, isSaving, totalPrice, handleAdjustQuantity, handlePaceOrder };
}
