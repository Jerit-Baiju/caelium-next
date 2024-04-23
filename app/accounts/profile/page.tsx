'use client';
import Wrapper from '@/app/Wrapper';
import AuthContext from '@/contexts/AuthContext';
import useAxios from '@/helpers/useAxios';
import { useContext, useState } from 'react';

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
  let [newData, setNewData] = useState({});

  const fields: { name: string; value: string; placeholder?: string; type?: string }[] = [
    { name: 'Name', value: name },
    { name: 'Username', value: username },
    { name: 'Email', value: email, placeholder: 'Add your E-mail here' },
    { name: 'Date of Birth', value: birthdate, placeholder: 'Add your age here', type: 'date' },
    { name: 'Location', value: location, placeholder: 'Mark your location' },
    { name: 'Gender', value: gender, placeholder: 'Choose Gender' },
  ];

  const handleInputChange = (fieldName: string, value: any) => {
    setNewData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const updateProfile = () => {
    api.patch(`/api/auth/update/${user.id}/`, newData);
  };
  return (
    <Wrapper>
      <div className='flex flex-col items-center justify-center w-full min-h-[calc(100dvh-9rem)]'>
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
            <label key={i} className='input input-bordered flex items-center gap-2 my-4 max-sm:mx-4 dark:[color-scheme:dark]'>
              {field.name}
              <input
                type={field.type || 'text'}
                className='grow'
                value={field.value || ''}
                placeholder={field.placeholder}
                disabled={!editable}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              />
              {!field.value && <i className='fa-solid fa-triangle-exclamation dark:text-red-400 text-red-500' />}
            </label>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default Profile;
