import { Button } from "@/components/ui/button";
import { useAuth } from "@/data/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();
  const {setToken, setUser} = useAuth();

  function OnClickHandler() {
    setToken(null);
    setUser(null);
    navigate("/login");
  }
  return <Button onClick={OnClickHandler}>Logout</Button>;
}
