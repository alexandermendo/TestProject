  import { useEffect, useState } from 'react';

  function App() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
      async function fetchUsers() {
        try {
          // Realiza la solicitud GET para obtener la lista de usuarios
          const response = await fetch('http://localhost:3000/users/'); // Ajusta la URL según la ruta de tu backend

          if (!response.ok) {
            throw new Error(`Error al obtener la lista de usuarios: ${response.statusText}`);
          }

          const data = await response.json();

          // Actualiza el estado con los datos de usuarios recibidos
          setUsers(data);
        } catch (error) {
          console.error('Error al obtener la lista de usuarios:', error);
        }
      }

      fetchUsers();
    }, []);

    return (
      <>
        <div>
          <h1>Lista de Usuarios</h1>
          <ul>
            {users.map(user => (
              <li key={user.id}>
                Nombre: {user.name}, Apellido: {user.lnam}
                {user.imag && <img src={`data:image/jpeg;base64,${user.imag}`} alt={`Foto de ${user.name}`} />}
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }

  export default App;
