import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { api } from '../services/api';

interface User {
  id: string;
  firstname: string;
  email: string;
  permissions: string[];
}

interface ValidationErrors {
  firstname?: string;
  email?: string;
}

export default function UserDetails() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editUser, setEditUser] = useState<string | null>(null);
  const firstnameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [showSucessMessage, setShowSucessMessage] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    firstname: '',
    email: '',
  });

  useEffect(() => {
    async function getUser() {
      try {
        const response = await api().get(`/user?email=${email}`);
        const { user: userData } = response.data;
        setUser(userData);

        const editPermission = verifyUserPermissions(response.data);
        if (editPermission) {
          setEditUser(editPermission);
        }
        setShowSucessMessage(false);
        setUserNotFound(false);
      } catch (err) {
        console.log('Error fetching user data:', err);
        setUserNotFound(true);
      }
    }

    getUser();
  }, [email]);

  function verifyUserPermissions(user: User): string | null {
    const userPermissions = user.permissions || [];

    const canEditEmail = userPermissions.includes('user:profile:email:edit');
    const canEditFirstname = userPermissions.includes('user:profile:firstname:edit');

    if (canEditEmail && canEditFirstname) {
      return 'both';
    } else if (canEditEmail) {
      return 'email';
    } else if (canEditFirstname) {
      return 'firstname';
    }

    return null;
  }

  async function handleUpdate(id: string) {
    try {
      const updateFirstname = firstnameRef.current?.value;
      const updateEmail = emailRef.current?.value;

      const errors: ValidationErrors = {};

      if(editUser === 'both' || editUser === 'firstname') {
        if (!updateFirstname || updateFirstname.length < 3) {
          errors.firstname = 'Firstname must have at least 3 characters';
        }
      }

      if(editUser === 'both' || editUser === 'email') {
        if (!updateEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateEmail)) {
          errors.email = 'Invalid email';
        }
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
      } else {
        const updateData: { firstname?: string; email?: string } = {};
        
        if (editUser === 'both') {
          updateData.firstname = updateFirstname;
          updateData.email = updateEmail;
        } else if (editUser === 'email') {
          updateData.email = updateEmail;
          updateData.firstname = user?.firstname;
        } else if (editUser === 'firstname') {
          updateData.firstname = updateFirstname;
          updateData.email = user?.email;
        }

        await api().put(`/user?id=${id}`, updateData);

        setEditMode(false);

        setValidationErrors({
          firstname: '',
          email: '',
        });
      }
      setShowSucessMessage(true);
      setUser((prevUser) => {
        if (!prevUser) {
          return prevUser;
        }
        return {
          ...prevUser,
          firstname: updateFirstname || prevUser.firstname,
        };
      });
      navigate(`/user-details/${updateEmail}`);
    } catch (err) {
      console.log(err);
    }
  }

  function handleCancelEdit() {
    if (firstnameRef.current) {
      firstnameRef.current.value = '';
    }
    if (emailRef.current) {
      emailRef.current.value = '';
    }
    setEditMode(false);

    setValidationErrors({
      firstname: '',
      email: '',
    });
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <main className="my-64 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-white">User Detail</h1>
        <section className="flex flex-col gap-4 my-6">
          {showSucessMessage && (
            <span className="text-green-500 text-sm">User updated successfully!</span>
          )}
          {userNotFound && (
            <span className="text-red-500 text-sm">User not found!</span>
          )}
          {user && (
            <article
              key={user.id}
              className="w-full bg-gray-800 rounded-md p-3 text-white relative hover:scale-105 duration-200"
            >
              <p>
                <span className="font-medium">Firstname:</span> {user.firstname}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              {editUser && (
                <>
                  <button
                    className="bg-amber-600 w-7 h-7 flex items-center justify-center rounded-md absolute right-0 -top-2"
                    onClick={() => setEditMode(true)}
                  >
                    <FiEdit size={18} color="#fff" />
                  </button>
                  {editMode && (
                    <>
                      {editUser === 'both' && (
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
                              <span className="text-red-500 text-sm flex">
                                {validationErrors.firstname}
                              </span>
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
                              <span className="text-red-500 text-sm">
                                {validationErrors.email}
                              </span>
                            )}
                          </label>
                        </>
                      )}
                      {editUser === 'firstname' && (
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
                              <span className="text-red-500 text-sm flex">
                                {validationErrors.firstname}
                              </span>
                            )}
                          </label>
                          <label className="font-medium text-white  ">
                            Edit Email:
                            <input
                              type="email"
                              className="w-full mb-5 px-4 py-3 rounded-md bg-gray-400 text-white"
                              readOnly
                              defaultValue={user.email}
                              ref={emailRef}
                            />
                          </label>
                        </>
                      )}
                      {editUser === 'email' && (
                        <>
                          <label className="font-medium text-white">
                            FirstName:
                            <input
                              type="text"
                              className="w-full mb-5 px-4 py-3 rounded-md bg-gray-400 text-white"
                              readOnly
                              defaultValue={user.firstname}
                              ref={firstnameRef}
                            />
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
                              <span className="text-red-500 text-sm">
                                {validationErrors.email}
                              </span>
                            )}
                          </label>
                        </>
                      )}
                      <div className="flex flex-row gap-1">
                        <button
                          className="cursor-pointer bg-green-600 w-6/12 h-8 flex items-center justify-center font-medium rounded-md right-0 -top-2"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                        <button
                          className="cursor-pointer bg-green-600 w-6/12 h-8 flex items-center justify-center font-medium rounded-md right-0 -top-2"
                          onClick={() => handleUpdate(user.id)}
                        >
                          Save Changes
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </article>
          )}
          <button
          className="cursor-pointer bg-green-600 w-6/12 h-8 flex items-center justify-center font-medium rounded-md right-0 -top-2 text-white"
          onClick={() => navigate('/')}
          >
            Go Back
          </button>
        </section>
      </main>
    </div>
  );
}
