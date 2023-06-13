import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { endpoint } from "../constants"
const Login = () => {

    const navigate = useNavigate()
    

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

    const [error_message, setError_message] = useState('')
    const {
        register,
        handleSubmit,
        formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const req = await fetch(`${endpoint}/v1/auth/login/`, {
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
            setError_message(res.error)
        }
    }

    return (
        <div className="min-h-screen bg-backgrounds-body flex flex-col justify-center sm:py-12">
            <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
                <h1 className="font-bold text-center text-2xl mb-5 text-text">Login In</h1>
                <div className="bg-backgrounds-card shadow w-full rounded-lg divide-y">
                    <div className="px-5 py-7 w-full flex flex-col items-center">
                        <p className="text-red-500 font-bold" hidden={ error_message.length === 0 }>{ error_message }</p>
                        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-5">
                                <label className="font-semibold text-sm text-text pb-1 block">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    {...register("username", { required: true })}
                                />
                                <p className="text-red-500 text-xs italic"> {errors.username?.type === 'required' && "Username is required"} </p>
                            </div>
                            <div className="mb-5">
                                <label className="font-semibold text-sm text-text pb-1 block">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    {...register("password", { required: true })}
                                />
                                <p className="text-red-500 text-xs italic"> {errors.password?.type === 'required' && "Password is required"} </p>
                            </div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md border border-transparent bg-button-background text-button-text py-2 px-4 font-medium hover:bg-[#121B2C] shadow-sm hover:bg-opacity-75 focus:ring-[#121B2C] focus:outline-none focus:ring-2 focus:bg-[#121B2C] focus:ring-offset-2"
                            >
                                Login
                            </button>
                        </form>
                        <p className="text-text mt-3 text-sm ">You Don't Have an Account ? <Link to={'/register'} className="text-primary underline"> Register </Link></p>
                    </div>

                </div>
            </div>
        </div>

    )
}

export default Login