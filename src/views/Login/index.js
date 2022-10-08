import { useState } from "react";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";

import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../../assets/style/styles.css";

import { firebase } from "../../firebaseConfig.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await firebase.auth().signInWithEmailAndPassword(email, password);
      navigate("/");
      setLoading(false);
    } catch (err) {
      toast.error("Email sau parola incorecta");
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Logare</h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <input
            type="password"
            className="form-control mb-4 p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parola"
            required
          />

          <button
            disabled={!email || !password || loading}
            type="submit"
            className="btn btn-block btn-primary w-100"
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
