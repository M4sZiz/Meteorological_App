import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { endpoint } from '../constants'

const ModalEdit = ({ showModal, setShowModal, getCoordinates }) => {
    
    const [selectedOption, setSelectedOption] = useState(null);
    const [value, setValue] = useState(null);
    const MySwal = withReactContent(Swal)
    
    const get_cities = () => {
        fetch(`${endpoint}/v1/cities/`)
            .then(response => response.json())
            .then(data => {
                let temp_options = []
                data.forEach(element => {
                    temp_options.push({ value: element.id, label: element.name_en })
                });

                temp_options.sort((a, b) => {
                    if (a.label < b.label) {
                        return -1;
                    }
                    if (a.label > b.label) {
                        return 1;
                    }
                    return 0;
                })

                setSelectedOption(temp_options);
            });
    }

    const addCoordinate = async () => {

        if (value != null) {
            const requset = await fetch(`${endpoint}/v1/coordinates/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ 'city': value }),
            })

            if (requset.status === 201) {
                MySwal.fire({
                    title: <strong>Good job!</strong>,
                    text: 'successfully added',
                    icon: 'success',
                    confirmButtonColor: '#488cc2'
                })
                getCoordinates()
            } else {
                MySwal.fire({
                    title: <strong>Oops...</strong>,
                    text: 'something went wrong',
                    icon: 'error'
                })
            }
        }
    }


    useEffect(() => {
        get_cities();
    }, [showModal])

    const filterColors = (inputValue) => {
        return selectedOption.filter((i) =>
            i.label.toLowerCase().startsWith(inputValue.toLowerCase())
        ).slice(0, 200);
    };

    const loadOptions = (inputValue, callback) => {
        setTimeout(() => {
            callback(filterColors(inputValue));
        }, 1000);
    };

    return (
        <>

            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-1/4 my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-2xl font-semibold">
                                        Add new coordinate
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <span className="text-gray-700">City</span>
                                    <AsyncSelect className='w-full' placeholder={'Search'} cacheOptions loadOptions={loadOptions} defaultOptions={[{ value:'', label:'Type city name', disabled:true }]} isOptionDisabled={(option) => option.disabled} onChange={
                                        (e) => {
                                            setValue(e.value)
                                        }
                                    } />
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false)
                                        }}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-button-background text-white hover:bg-button-hover font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            addCoordinate()
                                            setShowModal(false)
                                        }}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>

            ) : null}
        </>
    );
}

export default ModalEdit;