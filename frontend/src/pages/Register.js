import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { endpoint } from "../constants";

const Register = () => {
    const [error_message, setError_message] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {

        if(localStorage.getItem("token")){
            fetch(`${endpoint}/v1/auth/user/`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
              }
            }).then(res => {
                if(res.status === 200){
                    return navigate("/", { replace: true });
                }
            });
          }

    }, [])

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors } } = useForm();

    const onSubmit = async(data) => {

        if(data.password !== data.confirm_password){
            setError("confirm_password", {
                type: "manual",
                message: "Password and Confirm Password do not match"
            })
            return
        }        

        const req = await fetch(`${endpoint}/v1/auth/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        
        if(req.status === 200){
            const res = await req.json()
            localStorage.setItem('token', res.tokens.access)
            localStorage.setItem('refresh', res.tokens.refresh)
            localStorage.setItem('username', JSON.stringify(res.username))
            navigate('/')
        }

        if(req.status === 400){
            const res = await req.json()
            if(res.error){
                setError_message(res.error)
                return
            }
            for (const key in res) {
                setError(key, {
                    type: "manual",
                    message: res[key][0]
                })
            }
        }
    }


    return (
        <div className="min-h-screen bg-backgrounds-body flex flex-col justify-center sm:py-12">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        <h1 className="font-bold text-center text-2xl mb-5 text-text">Register</h1>

        <div className="bg-backgrounds-card shadow w-full rounded-lg divide-y">
            <div className="px-5 py-7">
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <p className="text-red-500 font-bold text-center" hidden={ error_message.length === 0 }>{ error_message }</p>
                    <div className="mb-4 md:flex md:justify-between">
                        <div className="mb-4 md:mr-2 md:mb-0 w-full">
                            <label htmlFor="first_name" className="font-semibold text-sm text-text pb-1 block" >
                                First Name
                            </label>
                            <input type="text" placeholder="First Name" 
                            {...register("first_name", { required: true })}
                            />
                            {errors.firstName && <span className="text-red-500">{errors.first_name?.message || 'This field is required'}</span>}
                        </div>
                        <div className="md:ml-2 w-full">
                            <label htmlFor="last_name" className="font-semibold text-sm text-text pb-1 block" >
                                Last Name
                            </label>
                            <input type="text" placeholder="Last Name" 
                                {...register("last_name", { required: true })}
                            />
                            {errors.lastName && <span className="text-red-500">{errors.last_name.message || 'This field is required'}</span>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="new-password" className="font-semibold text-sm text-text pb-1 block" >
                            Username
                        </label>
                        <div className="mt-1">
                            <input name="username" type="text" placeholder="username" 
                            {...register("username", { required: true })}
                            />
                        </div>
                        {errors.username && <span className="text-red-500">{errors.username.message || 'This field is required'}</span>}
                    </div>
                    <div>
                        <label htmlFor="email" className="font-semibold text-sm text-text pb-1 block " >
                            Email
                        </label>
                        <div className="mt-1">
                            <input name="email" type="email-address" placeholder="email"
                            {...register("email", { required: true })}
                            />
                        </div>
                        {errors.email && <span className="text-red-500">{errors.email.message || 'This field is required'}</span>}
                    </div>

                    <div>
                        <label htmlFor="password" className="font-semibold text-sm text-text pb-1 block " >
                            Password
                        </label>
                        <div className="mt-1">
                            <input name="password" type="password" placeholder="Password" 
                            {...register("password", { required: true })}
                            />
                        </div>
                        {errors.password && <span className="text-red-500">{errors.password.message || 'This field is required'}</span>}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="font-semibold text-sm text-text pb-1 block "
                        >
                            Confirm Password
                        </label>
                        <div className="mt-1">
                            <input
                                name="confirm_password"
                                type="password"
                                className="px-3 py-2 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
                                placeholder="Confirm Password"
                                {...register("confirm_password", { required: true })}
                            />
                        </div>
                        {errors.confirm_password && <span className="text-red-500">{errors.confirm_password.message || 'This field is required'}</span>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md border border-transparent bg-[#4A6BA0] py-2 px-4 text-sm font-medium hover:bg-[#121B2C] text-white shadow-sm hover:bg-opacity-75 focus:ring-[#121B2C] focus:outline-none focus:ring-2 focus:bg-[#121B2C] focus:ring-offset-2"
                        >
                            Sign Up
                        </button>
                        <p className="text-text mt-3 text-sm ">Do You Have an Account ? <Link to={'/login'} className="text-primary underline"> Login In </Link></p>
                    </div>
                </form>
            </div>
        </div>
    </div>
    </div>
    )

}

export default Register