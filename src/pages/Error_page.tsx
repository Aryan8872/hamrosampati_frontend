import error_page from "../assets/logo/error_page.png"
import PrimaryButton from "../components/buttons/PrimaryButton"

const Page_404 = () => {
    return (
        <div className="h-screen w-screen">
            <div className="flex flex-col h-full w-full  justify-center items-center ">
                <div className="w-[min(50vw,50vh)] aspect-square">
                    <img
                        className="h-full w-full object-cover"
                        src={error_page} />
                </div>


                <div className="flex  text-center flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <span className="font-ManropeBold ">Something Went Wrong</span>
                        <span className="font-ManropeRegular">Sorry, We can't find the page you're looking for.</span>
                    </div>
                    <div>
                        <PrimaryButton
                            to="/"
                            text="Go Back"
                        />
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Page_404
