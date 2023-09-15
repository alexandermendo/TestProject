import { useEffect, useState } from 'react';
import { url } from '../../../common/utils'
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ nombre: '', apellido: '', foto: null });

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${url}/users/`); // Ajusta la URL según la ruta de tu backend

        if (!response.ok) {
          throw new Error(`Error al obtener la lista de usuarios: ${response.statusText}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    }

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'foto') {
      setFormData({
        ...formData,
        foto: files[0], // Solo se toma el primer archivo si se seleccionan múltiples
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { nombre, apellido, foto } = formData;
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', nombre);
      formDataToSend.append('apellido', apellido);
      formDataToSend.append('foto', foto);

      const response = await fetch(`${url}/users/`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`Error al agregar el usuario: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
    }
  };

  return (
    <>
      <div className="container">
        <h1>Lista de Usuarios</h1>
        <div className="user-list">
          {users.map(user => (
            <div className="user-card" key={user.id || user.name}>
              {user.imag && (
                <div className="user-image">
                  {/* Utiliza la URL de la imagen en el atributo 'src' */}
                  <img src={`${url}/uploads/${user.imag}`} alt={`Foto de ${user.name}`} />
                </div>
              )}
              <div className="user-info">
                <p>{user.name}</p>
                <p>{user.lnam}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='container'>
        <h2>Agregar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="apellido">Apellido:</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="foto">Subir Foto:</label>
            <input
              type="file"
              id="foto"
              name="foto"
              onChange={handleInputChange}
              accept=".jpg,.jpeg,.png,.gif" // Limita los tipos de archivos aceptados
            />
          </div>
          <button type="submit">Subir Usuario</button>
        </form>
      </div>
    </>
  );
}

export default App;
