const DetailedImage = () => {
  const images = [
    'https://images.unsplash.com/photo-1715351190944-a32bc9a900ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8',
    'https://images.unsplash.com/photo-1715586041798-9583f0642747?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8',
    'https://images.unsplash.com/photo-1715624849529-3f99fafffee5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1NHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1714572877812-7b416fbd4314?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2Nnx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1714715362537-4aa538a6f0ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw3NXx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1715639732762-cf660da518c6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDR8aG1lbnZRaFVteE18fGVufDB8fHx8fA%3D%3D',
  ];

  return (
      <div className='grid gap-4'>
        <div className='flex items-center justify-center'>
          <img className='h-screen max-w-full rounded-lg' src={images[0]} alt='' />
        </div>
        <div className='grid grid-cols-5 gap-4'>
          {images.map((image, i) => (
            <div>
              <img className='w-full md:h-72 h-full sm:h-40 rounded-lg object-cover' key={i} src={image} />
            </div>
          ))}
        </div>
      </div>
  );
};

export default DetailedImage;
