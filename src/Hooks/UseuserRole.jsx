import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { ValueContext } from "../Context/ValueContext";
import Useaxios from "./Useaxios";

const UseUserRole = () => {
  const { currentuser, loading } = useContext(ValueContext);
  const axiosInstance = Useaxios();

  const fetchUserRole = async (email) => {
    if (!email) return null;
    const { data } = await axiosInstance.get(`/users?email=${email}`);
    console.log("Fetched user:", data[0]);
    return data[0]?.role;
  };

  const email = currentuser?.email;

  const {
    data: role,
    isLoading: roleLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userRole", email],
    queryFn: () => fetchUserRole(email),
    enabled: !!email && !loading,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const isLoading = loading || roleLoading;

  return { role, isLoading, isError, error, refetch };
};

export default UseUserRole;
