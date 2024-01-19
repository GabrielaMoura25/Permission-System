import { useState, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface ValidationErrors {
  email?: string;
}

export default function Home() {

  const [email, setEmail] = useState('');
  const emailRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    email: '',
  });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const email = emailRef.current?.value;

    const errors: ValidationErrors = {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Invalid email format. Please enter a valid email address.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
    } else {
      navigate(`/user-details/${email}`);

      setValidationErrors({
        email: '',
      });
    }

    if (emailRef.current) {
      emailRef.current.value = '';
    }
  }

  return (

    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">

      <main className="my-64 w-full md:max-w-2xl">

        <h1 className="text-4xl font-medium text-white">Users</h1>

        <form className="flex flex-col my-6" onSubmit={handleSubmit}>

          <label className="font-medium text-white">
            Email:
            <input
            type="email"
            placeholder="Enter your email here..."
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full mb-5 px-4 py-3 rounded-md bg-gray-800 text-white"
            ref={emailRef}
            />
            {validationErrors.email && (
              <span className="text-red-500 text-sm">{validationErrors.email}</span>
            )}
          </label>

          <input 
          type="submit" 
          value="Search" 
          className="cursor-pointer w-full mb-5 px-4 py-3 rounded-md bg-green-600 text-white font-medium"
          />

        </form>

      </main>

    </div>
  )
}
