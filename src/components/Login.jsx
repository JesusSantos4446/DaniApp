import { useState } from "react";
import usersData from "../data/users.json";
import "./Login.css";

export default function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const foundUser = usersData.users.find(
      (u) => u.user === user && u.pass === pass
    );

    if (foundUser) {
      onLogin(foundUser);
    } else {
      alert("Usuario o contraseña incorrecta");
    }
  };

  return (
    <div className="login-container">
      <h1>Iniciar Sesión</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
