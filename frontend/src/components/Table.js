import { useEffect, useState } from 'react';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import Loading from './Loading';
import ModalAdd from './ModalAdd';
import ModalEdit from './ModalEdit';

import { HiPlus } from 'react-icons/hi';
import { FiEdit } from 'react-icons/fi';
import { MdDeleteOutline } from 'react-icons/md';
import { AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai';

import '../css/table.css'
import { useNavigate } from "react-router-dom";

import imagesPath from "../imagePath.json"
import { endpoint } from "../constants"


const Table = () => {
    const [data, setData] = useState([]);
    const [isLoading, setLoad] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [cityId, setCityId] = useState(null);
    const [idCoordinate, setIdCoordinate] = useState(null);
    const MySwal = withReactContent(Swal)
    const navigate = useNavigate()

    const getCoordinateId = () =>{
        return idCoordinate;
    }

    const getCityId = () =>{
        return cityId;
    }

    const clearIds = () =>{
        setIdCoordinate(null);
        setCityId(null);
    }

    const getCoordinates = async (url = `${endpoint}/v1/coordinates/?page=1`, type='normal') => {
        const response = await fetch(url,
            {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
        const res_data = await response.json();

        setNext(res_data['next']);
        setPrevious(res_data['previous']);
        setTotalPage(Math.ceil(res_data['count'] / 10));


        const temp_data = [];
        for (let i = 0; i < res_data['results'].length; i++) {
            let temp = {
                "id": res_data['results'][i].id,
                "name": res_data['results'][i]['city'].name,
                "max_temp": res_data['results'][i]['city'].max_temp,
                "min_temp": res_data['results'][i]['city'].min_temp,
                "icon": res_data['results'][i]['city'].weather_symbol,
                "city_id": res_data['results'][i]['city'].id,

            }
            temp_data.push(temp);
        }
        setData(temp_data);

        if(type === 'next'){
            setPage(page + 1);
        }else if(type === 'previous'){
            setPage(page - 1);
        }else{
            setPage(1);
        }
        


    }

    const removeCoordinate = async (id) => {

        MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#FF0000',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (!result.isConfirmed) {
                return;
            }
            const response = await fetch(`${endpoint}/v1/coordinates/${id}/`,
                {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });

            if (response.status === 204) {
                MySwal.fire({
                    icon: 'success',
                    title: 'Delete success',
                    showConfirmButton: false,
                    timer: 1500
                })
                getCoordinates();
            }
            else {
                MySwal.fire({
                    icon: 'error',
                    title: 'Delete failed',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        })


    }

    useEffect(() => {
        if (isLoading) {
            getCoordinates();
        }
        setTimeout(() => {
            setLoad(false);
        }, 2000);
    }, []);


    if (isLoading) {
        return (
            <Loading />
        )
    }
    else {
        return (
            <div className='flex flex-col w-full gap-y-5 bg-backgrounds-body'>
                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-3xl font-bold text-text">Weather info</h1>
                    <button className="btn-add" onClick={() => { setShowModalAdd(true) }}>
                        <HiPlus size={25} />
                        Add Coordinate
                    </button>
                </div>

                <table className="w-full table ">
                    <tbody className="">
                        {
                            data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="w-[10%]" onClick={() => navigate(`/info/${item['city_id']}`)}><img src={require(`../images/weather/${imagesPath[item.icon]}`)} alt="" /></td>
                                        <td className="w-[30%]" onClick={() => navigate(`/info/${item['city_id']}`)}>{item.name}</td>
                                        <td className="w-[10%]" onClick={() => navigate(`/info/${item['city_id']}`)}>{item.min_temp}°</td>
                                        <td className="w-[10%]" onClick={() => navigate(`/info/${item['city_id']}`)}>{item.max_temp}°</td>
                                        <td className="w-[10%]" >
                                            <div className="flex flex-row items-center space-x-3">
                                                <FiEdit size={18} onClick={() => {
                                                    setCityId(item['city_id']);
                                                    setIdCoordinate(item['id']);
                                                    setShowModalEdit(true);
                                                }} /> <MdDeleteOutline size={22} onClick={() => removeCoordinate(item['id']) } />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <div className="flex flex-row justify-center space-x-5">
                    <button type="button" className="btn-paginate" disabled={previous === null} onClick={() => getCoordinates(previous,'previous')}>
                        <AiOutlineArrowLeft size={20} />
                        <span className="sr-only">Icon description</span>
                    </button>
                    <p className="p-2.5 font-bold">{page} / {totalPage}</p>
                    <button type="button" className="btn-paginate" disabled={next === null} onClick={() => getCoordinates(next,'next')}>
                        <AiOutlineArrowRight size={20} />
                        <span className="sr-only">Icon description</span>
                    </button>
                </div>

                <ModalAdd showModal={showModalAdd} setShowModal={setShowModalAdd} getCoordinates={getCoordinates} />
                <ModalEdit showModal={showModalEdit} setShowModal={setShowModalEdit} getCoordinates={getCoordinates} getCoordinateId={getCoordinateId} clearIds={clearIds} getCityId={getCityId} />
            </div>

        )
    }
}

export default Table