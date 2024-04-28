'use client';
import Wrapper from '@/app/Wrapper';
import AuthContext from '@/contexts/AuthContext';
import useAxios from '@/helpers/useAxios';
import { useContext, useEffect, useState } from 'react';

const Profile = () => {
  const api = useAxios();
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user?.name);
  const [username, setUsername] = useState(user?.username);
  const [email, setEmail] = useState(user?.email);
  const [birthdate, setBirthdate] = useState(user?.birthdate);
  const [location, setLocation] = useState(user?.location);
  const [gender, setGender] = useState(user?.gender);
  const [editable, setEditable] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(false);
  let [newData, setNewData] = useState({});

  useEffect(() => {
    setName(user?.name);
    setUsername(user?.username);
    setEmail(user?.email);
    setBirthdate(user?.birthdate);
    setLocation(user?.location);
    setGender(user?.gender);
  }, [user]);

  const fields: { name: string; value: string; placeholder?: string; type?: string; fieldName: string; options?: string[] }[] = [
    { name: 'Name', value: name, fieldName: 'name' },
    { name: 'Username', value: username, fieldName: 'username' },
    { name: 'Email', value: email, placeholder: 'Add your E-mail here', fieldName: 'email' },
    { name: 'Date of Birth', value: birthdate, placeholder: 'Add your age here', type: 'date', fieldName: 'birthdate' },
    { name: 'Location', value: location, placeholder: 'Mark your location', fieldName: 'location' },
    {
      name: 'Gender',
      value: gender,
      placeholder: 'Choose Gender',
      fieldName: 'gender',
      type: 'select',
      options: ['Male', 'Female', 'Other'],
    },
  ];

  const handleInputChange = (fieldName: string, stateName: string, value: any) => {
    setErrors({ ...errors, [fieldName]: null });
    setNewData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));

    switch (stateName) {
      case 'Name':
        setName(value);
        break;
      case 'Username':
        setUsername(value);
        break;
      case 'Email':
        setEmail(value);
        break;
      case 'Date of Birth':
        setBirthdate(value);
        break;
      case 'Location':
        setLocation(value);
        break;
      case 'Gender':
        setGender(value);
        break;
      default:
        break;
    }
  };

  const updateProfile = () => {
    api
      .patch(`/api/auth/update/${user.id}/`, newData)
      .then(() => {
        setAlert(true);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrors(error.response.data);
          setEditable(true);
        }
      });
  };

  return (
    <Wrapper>
      {alert && (
        <div
          className='p-4 m-4 text-sm text-center text-green-800 rounded-lg bg-green-50 dark:bg-neutral-800 dark:text-green-400'
          role='alert'
        >
          <span className='font-medium'>Profile updated successfully.</span>
        </div>
      )}
      <div className='flex flex-col items-center justify-center my-8 w-full min-h-[calc(100dvh-9rem)]'>
        <div className='relative flex flex-col items-center justify-center'>
          <img className='dark:bg-white h-64 rounded-full border' src={user?.avatar} alt='' />
          <i className='absolute ml-44 mt-44 dark:bg-neutral-700 bg-neutral-300 p-2 rounded-full text-2xl fa-regular fa-pen-to-square'></i>
        </div>
        <h1 className='text-3xl mt-4'>{user?.name}</h1>
        <div className='flex px-10 my-4 max-sm:w-full items-center justify-center'>
          <button
            onClick={() => {
              if (editable) {
                updateProfile();
                setEditable(false);
              } else {
                setEditable(true);
              }
            }}
            className={`p-1 rounded-lg max-sm:text-xl m-3 w-full md:w-24 ${editable ? 'dark:bg-blue-500 bg-blue-400' : 'dark:bg-neutral-700 bg-neutral-300'}`}
          >
            {editable ? 'Save' : 'Edit'}
          </button>
          <input type='text' id='shareLink' value={'this is to copy k'} hidden disabled readOnly />
          <button
            data-copy-to-clipboard-target='shareLink'
            className='dark:bg-neutral-700 bg-neutral-300 p-1 rounded-lg max-sm:text-xl m-3 w-full md:w-24'
          >
            <span id='default-message'>Share</span>
          </button>
        </div>
        <div className='md:w-3/5 w-full'>
          {fields.map((field, i) => (
            <div key={i}>
              {field.type != 'select' ? (
                <label className='input input-bordered flex items-center gap-2 my-4 max-sm:mx-4 dark:[color-scheme:dark]'>
                  {field.name}:
                  <input
                    type={field.type || 'text'}
                    className='grow'
                    value={field.value || ''}
                    placeholder={field.placeholder}
                    disabled={!editable}
                    onChange={(e) => handleInputChange(field.fieldName, field.name, e.target.value)}
                  />
                  {errors[field.fieldName as keyof typeof errors] || !field.value ? (
                    <i className='fa-solid fa-triangle-exclamation dark:text-red-400 text-red-500' />
                  ) : null}
                </label>
              ) : (
                <select
                  value={field.value}
                  className='select select-bordered w-full mb-4'
                  disabled={!editable}
                  onChange={(e) => handleInputChange(field.fieldName, field.name, e.target.value)}
                >
                  <option disabled selected>
                    {field.name}
                  </option>
                  {field.options?.map((option) => <option>{option}</option>)}
                </select>
              )}
              {errors[field.fieldName as keyof typeof errors] && (
                <p className='text-sm mx-4 text-red-600 dark:text-red-500 font-medium'>
                  {(errors[field.fieldName as keyof typeof errors] as string[])[0]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default Profile;
