import { useEffect, useState, useRef, FormEvent } from 'react';
import { FiTrash, FiEdit } from 'react-icons/fi';
import { api } from './services/api';

interface UserProps {
  id: string;
  firstname: string;
  email: string;
}

interface ValidationErrors {
  firstname?: string;
  email?: string;
}

export default function App() {

  const [users, setUsers] = useState<UserProps[]>([]);
  const [editUser, setEditUser] = useState<string | null>(null);
  const firstnameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    firstname: '',
    email: '',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const response = await api.get('/users');
    setUsers(response.data);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const firstname = firstnameRef.current?.value;
    const email = emailRef.current?.value;

    const errors: ValidationErrors = {};

    if (!firstname || firstname.length < 3) {
      errors.firstname = 'Firstname must have at least 3 characters';
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
    } else {
      await api.post('/user', { firstname, email });
      loadUsers();

      setValidationErrors({
        firstname: '',
        email: '',
      });
    }

    if (firstnameRef.current) {
      firstnameRef.current.value = '';
    }
    if (emailRef.current) {
      emailRef.current.value = '';
    }
  }

  async function handleDelete(id: string) {
    try{
      await api.delete('/user', {
        params: { id }
      });
      loadUsers();
    } catch(err) {
      console.log(err);
    }
  }

  async function handleUpdate(id: string) {
    try {
      const updateFirstname = firstnameRef.current?.value;
      const updateEmail = emailRef.current?.value;

      const errors: ValidationErrors = {};

      if (!updateFirstname || updateFirstname.length < 3) {
        errors.firstname = 'Firstname must have at least 3 characters';
      }

      if (!updateEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateEmail)) {
        errors.email = 'Invalid email';
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
      } else {
        await api.put(`/user?id=${id}`, {
          firstname: updateFirstname,
          email: updateEmail,
        })
        
        setEditUser(null);
  
        loadUsers();

        setValidationErrors({
          firstname: '',
          email: '',
        });
      }


      if (firstnameRef.current) {
        firstnameRef.current.value = '';
      }
      if (emailRef.current) {
        emailRef.current.value = '';
      }

    } catch(err) {
      console.log(err);
    }
  }

  async function handleCancelEdit() {
    if (firstnameRef.current) {
      firstnameRef.current.value = '';
    }
    if (emailRef.current) {
      emailRef.current.value = '';
    }
    setEditUser(null);
  }

  return (

    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">

      <main className="my-10 w-full md:max-w-2xl">

        <h1 className="text-4xl font-medium text-white">Users</h1>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>

          <label className="font-medium text-white">
            FirstName:
            <input
            type="text"
            placeholder="Enter your first name here..."
            className="w-full mb-5 px-4 py-3 rounded-md bg-gray-800 text-white"
            ref={firstnameRef}
            />
            {validationErrors.firstname && (
              <span className="text-red-500 text-sm">{validationErrors.firstname}</span>
            )}
          </label>

          <label className="font-medium text-white">
            Email:
            <input
            type="email"
            placeholder="Enter your email here..."
            className="w-full mb-5 px-4 py-3 rounded-md bg-gray-800 text-white"
            ref={emailRef}
            />
            {validationErrors.email && (
              <span className="text-red-500 text-sm">{validationErrors.email}</span>
            )}
          </label>

          <input 
          type="submit" 
          value="Register" 
          className="cursor-pointer w-full mb-5 px-4 py-3 rounded-md bg-green-600 text-white font-medium"
          />

        </form>

        <section className="flex flex-col gap-4">
          
          {users.map((user) => (
            <article
            key={user.id}
            className="w-full bg-gray-800 rounded-md p-3 text-white relative hover:scale-105 duration-200"
            >
              {editUser === user.id ? (
                <>
                  <label className="font-medium text-white">
                    Edit FirstName:
                    <input
                    type="text"
                    className="w-full mb-5 px-4 py-3 rounded-md bg-gray-400 text-white"
                    defaultValue={user.firstname}
                    ref={firstnameRef}
                    />
                    {validationErrors.firstname && (
                      <span className="text-red-500 text-sm flex">{validationErrors.firstname}</span>
                    )}
                  </label>

                  <label className="font-medium text-white  ">
                    Edit Email:
                    <input
                    type="email"
                    className="w-full mb-5 px-4 py-3 rounded-md bg-gray-400 text-white"
                    defaultValue={user.email}
                    ref={emailRef}
                    />
                    {validationErrors.email && (
                      <span className="text-red-500 text-sm">{validationErrors.email}</span>
                    )}
                  </label>

                  <div className='flex flex-row gap-1'>
                    <button
                    className='cursor-pointer bg-green-600 w-6/12 h-8 flex items-center justify-center font-medium rounded-md right-0 -top-2'
                    onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                    <button
                    className='cursor-pointer bg-green-600 w-6/12 h-8 flex items-center justify-center font-medium rounded-md right-0 -top-2'
                    onClick={() => handleUpdate(user.id)}
                    >
                      Save Changes
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p><span className="font-medium">Firstname:</span> {user.firstname}</p>
                  <p><span className="font-medium">Email:</span> {user.email}</p>

                  <button
                  className='bg-amber-600 w-7 h-7 flex items-center justify-center rounded-md absolute right-8 -top-2'
                  onClick={() => setEditUser(user.id)}
                  >
                    <FiEdit size={18} color='#fff' />
                  </button>
                  <button
                  className='bg-red-600 w-7 h-7 flex items-center justify-center rounded-md absolute right-0 -top-2'
                  onClick={() => handleDelete(user.id)}
                  >
                    <FiTrash size={18} color='#fff' />
                  </button>
                </>
              )}
            </article>
          ))}

        </section>

      </main>

    </div>
  )
}
