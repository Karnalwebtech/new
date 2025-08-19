import { useSelector } from "react-redux";
import { RootState } from "@/store"; // Import the RootState type

export const useAuthToken = (): string | null => {
  const token = useSelector((state: RootState) => state.user.token);
  return token || null;
};
