import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [message, setMessage] = useState("");

  useEffect(() => {

    axios.get("api/codes/allcmmngroupcd")
    // axios.get("api/hello")
      .then(response => setMessage(response.data));

  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default App;