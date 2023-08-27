import React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FiMenu } from "react-icons/fi";
import http from '../helpers/http';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../redux/reducers/auth';

function Home() {
  const [product, setProduct] = React.useState([])
  const [searchParams, setSearchParams] = useSearchParams('')
  const [sort, setSort] = React.useState('DESC')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getDataProduct = React.useCallback(async () => {
    const { data } = await http().get(`/product?limit=6&sort=${sort}&${searchParams}`)
    setProduct(data.results)
  }, [sort,searchParams])

  React.useEffect(() => {
    getDataProduct()
  }, [getDataProduct])


  const handleSort = (sort) => {
    setSort(sort)
    // setSort(sort)
    // setMessage(message)

    const elem = document.activeElement;
    elem?.blur();
  }

  const doLogout = () => {
    dispatch(logoutAction()),
        navigate('/login')
}

  const onSearch = (values) => {
    setSearchParams(`search=${values.search}`);

  };
  return (
    <>
      <div className='flex flex-col justify-center items-center mt-10'>
        <div className='font-bold text-3xl mb-10'>Home</div>
        <div>
          <div className='flex justify-center items-center gap-10'>
            <Formik
            initialValues={{
              search:""
            }}
            onSubmit={onSearch}
            >
              {({ handleBlur, handleChange, handleSubmit, values }) => (
                <>
                  <form onSubmit={handleSubmit} className='flex gap-5'>
                    <div>
                      <input
                        type="text"
                        placeholder="search"
                        className="input input-bordered w-[700px]"
                        name='search'
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.search} />
                    </div>
                    <div>
                      <button type='submit' className='normal-case text-white btn btn-primary st'>
                        Search
                      </button>
                    </div>
                  </form>
                </>
              )}
            </Formik>
            <div>
              <div>
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn m-1"><FiMenu /></label>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li onClick={() => { handleSort('DESC') }}><a className='text-black'>Terbaru</a></li>
                    <li onClick={() => { handleSort('ASC') }}><a className='text-black'>Terlama</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-center items-center gap-10 mt-[50px]'>
            <div className='flex flex-col gap-5'>
              <div className='border border-indigo-600 w-[130px] h-10 flex justify-center items-center rounded-lg'>
                <Link>Add Product</Link>
              </div>
              <div className='border border-red-600 w-[130px] h-10 flex justify-center items-center rounded-lg'>
                <Link onClick={doLogout} className='text-red-500'>Logout</Link>
              </div>
            </div>
            <div className='grid grid-cols-3 gap-10'>
              {product.map(product => {
                return (
                  <>
                    <div key={product?.id} className='border border-black w-[200px] h-[230px]'>
                      <div className=''>
                        <div className='w-[200px] h-[150px]'>
                          <img className='w-[198px] h-[150px]' src={product?.image} alt="" />
                        </div>
                        <Link to={`product/${product?.id}`} className='flex flex-col border-t border-black justify-center items-center h-[70px] '>
                          <span className='font-bold text-xl'>{product?.name.slice(0, 15)}</span>
                          <span className='text-red-500 font-semibold'>Rp.{product?.price}</span>
                        </Link>
                      </div>
                    </div>
                  </>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home