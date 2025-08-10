import { useNavigate } from "react-router-dom"
import readyto from "../../assets/readyto.png"


const Readyto = () => {
    const navigate = useNavigate()
    return (
        <div
            className="flex justify-center relative w-full h-[60vh] ">
            <div className="absolute z-30 w-full h-full bg-black/30"></div>
            <div className="absolute z-10 w-full h-full bg-black/30 ">
                <img src={readyto}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex relative z-30 flex-col justify-evenly ">
                <div className="flex flex-col items-center gap-10 ">
                    <div
                        className="flex flex-col gap-3 text-white items-center ">
                        <span style={{
                            lineHeight: "50px"
                        }} className="font-ManropeBold md:text-4xl w-[80%]  text-center sm:text-3xl text-2xl ">Ready to Make Your Dream Property a Reality</span>
                        <span className="font-ManropeMedium text-sm text-center md:text-base">Explore a curated selection of properties that align with your goals</span>
                    </div>

                    <div
                        onClick={() => navigate('/all-properties')}
                        className="bg-buttonColor cursor-pointer text-white py-2 px-6 rounded-md">
                        <span>Get Started</span>
                    </div>
                </div>


            </div>

        </div>
    )
}

export default Readyto
