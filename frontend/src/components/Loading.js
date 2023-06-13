

const Loading = () => {
    return (
        <div className="w-[50%] flex justify-center items-center p-10">
            <div
                style={{ width: `100px`, height: `100px` }}
                className="animate-spin">
                <div className="h-full w-full border-4 border-t-primary
                    border-b-primary-700 rounded-[50%]">
                </div>
            </div>
        </div>
    )
}

export default Loading
