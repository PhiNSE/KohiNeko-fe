import { useCallback, useState } from 'react';
import CatList from '../../components/CatList';
import PaginationCustom from '../../components/PaginationCustom';
import Empty from '../../components/Empty';
import catPng from '../../assets/catPngHome.png';
import LazyLoadImage from '../../components/LazyLoadImage';

const Cats = ({ cats }) => {
  //* Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageChange = useCallback((value) => {
    setCurrentPage(value);
  }, []);
  return (
    <>
      <div className='grid grid-cols-[1fr_1fr] mb-6 '>
        {cats.slice(currentPage * 2, (currentPage + 1) * 2).map((cat, idx) => {
          return (
            <div key={idx} className='w-[18vw] my-4'>
              <CatList
                key={idx}
                shopId={cat.shopId}
                catId={cat._id}
                img={cat?.images[0]?.url}
                catName={cat.name}
                catGender={cat.gender}
                catKind={cat.breed}
              />
            </div>
          );
        })}
      </div>

      {cats.length === 0 && <Empty object='cats' />}

      {/* Pagination */}
      {cats.length > 0 && (
        <div className=''>
          <PaginationCustom
            count={Math.ceil(cats.length / 2)}
            page={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {cats.length !== 0 && (
        <div>
          <div className='flex flex-row justify-center'>
            <div className='h-32 w-32 flex justify-center'>
              <LazyLoadImage src={catPng} />
            </div>
          </div>
          <h1 className='text-center font-semibold'>
            Our cats are looking forward to your visit
          </h1>
        </div>
      )}
    </>
  );
};

export default Cats;
